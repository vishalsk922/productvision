import React, { useState } from 'react';
import { Box, Menu, X, User, SlidersHorizontal, Sparkles, LogOut, Database } from 'lucide-react';
import type { ActiveTab, UserProfile } from '../../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  savedCount: number;
  onOpenAuth: () => void;
  user: UserProfile | null;
  onSignOut: () => void;
  isCloudConnected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  onOpenAuth,
  user,
  onSignOut,
  isCloudConnected,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ActiveTab; label: string; badge?: number }[] = [
    { id: 'home', label: 'Home' },
    { id: 'catalog', label: 'Explore Products' },
    { id: 'configurator', label: '3D Configurator' },
    { id: 'my-configurations', label: 'My Configurations', badge: savedCount },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/85 border-b border-slate-800/80 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg p-1"
            aria-label="ProductVision Home"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Box className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div className="text-left">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                ProductVision
              </span>
              <span className="block text-[10px] font-mono tracking-widest text-cyan-400/80 uppercase">
                3D Configurator
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    isActive
                      ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-800/50 shadow-sm shadow-cyan-950'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <span>{item.label}</span>
                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span className="ml-1.5 px-2 py-0.5 text-xs font-mono font-semibold rounded-full bg-cyan-500 text-slate-950">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action / User Controls */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Database Cloud Indicator */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono border ${
                isCloudConnected
                  ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
              title={
                isCloudConnected
                  ? 'PostgreSQL Cloud Database Live (Supabase RLS)'
                  : 'Local Verified Mode (Add Supabase URL/Key in .env to connect to cloud)'
              }
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{isCloudConnected ? 'Supabase Connected' : 'Local Storage'}</span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isCloudConnected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
                }`}
              />
            </div>

            <button
              onClick={() => handleNavClick('configurator')}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-md transition"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Studio View</span>
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('my-configurations')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white transition"
                >
                  <div className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center font-bold text-[10px]">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <span className="truncate max-w-[100px]">{user.fullName}</span>
                </button>
                <button
                  onClick={onSignOut}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 bg-slate-900 hover:bg-rose-950/50 border border-slate-800 transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-md shadow-cyan-900/30 hover:shadow-cyan-500/20 active:scale-95 transition-all"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={user ? onSignOut : onOpenAuth}
              className="p-2 text-slate-300 hover:text-white bg-slate-900 rounded-lg border border-slate-800"
              aria-label={user ? 'Sign Out' : 'Sign In'}
            >
              {user ? <LogOut className="w-5 h-5 text-rose-400" /> : <User className="w-5 h-5 text-cyan-400" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white bg-slate-900 rounded-lg border border-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 px-4 pt-3 pb-5 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-base font-medium flex items-center justify-between ${
                  isActive
                    ? 'text-cyan-400 bg-cyan-950/50 border border-cyan-800/60'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <span>{item.label}</span>
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span className="px-2 py-0.5 text-xs font-mono font-semibold rounded-full bg-cyan-500 text-slate-950">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 px-2">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              {isCloudConnected ? 'Supabase PostgreSQL Cloud Active' : 'Local Verified Mode Active'}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
