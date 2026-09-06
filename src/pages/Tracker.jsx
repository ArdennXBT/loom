import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Tracker.css';

const FAVORITES_KEY = 'loomscan_favorite_wallets';
const TELEGRAM_KEY = 'loomscan_telegram_connected';
const API_BASE = 'http://localhost:4000';

const PERIODS = [
  { key: 'today', label: '24H' },
  { key: 'week', label: '7D' },
  { key: 'month', label: '30D' },
  { key: 'year', label: '1Y' },
];

function formatUsd(value) {
  if (value === null || value === undefined || isNaN(value)) return '$0.00';
  const sign = value < 0 ? '-' : '';
  return `${sign}$${Math.abs(Number(value)).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatPercent(value) {
  if (value === null || value === undefined || isNaN(value)) return '0.0%';
  const sign = value > 0 ? '+' : '';
  return `${sign}${Number(value).toFixed(1)}%`;
}

function pnlClass(value) {
  if (value > 0) return 'positive';
  if (value < 0) return 'negative';
  return '';
}

function truncateAddress(addr) {
  if (!addr || addr.length < 12) return addr || '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveFavorites(favorites) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch {
    // ignore
  }
}

function Tracker() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState('week');
  const [favorites, setFavorites] = useState([]);
  const [telegramConnected, setTelegramConnected] = useState(false);
  const [nickname, setNickname] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setFavorites(loadFavorites());
    try {
      setTelegramConnected(localStorage.getItem(TELEGRAM_KEY) === 'true');
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (data?.address) {
      const fav = favorites.find((f) => f.address === data.address);
      setNickname(fav?.nickname || '');
    }
  }, [data, favorites]);

  const fetchWallet = async (addr) => {
    const trimmed = (addr || '').trim();
    if (!trimmed) {
      setError('Paste a wallet address.');
      return;
    }
    if (!/^0x[a-fA-F0-9]{40}$/i.test(trimmed)) {
      setError('Invalid wallet address.');
      return;
    }

    setError('');
    setLoading(true);
    setData(null);

    try {
      const res = await fetch(`${API_BASE}/tracker/${trimmed}`);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to fetch wallet');
      }

      setData(json);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWallet(address);
  };

  const handleCopy = () => {
    if (!data?.address) return;
    navigator.clipboard.writeText(data.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSaveFavorite = () => {
    if (!data?.address || !nickname.trim()) return;

    const existing = favorites.find((f) => f.address === data.address);
    let updated;

    if (existing) {
      updated = favorites.map((f) =>
        f.address === data.address ? { ...f, nickname: nickname.trim() } : f
      );
    } else {
      updated = [
        ...favorites,
        { address: data.address, nickname: nickname.trim(), notify: false },
      ];
    }

    setFavorites(updated);
    saveFavorites(updated);
  };

  const handleToggleNotify = () => {
    if (!data?.address) return;
    const existing = favorites.find((f) => f.address === data.address);
    if (!existing) return;

    const updated = favorites.map((f) =>
      f.address === data.address ? { ...f, notify: !f.notify } : f
    );
    setFavorites(updated);
    saveFavorites(updated);
  };

  const handleConnectTelegram = () => {
    setTelegramConnected(true);
    try {
      localStorage.setItem(TELEGRAM_KEY, 'true');
    } catch {
      // ignore
    }
  };

  const currentFavorite = data
    ? favorites.find((f) => f.address === data.address)
    : null;

  const periodPnl = data?.totalPnlByPeriod?.[period] ?? data?.totalPnlUsd ?? 0;
  const periodPnlPercent =
    data?.totalPnlPercentByPeriod?.[period] ?? data?.totalPnlPercent ?? 0;

  return (
    <div className="tracker-page">
      <Navbar />

      <main className="tracker">
        <div className="tracker-header">
          <h1>Track a wallet</h1>
          <p>Paste any wallet address on Robinhood Chain to see trades, PnL and win rate.</p>
        </div>

        <form className="tracker-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="tracker-input"
            placeholder="0x..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            disabled={loading}
          />
          <button type="submit" className="tracker-btn" disabled={loading}>
            {loading ? 'Loading...' : 'Track'}
          </button>
        </form>

        {error && <p className="tracker-error">{error}</p>}

        {loading && (
          <div className="tracker-loading">
            <div className="spinner"></div>
            <p>Fetching wallet activity...</p>
          </div>
        )}

        {data && !loading && (
          <>
            {/* Wallet Summary Card */}
            <div className="wallet-card">
              <div className="wallet-card-top">
                <span className="wallet-address">{truncateAddress(data.address)}</span>
                <button type="button" className="copy-btn" onClick={handleCopy}>
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div className="wallet-stats">
                <div className="stat">
                  <span className="stat-label">Portfolio</span>
                  <span className="stat-value">{formatUsd(data.totalValueUsd)}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">PnL</span>
                  <span className={`stat-value ${pnlClass(periodPnl)}`}>
                    {formatUsd(periodPnl)}
                    <small> ({formatPercent(periodPnlPercent)})</small>
                  </span>
                </div>
                <div className="stat">
                  <span className="stat-label">Win rate</span>
                  <span className="stat-value">
                    {data.winRate ?? 0}%
                    <small> ({data.closedTrades ?? 0} closed)</small>
                  </span>
                </div>
              </div>

              <div className="period-pills">
                {PERIODS.map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    className={`pill ${period === p.key ? 'active' : ''}`}
                    onClick={() => setPeriod(p.key)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Follow Section */}
            <div className="follow-card">
              <h3>Follow this wallet</h3>

              <div className="follow-row">
                <input
                  type="text"
                  placeholder="Name this wallet (e.g. Whale #1)"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  maxLength={30}
                />
                <button
                  type="button"
                  className="save-btn"
                  onClick={handleSaveFavorite}
                  disabled={!nickname.trim()}
                >
                  {currentFavorite ? 'Update' : 'Save'}
                </button>
              </div>

              <div className="follow-telegram">
                {!telegramConnected ? (
                  <>
                    <p>Get Telegram alerts when this wallet buys or sells.</p>
                    <button type="button" className="telegram-btn" onClick={handleConnectTelegram}>
                      Connect Telegram
                    </button>
                  </>
                ) : currentFavorite?.notify ? (
                  <>
                    <p className="active-text">
                      🔔 Alerts active for <strong>{currentFavorite.nickname}</strong>
                    </p>
                    <button type="button" className="stop-btn" onClick={handleToggleNotify}>
                      Stop alerts
                    </button>
                  </>
                ) : (
                  <>
                    <p>Telegram connected. Enable alerts for this wallet.</p>
                    <button
                      type="button"
                      className="telegram-btn"
                      onClick={handleToggleNotify}
                      disabled={!currentFavorite}
                    >
                      Enable alerts
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Tokens List */}
            <div className="tokens-section">
              <h3>Positions</h3>

              {(data.tokens || []).length === 0 ? (
                <p className="empty-state">No positions found yet.</p>
              ) : (
                <div className="tokens-list">
                  {(data.tokens || []).map((token) => {
                    const isOpen = token.status === 'open';
                    const pnlValue = isOpen ? token.unrealizedPnlUsd : token.realizedPnlUsd;
                    const pnlPercent = isOpen
                      ? token.unrealizedPnlPercent
                      : token.realizedPnlPercent;

                    return (
                      <div className="token-item" key={token.contractAddress || token.symbol}>
                        <div className="token-left">
                          <span className="token-symbol">${token.symbol || '???'}</span>
                          <span className="token-meta">
                            {isOpen
                              ? `${Number(token.amountHeld || 0).toLocaleString()} tokens`
                              : 'Closed'}
                          </span>
                        </div>
                        <div className="token-right">
                          <span className="token-value">
                            {isOpen ? formatUsd(token.valueUsd) : formatUsd(pnlValue)}
                          </span>
                          <span className={`token-pnl ${pnlClass(pnlValue)}`}>
                            {formatPercent(pnlPercent)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Tracker;