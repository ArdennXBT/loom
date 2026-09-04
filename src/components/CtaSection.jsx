import { useNavigate } from 'react-router-dom';
import './CtaSection.css';

function CtaSection() {
  const navigate = useNavigate();

  return (
    <div className="cta">
      <div className="cta-card">
        <h2 className="cta-title">
          Ready to trade <span className="cta-highlight">safer</span>?
        </h2>
        <p className="cta-subtitle">
          Scan a token before you buy, or track a wallet worth copying free, no signup required.
        </p>
        <div className="cta-buttons">
          <button className="btn-primary" onClick={() => navigate('/scanner')}>
            Scan a token →
          </button>
          <button className="btn-secondary-dark" onClick={() => navigate('/tracker')}>
            Track a wallet →
          </button>
        </div>
        <p className="cta-note">No wallet connection required to scan or browse</p>
      </div>
    </div>
  );
}

export default CtaSection;