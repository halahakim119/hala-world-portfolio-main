import * as THREE from 'three';

// Shared numbers for the world. Keeping these in one place means the island,
// the rover's boundary, and the minimap all agree on the same geometry.

export const ISLAND_RADIUS = 34;
export const ZONE_RING_RADIUS = ISLAND_RADIUS * 0.62;
export const ZONE_TRIGGER_DISTANCE = 5.5;
export const ROVER_START = { x: 0, z: 0 };

/**
 * The five stops are laid out in a ring around the spawn point, evenly
 * spaced like a pentagon. Index 0 sits due north so the rover starts facing
 * its first stop.
 */
export function zoneAngle(index: number, total: number): number {
  return (index / total) * Math.PI * 2 - Math.PI / 2;
}

export function zonePosition(index: number, total: number): [number, number] {
  const angle = zoneAngle(index, total);
  return [Math.cos(angle) * ZONE_RING_RADIUS, Math.sin(angle) * ZONE_RING_RADIUS];
}

/** Builds a soft radial-gradient CanvasTexture entirely on the client, so the
 * water/glow effects don't need any image files or network fetches (the
 * site's CSP only allows same-origin connections). */
export function makeRadialGradientTexture(
  inner: string,
  outer: string,
  size = 256,
): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  gradient.addColorStop(0, inner);
  gradient.addColorStop(1, outer);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function isWebglAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('webgl'))
    );
  } catch {
    return false;
  }
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
