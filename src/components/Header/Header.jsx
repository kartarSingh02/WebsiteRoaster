export default function Header() {
  return (
    <header className="header">
      <div className="header__brand">
        <span className="header__logo" aria-hidden="true">🔥</span>
        <div>
          <span className="header__name">WebSite Roaster</span>
          <span className="header__tagline">High-tech honesty engine</span>
        </div>
      </div>
      <div className="header__status">
        <span className="header__dot" />
        Live · In-memory only
      </div>
    </header>
  );
}
