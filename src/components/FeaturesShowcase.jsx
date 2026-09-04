import { useNavigate } from 'react-router-dom';
import './FeaturesShowcase.css';

function FeaturesShowcase() {
  const navigate = useNavigate();

  return (
    <div className="features">
      <h2 className="section-title features-title">Everything you need before you trade</h2>
      <div className="features-grid">
        <div className="feature-card reveal-item">
          <span className="feature-tag">Scanner</span>
          <h3 className="feature-title">Know before you buy</h3>
          <p className="feature-text">
            Paste a token contract and get a full security score — liquidity,
            ownership, holder concentration, and honeypot checks in one view.
          </p>
          <div className="feature-preview">
            <div className="preview-row">
              <span className="preview-label">$SAFE</span>
              <span className="preview-badge preview-badge-good">Healthy</span>
            </div>
            <div className="preview-score preview-score-good">94/100</div>
          </div>
          <button className="btn-secondary" onClick={() => navigate('/scanner')}>
            Scan a token →
          </button>
        </div>

        <div className="feature-card reveal-item">
          <span className="feature-tag">Tracker</span>
          <h3 className="feature-title">Follow any wallet</h3>
          <p className="feature-text">
            See every trade, PnL by period, holding time and win rate — then
            follow a wallet to get Telegram alerts the moment it trades.
          </p>
          <div className="feature-preview">
            <div className="preview-row">
              <span className="preview-label">Win rate</span>
              <span className="preview-badge preview-badge-good">68%</span>
            </div>
            <div className="preview-score preview-score-good">+142.3%</div>
          </div>
          <button className="btn-secondary" onClick={() => navigate('/tracker')}>
            Track a wallet →
          </button>
        </div>
      </div>
    </div>
  );
}

export default FeaturesShowcase;