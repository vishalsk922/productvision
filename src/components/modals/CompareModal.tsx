import React, { useState } from 'react';
import { X, Scale, ExternalLink, Gauge, Zap, Flame, Check } from 'lucide-react';
import type { UserConfiguration } from '../../types';
import { formatCurrency } from '../../lib/pricingEngine';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  configurations: UserConfiguration[];
  onOpenConfig: (config: UserConfiguration) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  configurations,
  onOpenConfig,
}) => {
  // Select up to 3 configs to compare
  const [selectedIds, setSelectedIds] = useState<string[]>(
    configurations.slice(0, 2).map((c) => c.id)
  );

  if (!isOpen) return null;

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter((item) => item !== id));
      }
    } else {
      if (selectedIds.length < 3) {
        setSelectedIds([...selectedIds, id]);
      } else {
        // Replace oldest
        setSelectedIds([selectedIds[1], selectedIds[2], id]);
      }
    }
  };

  const comparedList = configurations.filter((c) => selectedIds.includes(c.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 text-left space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800/60 flex items-center justify-center">
              <Scale className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Compare Configurations
              </h2>
              <p className="text-xs text-slate-400">
                Side-by-side spec, pricing, and aesthetic comparison.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Configuration Selection Pills */}
        <div className="space-y-2">
          <span className="text-xs font-mono text-slate-400">
            Select 2 or 3 saved builds to compare:
          </span>
          <div className="flex flex-wrap gap-2">
            {configurations.map((item) => {
              const isChecked = selectedIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggleSelect(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-2 transition ${
                    isChecked
                      ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: item.selectedColor.hex }}
                  />
                  <span>{item.title}</span>
                  {isChecked && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Side-by-Side Comparison Table Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {comparedList.map((item) => (
            <div
              key={item.id}
              className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4"
            >
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400 bg-slate-900 px-2 py-0.5 rounded">
                  {item.product.category}
                </span>
                <h3 className="text-lg font-bold text-white mt-2">{item.title}</h3>
                <div className="text-xs text-slate-400 mb-3">
                  Base Model: <strong className="text-slate-200">{item.product.name}</strong>
                </div>

                <div className="text-2xl font-black font-mono text-cyan-400 mb-4 pb-3 border-b border-slate-800">
                  {formatCurrency(item.totalPrice)}
                </div>

                {/* Aesthetic Specs */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-900">
                    <span className="text-slate-400">Paint Finish:</span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-slate-600"
                        style={{ backgroundColor: item.selectedColor.hex }}
                      />
                      <span className="text-white font-medium">
                        {item.selectedColor.name} ({item.selectedColor.finish})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-slate-900">
                    <span className="text-slate-400">Wheels:</span>
                    <span className="text-white font-medium truncate max-w-[170px]">
                      {item.selectedWheel.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-slate-900">
                    <span className="text-slate-400">Upgrades ({item.selectedAddOns.length}):</span>
                    <span className="text-cyan-400 font-mono font-medium">
                      +{formatCurrency(
                        item.selectedAddOns.reduce((sum, a) => sum + a.price, 0)
                      )}
                    </span>
                  </div>

                  {/* Performance Specs */}
                  <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                      <div className="flex items-center gap-1 text-slate-400">
                        <Gauge className="w-3 h-3 text-cyan-400" />
                        <span>0-60 MPH</span>
                      </div>
                      <div className="text-white font-bold mt-0.5">{item.product.specs.acceleration}</div>
                    </div>

                    <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                      <div className="flex items-center gap-1 text-slate-400">
                        <Flame className="w-3 h-3 text-orange-400" />
                        <span>Top Speed</span>
                      </div>
                      <div className="text-white font-bold mt-0.5">{item.product.specs.topSpeed}</div>
                    </div>

                    <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                      <div className="flex items-center gap-1 text-slate-400">
                        <Zap className="w-3 h-3 text-yellow-400" />
                        <span>Horsepower</span>
                      </div>
                      <div className="text-white font-bold mt-0.5">{item.product.specs.horsepower}</div>
                    </div>

                    <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                      <div className="flex items-center gap-1 text-slate-400">
                        <span>AWD</span>
                      </div>
                      <div className="text-white font-bold mt-0.5 truncate">{item.product.specs.drivetrain}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  onClose();
                  onOpenConfig(item);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Load in 3D Configurator</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
