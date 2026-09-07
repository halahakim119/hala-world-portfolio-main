'use client';

import { useEffect, useState } from 'react';
import type { PortfolioZone } from '../portfolio-data';
import type { DriveState } from '../hooks/use-drive-controls';

export default function Hud({
  zones,
  zonePositions,
  activeZone,
  transformRef,
  islandRadius,
  onSetControl,
  onSwitchToSimple,
}: {
  zones: PortfolioZone[];
  zonePositions: [number, number][];
  activeZone: number | null;
  transformRef: React.RefObject<{ x: number; z: number; heading: number }>;
  islandRadius: number;
  onSetControl: (key: keyof DriveState, value: boolean) => void;
  onSwitchToSimple: () => void;
}) {
  const [isTouch, setIsTouch] = useState(false);
  const [roverDot, setRoverDot] = useState({ x: 50, y: 50 });

  useEffect(() => {
    setIsTouch(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  // Throttled minimap updates — reading a ref in a plain rAF loop rather than
  // on every R3F frame keeps this cheap and independent of the 3D render.
  useEffect(() => {
    let raf = 0;
    let last = 0;
    const tick = (time: number) => {
      if (time - last > 120) {
        last = time;
        const t = transformRef.current;
        if (t) {
          setRoverDot({
            x: 50 + (t.x / islandRadius) * 46,
            y: 50 + (t.z / islandRadius) * 46,
          });
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [transformRef, islandRadius]);

  const active = activeZone !== null ? zones[activeZone] : null;

  return (
    <div className="hud">
      <div className="hud__top">
        <div className="hud__brand">
          <span className="hud__brand-mark" />
          Hala&rsquo;s World
        </div>
        <button type="button" className="hud__link" onClick={onSwitchToSimple}>
          Simple view
        </button>
      </div>

      <div className="minimap" aria-hidden="true">
        {zones.map((zone, i) => {
          const [zx, zz] = zonePositions[i];
          const x = 50 + (zx / islandRadius) * 46;
          const y = 50 + (zz / islandRadius) * 46;
          return (
            <div
              key={zone.id}
              className={`minimap__dot ${activeZone === i ? 'minimap__dot--active' : ''}`}
              style={{ left: `${x}%`, top: `${y}%`, background: zone.color }}
              title={zone.title}
            />
          );
        })}
        <div className="minimap__rover" style={{ left: `${roverDot.x}%`, top: `${roverDot.y}%` }} />
      </div>

      {!isTouch && (
        <div className="hud__hint">Drive with <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> or the arrow keys</div>
      )}

      {isTouch && <TouchDpad onSetControl={onSetControl} />}

      <div className={`zone-panel ${active ? 'zone-panel--open' : ''}`}>
        {active && (
          <div style={{ borderColor: active.color }} className="zone-panel__inner">
            <p className="zone-panel__eyebrow" style={{ color: active.color }}>{active.tagline}</p>
            <h2>{active.title}</h2>
            <ul>
              {active.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
            <p className="zone-panel__hint">Drive on to keep exploring.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TouchDpad({ onSetControl }: { onSetControl: (key: keyof DriveState, value: boolean) => void }) {
  const press = (key: keyof DriveState) => (e: React.PointerEvent) => {
    e.preventDefault();
    onSetControl(key, true);
  };
  const release = (key: keyof DriveState) => () => onSetControl(key, false);

  return (
    <div className="dpad" aria-label="Drive controls">
      <div className="dpad__row">
        <button
          type="button"
          className="dpad__btn dpad__btn--forward"
          onPointerDown={press('forward')}
          onPointerUp={release('forward')}
          onPointerLeave={release('forward')}
          aria-label="Drive forward"
        >
          ▲
        </button>
      </div>
      <div className="dpad__row">
        <button
          type="button"
          className="dpad__btn"
          onPointerDown={press('left')}
          onPointerUp={release('left')}
          onPointerLeave={release('left')}
          aria-label="Turn left"
        >
          ◀
        </button>
        <button
          type="button"
          className="dpad__btn"
          onPointerDown={press('backward')}
          onPointerUp={release('backward')}
          onPointerLeave={release('backward')}
          aria-label="Reverse"
        >
          ▼
        </button>
        <button
          type="button"
          className="dpad__btn"
          onPointerDown={press('right')}
          onPointerUp={release('right')}
          onPointerLeave={release('right')}
          aria-label="Turn right"
        >
          ▶
        </button>
      </div>
    </div>
  );
}
