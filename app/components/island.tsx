'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { ISLAND_RADIUS, makeRadialGradientTexture } from '../lib/constants';
import type { PortfolioZone } from '../portfolio-data';

// Fixed decorative positions so trees/rocks never block the driving path
// (kept well clear of the ring the signposts sit on).
const TREES: [number, number, number][] = [
  [10, 0, 4], [-14, 0, 9], [6, 0, -18], [-8, 0, -12], [17, 0, -6],
  [-20, 0, -2], [3, 0, 20], [-4, 0, 24], [22, 0, 10], [-24, 0, 12],
];
const ROCKS: [number, number, number][] = [
  [13, 0, -10], [-11, 0, 16], [19, 0, 17], [-19, 0, -14], [1, 0, -25],
];

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 1, 0]}>
        <cylinderGeometry args={[0.18, 0.24, 2, 6]} />
        <meshStandardMaterial color="#6B4A32" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 2.4, 0]}>
        <coneGeometry args={[1.1, 2.2, 7]} />
        <meshStandardMaterial color="#4C7A4A" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0, 3.4, 0]}>
        <coneGeometry args={[0.8, 1.6, 7]} />
        <meshStandardMaterial color="#5A8B54" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Rock({ position }: { position: [number, number, number] }) {
  return (
    <mesh castShadow position={[position[0], 0.4, position[2]]} rotation={[0.3, 0.6, 0.1]}>
      <icosahedronGeometry args={[0.7, 0]} />
      <meshStandardMaterial color="#8C8378" roughness={1} flatShading />
    </mesh>
  );
}

function Signpost({
  zone,
  position,
  active,
}: {
  zone: PortfolioZone;
  position: [number, number];
  active: boolean;
}) {
  return (
    <group position={[position[0], 0, position[1]]}>
      <mesh castShadow position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 2.2, 8]} />
        <meshStandardMaterial color="#3B2A20" roughness={0.85} />
      </mesh>
      <mesh castShadow position={[0, 2.15, 0]}>
        <sphereGeometry args={[0.34, 16, 16]} />
        <meshStandardMaterial
          color={zone.color}
          emissive={zone.color}
          emissiveIntensity={active ? 1.4 : 0.55}
          roughness={0.35}
        />
      </mesh>
      <pointLight color={zone.color} intensity={active ? 3 : 1.2} distance={9} position={[0, 2.15, 0]} />
      <Html position={[0, 2.9, 0]} center distanceFactor={22} occlude={false}>
        <div className={`zone-tag ${active ? 'zone-tag--active' : ''}`} style={{ borderColor: zone.color }}>
          {zone.title}
        </div>
      </Html>
      {/* ground ring marking the stop */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[1.5, 1.75, 32]} />
        <meshStandardMaterial color={zone.color} emissive={zone.color} emissiveIntensity={0.4} transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

export default function Island({
  zones,
  zonePositions,
  activeZone,
}: {
  zones: PortfolioZone[];
  zonePositions: [number, number][];
  activeZone: number | null;
}) {
  const waterGlow = useMemo(
    () => makeRadialGradientTexture('rgba(120,200,220,0.55)', 'rgba(17,75,95,0)'),
    [],
  );

  return (
    <group>
      {/* water */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]} receiveShadow>
        <circleGeometry args={[240, 64]} />
        <meshStandardMaterial color="#0E3A4A" roughness={0.35} metalness={0.1} />
      </mesh>
      {waterGlow && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.38, 0]}>
          <circleGeometry args={[ISLAND_RADIUS * 1.6, 48]} />
          <meshBasicMaterial map={waterGlow} transparent opacity={0.5} depthWrite={false} />
        </mesh>
      )}

      {/* sand shelf */}
      <mesh receiveShadow position={[0, -0.15, 0]}>
        <cylinderGeometry args={[ISLAND_RADIUS + 1.5, ISLAND_RADIUS + 3, 0.5, 48]} />
        <meshStandardMaterial color="#E3C08C" roughness={1} />
      </mesh>

      {/* main island */}
      <mesh receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[ISLAND_RADIUS, ISLAND_RADIUS + 1, 0.6, 48]} />
        <meshStandardMaterial color="#5C8A52" roughness={1} />
      </mesh>

      {TREES.map((p, i) => (
        <Tree key={i} position={p} />
      ))}
      {ROCKS.map((p, i) => (
        <Rock key={i} position={p} />
      ))}

      {zones.map((zone, i) => (
        <Signpost key={zone.id} zone={zone} position={zonePositions[i]} active={activeZone === i} />
      ))}
    </group>
  );
}
