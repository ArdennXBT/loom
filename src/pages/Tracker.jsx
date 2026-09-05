import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getWalletData } from "../services/api";
import "./Tracker.css";

const FAVORITES_KEY = "loomscan_favorite_wallets";
const TELEGRAM_KEY = "loomscan_telegram_connected";

const PERIODS = [
  { key: "today", label: "24H" },
  { key: "week", label: "7D" },
  { key: "month", label: "30D" },
  { key: "year", label: "1Y" },
];

function formatUsd(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "$0.00";
  const sign = value < 0 ? "-" : "";
  return `${sign}$${Math.abs(value).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  })}`;
}

function formatPercent(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "0.0%";
  const sign = value > 0 ? "+" : "";
  return `${sign}${Number(value).toFixed(1)}%`;
}

function pnlClass(value) {
  if (value > 0) return "pnl-positive";
  if (value < 0) return "pnl-negative";
  return "pnl-neutral";
}

function truncateAddress(addr) {
  if (!addr || addr.length < 12) return addr || "";
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
          className={`period-btn ${period === p.key ? "active" : ""}`}
          onClick={() => onChange(p.key)}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

function SummaryBar({ data, period }) {
  const periodPnl = data.totalPnlByPeriod?.[period] ?? data.totalPnlUsd ?? 0;
  const periodPnlPercent = data.totalPnlPercentByPeriod?.[period] ?? data.totalPnlPercent ?? 0;

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
        <span className="summary-value">{data.avgHoldingTime || "—"}</span>
      </div>
    </div>
  );
}

