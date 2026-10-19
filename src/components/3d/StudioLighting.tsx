import React from 'react';
import { Environment } from '@react-three/drei';

interface StudioLightingProps {
  mode: 'studio' | 'sunset' | 'cyber';
}

export const StudioLighting: React.FC<StudioLightingProps> = ({ mode }) => {
  return (
    <>
      {/* Dynamic Environment Reflection Map */}
      <Environment preset={mode === 'sunset' ? 'sunset' : 'city'} />

      {mode === 'studio' && (
        <>
          {/* Main Key Light */}
          <directionalLight
            position={[5, 8, 5]}
            intensity={2.8}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-near={0.5}
            shadow-camera-far={25}
            shadow-bias={-0.0001}
          />
          {/* Soft Fill Light */}
          <directionalLight position={[-6, 4, -4]} intensity={1.4} color="#93c5fd" />
          {/* High-Gloss Rim Light */}
          <directionalLight position={[0, 6, -8]} intensity={2.2} color="#f8fafc" />
          {/* Ambient Ground Bounce */}
          <ambientLight intensity={0.65} color="#cbd5e1" />
        </>
      )}

      {mode === 'sunset' && (
        <>
          {/* Warm Golden Hour Key */}
          <directionalLight
            position={[8, 4, 3]}
            intensity={3.5}
            color="#fbbf24"
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          {/* Sunset Horizon Fill */}
          <directionalLight position={[-6, 3, -4]} intensity={1.8} color="#f43f5e" />
          {/* Rim light */}
          <directionalLight position={[0, 5, -6]} intensity={1.5} color="#fdba74" />
          <ambientLight intensity={0.6} color="#7c2d12" />
        </>
      )}

      {mode === 'cyber' && (
        <>
          {/* Electric Neon Cyan Key */}
          <directionalLight
            position={[5, 6, 4]}
            intensity={3.2}
            color="#22d3ee"
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          {/* Hot Magenta Rim Accent */}
          <directionalLight position={[-5, 4, -5]} intensity={2.8} color="#ec4899" />
          {/* Top Violet Accent */}
          <directionalLight position={[0, 8, 0]} intensity={1.5} color="#818cf8" />
          <ambientLight intensity={0.4} color="#0f172a" />
        </>
      )}
    </>
  );
};
