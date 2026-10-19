import React, { useMemo, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import type { ColorOption, WheelOption, AddOnOption } from '../../types';

interface CarModelProps {
  color: ColorOption;
  wheel: WheelOption;
  addOns: AddOnOption[];
  wireframeMode?: boolean;
}

export const CarModel: React.FC<CarModelProps> = ({
  color,
  wheel,
  addOns,
  wireframeMode = false,
}) => {
  // Load the official Three.js GLB model
  const { scene } = useGLTF('/models/car.glb');

  // Clone scene so material mutations don't leak or mutate the cached asset
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  // Check if ceramic track brakes are chosen in options
  const hasCeramicBrakes = addOns.some((o) =>
    o.name.toLowerCase().includes('brake') || o.name.toLowerCase().includes('ceramic')
  );

  // Apply real-time material & shader modifications
  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // 1. CAR BODY PAINT CUSTOMIZATION
        if (mesh.name === 'body' || (mesh.material && (mesh.material as THREE.Material).name === 'Body_Color')) {
          const mat = ((mesh.material as THREE.Material).clone()) as THREE.MeshStandardMaterial;
          mat.color = new THREE.Color(color.hex);

          if (color.finish === 'Metallic') {
            mat.roughness = 0.32;
            mat.metalness = 0.88;
          } else if (color.finish === 'Gloss') {
            mat.roughness = 0.12;
            mat.metalness = 0.25;
          } else if (color.finish === 'Matte') {
            mat.roughness = 0.85;
            mat.metalness = 0.08;
          }

          mat.wireframe = wireframeMode;
          mat.needsUpdate = true;
          mesh.material = mat;
        }

        // 2. WHEEL RIMS CUSTOMIZATION (rim_fl, rim_fr, rim_rl, rim_rr)
        if (mesh.name.startsWith('rim_') || mesh.name === 'wheel') {
          const mat = ((mesh.material as THREE.Material).clone()) as THREE.MeshStandardMaterial;
          const finishLower = wheel.finish.toLowerCase();

          if (finishLower.includes('black') || finishLower.includes('dark')) {
            mat.color = new THREE.Color('#18181b');
            mat.roughness = 0.55;
            mat.metalness = 0.65;
          } else if (finishLower.includes('carbon')) {
            mat.color = new THREE.Color('#27272a');
            mat.roughness = 0.4;
            mat.metalness = 0.4;
          } else if (finishLower.includes('bronze')) {
            mat.color = new THREE.Color('#b45309');
            mat.roughness = 0.32;
            mat.metalness = 0.85;
          } else {
            // Machined / Turbine Silver
            mat.color = new THREE.Color('#e2e8f0');
            mat.roughness = 0.18;
            mat.metalness = 0.92;
          }

          mat.needsUpdate = true;
          mesh.material = mat;
        }

        // 3. BRAKE CALIPERS CUSTOMIZATION
        if (mesh.name === 'brakes' || mesh.name === 'brake') {
          const mat = ((mesh.material as THREE.Material).clone()) as THREE.MeshStandardMaterial;
          if (hasCeramicBrakes) {
            mat.color = new THREE.Color('#eab308'); // High-voltage yellow for track ceramics
            mat.roughness = 0.2;
            mat.metalness = 0.75;
          } else {
            mat.color = new THREE.Color('#dc2626'); // Classic race red calipers
            mat.roughness = 0.3;
            mat.metalness = 0.6;
          }
          mat.needsUpdate = true;
          mesh.material = mat;
        }

        // 4. GLASS WINDOWS TRANSPARENCY
        if (mesh.name === 'glass') {
          const mat = ((mesh.material as THREE.Material).clone()) as THREE.MeshStandardMaterial;
          mat.transparent = true;
          mat.opacity = 0.45;
          mat.roughness = 0.05;
          mat.metalness = 0.1;
          mat.needsUpdate = true;
          mesh.material = mat;
        }

        // 5. TIRES RUBBER
        if (mesh.name.startsWith('tire')) {
          const mat = ((mesh.material as THREE.Material).clone()) as THREE.MeshStandardMaterial;
          mat.color = new THREE.Color('#111827');
          mat.roughness = 0.9;
          mat.metalness = 0.05;
          mat.needsUpdate = true;
          mesh.material = mat;
        }
      }
    });
  }, [clonedScene, color, wheel, hasCeramicBrakes, wireframeMode]);

  return (
    <primitive
      object={clonedScene}
      position={[0, -0.05, 0]}
      rotation={[0, Math.PI / 4, 0]}
      scale={0.88}
    />
  );
};

// Preload the GLB model asset for instantaneous rendering
useGLTF.preload('/models/car.glb');
