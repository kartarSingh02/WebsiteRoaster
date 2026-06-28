import ScoreCard from '../ScoreCard/ScoreCard';
import SummarySection from '../SummarySection/SummarySection';
import ColorPalette from '../ColorPalette/ColorPalette';
import CtaList from '../CtaList/CtaList';
import PerformanceSection from '../PerformanceSection/PerformanceSection';
import TrendSection from '../TrendSection/TrendSection';
import OutdatedSection from '../OutdatedSection/OutdatedSection';
import SuggestionsSection from '../SuggestionsSection/SuggestionsSection';
import { getClosingLine } from '../../services/roastGenerator.js';
import { formatBytes } from '../../utils/helpers.js';

export default function RoastResults({ data, onReset }) {
  return (
    <section className="results" aria-label="Roast results">
      <ScoreCard data={data} />
      <SummarySection summary={data.summary} />

      <div className="results__meta">
        <div className="meta-chip">
          <span className="meta-chip__label">Site</span>
          <a href={data.url} target="_blank" rel="noopener noreferrer" className="meta-chip__value">
            {data.title}
          </a>
        </div>
        <div className="meta-chip">
          <span className="meta-chip__label">HTML size</span>
          <span className="meta-chip__value">{formatBytes(data.size)}</span>
        </div>
        <div className="meta-chip">
          <span className="meta-chip__label">Fetch time</span>
          <span className="meta-chip__value">{data.performance.fetchTimeMs}ms</span>
        </div>
        <div className="meta-chip">
          <span className="meta-chip__label">Images</span>
          <span className="meta-chip__value">{data.images.total} ({data.images.missingAlt} missing alt)</span>
        </div>
      </div>

      {data.metaDesc && (
        <p className="results__desc">
          <strong>Meta:</strong> {data.metaDesc}
        </p>
      )}

      <div className="results__stack">
        <ColorPalette colors={data.colors} />
        <CtaList ctas={data.ctas} />
        <PerformanceSection performance={data.performance} seo={data.seo} />
      </div>

      <div className="results__grid">
        <TrendSection trends={data.trends} />
        <OutdatedSection outdated={data.outdated} fontRoasts={data.fontRoasts} fonts={data.fonts} />
        <SuggestionsSection suggestions={data.suggestions} />
      </div>

      <div className="results__footer">
        <p className="results__closing">{getClosingLine()}</p>
        <button type="button" className="btn btn--ghost" onClick={onReset}>
          Roast another site
        </button>
      </div>
    </section>
  );
}
