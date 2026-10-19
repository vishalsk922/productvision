import React from 'react';
import { useProgress, Html } from '@react-three/drei';
import { Box, Sparkles } from 'lucide-react';

export const Loader3D: React.FC = () => {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-2xl backdrop-blur-md min-w-[240px] text-center select-none">
        <div className="relative mb-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 animate-pulse">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Box className="w-6 h-6 text-cyan-400 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
          </div>
          <Sparkles className="w-4 h-4 text-cyan-300 absolute -top-1 -right-1 animate-bounce" />
        </div>

        <span className="text-xs font-mono font-semibold tracking-wider text-cyan-400 uppercase">
          ProductVision 3D Engine
        </span>
        <span className="text-sm font-bold text-white mt-1">
          Loading 3D Car Mesh
        </span>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
            style={{ width: `${Math.round(progress)}%` }}
          />
        </div>

        <span className="text-[11px] font-mono text-slate-400 mt-2">
          {Math.round(progress)}% loaded
        </span>
      </div>
    </Html>
  );
};
