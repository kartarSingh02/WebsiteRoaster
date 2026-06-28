import { useState } from 'react';

export default function UrlInput({ onSubmit, loading, onReset, hasResult }) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim() || loading) return;
    onSubmit(url);
  };

  return (
    <form className="url-input" onSubmit={handleSubmit}>
      <div className="url-input__field">
        <label htmlFor="site-url" className="sr-only">Website URL</label>
        <span className="url-input__prefix">https://</span>
        <input
          id="site-url"
          type="text"
          className="url-input__control"
          placeholder="yourwebsite.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      <button type="submit" className="btn btn--primary" disabled={loading || !url.trim()}>
        {loading ? 'Roasting…' : 'Roast My Site'}
      </button>
      {hasResult && (
        <button type="button" className="btn btn--ghost" onClick={onReset} disabled={loading}>
          Clear
        </button>
      )}
    </form>
  );
}
