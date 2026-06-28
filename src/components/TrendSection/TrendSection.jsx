import { getTrendRoast } from '../../services/roastGenerator.js';

export default function TrendSection({ trends }) {
  const roast = getTrendRoast(trends.present.length, trends.missing.length);

  return (
    <article className="panel panel--wide">
      <header className="panel__header">
        <h2 className="panel__title">📡 Trends Radar</h2>
        <p className="panel__subtitle">{roast}</p>
      </header>

      <div className="trend-columns">
        <div className="trend-block trend-block--good">
          <h3 className="trend-block__title">✅ On trend</h3>
          {trends.present.length === 0 ? (
            <p className="panel__empty">Nothing modern detected yet. Room to grow!</p>
          ) : (
            <ul className="tag-list">
              {trends.present.map((item) => (
                <li key={item.id} className="tag tag--good">{item.label}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="trend-block trend-block--miss">
          <h3 className="trend-block__title">🕰️ Missing / outdated</h3>
          {trends.missing.length === 0 ? (
            <p className="panel__empty">You are trend-compliant. Suspiciously good.</p>
          ) : (
            <ul className="tip-list">
              {trends.missing.map((item) => (
                <li key={item.id} className="tip-item">
                  <strong>{item.label}</strong>
                  <span>{item.tip}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </article>
  );
}
