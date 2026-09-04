import './HowItWorks.css';

function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Paste an address',
      text: 'A token contract to scan, or a wallet to track.',
    },
    {
      number: '02',
      title: 'Get instant analysis',
      text: 'Security score, holder stats, PnL, and win rate in seconds.',
    },
    {
      number: '03',
      title: 'Trade with confidence',
      text: 'Follow a wallet and get Telegram alerts the moment it moves.',
    },
  ];

  return (
    <div className="how-it-works">
      <h2 className="section-title">How it works</h2>
      <div className="steps">
        {steps.map((step) => (
          <div className="step reveal-item" key={step.number}>
            <div className="step-number">{step.number}</div>
            <h3 className="step-title">{step.title}</h3>
            <p className="step-text">{step.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HowItWorks;