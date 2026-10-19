import React from 'react';
import {
  Car,
  Trash2,
  Copy,
  ExternalLink,
  Calendar,
  Layers,
  Sparkles,
  ShieldCheck,
  Plus,
  FileText,
  Scale,
  Edit3,
  Database,
} from 'lucide-react';
import type { UserConfiguration, Product, ColorOption, WheelOption, AddOnOption } from '../../types';
import { formatCurrency } from '../../lib/pricingEngine';

interface MyConfigurationsProps {
  configurations: UserConfiguration[];
  onOpenConfig: (config: UserConfiguration) => void;
  onDuplicateConfig: (config: UserConfiguration) => void;
  onRenameConfig: (config: UserConfiguration) => void;
  onDeleteConfig: (id: string) => void;
  onNewConfig: () => void;
  onCompareConfigs: () => void;
  onViewSpecSheet: (
    product: Product,
    color: ColorOption,
    wheel: WheelOption,
    addOns: AddOnOption[],
    totalPrice: number
  ) => void;
  isCloudConnected: boolean;
}

export const MyConfigurations: React.FC<MyConfigurationsProps> = ({
  configurations,
  onOpenConfig,
  onDuplicateConfig,
  onRenameConfig,
  onDeleteConfig,
  onNewConfig,
  onCompareConfigs,
  onViewSpecSheet,
  isCloudConnected,
}) => {
  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-cyan-400 uppercase mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Saved Studio Builds</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            My Configurations
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage, duplicate, rename, and compare your customized automotive builds.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {configurations.length >= 2 && (
            <button
              onClick={onCompareConfigs}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 transition"
              title="Compare side-by-side specs"
            >
              <Scale className="w-4 h-4 text-cyan-400" />
              <span>Compare ({configurations.length})</span>
            </button>
          )}

          <button
            onClick={onNewConfig}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 transition shadow-md shadow-cyan-950"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Build</span>
          </button>
        </div>
      </div>

      {/* Cloud & Architecture Persistence Banner */}
      <div className="mb-8 p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-start justify-between gap-4 text-xs">
        <div className="flex items-start gap-3">
          <Database className={`w-4 h-4 shrink-0 mt-0.5 ${isCloudConnected ? 'text-emerald-400' : 'text-cyan-400'}`} />
          <div className="space-y-0.5">
            <div className="font-semibold text-slate-200">
              {isCloudConnected ? (
                <span className="flex items-center gap-2 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Supabase PostgreSQL Cloud Active
                </span>
              ) : (
                <span className="text-cyan-300">
                  Local Storage & RLS-Ready Architecture
                </span>
              )}
            </div>
            <p className="text-slate-400 leading-relaxed">
              {isCloudConnected
                ? 'Your custom car configurations are secured under PostgreSQL Row Level Security (RLS) and synced to your cloud database.'
                : 'Configurations are saved in local storage. To sync across devices, provide your Supabase URL & Anon Key in the .env file.'}
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-slate-400 font-mono text-[11px] whitespace-nowrap">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>RLS Isolated</span>
        </div>
      </div>

      {/* Grid of Saved Configurations */}
      {configurations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {configurations.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between shadow-lg transition-all"
            >
              <div>
                {/* Header with Color Dot & Category */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-cyan-900/50">
                    {item.product.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Configuration Title & Quick Rename */}
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-lg font-bold text-white">
                    {item.title}
                  </h3>
                  <button
                    onClick={() => onRenameConfig(item)}
                    className="p-1 rounded text-slate-400 hover:text-cyan-400 transition"
                    title="Rename Configuration"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-xs text-slate-400 mb-4">
                  Platform: <span className="text-slate-200 font-medium">{item.product.name}</span>
                </div>

                {/* Spec Summary Pill */}
                <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Paint Finish:</span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-slate-600"
                        style={{ backgroundColor: item.selectedColor.hex }}
                      />
                      <span className="text-slate-200 font-medium">
                        {item.selectedColor.name} ({item.selectedColor.finish})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Wheel Package:</span>
                    <span className="text-slate-200 font-medium truncate max-w-[170px]">
                      {item.selectedWheel.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Active Upgrades:</span>
                    <span className="text-cyan-400 font-mono font-medium">
                      {item.selectedAddOns.length} selected
                    </span>
                  </div>
                </div>
              </div>

              {/* Price and Action Buttons */}
              <div className="mt-5 pt-4 border-t border-slate-800">
                <div className="flex items-baseline justify-between mb-4">
                  <span className="text-xs text-slate-400">Calculated MSRP</span>
                  <span className="text-lg font-bold font-mono text-cyan-400">
                    {formatCurrency(item.totalPrice)}
                  </span>
                </div>

                <div className="grid grid-cols-6 gap-2">
                  <button
                    onClick={() => onOpenConfig(item)}
                    className="col-span-2 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition"
                    title="Open in Configurator Studio"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open 3D</span>
                  </button>

                  <button
                    onClick={() => onRenameConfig(item)}
                    className="p-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center justify-center"
                    title="Rename Build"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() =>
                      onViewSpecSheet(
                        item.product,
                        item.selectedColor,
                        item.selectedWheel,
                        item.selectedAddOns,
                        item.totalPrice
                      )
                    }
                    className="p-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center justify-center"
                    title="View Itemized Spec Sheet"
                  >
                    <FileText className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDuplicateConfig(item)}
                    className="p-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center justify-center"
                    title="Duplicate Configuration"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteConfig(item.id)}
                    className="p-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 transition flex items-center justify-center"
                    title="Delete Build"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 text-center bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl p-8 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-800/60 flex items-center justify-center mx-auto mb-4">
            <Car className="w-6 h-6 text-cyan-400" />
          </div>
          <h3 className="text-lg font-bold text-white">No Saved Configurations Yet</h3>
          <p className="mt-1 text-xs text-slate-400 leading-relaxed">
            Customize any product from our catalog, choose custom paint swatches and wheel options, and click "Save Configuration".
          </p>
          <button
            onClick={onNewConfig}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch Studio Configurator</span>
          </button>
        </div>
      )}
    </section>
  );
};
