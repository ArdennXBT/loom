import './StatsBar.css';

function StatsBar() {
  // Placeholder values — replace with real data once the backend is live
  const stats = [
    { value: '0', label: 'Tokens scanned' },
    { value: '0', label: 'Wallets tracked' },
    { value: '0', label: 'Rugs flagged' },
    { value: '0', label: 'Alerts sent · 24h' },
  ];

  return (
    <div className="stats-bar">
      {stats.map((stat) => (
        <div className="stat-card" key={stat.label}>
          <p className="stat-value">{stat.value}</p>
          <p className="stat-label">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

export default StatsBar;