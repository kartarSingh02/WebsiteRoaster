import ScoreCard from '../ScoreCard/ScoreCard';
import SuggestionsSection from '../SuggestionsSection/SuggestionsSection';
import { getClosingLine } from '../../services/roastGenerator.js';
import { formatBytes } from '../../utils/helpers.js';

export default function ResumeRoastResults({ data, onReset }) {
  const groupedSuggestions = {
    add: data.suggestions.filter((s) => s.type === 'add').map((s) => ({ label: s.label, tip: s.description })),
    remove: data.suggestions.filter((s) => s.type === 'remove').map((s) => ({ label: s.label, tip: s.description })),
    optimize: data.suggestions.filter((s) => s.type === 'optimize').map((s) => ({ label: s.label, tip: s.description })),
  };

  return (
    <section className="results" aria-label="Resume roast results">
      <ScoreCard data={data} />

      <div className="results__meta">
        <div className="meta-chip">
          <span className="meta-chip__label">File</span>
          <span className="meta-chip__value" title={data.fileName}>
            {data.fileName.length > 25 ? `${data.fileName.slice(0, 22)}...` : data.fileName}
          </span>
        </div>
        <div className="meta-chip">
          <span className="meta-chip__label">Size</span>
          <span className="meta-chip__value">{formatBytes(data.fileSize)}</span>
        </div>
        <div className="meta-chip">
          <span className="meta-chip__label">Length</span>
          <span className="meta-chip__value">
            {data.wordCount} words ({data.lengthVerdict})
          </span>
        </div>
        <div className="meta-chip">
          <span className="meta-chip__label">Characters</span>
          <span className="meta-chip__value">{data.characterCount}</span>
        </div>
      </div>

      <div className="results__stack">
        {/* Buzzwords Panel */}
        <article className="panel">
          <header className="panel__header">
            <h3 className="panel__title">🐝 Corporate Buzzwords</h3>
            <p className="panel__subtitle">
              {data.buzzwords.found.length === 0
                ? 'Impressive! You managed to write a resume without resorting to corporate jargon.'
                : `We detected ${data.buzzwords.found.length} generic buzzwords.`}
            </p>
          </header>
          {data.buzzwords.found.length > 0 ? (
            <ul className="cta-list">
              {data.buzzwords.found.map((item, i) => (
                <li key={`${item.word}-${i}`} className="cta-item">
                  <div className="cta-item__left">
                    <span className="cta-item__text">"{item.word}"</span>
                    <span className="cta-item__tag" style={{ color: 'var(--hot)', borderColor: 'rgba(255, 107, 74, 0.3)' }}>
                      found {item.count}x
                    </span>
                  </div>
                  <span className="cta-item__href" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {item.roast}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="health-dash__empty" style={{ padding: '1rem 0', color: 'var(--good)' }}>
              ✓ Jargon-free zone. Your phrasing is direct.
            </div>
          )}
        </article>

        {/* Basic Skills Panel */}
        <article className="panel">
          <header className="panel__header">
            <h3 className="panel__title">🛠️ Baseline Computer Skills</h3>
            <p className="panel__subtitle">
              {data.basicSkills.found.length === 0
                ? 'Thank goodness. You did not list basic tools that are expected of every computer-literate human.'
                : `Listing these tells recruiters you are stretching for space.`}
            </p>
          </header>
          {data.basicSkills.found.length > 0 ? (
            <ul className="cta-list">
              {data.basicSkills.found.map((item, i) => (
                <li key={`${item.name}-${i}`} className="cta-item">
                  <div className="cta-item__left">
                    <span className="cta-item__text">{item.name}</span>
                    <span className="cta-item__tag" style={{ color: 'var(--warn)', borderColor: 'rgba(251, 191, 36, 0.3)' }}>
                      Basic Skill
                    </span>
                  </div>
                  <span className="cta-item__href" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {item.roast}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="health-dash__empty" style={{ padding: '1rem 0', color: 'var(--good)' }}>
              ✓ No basic filler skills (like Microsoft Word or Zoom) detected.
            </div>
          )}
        </article>

        {/* Action Verbs vs Passive Verbs */}
        <article className="panel">
          <header className="panel__header">
            <h3 className="panel__title">⚡ Action Verbs Check</h3>
            <p className="panel__subtitle">
              Active voice shows leadership and results. Passive voice shows you just sat in the room.
            </p>
          </header>
          <div className="health-dash__grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
            <div className="health-dash__stat">
              <span className="health-dash__stat-label">Active Verbs</span>
              <span className="health-dash__stat-value" style={{ color: 'var(--good)' }}>
                {data.verbs.activeCount}
              </span>
            </div>
            <div className="health-dash__stat">
              <span className="health-dash__stat-label">Passive Verbs</span>
              <span className="health-dash__stat-value" style={{ color: data.verbs.passiveCount > data.verbs.activeCount ? 'var(--bad)' : 'var(--text-muted)' }}>
                {data.verbs.passiveCount}
              </span>
            </div>
          </div>
          <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
            <p style={{ fontWeight: 'bold', color: data.verbs.passiveCount > data.verbs.activeCount ? 'var(--warn)' : 'var(--good)' }}>
              Verdict: {data.verbs.verdict}
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              {data.verbs.tip}
            </p>
          </div>
        </article>
      </div>

      {/* Row containing Contact, Clichés, and Market Alignment side-by-side */}
      <div className="resume-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        {/* Contact Check */}
        <article className="panel" style={{ height: '100%' }}>
          <header className="panel__header">
            <h3 className="panel__title">📞 Contact Section Analysis</h3>
            <p className="panel__subtitle">Did you leave a crumb trail for recruiters to find you?</p>
          </header>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', margin: '0.75rem 0' }}>
            <span className="meta-chip__value" style={{ color: data.contactInfo.hasEmail ? 'var(--good)' : 'var(--bad)', border: '1px solid var(--border)', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem' }}>
              {data.contactInfo.hasEmail ? '✓ Email' : '✗ No Email'}
            </span>
            <span className="meta-chip__value" style={{ color: data.contactInfo.hasPhone ? 'var(--good)' : 'var(--text-muted)', border: '1px solid var(--border)', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem' }}>
              {data.contactInfo.hasPhone ? '✓ Phone' : '✗ No Phone'}
            </span>
            <span className="meta-chip__value" style={{ color: data.contactInfo.hasLinkedin ? 'var(--good)' : 'var(--text-muted)', border: '1px solid var(--border)', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem' }}>
              {data.contactInfo.hasLinkedin ? '✓ LinkedIn' : '✗ No LinkedIn'}
            </span>
            <span className="meta-chip__value" style={{ color: data.contactInfo.hasGithub ? 'var(--good)' : 'var(--text-muted)', border: '1px solid var(--border)', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem' }}>
              {data.contactInfo.hasGithub ? '✓ GitHub' : '✗ No GitHub'}
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            {data.contactInfo.roast}
          </p>
          {data.contactInfo.unprofessionalEmail && (
            <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: 'rgba(248, 113, 113, 0.1)', border: '1px solid rgba(248, 113, 113, 0.3)', borderRadius: '6px' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--bad)', fontWeight: 'bold' }}>
                ⚠️ Unprofessional Email:
              </p>
              <p style={{ fontSize: '0.85rem', fontStyle: 'italic', margin: '0.2rem 0' }}>
                "{data.contactInfo.unprofessionalEmail.email}"
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {data.contactInfo.unprofessionalEmail.roast}
              </p>
            </div>
          )}
        </article>

        {/* Clichés Panel */}
        <article className="panel" style={{ height: '100%' }}>
          <header className="panel__header">
            <h3 className="panel__title">🤡 Resume Clichés</h3>
            <p className="panel__subtitle">Outdated relics wasting valuable space on your single page.</p>
          </header>
          {data.cliches.length > 0 ? (
            <ul className="tip-list">
              {data.cliches.map((cliche) => (
                <li key={cliche.id} className="tip-item">
                  <strong style={{ color: 'var(--warn)' }}>{cliche.label}</strong>
                  <span>{cliche.roast}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="health-dash__empty" style={{ padding: '1rem 0', color: 'var(--good)' }}>
              ✓ No outdated clichés (like Objective statements or References requests) detected.
            </div>
          )}
        </article>

        {/* Market Fit & Skills Panel */}
        <article className="panel" style={{ height: '100%' }}>
          <header className="panel__header">
            <h3 className="panel__title">📈 Market Fit & Tooling</h3>
            <p className="panel__subtitle">Does your toolkit match what modern developer teams look for?</p>
          </header>
          <div style={{ margin: '0.5rem 0 0.75rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {data.marketSkills.roast}
            </p>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--good)', fontWeight: 'bold', marginBottom: '0.4rem' }}>
              Skills Found ({data.marketSkills.count}/8):
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {data.marketSkills.found.map((skill, i) => (
                <span key={i} style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(74, 222, 128, 0.1)', border: '1px solid rgba(74, 222, 128, 0.2)', color: '#bbf7d0' }}>
                  {skill}
                </span>
              ))}
              {data.marketSkills.found.length === 0 && (
                <span style={{ fontSize: '0.75rem', color: 'var(--bad)' }}>None</span>
              )}
            </div>
          </div>

          {data.marketSkills.missing.length > 0 && (
            <div style={{ marginTop: '0.75rem' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--warn)', fontWeight: 'bold', marginBottom: '0.4rem' }}>
                Missing Tooling Suggestions:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {data.marketSkills.missing.map((skill, i) => (
                  <span key={i} style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(251, 191, 36, 0.05)', border: '1px solid rgba(251, 191, 36, 0.15)', color: '#fde047' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {data.hasRedundantTitle && (
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--bad)', fontWeight: 'bold' }}>
                ⚠️ Header Redundancy:
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Writing "Resume" or "CV" at the top is redundant. We know what it is.
              </p>
            </div>
          )}
        </article>
      </div>

      {/* Suggestions Section taking full width */}
      <div style={{ width: '100%' }}>
        <SuggestionsSection suggestions={groupedSuggestions} />
      </div>

      <div className="results__footer">
        <p className="results__closing">{getClosingLine()}</p>
        <button type="button" className="btn btn--ghost" onClick={onReset}>
          Roast another resume
        </button>
      </div>
    </section>
  );
}
