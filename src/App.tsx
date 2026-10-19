import { useState, useEffect } from 'react';
import { MOCK_PRODUCTS } from './data/mockProducts';
import type {
  ActiveTab,
  Product,
  ColorOption,
  WheelOption,
  AddOnOption,
  UserConfiguration,
  UserProfile,
} from './types';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/home/HeroSection';
import { FeaturedProduct } from './components/home/FeaturedProduct';
import { ProductCatalog } from './components/catalog/ProductCatalog';
import { ConfiguratorView } from './components/configurator/ConfiguratorView';
import { MyConfigurations } from './components/dashboard/MyConfigurations';
import { AuthModal } from './components/modals/AuthModal';
import { SpecSheetModal } from './components/modals/SpecSheetModal';
import { CompareModal } from './components/modals/CompareModal';
import { RenameModal } from './components/modals/RenameModal';
import {
  isSupabaseConfigured,
  apiGetCurrentUser,
  apiFetchConfigurations,
  apiSaveConfiguration,
  apiUpdateConfigurationTitle,
  apiDeleteConfiguration,
  apiSignOut,
} from './lib/supabase';
import { Check } from 'lucide-react';

// Static initial configurations for demo fallback
const INITIAL_SAVED_CONFIGURATIONS: UserConfiguration[] = [
  {
    id: 'cfg-sample-1',
    title: 'Apex GT-R Track Spec',
    product: MOCK_PRODUCTS[0],
    selectedColor: MOCK_PRODUCTS[0].availableColors[1], // Midnight Hyper-Blue
    selectedWheel: MOCK_PRODUCTS[0].availableWheels[2], // Carbon Aero Blade
    selectedAddOns: [
      MOCK_PRODUCTS[0].availableAddOns[0], // Carbon Aero
      MOCK_PRODUCTS[0].availableAddOns[1], // Ceramic Brakes
    ],
    totalPrice: 139400,
    createdAt: '2026-10-17T10:00:00.000Z',
    updatedAt: '2026-10-17T10:00:00.000Z',
  },
  {
    id: 'cfg-sample-2',
    title: 'Specter Aero Minimalist EV',
    product: MOCK_PRODUCTS[1],
    selectedColor: MOCK_PRODUCTS[1].availableColors[3], // Monolith Black
    selectedWheel: MOCK_PRODUCTS[1].availableWheels[1], // Vortex Alloy
    selectedAddOns: [MOCK_PRODUCTS[1].availableAddOns[1]], // Glass roof
    totalPrice: 100300,
    createdAt: '2026-10-15T14:30:00.000Z',
    updatedAt: '2026-10-15T14:30:00.000Z',
  },
];

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [currentProduct, setCurrentProduct] = useState<Product>(MOCK_PRODUCTS[0]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<UserConfiguration | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isCloudConnected = isSupabaseConfigured();

  // Spec Sheet Modal State
  const [specSheetData, setSpecSheetData] = useState<{
    isOpen: boolean;
    product: Product;
    color: ColorOption;
    wheel: WheelOption;
    addOns: AddOnOption[];
    totalPrice: number;
  }>({
    isOpen: false,
    product: MOCK_PRODUCTS[0],
    color: MOCK_PRODUCTS[0].availableColors[0],
    wheel: MOCK_PRODUCTS[0].availableWheels[0],
    addOns: [],
    totalPrice: MOCK_PRODUCTS[0].basePrice,
  });

  const [savedConfigurations, setSavedConfigurations] = useState<UserConfiguration[]>(
    INITIAL_SAVED_CONFIGURATIONS
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Load user session and configurations on mount
  useEffect(() => {
    async function initSessionAndData() {
      const activeUser = await apiGetCurrentUser();
      if (activeUser) {
        setUser(activeUser);
      }

      const { data } = await apiFetchConfigurations(activeUser?.id);
      if (data && data.length > 0) {
        setSavedConfigurations(data);
      }
    }

    initSessionAndData();
  }, []);

  // Auth Handlers
  const handleAuthSuccess = async (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    showToast(`Welcome back, ${loggedInUser.fullName}!`);
    const { data } = await apiFetchConfigurations(loggedInUser.id);
    if (data && data.length > 0) {
      setSavedConfigurations(data);
    }
  };

  const handleSignOut = async () => {
    await apiSignOut();
    setUser(null);
    showToast('Signed out of session.');
  };

  // Product Selection handler
  const handleSelectProduct = (product: Product) => {
    setCurrentProduct(product);
    setActiveTab('configurator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Save new configuration handler (persisted to Supabase PostgreSQL or local storage)
  const handleSaveConfiguration = async (
    title: string,
    color: ColorOption,
    wheel: WheelOption,
    addOns: AddOnOption[],
    totalPrice: number
  ) => {
    const newConfig: UserConfiguration = {
      id: `cfg-${Date.now()}`,
      userId: user?.id,
      title,
      product: currentProduct,
      selectedColor: color,
      selectedWheel: wheel,
      selectedAddOns: addOns,
      totalPrice,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newConfig, ...savedConfigurations];
    setSavedConfigurations(updated);

    await apiSaveConfiguration(newConfig, user?.id);
    showToast(
      isCloudConnected
        ? 'Configuration saved to Supabase PostgreSQL cloud database!'
        : 'Configuration saved to your local garage!'
    );
  };

  // Rename configuration handler
  const handleRenameConfiguration = async (id: string, newTitle: string) => {
    const updated = savedConfigurations.map((item) =>
      item.id === id ? { ...item, title: newTitle, updatedAt: new Date().toISOString() } : item
    );
    setSavedConfigurations(updated);
    await apiUpdateConfigurationTitle(id, newTitle);
    showToast('Configuration title updated.');
  };

  // Duplicate configuration handler
  const handleDuplicateConfiguration = async (config: UserConfiguration) => {
    const duplicated: UserConfiguration = {
      ...config,
      id: `cfg-${Date.now()}`,
      title: `${config.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [duplicated, ...savedConfigurations];
    setSavedConfigurations(updated);
    await apiSaveConfiguration(duplicated, user?.id);
    showToast('Configuration duplicated.');
  };

  // Delete configuration handler
  const handleDeleteConfiguration = async (id: string) => {
    const updated = savedConfigurations.filter((c) => c.id !== id);
    setSavedConfigurations(updated);
    await apiDeleteConfiguration(id);
    showToast('Configuration removed.');
  };

  // Open saved build in Configurator
  const handleOpenConfiguration = (config: UserConfiguration) => {
    setCurrentProduct(config.product);
    setActiveTab('configurator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Spec Sheet trigger
  const handleOpenSpecSheet = (
    product: Product,
    color: ColorOption,
    wheel: WheelOption,
    addOns: AddOnOption[],
    totalPrice: number
  ) => {
    setSpecSheetData({
      isOpen: true,
      product,
      color,
      wheel,
      addOns,
      totalPrice,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedConfigurations.length}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        user={user}
        onSignOut={handleSignOut}
        isCloudConnected={isCloudConnected}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {/* Tab 1: HOME */}
        {activeTab === 'home' && (
          <>
            <HeroSection
              onExploreConfigurator={() => {
                setActiveTab('configurator');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreProducts={() => {
                setActiveTab('catalog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <FeaturedProduct
              product={MOCK_PRODUCTS[0]}
              onCustomize={handleSelectProduct}
            />

            <ProductCatalog
              products={MOCK_PRODUCTS}
              onSelectProduct={handleSelectProduct}
            />
          </>
        )}

        {/* Tab 2: PRODUCT CATALOG */}
        {activeTab === 'catalog' && (
          <ProductCatalog
            products={MOCK_PRODUCTS}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {/* Tab 3: INTERACTIVE 3D CONFIGURATOR */}
        {activeTab === 'configurator' && (
          <ConfiguratorView
            products={MOCK_PRODUCTS}
            currentProduct={currentProduct}
            onSelectProduct={setCurrentProduct}
            onSaveConfiguration={handleSaveConfiguration}
            onOpenSpecSheet={handleOpenSpecSheet}
          />
        )}

        {/* Tab 4: MY SAVED CONFIGURATIONS DASHBOARD */}
        {activeTab === 'my-configurations' && (
          <MyConfigurations
            configurations={savedConfigurations}
            onOpenConfig={handleOpenConfiguration}
            onDuplicateConfig={handleDuplicateConfiguration}
            onRenameConfig={(config) => setRenameTarget(config)}
            onDeleteConfig={handleDeleteConfiguration}
            onNewConfig={() => {
              setActiveTab('configurator');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onCompareConfigs={() => setIsCompareModalOpen(true)}
            onViewSpecSheet={handleOpenSpecSheet}
            isCloudConnected={isCloudConnected}
          />
        )}
      </main>

      {/* Shared Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* Floating Feedback Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900/95 border border-cyan-500/50 shadow-2xl backdrop-blur-md text-xs text-white animate-in slide-in-from-bottom-3 duration-200">
          <Check className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <CompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        configurations={savedConfigurations}
        onOpenConfig={handleOpenConfiguration}
      />

      <RenameModal
        isOpen={Boolean(renameTarget)}
        onClose={() => setRenameTarget(null)}
        config={renameTarget}
        onRename={handleRenameConfiguration}
      />

      <SpecSheetModal
        isOpen={specSheetData.isOpen}
        onClose={() => setSpecSheetData({ ...specSheetData, isOpen: false })}
        product={specSheetData.product}
        color={specSheetData.color}
        wheel={specSheetData.wheel}
        addOns={specSheetData.addOns}
        totalPrice={specSheetData.totalPrice}
      />
    </div>
  );
}

export default App;
