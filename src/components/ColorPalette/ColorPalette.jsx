import { getColorRoast } from '../../services/roastGenerator.js';

function isLightColor(hex) {
  if (!hex?.startsWith('#')) return false;
  let h = hex.slice(1);
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 180;
}

export default function ColorPalette({ colors }) {
  const { swatches, stats } = colors;
  const roast = getColorRoast(stats.total);

  return (
    <article className="panel panel--full">
      <header className="panel__header">
        <h2 className="panel__title">🎨 Color Palette</h2>
        <p className="panel__subtitle">{roast}</p>
      </header>

      {swatches.length === 0 ? (
        <p className="panel__empty">No colors found in HTML. External CSS may be hiding the rainbow.</p>
      ) : (
        <>
          <div className="color-stats">
            <div className="color-stat">
              <span className="color-stat__value">{stats.total}</span>
              <span className="color-stat__label">Detected</span>
            </div>
            <div className="color-stat">
              <span className="color-stat__value">{stats.unique}</span>
              <span className="color-stat__label">Unique</span>
            </div>
            <div className="color-stat">
              <span className="color-stat__value">{stats.dark} / {stats.light}</span>
              <span className="color-stat__label">Dark / Light</span>
            </div>
            <div className="color-stat color-stat--verdict">
              <span className="color-stat__value">{stats.verdict}</span>
              <span className="color-stat__label">{stats.tip}</span>
            </div>
          </div>

          <div className="color-strip" role="list" aria-label="Detected colors">
            {swatches.map((swatch) => (
              <div key={swatch.hex + swatch.raw} className="color-strip__item" role="listitem">
                <div
                  className="color-strip__chip"
                  style={{ background: swatch.hex.startsWith('#') ? swatch.hex : swatch.raw }}
                  title={swatch.hex}
                />
                <div className="color-strip__meta">
                  <code className={`color-strip__hex ${isLightColor(swatch.hex) ? 'color-strip__hex--dark' : ''}`}>
                    {swatch.hex}
                  </code>
                  <span className="color-strip__tag">{swatch.type}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </article>
  );
}
