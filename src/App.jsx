import { useState } from 'react';
import { normalizeUrl } from './utils/helpers.js';
import { fetchSiteHtml } from './services/fetchSite.js';
import { analyzeWebsite } from './services/analyzer.js';
import { getLoadingMessage } from './services/roastGenerator.js';
import { analyzeResume } from './services/resumeAnalyzer.js';
import Header from './components/Header/Header';
import UrlInput from './components/UrlInput/UrlInput';
import ResumeInput from './components/ResumeInput/ResumeInput';
import LoadingState from './components/LoadingState/LoadingState';
import RoastResults from './components/RoastResults/RoastResults';
import ResumeRoastResults from './components/RoastResults/ResumeRoastResults';
import './styles/App.css';

export default function App() {
  const [mode, setMode] = useState('website'); // 'website' | 'resume'
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

  const handleResumeRoast = async (fileName, fileSize, extractedText) => {
    setError('');
    setResult(null);
    setLoading(true);
    
    // Funny loading messages for resumes
    const resumeLoaders = [
      'Scanning… evaluating your questionable career choices.',
      'Sifting through buzzwords. Brace yourself.',
      'Checking if "Microsoft Word" is still listed. Please hold.',
      'Consulting the AI career therapist. The therapist is sighing.',
    ];
    setLoadingMsg(resumeLoaders[Math.floor(Math.random() * resumeLoaders.length)]);

    try {
      // Small simulated delay for dramatic loading effect
      await new Promise((r) => setTimeout(r, 1500));
      const analysis = analyzeResume(fileName, fileSize, extractedText);
      setResult(analysis);
    } catch (err) {
      setError(err.message || 'Error roasting resume. Even our AI got exhausted reading it.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError('');
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    handleReset();
  };

  return (
    <div className="app">
      <div className="app__bg-grid" aria-hidden="true" />
      <div className="app__glow app__glow--left" aria-hidden="true" />
      <div className="app__glow app__glow--right" aria-hidden="true" />

      <main className="app__main">
        <Header />

        <section className="hero">
          <p className="hero__badge">100% client-side · zero storage · instant feedback</p>
          <h1 className="hero__title">
            Drop a {mode === 'website' ? 'URL' : 'Resume'}.
            <span className="hero__title-accent"> Get roasted.</span>
            <br />
            Leave smarter.
          </h1>
          <p className="hero__subtitle">
            {mode === 'website'
              ? 'We scan trends, colors, CTAs, and outdated relics — then roast you with love and hand you calm optimization tips.'
              : 'We scan length, buzzwords, basic skills, formatting relics, and active verbs — then brutally point out your career-killing habits.'}{' '}
            Close the tab and it is gone forever.
          </p>

          <div className="mode-selector">
            <button
              type="button"
              className={`mode-btn ${mode === 'website' ? 'mode-btn--active' : ''}`}
              onClick={() => handleModeChange('website')}
              disabled={loading}
            >
              🌐 Website
            </button>
            <button
              type="button"
              className={`mode-btn ${mode === 'resume' ? 'mode-btn--active' : ''}`}
              onClick={() => handleModeChange('resume')}
              disabled={loading}
            >
              📄 Resume
            </button>
          </div>

          {mode === 'website' ? (
            <UrlInput onSubmit={handleRoast} loading={loading} onReset={handleReset} hasResult={!!result} />
          ) : (
            <ResumeInput onSubmit={handleResumeRoast} loading={loading} onReset={handleReset} hasResult={!!result} />
          )}

          {error && (
            <div className="alert alert--error" role="alert" style={{ margin: '1.5rem auto 0', maxWidth: '500px' }}>
              <span className="alert__icon">⚠️</span>
              {error}
            </div>
          )}
        </section>

        {loading && <LoadingState message={loadingMsg} />}

        {result && !loading && (
          mode === 'website' ? (
            <RoastResults data={result} onReset={handleReset} />
          ) : (
            <ResumeRoastResults data={result} onReset={handleReset} />
          )
        )}
      </main>

      <footer className="footer">
        <p>Nothing is saved. No database. No accounts. Just vibes and in-browser parsing.</p>
      </footer>
    </div>
  );
}
