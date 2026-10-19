import React from 'react';
import { ArrowRight, Gauge, Zap, Flame, Sparkles, CheckCircle2 } from 'lucide-react';
import type { Product } from '../../types';
import { formatCurrency } from '../../lib/pricingEngine';

interface FeaturedProductProps {
  product: Product;
  onCustomize: (product: Product) => void;
}

export const FeaturedProduct: React.FC<FeaturedProductProps> = ({
  product,
  onCustomize,
}) => {
  return (
    <section className="py-16 bg-slate-900/40 border-y border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-cyan-400 uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Flagship Engineering Showcase</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Featured Model: {product.name}
            </h2>
          </div>

          {/* Custom Build Studio Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>Custom Build Studio • 2026 Edition</span>
          </div>
        </div>

        {/* Featured Product Showcase Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Light */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Left Column: Visual & Color Preview */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 group">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

              {/* Tagline on image */}
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 bg-slate-950/80 px-2.5 py-1 rounded border border-cyan-900/50">
                  {product.category}
                </span>
                <p className="mt-2 text-sm text-slate-200 font-medium max-w-lg drop-shadow">
                  {product.tagline}
                </p>
              </div>
            </div>

            {/* Quick Color Palette Teaser */}
            <div className="flex items-center justify-between px-2 pt-2 text-xs text-slate-400">
              <span className="font-mono">Available Factory Finishes ({product.availableColors.length}):</span>
              <div className="flex items-center space-x-2">
                {product.availableColors.map((color) => (
                  <span
                    key={color.id}
                    title={`${color.name} (${color.finish})`}
                    className="w-5 h-5 rounded-full border border-slate-700 shadow-sm cursor-pointer transition hover:scale-125"
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Specs & Configuration Trigger */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="text-sm font-mono text-cyan-400 mb-1">Starting Benchmark MSRP</div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                {formatCurrency(product.basePrice)}
              </div>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Technical Specifications Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Acceleration</span>
                </div>
                <div className="text-sm font-bold text-white font-mono">
                  {product.specs.acceleration}
                </div>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span>Max Velocity</span>
                </div>
                <div className="text-sm font-bold text-white font-mono">
                  {product.specs.topSpeed}
                </div>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Zap className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Output</span>
                </div>
                <div className="text-sm font-bold text-white font-mono">
                  {product.specs.horsepower}
                </div>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Drivetrain</span>
                </div>
                <div className="text-sm font-bold text-white font-mono">
                  {product.specs.drivetrain}
                </div>
              </div>
            </div>

            {/* Customization Action */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onCustomize(product)}
                className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-900/30 hover:shadow-cyan-500/25 active:scale-98 transition-all"
              >
                <span>Customize Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
