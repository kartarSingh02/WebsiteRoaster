export default function PerformanceSection({ performance, seo }) {
  return (
    <article className="panel panel--full">
      <header className="panel__header">
        <h2 className="panel__title">⚡ Speed & SEO Signals</h2>
        <p className="panel__subtitle">
          Scanned from HTML — not a full Lighthouse run. Real FCP/LCP need a live browser test,
          but these flags catch common slowdowns.
        </p>
      </header>

      <div className="perf-score-row">
        <div className="perf-score">
          <span className="perf-score__label">Complexity score</span>
          <span className={`perf-score__value ${performance.complexityScore >= 70 ? 'perf-score__value--good' : performance.complexityScore >= 45 ? 'perf-score__value--mid' : 'perf-score__value--bad'}`}>
            {performance.complexityScore}/100
          </span>
        </div>
        <div className="perf-resources">
          <span>{performance.resources.scripts} scripts</span>
          <span>{performance.resources.stylesheets} stylesheets</span>
          <span>{performance.resources.images} images</span>
          <span>{performance.domElements.toLocaleString()} DOM nodes</span>
        </div>
      </div>

      <h3 className="perf-section-title">Load signals</h3>
      <div className="signal-grid">
        {performance.signals.map((signal) => (
          <div key={signal.id} className={`signal-card signal-card--${signal.status}`}>
            <div className="signal-card__top">
              <span className="signal-card__label">{signal.label}</span>
              <span className="signal-card__value">{signal.value}</span>
            </div>
            <p className="signal-card__tip">{signal.tip}</p>
            {signal.note && <p className="signal-card__note">{signal.note}</p>}
          </div>
        ))}
      </div>

      <h3 className="perf-section-title">SEO basics</h3>
      <div className="signal-grid signal-grid--seo">
        {seo.checks.map((check) => (
          <div key={check.id} className={`signal-card signal-card--${check.status}`}>
            <div className="signal-card__top">
              <span className="signal-card__label">{check.label}</span>
              <span className="signal-card__value">{check.value}</span>
            </div>
            <p className="signal-card__tip">{check.tip}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
