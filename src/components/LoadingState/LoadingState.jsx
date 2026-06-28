const STEPS = [
  'Fetching HTML through the void…',
  'Counting questionable color choices…',
  'Hunting CTAs and ghost buttons…',
  'Checking if you still use marquee tags…',
  'Generating spicy but helpful feedback…',
];

export default function LoadingState({ message }) {
  return (
    <section className="loading" aria-live="polite">
      <div className="loading__scanner">
        <div className="loading__ring" />
        <span className="loading__emoji">🔥</span>
      </div>
      <p className="loading__message">{message}</p>
      <ul className="loading__steps">
        {STEPS.map((step) => (
          <li key={step} className="loading__step">{step}</li>
        ))}
      </ul>
    </section>
  );
}