function AllocationBar({ tokens }) {
  const openTokens = (tokens || [])
    .filter((t) => t.status === "open" && (t.valueUsd || 0) >= 1)
    .sort((a, b) => (b.valueUsd || 0) - (a.valueUsd || 0));

  const colors = ["#22C55E", "#15803D", "#D97706", "#5F5E5A", "#141310", "#3B82F6", "#8B5CF6"];

  if (openTokens.length === 0) return null;

  return (
    <div className="allocation-section">
      <h3 className="section-title">Allocation</h3>
      <div className="allocation-bar">
        {openTokens.map((token, i) => (
          <div
            key={token.contractAddress || token.symbol}
            className="allocation-segment"
            style={{
              width: `${token.percentOfPortfolio}%`,
              background: colors[i % colors.length],
            }}
            title={`${token.symbol || truncateAddress(token.contractAddress)}: ${token.percentOfPortfolio}%`}
          />
        ))}
      </div>
      <div className="allocation-legend">
        {openTokens.map((token, i) => (
          <div className="allocation-legend-item" key={token.contractAddress || token.symbol}>
            <span
              className="allocation-dot"
              style={{ background: colors[i % colors.length] }}
            />
            <span>
              ${token.symbol && token.symbol !== "???" ? token.symbol : truncateAddress(token.contractAddress)} · {token.percentOfPortfolio}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Follow this wallet ---------- */

function FollowWalletCard({ favorite, telegramConnected, onConnectTelegram, onSave, onToggleNotify }) {
  const [nickname, setNickname] = useState(favorite?.nickname || "");
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    setNickname(favorite?.nickname || "");
  }, [favorite]);

  const handleConnect = () => {
    setConnecting(true);
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
          {favorite ? "Update name" : "Save wallet"}
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
            {connecting ? "Connecting..." : "Connect Telegram"}
          </button>
        </div>
      ) : (
        <div className="follow-telegram-box">
          {!favorite ? (
            <p className="follow-hint">Save this wallet with a name to enable notifications.</p>
          ) : favorite.notify ? (
            <>
              <p className="follow-hint follow-active">
                🔔 Following as "<strong>{favorite.nickname}</strong>" — alerts sent to Telegram.
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

function TokenRow({ token, expanded, onToggle }) {
  const isOpen = token.status === "open";
  const [copied, setCopied] = useState(false);

  const displaySymbol =
    token.symbol && token.symbol !== "???" && token.symbol !== "Unknown"
      ? token.symbol
      : truncateAddress(token.contractAddress);

  const displayName =
    token.name && token.name !== "Unknown token" && token.name !== "???"
      ? token.name
      : "Token";

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(token.contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className={`token-row ${expanded ? "expanded" : ""}`}>
      <button type="button" className="token-row-header" onClick={onToggle}>
        <div className="token-identity">
          <span className="token-symbol">${displaySymbol}</span>
          <span className="token-name">{displayName}</span>
        </div>

        <div className="token-stats">
          {isOpen ? (
            <>
              <span className="token-value">{formatUsd(token.valueUsd)}</span>
              <span className={`token-pnl ${pnlClass(token.unrealizedPnlUsd)}`}>
                {formatUsd(token.unrealizedPnlUsd)} ({formatPercent(token.unrealizedPnlPercent)})
              </span>
            </>
          ) : (
            <>
              <span className={`token-pnl ${pnlClass(token.realizedPnlUsd)}`}>
                {formatUsd(token.realizedPnlUsd)} ({formatPercent(token.realizedPnlPercent)})
              </span>
              <span className="token-result">{token.result}</span>
            </>
          )}
          <span className="token-holding">{token.holdingTime}</span>
        </div>
      </button>

      {expanded && (
        <div className="token-details">
          <div className="token-detail-row">
            <span>Contract</span>
            <button type="button" className="copy-btn" onClick={handleCopy}>
              {copied ? "Copied!" : truncateAddress(token.contractAddress)}
            </button>
          </div>

          {isOpen && (
            <>
              <div className="token-detail-row">
                <span>Amount held</span>
                <span>{Number(token.amountHeld).toLocaleString(undefined, { maximumFractionDigits: 6 })}</span>
              </div>
              <div className="token-detail-row">
                <span>Avg buy price</span>
                <span>{formatUsd(token.avgBuyPrice)}</span>
              </div>
              <div className="token-detail-row">
                <span>Current price</span>
                <span>{formatUsd(token.currentPrice)}</span>
              </div>
            </>
          )}

          {token.transactions?.length > 0 && (
            <div className="token-transactions">
              <h4>Transactions</h4>
              {token.transactions.map((tx, i) => (
                <div key={i} className="tx-row">
                  <span className={`tx-type ${tx.type}`}>{tx.type}</span>
                  <span>{tx.date}</span>
                  <span>{Number(tx.amount).toLocaleString()}</span>
                  <span>{formatUsd(tx.priceUsd)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- Page principale ---------- */

export default function Tracker() {
  const [address, setAddress] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState("today");
  const [expandedToken, setExpandedToken] = useState(null);

  const [favorites, setFavorites] = useState(() => loadFavorites());
  const [telegramConnected, setTelegramConnected] = useState(() => {
    return localStorage.getItem(TELEGRAM_KEY) === "true";
  });

  const currentFavorite = favorites.find(
    (f) => f.address.toLowerCase() === (data?.address || "").toLowerCase()
  );

  const handleTrack = async (addr) => {
    const trimmed = (addr || address).trim();
    if (!trimmed) {
      setError("Paste a wallet address");
      return;
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(trimmed)) {
      setError("Invalid wallet address");
      return;
    }

    setError("");
    setLoading(true);
    setData(null);
    setExpandedToken(null);

    try {
      const result = await getWalletData(trimmed);
      setData(result);
      setAddress(trimmed);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404) {
        setError("No activity found for this wallet yet");
      } else {
        setError("Failed to fetch wallet data. Is the backend running?");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleTrack();
  };

  const handleSaveFavorite = (nickname) => {
    if (!data?.address) return;

    const existing = favorites.find(
      (f) => f.address.toLowerCase() === data.address.toLowerCase()
    );

    let updated;
    if (existing) {
      updated = favorites.map((f) =>
        f.address.toLowerCase() === data.address.toLowerCase()
          ? { ...f, nickname }
          : f
      );
    } else {
      updated = [
        ...favorites,
        {
          address: data.address,
          nickname,
          notify: false,
        },
      ];
    }

    setFavorites(updated);
    saveFavorites(updated);
  };

  const handleToggleNotify = (enable) => {
    if (!currentFavorite) return;

    const updated = favorites.map((f) =>
      f.address.toLowerCase() === currentFavorite.address.toLowerCase()
        ? { ...f, notify: enable }
        : f
    );
    setFavorites(updated);
    saveFavorites(updated);
  };

  const handleRemoveFavorite = (addr) => {
    const updated = favorites.filter(
      (f) => f.address.toLowerCase() !== addr.toLowerCase()
    );
    setFavorites(updated);
    saveFavorites(updated);
  };

  const handleConnectTelegram = () => {
    localStorage.setItem(TELEGRAM_KEY, "true");
    setTelegramConnected(true);
  };

  // Tokens filtrés + triés
  const displayTokens = (data?.tokens || [])
    .filter((t) => (t.status === "open" ? (t.valueUsd || 0) >= 1 : true))
    .sort((a, b) => {
      const valueA = a.status === "open" ? (a.valueUsd || 0) : Math.abs(a.realizedPnlUsd || 0);
      const valueB = b.status === "open" ? (b.valueUsd || 0) : Math.abs(b.realizedPnlUsd || 0);
      return valueB - valueA;
    });

  return (
    <div className="tracker-page">
      <Navbar />

      <main className="tracker">
        <h1 className="tracker-title">Track a wallet</h1>
        <p className="tracker-subtitle">
          Paste any wallet address on Robinhood Chain to see its trades, PnL and win rate.
        </p>

        <form className="tracker-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="tracker-input"
            placeholder="0x..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <button type="submit" className="tracker-submit" disabled={loading}>
            {loading ? "Loading..." : "Track"}
          </button>
        </form>

        {error && <p className="tracker-error">{error}</p>}

        <FavoritesPanel
          favorites={favorites}
          onTrack={handleTrack}
          onRemove={handleRemoveFavorite}
        />

        {loading && (
          <p className="tracker-loading">Fetching trades and calculating PnL...</p>
        )}

        {data && !loading && (
          <>
            <div className="tracker-header-row">
              <div>
                <h2 className="wallet-address">{truncateAddress(data.address)}</h2>
                <PeriodSelector period={period} onChange={setPeriod} />
              </div>
            </div>

            <SummaryBar data={data} period={period} />
            <AllocationBar tokens={data.tokens} />

            <FollowWalletCard
              favorite={currentFavorite}
              telegramConnected={telegramConnected}
              onConnectTelegram={handleConnectTelegram}
              onSave={handleSaveFavorite}
              onToggleNotify={handleToggleNotify}
            />

            <div className="tokens-section">
              <h3 className="section-title">Positions ({displayTokens.length})</h3>
              {displayTokens.length === 0 ? (
                <p className="no-positions">No significant positions found.</p>
              ) : (
                displayTokens.map((token) => (
                  <TokenRow
                    key={token.contractAddress}
                    token={token}
                    expanded={expandedToken === token.contractAddress}
                    onToggle={() =>
                      setExpandedToken(
                        expandedToken === token.contractAddress
                          ? null
                          : token.contractAddress
                      )
                    }
                  />
                ))
              )}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}