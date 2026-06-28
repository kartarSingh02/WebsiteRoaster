import { getCtaRoast } from '../../services/roastGenerator.js';

export default function CtaList({ ctas }) {
  const roast = getCtaRoast(ctas);

  return (
    <article className="panel panel--full">
      <header className="panel__header">
        <h2 className="panel__title">🎯 Calls to Action</h2>
        <p className="panel__subtitle">{roast}</p>
      </header>

      {ctas.length === 0 ? (
        <p className="panel__empty">No CTAs detected. Users love guessing games, right?</p>
      ) : (
        <ul className="cta-grid">
          {ctas.map((cta, i) => (
            <li key={`${cta.text}-${i}`} className="cta-card">
              <span className="cta-card__tag">{cta.tag}</span>
              <span className="cta-card__text">{cta.text}</span>
              {cta.href && (
                <code className="cta-card__href">
                  {cta.href.slice(0, 40)}{cta.href.length > 40 ? '…' : ''}
                </code>
              )}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
