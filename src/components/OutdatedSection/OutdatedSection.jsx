export default function OutdatedSection({ outdated, fontRoasts, fonts }) {
  return (
    <article className="panel">
      <header className="panel__header">
        <h2 className="panel__title">🦴 Fossil Detector</h2>
        <p className="panel__subtitle">Relics from the internet&apos;s awkward phase.</p>
      </header>

      {outdated.length === 0 && fontRoasts.length === 0 ? (
        <p className="panel__empty">No ancient artifacts found. Your HTML passed the vibe check.</p>
      ) : (
        <ul className="fossil-list">
          {outdated.map((item) => (
            <li key={item.id} className="fossil-item">
              <span className="fossil-item__label">{item.label}</span>
              <span className="fossil-item__roast">{item.roast}</span>
            </li>
          ))}
          {fontRoasts.map((item) => (
            <li key={item.name} className="fossil-item fossil-item--font">
              <span className="fossil-item__label">{item.name}</span>
              <span className="fossil-item__roast">{item.roast}</span>
            </li>
          ))}
        </ul>
      )}

      {fonts.length > 0 && (
        <div className="font-stack">
          <h3 className="font-stack__title">Fonts detected</h3>
          <ul className="tag-list">
            {fonts.map((font) => (
              <li key={font} className="tag">{font.slice(0, 60)}{font.length > 60 ? '…' : ''}</li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
