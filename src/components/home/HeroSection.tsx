import React from 'react';
import { ArrowRight, Box, Compass, Sparkles, Layers, Zap } from 'lucide-react';

interface HeroSectionProps {
  onExploreConfigurator: () => void;
  onExploreProducts: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreConfigurator,
  onExploreProducts,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24">
      {/* Background Glow Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-cyan-800/60 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs font-mono font-medium text-cyan-300">
                Next-Gen 3D WebGL Configurator
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">BTech IT Major Project</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
              Design Your Dream.{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
                See Every Detail.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl">
              Experience photorealistic 3D automotive customization directly in your browser. Inspect high-fidelity meshes from any angle, experiment with custom paint finishes and wheel packages, and calculate transparent pricing in real time.
            </p>

            {/* Call to Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onExploreConfigurator}
                className="group relative inline-flex items-center justify-center gap-3 px-7 py-4 text-base font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 hover:from-cyan-300 hover:to-blue-300 rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 active:scale-95 transition-all duration-200"
              >
                <Box className="w-5 h-5 text-slate-950 group-hover:rotate-12 transition-transform duration-300" />
                <span>Explore Configurator</span>
                <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreProducts}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 text-base font-semibold text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl transition-all duration-200"
              >
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>Explore Products</span>
              </button>
            </div>

            {/* Key Value Badges */}
            <div className="pt-6 border-t border-slate-900 grid grid-cols-3 gap-4 text-left">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white font-mono">360°</div>
                <div className="text-xs text-slate-400">Interactive Orbit Controls</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-cyan-400 font-mono">Real-Time</div>
                <div className="text-xs text-slate-400">Material & Paint Swapper</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-indigo-400 font-mono">100%</div>
                <div className="text-xs text-slate-400">Deterministic Price Engine</div>
              </div>
            </div>
          </div>

          {/* Right Column: High-Impact Automotive Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl p-1 bg-gradient-to-b from-cyan-500/30 via-slate-800/40 to-transparent shadow-2xl">
              <div className="relative rounded-[15px] overflow-hidden bg-slate-900 border border-slate-800">
                {/* Hero Automotive Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
                  <img
                    src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80"
                    alt="ProductVision Featured Sports Coupe"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-95 contrast-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Top Floating Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-cyan-500/40 text-xs font-mono text-cyan-300">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    <span>Flagship Demo: Apex GT-R</span>
                  </div>

                  {/* Studio Status Marker */}
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/80 backdrop-blur-md border border-emerald-500/30 text-[11px] font-mono text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>Studio Ready</span>
                  </div>

                  {/* Bottom Stats Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800/90 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-400">Starting MSRP</div>
                      <div className="text-lg font-bold text-white font-mono">$128,500</div>
                    </div>
                    <button
                      onClick={onExploreConfigurator}
                      className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition"
                    >
                      Launch 3D View
                    </button>
                  </div>
                </div>

                {/* Sub-card feature highlights */}
                <div className="p-4 bg-slate-950/70 border-t border-slate-800/80 grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    <span>820 HP Hybrid Powertrain</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Modular Mesh Architecture</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Background Decorative Grid */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
};
