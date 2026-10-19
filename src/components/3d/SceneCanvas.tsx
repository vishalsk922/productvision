import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { ColorOption, WheelOption, AddOnOption } from '../../types';
import { CarModel } from './CarModel';
import { StudioLighting } from './StudioLighting';
import { StudioFloor } from './StudioFloor';
import { Loader3D } from './Loader3D';

interface SceneCanvasProps {
  color: ColorOption;
  wheel: WheelOption;
  addOns: AddOnOption[];
  wireframeMode?: boolean;
  studioLightMode?: 'studio' | 'sunset' | 'cyber';
  cameraPreset?: 'perspective' | 'front' | 'side' | 'rear';
  autoRotate?: boolean;
}

export const SceneCanvas: React.FC<SceneCanvasProps> = ({
  color,
  wheel,
  addOns,
  wireframeMode = false,
  studioLightMode = 'studio',
  cameraPreset = 'perspective',
  autoRotate = false,
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  // Smoothly move camera when user clicks preset buttons
  useEffect(() => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;
    const camera = controls.object;

    if (cameraPreset === 'front') {
      camera.position.set(0, 1.2, 5.0);
    } else if (cameraPreset === 'side') {
      camera.position.set(5.2, 1.2, 0);
    } else if (cameraPreset === 'rear') {
      camera.position.set(0, 1.4, -5.2);
    } else {
      // Perspective
      camera.position.set(4.2, 1.8, 4.2);
    }

    controls.target.set(0, 0.4, 0);
    controls.update();
  }, [cameraPreset]);

  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        camera={{ position: [4.2, 1.8, 4.2], fov: 42 }}
        dpr={[1, 2]}
      >
        <Suspense fallback={<Loader3D />}>
          {/* Studio Lights & Reflection Environment */}
          <StudioLighting mode={studioLightMode} />

          {/* Interactive 3D Car Model */}
          <CarModel
            color={color}
            wheel={wheel}
            addOns={addOns}
            wireframeMode={wireframeMode}
          />

          {/* Studio Floor & Contact Shadow */}
          <StudioFloor />

          {/* User Orbit Rotation & Zoom Controls */}
          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            minDistance={2.6}
            maxDistance={8.5}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.05}
            autoRotate={autoRotate}
            autoRotateSpeed={0.9}
            makeDefault
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
