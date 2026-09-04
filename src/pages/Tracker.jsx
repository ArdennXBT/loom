import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Tracker.css';

const FAVORITES_KEY = 'loomscan_favorite_wallets';
const TELEGRAM_KEY = 'loomscan_telegram_connected';

const PERIODS = [
  { key: 'today', label: '24H' },
  { key: 'week', label: '7D' },
  { key: 'month', label: '30D' },
  { key: 'year', label: '1Y' },
];

// TODO: remplacer par un vrai appel à src/services/api.js une fois
// Alchemy (Transfers API, Token API, Prices API) branché côté backend.
function getMockWalletData(address) {
  return {
    address,
    totalValueUsd: 18420.5,
    totalPnlUsd: 4210.32,
    totalPnlPercent: 29.6,
    totalPnlByPeriod: { today: 620.1, week: 1840.55, month: 3990.2, year: 4210.32 },
    totalPnlPercentByPeriod: { today: 3.5, week: 11.2, month: 27.6, year: 29.6 },
    realizedPnlUsd: 1820.1,
    unrealizedPnlUsd: 2390.22,
    winRate: 64, // calculé uniquement sur les trades clôturés
    closedTrades: 11,
    avgHoldingTime: '4d 6h',
    tokens: [
      {
        symbol: 'PONS',
        name: 'Pondiscoin',
        contractAddress: '0x9F2b3aE1c4D5e6F7A8B9c0D1E2F3a4B5c6D7e8F9',
        status: 'open',
        amountHeld: 125000,
        currentPrice: 0.0182,
        valueUsd: 2275,
        percentOfPortfolio: 12.3,
        avgBuyPrice: 0.0104,
        unrealizedPnlUsd: 975.5,
        unrealizedPnlPercent: 75.0,
        pnl: { today: 4.2, week: 18.6, month: 61.3, year: 61.3 },
        holdingTime: '14d',
        transactions: [
          { type: 'buy', date: '2026-08-21', amount: 80000, priceUsd: 0.0095 },
          { type: 'buy', date: '2026-08-25', amount: 45000, priceUsd: 0.0119 },
        ],
      },
      {
        symbol: 'RHOG',
        name: 'RH Doge',
        contractAddress: '0x4C1a2B3c4D5e6F708192A3b4C5d6E7f8A9B0c1D2',
        status: 'open',
        amountHeld: 2100000,
        currentPrice: 0.00041,
        valueUsd: 861,
        percentOfPortfolio: 4.7,
        avgBuyPrice: 0.00052,
        unrealizedPnlUsd: -231.0,
        unrealizedPnlPercent: -21.2,
        pnl: { today: -2.1, week: -8.4, month: -21.2, year: -21.2 },
        holdingTime: '6d',
        transactions: [
          { type: 'buy', date: '2026-08-29', amount: 2100000, priceUsd: 0.00052 },
        ],
      },
      {
        symbol: 'SAFE',
        name: 'SafeMoonshot',
        contractAddress: '0x1A2b3C4d5E6f7A8b9C0d1E2f3A4b5C6d7E8f9A0b',
        status: 'open',
        amountHeld: 48000,
        currentPrice: 0.094,
        valueUsd: 4512,
        percentOfPortfolio: 24.5,
        avgBuyPrice: 0.061,
        unrealizedPnlUsd: 1584.0,
        unrealizedPnlPercent: 54.1,
        pnl: { today: 1.8, week: 12.0, month: 54.1, year: 54.1 },
        holdingTime: '9d',
        transactions: [
          { type: 'buy', date: '2026-08-26', amount: 48000, priceUsd: 0.061 },
        ],
      },
      {
        symbol: 'BOOP',
        name: 'BoopCoin',
        contractAddress: '0x7E8f9A0b1C2d3E4f5A6b7C8d9E0f1A2b3C4d5E6f',
        status: 'closed',
        realizedPnlUsd: 612.4,
        realizedPnlPercent: 38.9,
        holdingTime: '3d 2h',
        result: 'win',
        transactions: [
          { type: 'buy', date: '2026-08-18', amount: 300000, priceUsd: 0.0052 },
          { type: 'sell', date: '2026-08-21', amount: 300000, priceUsd: 0.0072 },
        ],
      },
      {
        symbol: 'GMEX',
        name: 'GME Express',
        contractAddress: '0x3D4e5F6a7B8c9D0e1F2a3B4c5D6e7F8a9B0c1D2e',
        status: 'closed',
        realizedPnlUsd: -184.6,
        realizedPnlPercent: -19.3,
        holdingTime: '1d 5h',
        result: 'loss',
        transactions: [
          { type: 'buy', date: '2026-08-30', amount: 90000, priceUsd: 0.0106 },
          { type: 'sell', date: '2026-08-31', amount: 90000, priceUsd: 0.0086 },
        ],
      },
    ],
  };
}

