import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { UserProfile, UserConfiguration } from '../types';

const rawUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
// Automatically sanitize URL to ensure clean base domain (e.g. remove /rest/v1 or trailing slashes)
const supabaseUrl = rawUrl ? rawUrl.replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '') : '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

// Determine if real Supabase cloud credentials are provided
export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project-id') &&
    supabaseAnonKey.length > 20
  );
};

// Initialize Supabase Client if credentials exist
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// ==============================================================================
// AUTHENTICATION METHODS
// ==============================================================================

export async function apiSignUp(email: string, password: string, fullName: string) {
  if (!supabase) {
    // Local fallback for guest preview mode
    const mockUser: UserProfile = {
      id: `local-user-${Date.now()}`,
      email,
      fullName: fullName || email.split('@')[0],
    };
    localStorage.setItem('productvision_user', JSON.stringify(mockUser));
    return { user: mockUser, error: null };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) return { user: null, error: error.message };

  const user: UserProfile | null = data.user
    ? {
        id: data.user.id,
        email: data.user.email ?? '',
        fullName: data.user.user_metadata?.full_name ?? email.split('@')[0],
      }
    : null;

  const needsEmailConfirmation = Boolean(data.user && !data.session);

  return { user, needsEmailConfirmation, error: null };
}


export async function apiSignIn(email: string, password: string) {
  if (!supabase) {
    // Local fallback
    const mockUser: UserProfile = {
      id: 'local-user-preview',
      email,
      fullName: email.split('@')[0],
    };
    localStorage.setItem('productvision_user', JSON.stringify(mockUser));
    return { user: mockUser, error: null };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { user: null, error: error.message };

  const user: UserProfile | null = data.user
    ? {
        id: data.user.id,
        email: data.user.email ?? '',
        fullName: data.user.user_metadata?.full_name ?? email.split('@')[0],
      }
    : null;

  return { user, error: null };
}

export async function apiSignOut() {
  localStorage.removeItem('productvision_user');
  if (supabase) {
    await supabase.auth.signOut();
  }
}

export async function apiGetCurrentUser(): Promise<UserProfile | null> {
  if (supabase) {
    const { data } = await supabase.auth.getUser();
    if (data?.user) {
      return {
        id: data.user.id,
        email: data.user.email ?? '',
        fullName: data.user.user_metadata?.full_name ?? data.user.email?.split('@')[0] ?? 'User',
      };
    }
  }

  const stored = localStorage.getItem('productvision_user');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }

  return null;
}

// ==============================================================================
// POSTGRESQL DATABASE CONFIGURATION METHODS
// ==============================================================================

export async function apiFetchConfigurations(userId?: string): Promise<{ data: UserConfiguration[]; error: string | null }> {
  if (supabase && userId) {
    const { data, error } = await supabase
      .from('configurations')
      .select('*, products(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase query error, falling back to local state:', error.message);
      return { data: getLocalConfigurations(), error: error.message };
    }

    if (data) {
      const mapped: UserConfiguration[] = data.map((row) => ({
        id: row.id,
        userId: row.user_id,
        title: row.title,
        product: row.products ?? row.product,
        selectedColor: row.selected_color,
        selectedWheel: row.selected_wheel,
        selectedAddOns: row.selected_add_ons ?? [],
        totalPrice: Number(row.total_price),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
      return { data: mapped, error: null };
    }
  }

  return { data: getLocalConfigurations(), error: null };
}

export async function apiSaveConfiguration(config: UserConfiguration, userId?: string): Promise<{ success: boolean; error: string | null }> {
  // Always save to localStorage so the client is instantaneously responsive
  saveLocalConfiguration(config);

  if (supabase && userId) {
    const { error } = await supabase.from('configurations').insert({
      id: config.id,
      user_id: userId,
      product_id: config.product.id,
      title: config.title,
      selected_color: config.selectedColor,
      selected_wheel: config.selectedWheel,
      selected_add_ons: config.selectedAddOns,
      total_price: config.totalPrice,
      created_at: config.createdAt,
      updated_at: config.updatedAt,
    });

    if (error) {
      return { success: false, error: error.message };
    }
  }

  return { success: true, error: null };
}

export async function apiUpdateConfigurationTitle(id: string, newTitle: string): Promise<boolean> {
  updateLocalConfigurationTitle(id, newTitle);

  if (supabase) {
    const { error } = await supabase
      .from('configurations')
      .update({ title: newTitle, updated_at: new Date().toISOString() })
      .eq('id', id);

    return !error;
  }

  return true;
}

export async function apiDeleteConfiguration(id: string): Promise<boolean> {
  deleteLocalConfiguration(id);

  if (supabase) {
    const { error } = await supabase.from('configurations').delete().eq('id', id);
    return !error;
  }

  return true;
}

// ==============================================================================
// LOCAL STORAGE RESILIENT PERSISTENCE HELPERS
// ==============================================================================

const STORAGE_KEY = 'productvision_configurations';

export function getLocalConfigurations(): UserConfiguration[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveLocalConfiguration(config: UserConfiguration) {
  const current = getLocalConfigurations();
  const filtered = current.filter((c) => c.id !== config.id);
  const updated = [config, ...filtered];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function updateLocalConfigurationTitle(id: string, newTitle: string) {
  const current = getLocalConfigurations();
  const updated = current.map((c) =>
    c.id === id ? { ...c, title: newTitle, updatedAt: new Date().toISOString() } : c
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function deleteLocalConfiguration(id: string) {
  const current = getLocalConfigurations();
  const updated = current.filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
