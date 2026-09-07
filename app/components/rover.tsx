'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { DriveState } from '../hooks/use-drive-controls';
import { ISLAND_RADIUS, ZONE_TRIGGER_DISTANCE } from '../lib/constants';

const MAX_SPEED = 12;
const ACCELERATION = 16;
const BRAKE = 22;
const FRICTION = 10;
const TURN_SPEED = 2.4;
const WHEEL_RADIUS = 0.42;

interface RoverProps {
  controls: React.RefObject<DriveState>;
  zonePositions: [number, number][];
  activeZone: number | null;
  onZoneChange: (index: number | null) => void;
  /** Updated every frame with the rover's world position + heading, read by
   * the camera rig and the minimap. Kept as a ref to avoid re-rendering React
   * sixty times a second. */
  transformRef: React.RefObject<{ x: number; z: number; heading: number }>;
}

export default function Rover({
  controls,
  zonePositions,
  activeZone,
  onZoneChange,
  transformRef,
}: RoverProps) {
  const group = useRef<THREE.Group>(null);
  const wheelRefs = useRef<THREE.Mesh[]>([]);
  const speed = useRef(0);
  const heading = useRef(Math.PI); // start facing the first stop (north)

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05); // guard against huge jumps on tab-refocus
    const input = controls.current;
    if (!group.current) return;

    // --- acceleration / braking / friction -------------------------------
    if (input.forward) {
      speed.current += ACCELERATION * dt;
    } else if (input.backward) {
      speed.current -= BRAKE * dt;
    } else if (speed.current > 0) {
      speed.current = Math.max(0, speed.current - FRICTION * dt);
    } else if (speed.current < 0) {
      speed.current = Math.min(0, speed.current + FRICTION * dt);
    }
    speed.current = THREE.MathUtils.clamp(speed.current, -MAX_SPEED * 0.5, MAX_SPEED);

    // --- steering (only meaningful while moving, like a real car) --------
    const steerFactor = THREE.MathUtils.clamp(Math.abs(speed.current) / 4, 0, 1);
    if (input.left) heading.current += TURN_SPEED * steerFactor * dt * Math.sign(speed.current || 1);
    if (input.right) heading.current -= TURN_SPEED * steerFactor * dt * Math.sign(speed.current || 1);

    // --- integrate position -----------------------------------------------
    const dx = Math.sin(heading.current) * speed.current * dt;
    const dz = Math.cos(heading.current) * speed.current * dt;
    let nextX = group.current.position.x + dx;
    let nextZ = group.current.position.z + dz;

    // keep the rover on the island
    const distFromCenter = Math.hypot(nextX, nextZ);
    const maxRadius = ISLAND_RADIUS - 3;
    if (distFromCenter > maxRadius) {
      const scale = maxRadius / distFromCenter;
      nextX *= scale;
      nextZ *= scale;
      speed.current *= 0.6; // bump off the shoreline instead of a hard stop
    }

    group.current.position.x = nextX;
    group.current.position.z = nextZ;
    group.current.rotation.y = heading.current;

    // spin the wheels based on distance travelled
    const wheelSpin = (speed.current * dt) / WHEEL_RADIUS;
    for (const wheel of wheelRefs.current) {
      if (wheel) wheel.rotation.x -= wheelSpin;
    }

    if (transformRef.current) {
      transformRef.current.x = nextX;
      transformRef.current.z = nextZ;
      transformRef.current.heading = heading.current;
    }

    // --- proximity check for the nearest stop -----------------------------
    let nearest: number | null = null;
    let nearestDist = Infinity;
    zonePositions.forEach(([zx, zz], index) => {
      const d = Math.hypot(nextX - zx, nextZ - zz);
      if (d < nearestDist) {
        nearestDist = d;
        nearest = index;
      }
    });
    const withinRange = nearest !== null && nearestDist < ZONE_TRIGGER_DISTANCE;
    const nextActive = withinRange ? nearest : null;
    if (nextActive !== activeZone) onZoneChange(nextActive);
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* body */}
      <mesh castShadow position={[0, 0.62, 0]}>
        <boxGeometry args={[1.6, 0.7, 2.6]} />
        <meshStandardMaterial color="#E8622C" roughness={0.45} metalness={0.15} />
      </mesh>
      {/* cabin */}
      <mesh castShadow position={[0, 1.12, -0.15]}>
        <boxGeometry args={[1.25, 0.5, 1.3]} />
        <meshStandardMaterial color="#1F2A30" roughness={0.3} metalness={0.2} />
      </mesh>
      {/* roll bar */}
      <mesh castShadow position={[0, 1.5, -0.15]}>
        <torusGeometry args={[0.66, 0.05, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#F2E9DC" roughness={0.4} />
      </mesh>
      {/* headlight glow */}
      <pointLight color="#FFE9C7" intensity={2.2} distance={6} position={[0, 0.7, 1.4]} />
      {/* wheels */}
      {[
        [-0.9, 0.42, 0.85],
        [0.9, 0.42, 0.85],
        [-0.9, 0.42, -0.85],
        [0.9, 0.42, -0.85],
      ].map((pos, i) => (
        <mesh
          key={i}
          castShadow
          ref={(el) => {
            if (el) wheelRefs.current[i] = el;
          }}
          position={pos as [number, number, number]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[WHEEL_RADIUS, WHEEL_RADIUS, 0.4, 16]} />
          <meshStandardMaterial color="#141414" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}
