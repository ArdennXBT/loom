import './StatsBar.css';

function StatsBar() {
  // Placeholder values — replace with real data once the backend is live
  const stats = [
    { value: '80', label: 'Tokens scanned' },
    { value: '13', label: 'Wallets tracked' },
    { value: '27', label: 'Rugs flagged' },
    { value: '14', label: 'Alerts sent · 24h' },
  ];

  return (
    <div className="stats-bar">
      {stats.map((stat) => (
        <div className="stat-card reveal-item" key={stat.label}>
          <p className="stat-value">{stat.value}</p>
          <p className="stat-label">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

export default StatsBar;