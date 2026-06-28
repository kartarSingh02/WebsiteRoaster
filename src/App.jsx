import { useState } from 'react';
import { normalizeUrl } from './utils/helpers.js';
import { fetchSiteHtml } from './services/fetchSite.js';
import { analyzeWebsite } from './services/analyzer.js';
import { getLoadingMessage } from './services/roastGenerator.js';
import Header from './components/Header/Header';
import UrlInput from './components/UrlInput/UrlInput';
import LoadingState from './components/LoadingState/LoadingState';
import RoastResults from './components/RoastResults/RoastResults';
import './styles/App.css';

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingMsg, setLoadingMsg] = useState('');

  const handleRoast = async (rawUrl) => {
    const url = normalizeUrl(rawUrl);
    if (!url) {
      setError('That URL looks suspicious. Try something like https://example.com');
      return;
    }

    setError('');
    setResult(null);
    setLoading(true);
    setLoadingMsg(getLoadingMessage());

    try {
      const { html, size, fetchTimeMs } = await fetchSiteHtml(url);
      const analysis = analyzeWebsite(url, html, size, fetchTimeMs);
      setResult(analysis);
    } catch (err) {
      setError(err.message || 'Something went wrong. The internet is moody today.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError('');
  };

  return (
    <div className="app">
      <div className="app__bg-grid" aria-hidden="true" />
      <div className="app__glow app__glow--left" aria-hidden="true" />
      <div className="app__glow app__glow--right" aria-hidden="true" />

      <main className="app__main">
        <Header />

        <section className="hero">
          <p className="hero__badge">100% client-side · zero storage · instant roast</p>
          <h1 className="hero__title">
            Drop a URL.
            <span className="hero__title-accent"> Get roasted.</span>
            <br />
            Leave smarter.
          </h1>
          <p className="hero__subtitle">
            We scan trends, colors, CTAs, and outdated relics — then roast you with love
            and hand you calm optimization tips. Close the tab and it is gone forever.
          </p>

          <UrlInput onSubmit={handleRoast} loading={loading} onReset={handleReset} hasResult={!!result} />

          {error && (
            <div className="alert alert--error" role="alert">
              <span className="alert__icon">⚠️</span>
              {error}
            </div>
          )}
        </section>

        {loading && <LoadingState message={loadingMsg} />}

        {result && !loading && <RoastResults data={result} onReset={handleReset} />}
      </main>

      <footer className="footer">
        <p>Nothing is saved. No backend. No account. Just vibes and HTML.</p>
      </footer>
    </div>
  );
}
