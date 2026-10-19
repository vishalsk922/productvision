import React from 'react';
import { ContactShadows } from '@react-three/drei';

export const StudioFloor: React.FC = () => {
  return (
    <group position={[0, -0.05, 0]}>
      {/* High-fidelity ground contact shadow */}
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.8}
        scale={12}
        blur={2}
        far={4.5}
        resolution={1024}
        color="#000000"
      />

      {/* Subtle Studio Pedestal Disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <circleGeometry args={[6.5, 64]} />
        <meshStandardMaterial
          color="#070a12"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
    </group>
  );
};
