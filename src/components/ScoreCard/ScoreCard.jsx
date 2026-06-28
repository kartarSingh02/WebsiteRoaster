import { getScoreRoast } from '../../services/roastGenerator.js';

export default function ScoreCard({ data }) {
  const roast = getScoreRoast(data.score);
  const scoreClass =
    data.score >= 80 ? 'score--good' : data.score >= 55 ? 'score--mid' : 'score--bad';

  return (
    <article className="score-card">
      <div className="score-card__left">
        <p className="score-card__label">Roast Score</p>
        <div className={`score-card__value ${scoreClass}`}>
          <span className="score-card__number">{data.score}</span>
          <span className="score-card__max">/100</span>
        </div>
        <p className="score-card__verdict">
          {data.verdict.emoji} {data.verdict.tier}
        </p>
      </div>
      <div className="score-card__right">
        <p className="score-card__roast">{roast}</p>
        <div className="score-card__bar" aria-hidden="true">
          <div className="score-card__fill" style={{ width: `${data.score}%` }} />
        </div>
      </div>
    </article>
  );
}
