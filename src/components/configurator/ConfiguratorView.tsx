import React, { useState } from 'react';
import {
  RotateCcw,
  RotateCw,
  Layers,
  Sun,
  Check,
  Save,
  FileText,
  ChevronRight,
  Box,
  Compass,
} from 'lucide-react';
import type { Product, ColorOption, WheelOption, AddOnOption } from '../../types';
import { calculateConfigurationPrice, formatCurrency } from '../../lib/pricingEngine';
import { SceneCanvas } from '../3d/SceneCanvas';
import { ErrorBoundary } from '../common/ErrorBoundary';

interface ConfiguratorViewProps {
  products: Product[];
  currentProduct: Product;
  onSelectProduct: (product: Product) => void;
  onSaveConfiguration: (
    title: string,
    color: ColorOption,
    wheel: WheelOption,
    addOns: AddOnOption[],
    totalPrice: number
  ) => void;
  onOpenSpecSheet: (
    product: Product,
    color: ColorOption,
    wheel: WheelOption,
    addOns: AddOnOption[],
    totalPrice: number
  ) => void;
}

export const ConfiguratorView: React.FC<ConfiguratorViewProps> = ({
  products,
  currentProduct,
  onSelectProduct,
  onSaveConfiguration,
  onOpenSpecSheet,
}) => {
  // Configurator state
  const [selectedColor, setSelectedColor] = useState<ColorOption>(
    currentProduct.availableColors[0]
  );
  const [selectedWheel, setSelectedWheel] = useState<WheelOption>(
    currentProduct.availableWheels[0]
  );
  const [selectedAddOns, setSelectedAddOns] = useState<AddOnOption[]>([]);
  const [activeTab, setActiveTab] = useState<'paint' | 'wheels' | 'options'>('paint');

  // 3D Studio WebGL controls
  const [wireframeMode, setWireframeMode] = useState(false);
  const [studioLightMode, setStudioLightMode] = useState<'studio' | 'sunset' | 'cyber'>('studio');
  const [cameraPreset, setCameraPreset] = useState<'perspective' | 'front' | 'side' | 'rear'>('perspective');
  const [autoRotate, setAutoRotate] = useState(false);
  const [viewMode, setViewMode] = useState<'3d' | 'schematic'>('3d');
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // Sync state if user changes model from selector
  const handleModelChange = (productId: string) => {
    const found = products.find((p) => p.id === productId);
    if (found) {
      onSelectProduct(found);
      setSelectedColor(found.availableColors[0]);
      setSelectedWheel(found.availableWheels[0]);
      setSelectedAddOns([]);
    }
  };

  // Toggle add-ons
  const handleToggleAddOn = (option: AddOnOption) => {
    if (selectedAddOns.some((o) => o.id === option.id)) {
      setSelectedAddOns(selectedAddOns.filter((o) => o.id !== option.id));
    } else {
      setSelectedAddOns([...selectedAddOns, option]);
    }
  };

  // Reset to factory spec
  const handleReset = () => {
    setSelectedColor(currentProduct.availableColors[0]);
    setSelectedWheel(currentProduct.availableWheels[0]);
    setSelectedAddOns([]);
  };

  // Deterministic price calculation
  const priceBreakdown = calculateConfigurationPrice(
    currentProduct,
    selectedColor,
    selectedWheel,
    selectedAddOns
  );

  const handleSaveClick = () => {
    const title = `${currentProduct.name} - ${selectedColor.name} Edition`;
    onSaveConfiguration(
      title,
      selectedColor,
      selectedWheel,
      selectedAddOns,
      priceBreakdown.totalPrice
    );
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
      {/* Top Breadcrumb & Model Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span>Configurator Studio</span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-slate-400">{currentProduct.category}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            {currentProduct.name}
          </h1>
        </div>

        {/* Quick Model Selector Dropdown */}
        <div className="flex items-center gap-3">
          <label htmlFor="model-select" className="text-xs font-mono text-slate-400">
            Select Platform:
          </label>
          <select
            id="model-select"
            value={currentProduct.id}
            onChange={(e) => handleModelChange(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 font-medium focus:outline-none focus:border-cyan-500"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({formatCurrency(p.basePrice)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Studio Viewport & Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 Columns: 3D Canvas Studio Area */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border border-slate-800 shadow-2xl overflow-hidden flex flex-col justify-between p-3 sm:p-5">
            {/* Viewport Top Header Controls */}
            <div className="flex items-center justify-between z-10 gap-2">
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-cyan-800/60 text-xs font-mono text-cyan-300">
                  <Box className="w-4 h-4 text-cyan-400" />
                  <span>3D WebGL Studio (Phase 2 Active)</span>
                </div>

                {/* View Mode Toggle (3D vs 2D Blueprint) */}
                <button
                  onClick={() => setViewMode(viewMode === '3d' ? 'schematic' : '3d')}
                  className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono bg-slate-900/80 text-slate-300 border border-slate-800 hover:text-white transition"
                  title="Toggle 3D WebGL vs 2D Blueprint"
                >
                  <Compass className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{viewMode === '3d' ? '3D View' : '2D Schematic'}</span>
                </button>
              </div>

              {/* Viewport Action Toggles */}
              <div className="flex items-center gap-2">
                {/* Auto Rotate Toggle */}
                {viewMode === '3d' && (
                  <button
                    onClick={() => setAutoRotate(!autoRotate)}
                    className={`p-2 rounded-lg text-xs font-mono border transition flex items-center gap-1.5 ${
                      autoRotate
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 shadow-sm shadow-cyan-950'
                        : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                    title={autoRotate ? 'Stop Auto-Rotate' : 'Start 360° Auto-Rotate'}
                  >
                    <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
                    <span className="hidden sm:inline text-[11px]">360°</span>
                  </button>
                )}

                {/* Wireframe Mesh Toggle */}
                <button
                  onClick={() => setWireframeMode(!wireframeMode)}
                  className={`p-2 rounded-lg text-xs font-mono border transition ${
                    wireframeMode
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 shadow-sm shadow-cyan-950'
                      : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                  title="Toggle Wireframe Mesh Shader"
                >
                  <Layers className="w-4 h-4" />
                </button>

                {/* Lighting Preset Toggle */}
                <button
                  onClick={() =>
                    setStudioLightMode(
                      studioLightMode === 'studio'
                        ? 'sunset'
                        : studioLightMode === 'sunset'
                        ? 'cyber'
                        : 'studio'
                    )
                  }
                  className="p-2 rounded-lg text-xs font-mono bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white transition flex items-center gap-1"
                  title={`Studio Lighting: ${studioLightMode.toUpperCase()}`}
                >
                  <Sun className={`w-4 h-4 ${studioLightMode === 'sunset' ? 'text-amber-400' : studioLightMode === 'cyber' ? 'text-cyan-400' : 'text-slate-200'}`} />
                  <span className="hidden sm:inline text-[11px] capitalize">{studioLightMode}</span>
                </button>
              </div>
            </div>

            {/* Central Viewport: Live Three.js WebGL Canvas or 2D Schematic */}
            <div className="relative w-full h-[320px] sm:h-[400px] lg:h-[440px] my-auto overflow-hidden rounded-xl">
              {viewMode === '3d' ? (
                <ErrorBoundary>
                  <SceneCanvas
                    color={selectedColor}
                    wheel={selectedWheel}
                    addOns={selectedAddOns}
                    wireframeMode={wireframeMode}
                    studioLightMode={studioLightMode}
                    cameraPreset={cameraPreset}
                    autoRotate={autoRotate}
                  />
                  {/* Subtle 3D Interaction Hint */}
                  <div className="absolute bottom-2 left-3 pointer-events-none z-10 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950/70 backdrop-blur-sm border border-slate-800/80 text-[10px] font-mono text-slate-400">
                    <Compass className="w-3 h-3 text-cyan-400" />
                    <span>Left Click + Drag to Orbit • Scroll to Zoom</span>
                  </div>
                </ErrorBoundary>
              ) : (
                /* 2D Schematic Blueprint Fallback / Educational Comparison */
                <div className="w-full h-full flex flex-col items-center justify-center p-4">
                  <div className="relative w-full max-w-md">
                    <svg
                      viewBox="0 0 600 240"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-full h-auto drop-shadow-2xl"
                    >
                      <path
                        d="M 60 160 C 80 160 110 160 130 145 C 160 120 220 70 340 70 C 410 70 480 95 530 135 C 550 150 560 165 570 170 C 540 170 510 170 490 170 C 480 140 430 140 420 170 C 310 170 270 170 230 170 C 220 140 170 140 160 170 C 110 170 80 170 50 170 C 45 165 50 160 60 160 Z"
                        fill={selectedColor.hex}
                        stroke="#38bdf8"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M 210 125 C 235 90 270 80 340 80 C 400 80 430 100 460 125 Z"
                        fill="#0f172a"
                        stroke="#64748b"
                        strokeWidth="1.5"
                        opacity="0.85"
                      />
                      <g transform="translate(190, 170)">
                        <circle r="34" fill="#020617" stroke="#38bdf8" strokeWidth="2" />
                        <circle r="12" fill={selectedWheel.price > 0 ? '#38bdf8' : '#94a3b8'} />
                      </g>
                      <g transform="translate(455, 170)">
                        <circle r="34" fill="#020617" stroke="#38bdf8" strokeWidth="2" />
                        <circle r="12" fill={selectedWheel.price > 0 ? '#38bdf8' : '#94a3b8'} />
                      </g>
                    </svg>
                  </div>
                  <div className="mt-2 text-center text-xs text-slate-400 font-mono">
                    <span>2D Schematic Blueprint • Switch back to 3D View anytime</span>
                  </div>
                </div>
              )}
            </div>

            {/* Viewport Bottom Camera Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-900 z-10 text-xs">
              <div className="flex items-center gap-1.5 text-slate-400 font-mono">
                <span className="hidden sm:inline">Camera Preset:</span>
                {(['perspective', 'front', 'side', 'rear'] as const).map((preset) => (
                  <button
                    key={preset}
                    onClick={() => {
                      setViewMode('3d');
                      setCameraPreset(preset);
                    }}
                    className={`px-2.5 py-1 rounded capitalize text-xs transition ${
                      cameraPreset === preset
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/60 shadow-sm'
                        : 'text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-3 h-3 rounded-full border border-slate-600 inline-block"
                    style={{ backgroundColor: selectedColor.hex }}
                  />
                  <span>Active Paint: <strong className="text-white">{selectedColor.name}</strong></span>
                </span>
                <span className="hidden sm:inline">Finish: <strong className="text-cyan-400">{selectedColor.finish}</strong></span>
              </div>
            </div>
          </div>


          {/* Quick Technical Summary Bar */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block font-mono">0-60 MPH</span>
              <strong className="text-white text-sm font-mono">{currentProduct.specs.acceleration}</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-mono">Top Speed</span>
              <strong className="text-white text-sm font-mono">{currentProduct.specs.topSpeed}</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-mono">Horsepower</span>
              <strong className="text-white text-sm font-mono">{currentProduct.specs.horsepower}</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-mono">Drivetrain</span>
              <strong className="text-white text-sm font-mono">{currentProduct.specs.drivetrain}</strong>
            </div>
          </div>
        </div>

        {/* Right 4 Columns: Interactive Customization & Deterministic Price Summary */}
        <div className="lg:col-span-4 space-y-6">
          {/* Customization Options Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
            {/* Customization Navigation Tabs */}
            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-medium" role="tablist">
              <button
                onClick={() => setActiveTab('paint')}
                className={`flex-1 py-2 rounded-lg text-center transition ${
                  activeTab === 'paint'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Paint ({currentProduct.availableColors.length})
              </button>
              <button
                onClick={() => setActiveTab('wheels')}
                className={`flex-1 py-2 rounded-lg text-center transition ${
                  activeTab === 'wheels'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Wheels ({currentProduct.availableWheels.length})
              </button>
              <button
                onClick={() => setActiveTab('options')}
                className={`flex-1 py-2 rounded-lg text-center transition ${
                  activeTab === 'options'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Upgrades ({currentProduct.availableAddOns.length})
              </button>
            </div>

            {/* TAB 1: Exterior Paint Palette */}
            {activeTab === 'paint' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Selected Paint:</span>
                  <span className="font-semibold text-white">
                    {selectedColor.name} ({selectedColor.finish})
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {currentProduct.availableColors.map((color) => {
                    const isSelected = selectedColor.id === color.id;
                    return (
                      <button
                        key={color.id}
                        onClick={() => setSelectedColor(color)}
                        className={`group relative flex flex-col items-center p-2 rounded-xl border transition-all ${
                          isSelected
                            ? 'border-cyan-400 bg-cyan-950/40 ring-2 ring-cyan-500/30'
                            : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                        }`}
                        title={`${color.name} - ${formatCurrency(color.price)}`}
                      >
                        <div
                          className="w-10 h-10 rounded-full border border-slate-700/80 shadow-md relative flex items-center justify-center transition-transform group-hover:scale-110"
                          style={{ backgroundColor: color.hex }}
                        >
                          {isSelected && (
                            <Check className={`w-4 h-4 ${color.hex === '#f8fafc' || color.hex === '#f1f5f9' ? 'text-slate-950' : 'text-white'}`} />
                          )}
                        </div>
                        <span className="mt-2 text-[10px] text-slate-300 font-medium truncate max-w-full">
                          {color.name}
                        </span>
                        <span className="text-[10px] font-mono text-cyan-400">
                          {color.price === 0 ? 'Included' : `+${formatCurrency(color.price)}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: Wheel Styles */}
            {activeTab === 'wheels' && (
              <div className="space-y-3">
                <div className="text-xs text-slate-400 mb-2">
                  Select Wheel Dimension & Finish:
                </div>
                {currentProduct.availableWheels.map((wheel) => {
                  const isSelected = selectedWheel.id === wheel.id;
                  return (
                    <button
                      key={wheel.id}
                      onClick={() => setSelectedWheel(wheel)}
                      className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-950/30 ring-1 ring-cyan-400'
                          : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-semibold text-white flex items-center gap-2">
                          <span>{wheel.name}</span>
                          <span className="text-[10px] font-mono text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded">
                            {wheel.size}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Finish: {wheel.finish}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-white">
                          {wheel.price === 0 ? 'Standard' : `+${formatCurrency(wheel.price)}`}
                        </div>
                        {isSelected && (
                          <span className="text-[10px] text-cyan-400 font-medium flex items-center gap-1 justify-end">
                            <Check className="w-3 h-3" /> Selected
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* TAB 3: Packages & Performance Upgrades */}
            {activeTab === 'options' && (
              <div className="space-y-3">
                <div className="text-xs text-slate-400 mb-2">
                  Optional Performance & Aero Upgrades:
                </div>
                {currentProduct.availableAddOns.map((addon) => {
                  const isSelected = selectedAddOns.some((o) => o.id === addon.id);
                  return (
                    <label
                      key={addon.id}
                      onClick={() => handleToggleAddOn(addon)}
                      className={`block p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-950/30'
                          : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="mt-0.5 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500"
                          />
                          <div>
                            <div className="text-xs font-semibold text-white">
                              {addon.name}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {addon.description}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-cyan-400 whitespace-nowrap">
                          +{formatCurrency(addon.price)}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Deterministic Price Summary Panel */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 pb-2 border-b border-slate-800 flex items-center justify-between">
              <span>Configuration Summary</span>
              <span className="text-emerald-400 font-mono text-[11px]">Deterministic Engine</span>
            </h3>

            {/* Itemized Line Items */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Base MSRP ({currentProduct.name})</span>
                <span className="font-mono text-white">{formatCurrency(priceBreakdown.basePrice)}</span>
              </div>

              <div className="flex justify-between text-slate-400">
                <span>Paint: {priceBreakdown.paintName}</span>
                <span className="font-mono text-white">
                  {priceBreakdown.paintPrice === 0 ? 'Included' : `+${formatCurrency(priceBreakdown.paintPrice)}`}
                </span>
              </div>

              <div className="flex justify-between text-slate-400">
                <span>Wheels: {priceBreakdown.wheelName}</span>
                <span className="font-mono text-white">
                  {priceBreakdown.wheelPrice === 0 ? 'Included' : `+${formatCurrency(priceBreakdown.wheelPrice)}`}
                </span>
              </div>

              {priceBreakdown.addOnsList.length > 0 && (
                <div className="pt-1 space-y-1 border-t border-slate-800/60">
                  {priceBreakdown.addOnsList.map((addon, index) => (
                    <div key={index} className="flex justify-between text-slate-400 text-[11px]">
                      <span className="truncate max-w-[200px]">+ {addon.name}</span>
                      <span className="font-mono text-slate-300">+{formatCurrency(addon.price)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Total Price Display */}
            <div className="pt-3 border-t border-slate-800 flex items-baseline justify-between">
              <span className="text-sm font-semibold text-slate-200">Total Configured MSRP</span>
              <span className="text-2xl font-extrabold text-white font-mono text-cyan-400">
                {formatCurrency(priceBreakdown.totalPrice)}
              </span>
            </div>

            {/* Success Feedback Alert */}
            {isSavedNotice && (
              <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Configuration saved to 'My Configurations' tab!</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                onClick={handleSaveClick}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-950/40 active:scale-98 transition"
              >
                <Save className="w-4 h-4" />
                <span>Save Configuration</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() =>
                    onOpenSpecSheet(
                      currentProduct,
                      selectedColor,
                      selectedWheel,
                      selectedAddOns,
                      priceBreakdown.totalPrice
                    )
                  }
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Spec Sheet</span>
                </button>

                <button
                  onClick={handleReset}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Reset Specs</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
