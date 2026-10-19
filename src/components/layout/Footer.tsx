import React from 'react';
import { Box, GitBranch, Layers, ShieldCheck, Cpu } from 'lucide-react';
import type { ActiveTab } from '../../types';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 mt-20 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Project Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
                  <Box className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                ProductVision
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 max-w-md">
              An interactive 3D product visualization and custom automotive configurator built for high-performance WebGL rendering, deterministic pricing, and bespoke customer spec generation.
            </p>
            <div className="p-3.5 bg-slate-900/70 border border-slate-800/80 rounded-xl space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2 font-medium text-cyan-400">
                <Cpu className="w-4 h-4" />
                <span>High-Performance 3D Visualization Platform</span>
              </div>
              <p className="text-slate-400">
                Built with React 19, TypeScript, Tailwind CSS, Three.js WebGL rendering & Supabase Cloud.
              </p>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-xs font-mono font-semibold tracking-wider text-slate-200 uppercase mb-4">
              Explore ProductVision
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-cyan-400 transition"
                >
                  Home & Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-cyan-400 transition"
                >
                  Product Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('configurator');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-cyan-400 transition"
                >
                  Interactive Configurator
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('my-configurations');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-cyan-400 transition"
                >
                  My Saved Configurations
                </button>
              </li>
            </ul>
          </div>

          {/* Platform Specifications */}
          <div>
            <h3 className="text-xs font-mono font-semibold tracking-wider text-slate-200 uppercase mb-4">
              Platform Features
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Interactive 3D Orbit & Studio Lighting</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>PBR Paint Finishes & Wheel Swapping</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                <span>Deterministic Pricing & Spec Generator</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Cloud Sync & Row Level Security</span>
              </li>
            </ul>
            <div className="mt-4 pt-3 border-t border-slate-900 flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Enterprise-Grade Security & RLS</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>
            © {new Date().getFullYear()} ProductVision. Designed & Engineered by{' '}
            <span className="text-slate-200 font-medium hover:text-cyan-400 transition-colors">
              Vishal Kumar Mohaniya
            </span>
            .
          </p>
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1.5 hover:text-slate-300 transition">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              TypeScript Strict Mode
            </span>
            <span className="flex items-center gap-1.5 hover:text-slate-300 transition">
              <GitBranch className="w-3.5 h-3.5 text-slate-400" />
              GitHub Ready
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
