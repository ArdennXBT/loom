import './ProductPreview.css';

function ProductPreview() {
  return (
    <div className="preview-section">
      <div className="browser-frame">
        <div className="browser-topbar">
          <span className="browser-dot browser-dot-red"></span>
          <span className="browser-dot browser-dot-amber"></span>
          <span className="browser-dot browser-dot-green"></span>
          <span className="browser-url">loomscan.io/scanner</span>
        </div>

        <div className="app-mockup">
          <div className="app-navbar">
            <span className="app-navbar-logo">LoomScan</span>
            <div className="app-navbar-tabs">
              <span className="app-tab app-tab-active">Scanner</span>
              <span className="app-tab">Tracker</span>
            </div>
          </div>

          <div className="app-body">
            <div className="app-search">
              <span className="app-search-address">0x4b8e...c710</span>
              <span className="app-search-btn">Scan →</span>
            </div>

            <div className="app-grid">
              <div className="app-score-card">
                <div className="app-score-top">
                  <span className="app-score-token">$PONS</span>
                  <span className="app-score-badge">Healthy</span>
                </div>
                <p className="app-score-value">91<span>/100</span></p>
                <div className="app-checks">
                  <div className="app-check"><span className="dot dot-good"></span>Liquidity locked 180d</div>
                  <div className="app-check"><span className="dot dot-good"></span>Ownership renounced</div>
                  <div className="app-check"><span className="dot dot-good"></span>Contract verified</div>
                  <div className="app-check"><span className="dot dot-warn"></span>Top 10 holders 22%</div>
                </div>
              </div>

              <div className="app-side-cards">
                <div className="app-mini-card">
                  <p className="mini-label">Holders</p>
                  <p className="mini-value">1,240</p>
                </div>
                <div className="app-mini-card">
                  <p className="mini-label">Liquidity</p>
                  <p className="mini-value">$184K</p>
                </div>
                <div className="app-mini-card app-mini-card-wide">
                  <p className="mini-label">Wallet win rate</p>
                  <div className="mini-bar">
                    <div className="mini-bar-fill"></div>
                  </div>
                  <p className="mini-pnl">+142.3% this month</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPreview;