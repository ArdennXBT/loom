import { useNavigate } from 'react-router-dom';
import './Hero.css';

function Hero() {
  const navigate = useNavigate();

  return (
    <div className="hero">
      <div className="hero-badge">
        <span className="hero-badge-dot"></span>
        LIVE · Robinhood Chain scanner &amp; tracker
      </div>

      <h1 className="hero-title">
        Trade Robinhood Chain memecoins <span className="hero-highlight">smarter</span>.
      </h1>

      <p className="hero-subtitle">
        LoomScan checks every token for rug risks and tracks any wallet's trades,
        PnL and win rate — with instant Telegram alerts the moment it moves.
      </p>

      <div className="hero-buttons">
        <button className="btn-primary" onClick={() => navigate('/scanner')}>
          Scan a token →
        </button>
        <button className="btn-secondary" onClick={() => navigate('/tracker')}>
          Track a wallet →
        </button>
      </div>

      <p className="hero-stat">
        <span className="hero-stat-dot"></span>
        Built for Robinhood Chain — real-time onchain data
      </p>
    </div>
  );
}

export default Hero;