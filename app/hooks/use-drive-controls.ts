'use client';

import { useEffect, useRef } from 'react';

export interface DriveState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
}

const KEY_MAP: Record<string, keyof DriveState> = {
  KeyW: 'forward',
  ArrowUp: 'forward',
  KeyS: 'backward',
  ArrowDown: 'backward',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right',
};

/**
 * Tracks which drive keys are currently held, in a ref (not state) so the
 * render loop can read it every frame without triggering React re-renders.
 * `set` is exposed so an on-screen touch d-pad can drive the same ref.
 */
export function useDriveControls() {
  const state = useRef<DriveState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = KEY_MAP[e.code];
      if (!key) return;
      state.current[key] = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const key = KEY_MAP[e.code];
      if (!key) return;
      state.current[key] = false;
    };
    const onBlur = () => {
      state.current = { forward: false, backward: false, left: false, right: false };
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  function set(key: keyof DriveState, value: boolean) {
    state.current[key] = value;
  }

  return { state, set };
}
