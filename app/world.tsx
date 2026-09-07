'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import Rover from './components/rover';
import Island from './components/island';
import CameraRig from './components/camera-rig';
import Hud from './components/hud';
import SimpleView from './components/simple-view';
import { useDriveControls } from './hooks/use-drive-controls';
import { zones } from './portfolio-data';
import { ISLAND_RADIUS, zonePosition, isWebglAvailable, prefersReducedMotion } from './lib/constants';

export default function World() {
  const [ready, setReady] = useState(false);
  const [webglOk, setWebglOk] = useState(true);
  const [simpleView, setSimpleView] = useState(true);
  const [activeZone, setActiveZone] = useState<number | null>(null);

  const { state: controls, set: setControl } = useDriveControls();
  const transformRef = useRef({ x: 0, z: 0, heading: Math.PI });

  const zonePositions = useMemo(
    () => zones.map((_, i) => zonePosition(i, zones.length)),
    [],
  );

  // Everything here reads browser APIs, so it only runs after mount — this
  // keeps the static export's server-rendered HTML free of window/document.
  useEffect(() => {
    const supported = isWebglAvailable();
    setWebglOk(supported);
    setSimpleView(!supported || prefersReducedMotion());
    setReady(true);
  }, []);

  if (!ready) return null;

  if (simpleView) {
    return (
      <SimpleView
        canEnter3d={webglOk}
        onEnter3d={() => setSimpleView(false)}
      />
    );
  }

  return (
    <div className="world">
      <Canvas shadows camera={{ fov: 55, position: [0, 5.5, 9.5] }}>
        <Sky sunPosition={[60, 18, -40]} turbidity={6} rayleigh={1.4} />
        <hemisphereLight args={['#EAF4FF', '#3C5A3E', 0.65]} />
        <directionalLight
          castShadow
          position={[40, 35, -20]}
          intensity={1.4}
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-50}
          shadow-camera-right={50}
          shadow-camera-top={50}
          shadow-camera-bottom={-50}
        />
        <fog attach="fog" args={['#BFE3EE', 60, 220]} />

        <Island zones={zones} zonePositions={zonePositions} activeZone={activeZone} />
        <Rover
          controls={controls}
          zonePositions={zonePositions}
          activeZone={activeZone}
          onZoneChange={setActiveZone}
          transformRef={transformRef}
        />
        <CameraRig transformRef={transformRef} />
      </Canvas>

      <Hud
        zones={zones}
        zonePositions={zonePositions}
        activeZone={activeZone}
        transformRef={transformRef}
        islandRadius={ISLAND_RADIUS}
        onSetControl={setControl}
        onSwitchToSimple={() => setSimpleView(true)}
      />
    </div>
  );
}
