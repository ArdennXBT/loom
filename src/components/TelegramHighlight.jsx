import './TelegramHighlight.css';

function TelegramHighlight() {
  return (
    <div className="telegram-section">
      <h2 className="section-title">Get alerted, then scan before you buy</h2>
      <p className="telegram-subtitle">
        Follow any wallet to get an instant Telegram alert the moment it trades
        then scan the token right away to see if it's worth buying.
      </p>

      <div className="telegram-grid">
        <div className="telegram-mockup reveal-item">
          <div className="telegram-header">
            <div className="telegram-avatar">LS</div>
            <div>
              <p className="telegram-bot-name">LoomScan Alerts</p>
              <p className="telegram-bot-status">bot</p>
            </div>
          </div>

          <div className="telegram-message">
            <p className="telegram-message-title">🟢 Buy detected</p>
            <p className="telegram-message-line">
              Wallet <span className="telegram-mono">0x7a3f...9d21</span> bought
            </p>
            <p className="telegram-message-token">$PONS</p>
            <p className="telegram-message-line">
              Contract <span className="telegram-mono">0x4b8e...c710</span>
            </p>
            <button className="telegram-scan-btn">Scan this token →</button>
          </div>
        </div>

        <div className="scan-mockup reveal-item">
          <div className="scan-mockup-header">
            <span className="scan-mockup-token">$PONS</span>
            <span className="scan-mockup-badge">Healthy</span>
          </div>
          <p className="scan-mockup-score">91<span className="scan-mockup-score-max">/100</span></p>
          <div className="scan-mockup-checks">
            <div className="scan-mockup-check">
              <span className="scan-check-icon scan-check-good">✓</span>
              Liquidity locked
            </div>
            <div className="scan-mockup-check">
              <span className="scan-check-icon scan-check-good">✓</span>
              Ownership renounced
            </div>
            <div className="scan-mockup-check">
              <span className="scan-check-icon scan-check-warn">!</span>
              Top 10 holders 22%
            </div>
          </div>
          <p className="scan-mockup-verdict">Safe to consider buying</p>
        </div>
      </div>
    </div>
  );
}

export default TelegramHighlight;