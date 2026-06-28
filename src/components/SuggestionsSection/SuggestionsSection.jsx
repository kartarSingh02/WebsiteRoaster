export default function SuggestionsSection({ suggestions }) {
  const sections = [
    { key: 'add', title: '➕ Add these', items: suggestions.add, className: 'suggest-block--add' },
    { key: 'remove', title: '➖ Remove / simplify', items: suggestions.remove, className: 'suggest-block--remove' },
    { key: 'optimize', title: '⚡ Optimize calmly', items: suggestions.optimize, className: 'suggest-block--optimize' },
  ];

  return (
    <article className="panel panel--wide">
      <header className="panel__header">
        <h2 className="panel__title">💡 Calm Suggestions</h2>
        <p className="panel__subtitle">
          The roast was loud. These fixes are quiet, practical, and actually helpful.
        </p>
      </header>

      <div className="suggest-grid">
        {sections.map(({ key, title, items, className }) => (
          <div key={key} className={`suggest-block ${className}`}>
            <h3 className="suggest-block__title">{title}</h3>
            <ul className="tip-list">
              {items.map((item, i) => (
                <li key={`${item.label}-${i}`} className="tip-item">
                  <strong>{item.label}</strong>
                  <span>{item.tip}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </article>
  );
}
