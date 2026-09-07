'use client';

import { hero, zones } from '../portfolio-data';

export default function SimpleView({
  canEnter3d,
  onEnter3d,
}: {
  canEnter3d: boolean;
  onEnter3d: () => void;
}) {
  return (
    <main className="simple">
      <header className="simple__header">
        <div>
          <p className="simple__eyebrow">Portfolio</p>
          <h1>{hero.name}</h1>
          <p className="simple__title">{hero.title}</p>
        </div>
        {canEnter3d && (
          <button type="button" className="simple__cta" onClick={onEnter3d}>
            Enter the 3D world
          </button>
        )}
      </header>

      <p className="simple__intro">{hero.intro}</p>

      <div className="simple__sections">
        {zones.map((zone) => (
          <section key={zone.id} className="simple__section" style={{ borderLeftColor: zone.color }}>
            <p className="simple__tagline" style={{ color: zone.color }}>{zone.tagline}</p>
            <h2>{zone.title}</h2>
            <ul>
              {zone.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
