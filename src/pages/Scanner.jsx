import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Scanner.css';

function verdictLabel(verdict) {
  if (verdict === 'safe') return 'Looks safe';
  if (verdict === 'warning') return 'Use caution';
  return 'High risk';
}

function StatusIcon({ status }) {
  if (status === 'pass') return <span className="check-icon pass">✓</span>;
  if (status === 'warning') return <span className="check-icon warning">!</span>;
  return <span className="check-icon fail">✕</span>;
}

function truncateAddress(addr) {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

const SOCIAL_META = {
  website: {
    label: 'Website',
    icon: (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9s1.3-6.5 3.8-9z" />
      </svg>
    ),
  },
  twitter: {
    label: 'Twitter',
    icon: (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
        <path d="M18.9 3H21l-6.8 7.8L22.2 21h-6.6l-5.1-6.6L4.6 21H2.5l7.2-8.3L2 3h6.8l4.6 6.1L18.9 3zm-1.2 16.2h1.2L7.4 4.7H6.1l11.6 14.5z" />
      </svg>
    ),
  },
  telegram: {
    label: 'Telegram',
    icon: (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
        <path d="M21.9 4.5 18.9 19c-.2 1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.3-4.9L18 6c.4-.4-.1-.6-.7-.2L7 12.4 2.2 10.9c-1-.3-1-1 .2-1.5l19-7.3c.9-.3 1.6.2 1.3 1.5z" />
      </svg>
    ),
  },
  discord: {
    label: 'Discord',
    icon: (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
        <path d="M20.3 5.4A18 18 0 0 0 15.9 4l-.3.6a13 13 0 0 1 3.7 1.4 15 15 0 0 0-15 0A13 13 0 0 1 8 4.6L7.7 4a18 18 0 0 0-4.4 1.4C1 8.9.4 12.3.7 15.6a18 18 0 0 0 5.4 2.7l.8-1.3a11 11 0 0 1-1.9-.9l.5-.4a13 13 0 0 0 11 0l.5.4c-.6.4-1.3.7-1.9.9l.8 1.3a18 18 0 0 0 5.4-2.7c.4-3.9-.6-7.3-2.9-10.2zM9 13.6c-.8 0-1.5-.8-1.5-1.7S8.1 10.2 9 10.2s1.5.8 1.5 1.7-.7 1.7-1.5 1.7zm6 0c-.8 0-1.5-.8-1.5-1.7s.7-1.7 1.5-1.7 1.5.8 1.5 1.7-.7 1.7-1.5 1.7z" />
      </svg>
    ),
  },
};

function SocialLinks({ socials }) {
  const entries = Object.entries(socials || {}).filter(([, url]) => Boolean(url));
  if (entries.length === 0) return null;

  return (
    <div className="category-card">
      <h3 className="category-title">Socials</h3>
      <div className="socials-row">
        {entries.map(([key, url]) => {
          const meta = SOCIAL_META[key];
          if (!meta) return null;
          return (
            <a
              key={key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              {meta.icon}
              {meta.label}
            </a>
          );
        })}
      </div>
    </div>
  );
}

function Scanner() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = address.trim();

    if (!trimmed) {
      setError('Paste a contract address to scan.');
      return;
    }

    if (!/^0x[a-fA-F0-9]{40}$/i.test(trimmed)) {
      setError('Invalid contract address.');
      return;
    }

    setError('');
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`http://localhost:4000/scanner/${trimmed}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Scan failed');
      }

      setResult(data);
    } catch (err) {
      setError(err.message || 'Something went wrong while scanning.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result?.address) return;
    navigator.clipboard.writeText(result.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleReset = () => {
    setResult(null);
    setAddress('');
    setError('');
  };

  return (
    <div className="scanner-page">
      <Navbar />

      <main className="scanner">
        <div className="scanner-header">
          <h1 className="scanner-title">Scan a token</h1>
          <p className="scanner-subtitle">
            Paste a token contract address on Robinhood Chain to get a full security analysis.
          </p>
        </div>

        <form className="scanner-form" onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <input
              type="text"
              className="scanner-input"
              placeholder="0x..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="scanner-submit" disabled={loading}>
              {loading ? (
                <span className="spinner"></span>
              ) : (
                'Scan'
              )}
            </button>
          </div>
        </form>

        {error && <p className="scanner-error">{error}</p>}

        {loading && (
          <div className="scanner-loading-box">
            <div className="spinner large"></div>
            <p>Analyzing contract, liquidity & holders...</p>
          </div>
        )}

        {result && !loading && (
          <div className="scanner-result">
            {/* Score Card */}
            <div className={`score-card verdict-${result.verdict}`}>
              <div className="score-card-top">
                <div className="score-card-token">
                  <span className="score-card-symbol">${result.tokenSymbol}</span>
                  <span className="score-card-name">{result.tokenName}</span>
                </div>
                <div className="chain-badge">Robinhood Chain</div>
              </div>

              <div className="score-main">
                <div className="score-number">{result.score}</div>
                <div className="score-out-of">/ 100</div>
              </div>

              <div className={`score-badge verdict-${result.verdict}`}>
                {verdictLabel(result.verdict)}
              </div>

              <div className="score-address-row">
                <span className="score-address">{truncateAddress(result.address)}</span>
                <button type="button" className="copy-btn" onClick={handleCopy}>
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <a
                  href={`https://robinhoodchain.blockscout.com/address/${result.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="explorer-link"
                >
                  Explorer ↗
                </a>
              </div>
            </div>

            {/* Categories */}
            <div className="category-grid">
              {result.categories?.map((category) => {
                const passCount = category.checks.filter(c => c.status === 'pass').length;
                const total = category.checks.length;

                return (
                  <div className="category-card" key={category.title}>
                    <div className="category-header">
                      <h3 className="category-title">{category.title}</h3>
                      <span className="category-count">{passCount}/{total}</span>
                    </div>
                    <ul className="category-checks">
                      {category.checks.map((check) => (
                        <li className="category-check" key={check.label}>
                          <StatusIcon status={check.status} />
                          <span>{check.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}

              <SocialLinks socials={result.socials} />
            </div>

            <div className="result-actions">
              <button type="button" className="scan-another-btn" onClick={handleReset}>
                Scan another token
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Scanner;