function formatUsd(value) {
  const sign = value < 0 ? '-' : '';
  return `${sign}$${Math.abs(value).toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
}

function formatPercent(value) {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

function pnlClass(value) {
  if (value > 0) return 'pnl-positive';
  if (value < 0) return 'pnl-negative';
  return 'pnl-neutral';
}

function truncateAddress(addr) {
  if (!addr || addr.length < 12) return addr;
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
    // stockage indisponible (mode privé, quota) — on ignore silencieusement
  }
}

/* ---------- Favoris ---------- */

function FavoritesPanel({ favorites, onTrack, onRemove }) {
  if (favorites.length === 0) return null;

  return (
    <div className="favorites-panel">
      <h3 className="section-title">Your favorite wallets</h3>
      <div className="favorites-list">
        {favorites.map((fav) => (
          <div className="favorite-item" key={fav.address}>
            <button
              type="button"
              className="favorite-item-main"
              onClick={() => onTrack(fav.address)}
            >
              <span className="favorite-nickname">{fav.nickname}</span>
              <span className="favorite-address">{truncateAddress(fav.address)}</span>
              {fav.notify && <span className="favorite-notify-badge">🔔 Notifying</span>}
            </button>
            <button
              type="button"
              className="favorite-remove"
              onClick={() => onRemove(fav.address)}
              aria-label={`Remove ${fav.nickname} from favorites`}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Résumé + période ---------- */

function PeriodSelector({ period, onChange }) {
  return (
    <div className="period-selector">
      {PERIODS.map((p) => (
        <button
          key={p.key}
          type="button"
          className={`period-btn ${period === p.key ? 'active' : ''}`}
          onClick={() => onChange(p.key)}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

function SummaryBar({ data, period }) {
  const periodPnl = data.totalPnlByPeriod[period];
  const periodPnlPercent = data.totalPnlPercentByPeriod[period];

  return (
    <div className="summary-bar">
      <div className="summary-stat">
        <span className="summary-label">Portfolio value</span>
        <span className="summary-value">{formatUsd(data.totalValueUsd)}</span>
      </div>
      <div className="summary-stat">
        <span className="summary-label">
          PnL · {PERIODS.find((p) => p.key === period)?.label}
        </span>
        <span className={`summary-value ${pnlClass(periodPnl)}`}>
          {formatUsd(periodPnl)} ({formatPercent(periodPnlPercent)})
        </span>
      </div>
      <div className="summary-stat">
        <span className="summary-label">Realized</span>
        <span className={`summary-value ${pnlClass(data.realizedPnlUsd)}`}>
          {formatUsd(data.realizedPnlUsd)}
        </span>
      </div>
      <div className="summary-stat">
        <span className="summary-label">Unrealized</span>
        <span className={`summary-value ${pnlClass(data.unrealizedPnlUsd)}`}>
          {formatUsd(data.unrealizedPnlUsd)}
        </span>
      </div>
      <div className="summary-stat">
        <span className="summary-label">Win rate</span>
        <span className="summary-value">
          {data.winRate}% <span className="summary-sub">({data.closedTrades} closed)</span>
        </span>
      </div>
      <div className="summary-stat">
        <span className="summary-label">Avg holding time</span>
        <span className="summary-value">{data.avgHoldingTime}</span>
      </div>
    </div>
  );
}

function AllocationBar({ tokens }) {
  const openTokens = tokens.filter((t) => t.status === 'open');
  const colors = ['#22C55E', '#15803D', '#D97706', '#5F5E5A', '#141310'];

  return (
    <div className="allocation-section">
      <h3 className="section-title">Allocation</h3>
      <div className="allocation-bar">
        {openTokens.map((token, i) => (
          <div
            key={token.symbol}
            className="allocation-segment"
            style={{
              width: `${token.percentOfPortfolio}%`,
              background: colors[i % colors.length],
            }}
            title={`${token.symbol}: ${token.percentOfPortfolio}%`}
          />
        ))}
      </div>
      <div className="allocation-legend">
        {openTokens.map((token, i) => (
          <div className="allocation-legend-item" key={token.symbol}>
            <span
              className="allocation-dot"
              style={{ background: colors[i % colors.length] }}
            />
            <span>
              ${token.symbol} · {token.percentOfPortfolio}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Suivre ce wallet (Telegram) ---------- */

function FollowWalletCard({ favorite, telegramConnected, onConnectTelegram, onSave, onToggleNotify }) {
  const [nickname, setNickname] = useState(favorite?.nickname || '');
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    setNickname(favorite?.nickname || '');
  }, [favorite]);

  const handleConnect = () => {
    setConnecting(true);
    // TODO: remplacer par le vrai flow OAuth du bot Telegram une fois construit
    setTimeout(() => {
      onConnectTelegram();
      setConnecting(false);
    }, 800);
  };

  const handleSave = () => {
    const trimmed = nickname.trim();
    if (!trimmed) return;
    onSave(trimmed);
  };

  return (
    <div className="follow-section">
      <h3 className="section-title">Follow this wallet</h3>

      <div className="follow-nickname-row">
        <input
          type="text"
          className="follow-nickname-input"
          placeholder="Name this wallet, e.g. 'Whale #1'"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={30}
        />
        <button
          type="button"
          className="follow-save-btn"
          onClick={handleSave}
          disabled={!nickname.trim()}
        >
          {favorite ? 'Update name' : 'Save wallet'}
        </button>
      </div>

      {!telegramConnected ? (
        <div className="follow-telegram-box">
          <p className="follow-hint">
            Connect Telegram to get notified instantly of every buy, sell, or transfer.
          </p>
          <button
            type="button"
            className="follow-telegram-btn"
            onClick={handleConnect}
            disabled={connecting}
          >
            {connecting ? 'Connecting...' : 'Connect Telegram'}
          </button>
        </div>
      ) : (
        <div className="follow-telegram-box">
          {!favorite ? (
            <p className="follow-hint">Save this wallet with a name to enable notifications.</p>
          ) : favorite.notify ? (
            <>
              <p className="follow-hint follow-active">
                🔔 Following as "<strong>{favorite.nickname}</strong>" alerts sent to Telegram.
              </p>
              <button
                type="button"
                className="follow-stop-btn"
                onClick={() => onToggleNotify(false)}
              >
                Stop notifications
              </button>
            </>
          ) : (
            <button
              type="button"
              className="follow-telegram-btn"
              onClick={() => onToggleNotify(true)}
            >
              Start notifications
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- Ligne de token ---------- */

function TokenRow({ token, expanded, onToggle, period }) {
  const isOpen = token.status === 'open';
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(token.contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className={`token-row ${expanded ? 'expanded' : ''}`}>
      <button type="button" className="token-row-header" onClick={onToggle}>
        <div className="token-identity">
          <span className="token-symbol">${token.symbol}</span>
          <span className="token-name">{token.name}</span>
          <span className="token-address">{truncateAddress(token.contractAddress)}</span>
          {!isOpen && (
            <span className={`token-status-tag ${token.result}`}>
              {token.result === 'win' ? 'Closed · Win' : 'Closed · Loss'}
            </span>
          )}
        </div>

        {isOpen ? (
          <>
            <div className="token-metric">
              <span className="metric-label">Value</span>
              <span className="metric-value">{formatUsd(token.valueUsd)}</span>
            </div>
            <div className="token-metric">
              <span className="metric-label">% Portfolio</span>
              <span className="metric-value">{token.percentOfPortfolio}%</span>
            </div>
            <div className="token-metric">
              <span className="metric-label">
                PnL · {PERIODS.find((p) => p.key === period)?.label}
              </span>
              <span className={`metric-value ${pnlClass(token.pnl[period])}`}>
                {formatPercent(token.pnl[period])}
              </span>
            </div>
            <div className="token-metric">
              <span className="metric-label">Unrealized PnL</span>
              <span className={`metric-value ${pnlClass(token.unrealizedPnlUsd)}`}>
                {formatUsd(token.unrealizedPnlUsd)} ({formatPercent(token.unrealizedPnlPercent)})
              </span>
            </div>
          </>
        ) : (
          <div className="token-metric">
            <span className="metric-label">Realized PnL</span>
            <span className={`metric-value ${pnlClass(token.realizedPnlUsd)}`}>
              {formatUsd(token.realizedPnlUsd)} ({formatPercent(token.realizedPnlPercent)})
            </span>
          </div>
        )}

        <span className="token-row-chevron">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="token-row-details">
          <div className="contract-row">
            <span className="metric-label">Contract</span>
            <span className="contract-address">{token.contractAddress}</span>
            <button type="button" className="contract-copy-btn" onClick={handleCopy}>
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <a
              href={`https://robinhoodchain.blockscout.com/address/${token.contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="contract-explorer-link"
            >
              View on Blockscout
            </a>
          </div>

          {isOpen && (
            <div className="pnl-periods">
              {PERIODS.map((p) => (
                <div className="pnl-period" key={p.key}>
                  <span className="metric-label">{p.label}</span>
                  <span className={pnlClass(token.pnl[p.key])}>
                    {formatPercent(token.pnl[p.key])}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="holding-time-row">
            <span className="metric-label">Holding time</span>
            <span>{token.holdingTime}</span>
          </div>

          <h4 className="tx-history-title">Transaction history</h4>
          <ul className="tx-history">
            {token.transactions.map((tx, i) => (
              <li className={`tx-item tx-${tx.type}`} key={i}>
                <span className="tx-type">{tx.type === 'buy' ? 'Buy' : 'Sell'}</span>
                <span className="tx-date">{tx.date}</span>
                <span className="tx-amount">
                  {tx.amount.toLocaleString('en-US')} {token.symbol}
                </span>
                <span className="tx-price">@ ${tx.priceUsd}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ---------- Page principale ---------- */

function Tracker() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [expandedSymbol, setExpandedSymbol] = useState(null);
  const [period, setPeriod] = useState('today');
  const [favorites, setFavorites] = useState([]);
  const [telegramConnected, setTelegramConnected] = useState(false);

  useEffect(() => {
    setFavorites(loadFavorites());
    try {
      setTelegramConnected(localStorage.getItem(TELEGRAM_KEY) === 'true');
    } catch {
      setTelegramConnected(false);
    }
  }, []);

  const runTrack = (rawAddress) => {
    const trimmed = rawAddress.trim();
    if (!trimmed) {
      setError('Paste a wallet address to track.');
      return;
    }

    setAddress(trimmed);
    setError('');
    setLoading(true);
    setResult(null);
    setExpandedSymbol(null);

    // Simule le temps de réponse d'un vrai backend
    setTimeout(() => {
      setResult(getMockWalletData(trimmed));
      setLoading(false);
    }, 900);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    runTrack(address);
  };

  const toggleToken = (symbol) => {
    setExpandedSymbol((current) => (current === symbol ? null : symbol));
  };

  const currentFavorite = result
    ? favorites.find((f) => f.address === result.address)
    : null;

  const handleSaveFavorite = (nickname) => {
    setFavorites((current) => {
      const exists = current.find((f) => f.address === result.address);
      let next;
      if (exists) {
        next = current.map((f) =>
          f.address === result.address ? { ...f, nickname } : f
        );
      } else {
        next = [...current, { address: result.address, nickname, notify: false }];
      }
      saveFavorites(next);
      return next;
    });
  };

  const handleRemoveFavorite = (favAddress) => {
    setFavorites((current) => {
      const next = current.filter((f) => f.address !== favAddress);
      saveFavorites(next);
      return next;
    });
  };

  const handleConnectTelegram = () => {
    setTelegramConnected(true);
    try {
      localStorage.setItem(TELEGRAM_KEY, 'true');
    } catch {
      // ignore
    }
  };

  const handleToggleNotify = (notify) => {
    if (!result) return;
    setFavorites((current) => {
      const next = current.map((f) =>
        f.address === result.address ? { ...f, notify } : f
      );
      saveFavorites(next);
      return next;
    });
  };

  return (
    <div className="tracker-page">
      <Navbar />

      <main className="tracker">
        <h1 className="tracker-title">Track a wallet</h1>
        <p className="tracker-subtitle">
          Paste a wallet address on Robinhood Chain to see its full portfolio and PnL.
        </p>

        <FavoritesPanel
          favorites={favorites}
          onTrack={runTrack}
          onRemove={handleRemoveFavorite}
        />

        <form className="tracker-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="tracker-input"
            placeholder="0x..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <button type="submit" className="tracker-submit" disabled={loading}>
            {loading ? 'Loading...' : 'Track'}
          </button>
        </form>

        {error && <p className="tracker-error">{error}</p>}

        {loading && (
          <p className="tracker-loading">Fetching transactions and computing PnL...</p>
        )}

        {result && !loading && (
          <div className="tracker-result">
            <PeriodSelector period={period} onChange={setPeriod} />
            <SummaryBar data={result} period={period} />
            <AllocationBar tokens={result.tokens} />

            <FollowWalletCard
              favorite={currentFavorite}
              telegramConnected={telegramConnected}
              onConnectTelegram={handleConnectTelegram}
              onSave={handleSaveFavorite}
              onToggleNotify={handleToggleNotify}
            />

            <div className="holdings-section">
              <h3 className="section-title">Holdings &amp; closed trades</h3>
              <div className="token-list">
                {result.tokens.map((token) => (
                  <TokenRow
                    key={token.symbol}
                    token={token}
                    period={period}
                    expanded={expandedSymbol === token.symbol}
                    onToggle={() => toggleToken(token.symbol)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Tracker;