-- ==============================================================================
-- ProductVision Database Schema Migration
-- College Major Project: 3D Product Visualization & Configurator
-- Topic 3: Full-Stack PostgreSQL with Supabase Row Level Security (RLS)
-- ==============================================================================

-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE (Linked 1-to-1 with auth.users)
-- ------------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Enable RLS for Profiles
alter table public.profiles enable row level security;

-- Profiles Policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Trigger to automatically create a profile record when a new user signs up via Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists and recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 2. PRODUCTS TABLE (Catalog of Customizable Vehicles)
-- ------------------------------------------------------------------------------
create table if not exists public.products (
  id text primary key,
  slug text unique not null,
  name text not null,
  tagline text,
  category text not null,
  base_price numeric not null,
  image text not null,
  description text not null,
  specs jsonb not null,
  available_colors jsonb not null,
  available_wheels jsonb not null,
  available_add_ons jsonb not null,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Enable RLS for Products
alter table public.products enable row level security;

-- Products Policies: Public read-only catalog
create policy "Anyone can view products catalog"
  on public.products for select
  using (true);

-- ------------------------------------------------------------------------------
-- 3. CONFIGURATIONS TABLE (Saved Customized Vehicles)
-- ------------------------------------------------------------------------------
create table if not exists public.configurations (
  id text primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  product_id text references public.products(id) on delete restrict not null,
  title text not null,
  selected_color jsonb not null,
  selected_wheel jsonb not null,
  selected_add_ons jsonb not null default '[]'::jsonb,
  total_price numeric not null,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Enable RLS for Configurations
alter table public.configurations enable row level security;

-- Row Level Security (RLS) Policies for Configurations
-- Strict data isolation: Users can ONLY access, alter, or delete their own rows
create policy "Users can view their own configurations"
  on public.configurations for select
  using (auth.uid() = user_id);

create policy "Users can insert their own configurations"
  on public.configurations for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own configurations"
  on public.configurations for update
  using (auth.uid() = user_id);

create policy "Users can delete their own configurations"
  on public.configurations for delete
  using (auth.uid() = user_id);

-- Performance Indexes
create index if not exists idx_configurations_user_id on public.configurations(user_id);
create index if not exists idx_configurations_product_id on public.configurations(product_id);

-- ------------------------------------------------------------------------------
-- 4. SEED PRODUCTS DATA
-- ------------------------------------------------------------------------------
insert into public.products (
  id, slug, name, tagline, category, base_price, image, description,
  specs, available_colors, available_wheels, available_add_ons
)
values
(
  'prod-apex-gtr',
  'apex-gtr-vision',
  'Apex GT-R Vision',
  'The Pinnacle of Hybrid Grand Touring Performance',
  'Sports Coupe',
  128500,
  'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
  'Engineered with an aerodynamic monocoque chassis, active downforce aero flaps, and a dual-turbo hybrid powertrain producing instantaneous torque.',
  '{"acceleration": "2.6s (0-60 mph)", "topSpeed": "205 mph", "horsepower": "820 HP", "drivetrain": "Hybrid e-AWD", "range": "420 mi Combined"}'::jsonb,
  '[
    {"id": "c-obsidian", "name": "Obsidian Shadow", "hex": "#0f172a", "finish": "Metallic", "price": 0, "badge": "Standard"},
    {"id": "c-midnight", "name": "Midnight Hyper-Blue", "hex": "#1e3a8a", "finish": "Metallic", "price": 1200, "badge": "Popular"},
    {"id": "c-rosso", "name": "Rosso Corsa Red", "hex": "#b91c1c", "finish": "Gloss", "price": 1500},
    {"id": "c-titanium", "name": "Liquid Titanium", "hex": "#64748b", "finish": "Metallic", "price": 1200},
    {"id": "c-emerald", "name": "Emerald Stealth", "hex": "#064e3b", "finish": "Matte", "price": 2800, "badge": "Exclusive"},
    {"id": "c-gold", "name": "Solar Apex Gold", "hex": "#d97706", "finish": "Metallic", "price": 3200, "badge": "Signature"},
    {"id": "c-chalk", "name": "Alpine Chalk White", "hex": "#f8fafc", "finish": "Gloss", "price": 800}
  ]'::jsonb,
  '[
    {"id": "w-turbine", "name": "20\" Forged Turbine Silver", "size": "20-inch", "finish": "Machined Silver", "price": 0},
    {"id": "w-satin-black", "name": "21\" Dark Satin Multi-Spoke", "size": "21-inch", "finish": "Matte Black", "price": 1800},
    {"id": "w-carbon-blade", "name": "21\" Carbon Aero Blade Rims", "size": "21-inch", "finish": "Exposed Carbon", "price": 3400}
  ]'::jsonb,
  '[
    {"id": "opt-aero", "name": "Carbon Aerodynamics Package", "description": "Active carbon fiber front splitter and high-downforce rear wing.", "price": 4500, "category": "Exterior"},
    {"id": "opt-brakes", "name": "Carbon Ceramic Track Brakes", "description": "Cross-drilled carbon rotors with signature yellow 6-piston calipers.", "price": 3200, "category": "Performance"},
    {"id": "opt-cockpit", "name": "Alcantara Racing Cockpit", "description": "Hand-stitched microfibre sport seats and carbon center console.", "price": 2400, "category": "Interior"},
    {"id": "opt-audio", "name": "Immersive Spatial Audio", "description": "18-speaker 1200W bespoke high-fidelity surround sound system.", "price": 1800, "category": "Interior"}
  ]'::jsonb
)
on conflict (id) do update set
  name = excluded.name,
  base_price = excluded.base_price,
  specs = excluded.specs,
  available_colors = excluded.available_colors,
  available_wheels = excluded.available_wheels,
  available_add_ons = excluded.available_add_ons;
