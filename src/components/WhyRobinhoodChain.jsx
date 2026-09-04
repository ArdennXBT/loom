import './WhyRobinhoodChain.css';

function WhyRobinhoodChain() {
  const points = [
    {
      title: 'Built for one chain',
      text: 'No generic multi-chain tool trying to cover everything. LoomScan is tuned specifically for Robinhood Chain.',
    },
    {
      title: 'Real-time data',
      text: 'Powered by live onchain webhooks — no delayed indexing, no stale prices.',
    },
    {
      title: 'Made for memecoins',
      text: 'Fresh tokens, thin liquidity, fast rugs — LoomScan is designed for exactly this kind of market.',
    },
  ];

  return (
    <div className="why-section">
      <h2 className="section-title">Why Robinhood Chain</h2>
      <p className="why-subtitle">
        Robinhood Chain is new, fast-moving, and full of memecoins — that's exactly why it needs its own tooling.
      </p>
      <div className="why-grid">
        {points.map((point) => (
          <div className="why-card reveal-item" key={point.title}>
            <h3 className="why-card-title">{point.title}</h3>
            <p className="why-card-text">{point.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WhyRobinhoodChain;