import React from 'react';
import { X, Printer, ShieldCheck, Box } from 'lucide-react';
import type { Product, ColorOption, WheelOption, AddOnOption } from '../../types';
import { calculateConfigurationPrice, formatCurrency } from '../../lib/pricingEngine';

interface SpecSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  color: ColorOption;
  wheel: WheelOption;
  addOns: AddOnOption[];
  totalPrice: number;
}

export const SpecSheetModal: React.FC<SpecSheetModalProps> = ({
  isOpen,
  onClose,
  product,
  color,
  wheel,
  addOns,
}) => {
  if (!isOpen) return null;

  const breakdown = calculateConfigurationPrice(product, color, wheel, addOns);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 text-left space-y-6">
        {/* Top Action Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800/60 flex items-center justify-center">
              <Box className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <span className="text-sm font-bold text-white">ProductVision Specification Sheet</span>
              <span className="block text-[10px] font-mono text-cyan-400">Deterministic Build Ledger</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 transition"
              title="Print Specification"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
              aria-label="Close specification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Vehicle Header Info */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-3 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono uppercase text-cyan-400">{product.category}</span>
            <h2 className="text-2xl font-extrabold text-white">{product.name}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{product.tagline}</p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block font-mono">Total MSRP</span>
            <span className="text-2xl font-black text-cyan-400 font-mono">
              {formatCurrency(breakdown.totalPrice)}
            </span>
          </div>
        </div>

        {/* Selected Options Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider">
              Selected Exterior & Wheels
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-200">
              <span
                className="w-4 h-4 rounded-full border border-slate-600 inline-block"
                style={{ backgroundColor: color.hex }}
              />
              <span className="font-semibold">{color.name}</span>
              <span className="text-slate-400">({color.finish})</span>
            </div>
            <div className="text-xs text-slate-300">
              Rims: <span className="font-semibold">{wheel.name}</span> ({wheel.size})
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider">
              Factory Performance Specs
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 font-mono">
              <div>0-60: <strong className="text-white">{product.specs.acceleration}</strong></div>
              <div>Top Speed: <strong className="text-white">{product.specs.topSpeed}</strong></div>
              <div>Power: <strong className="text-white">{product.specs.horsepower}</strong></div>
              <div>AWD: <strong className="text-white">{product.specs.drivetrain}</strong></div>
            </div>
          </div>
        </div>

        {/* Itemized Financial Ledger */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider">
            Itemized Pricing Ledger
          </h3>
          <div className="rounded-xl border border-slate-800 overflow-hidden divide-y divide-slate-800 text-xs">
            <div className="p-3 bg-slate-950/60 flex justify-between">
              <span className="text-slate-300">Base Vehicle Price ({product.name})</span>
              <span className="font-mono font-semibold text-white">{formatCurrency(breakdown.basePrice)}</span>
            </div>

            <div className="p-3 bg-slate-950/40 flex justify-between">
              <span className="text-slate-300">Exterior Paint: {breakdown.paintName}</span>
              <span className="font-mono text-white">
                {breakdown.paintPrice === 0 ? 'Included ($0)' : formatCurrency(breakdown.paintPrice)}
              </span>
            </div>

            <div className="p-3 bg-slate-950/40 flex justify-between">
              <span className="text-slate-300">Wheel Package: {breakdown.wheelName}</span>
              <span className="font-mono text-white">
                {breakdown.wheelPrice === 0 ? 'Included ($0)' : formatCurrency(breakdown.wheelPrice)}
              </span>
            </div>

            {breakdown.addOnsList.length > 0 &&
              breakdown.addOnsList.map((addon, idx) => (
                <div key={idx} className="p-3 bg-slate-950/40 flex justify-between">
                  <span className="text-slate-300">+ {addon.name}</span>
                  <span className="font-mono text-white">{formatCurrency(addon.price)}</span>
                </div>
              ))}

            <div className="p-4 bg-slate-950 flex justify-between text-sm font-bold">
              <span className="text-cyan-400">Total Validated Price</span>
              <span className="font-mono text-cyan-400">{formatCurrency(breakdown.totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* Compliance Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Deterministic Math Verified • Architect: Vishal Kumar Mohaniya</span>
          </div>
          <span className="font-mono text-cyan-400">Official Build Spec</span>
        </div>
      </div>
    </div>
  );
};
