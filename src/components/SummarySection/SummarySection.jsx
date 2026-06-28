export default function SummarySection({ summary }) {
  return (
    <article className="summary panel--full">
      <header className="summary__header">
        <h2 className="panel__title">📋 TL;DR Summary</h2>
        <p className="summary__headline">{summary.headline}</p>
      </header>

      <div className="summary__grid">
        <div className="summary__col summary__col--wins">
          <h3 className="summary__col-title">✅ What is working</h3>
          <ul className="summary__list">
            {summary.wins.map((item) => (
              <li key={item.label} className="summary__item summary__item--win">
                <strong>{item.label}</strong>
                <span>{item.detail}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="summary__col summary__col--fixes">
          <h3 className="summary__col-title">🔧 Fix these first</h3>
          <ul className="summary__list">
            {summary.fixes.map((item) => (
              <li key={item.label} className={`summary__item summary__item--${item.priority}`}>
                <strong>{item.label}</strong>
                <span>{item.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
