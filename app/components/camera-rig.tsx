'use client';

import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Negative Z: the rover drives toward +Z at heading 0, so the chase camera
// sits behind it on -Z before the heading rotation is applied.
const OFFSET = new THREE.Vector3(0, 5.5, -9.5);
const LOOK_HEIGHT = 1.1;

export default function CameraRig({
  transformRef,
}: {
  transformRef: React.RefObject<{ x: number; z: number; heading: number }>;
}) {
  const { camera } = useThree();
  const desired = new THREE.Vector3();
  const lookAt = new THREE.Vector3();

  useFrame((_, delta) => {
    const t = transformRef.current;
    if (!t) return;
    const rotatedOffset = OFFSET.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), t.heading);
    desired.set(t.x + rotatedOffset.x, rotatedOffset.y, t.z + rotatedOffset.z);
    const smoothing = 1 - Math.pow(0.001, delta);
    camera.position.lerp(desired, smoothing);
    lookAt.set(t.x, LOOK_HEIGHT, t.z);
    camera.lookAt(lookAt);
  });

  return null;
}
