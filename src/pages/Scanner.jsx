import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Scanner.css';

// TODO: remplacer par un vrai appel à src/services/api.js une fois
// Alchemy + le service honeypot (GoPlus/Honeypot.is) branchés côté backend.
function getMockScanResult(address) {
  return {
    address,
    tokenName: 'SafeMoonshot',
    tokenSymbol: 'SAFE',
    score: 87,
    verdict: 'safe', // 'safe' | 'warning' | 'danger'
    // null = réseau non renseigné par le déployeur, ne pas l'afficher
    socials: {
      website: 'https://safemoonshot.io',
      twitter: 'https://twitter.com/safemoonshot',
      telegram: null,
      discord: null,
    },
    categories: [
      {
        title: 'Fatal',
        checks: [
          { label: 'No honeypot detected', status: 'pass' },
          { label: 'Buy/sell tax under 5%', status: 'pass' },
          { label: 'No active mint function', status: 'pass' },
          { label: 'No blacklist/freeze function', status: 'pass' },
        ],
      },
      {
        title: 'Structural',
        checks: [
          { label: 'Ownership renounced', status: 'pass' },
          { label: 'Contract verified', status: 'pass' },
          { label: 'Not upgradeable (no proxy)', status: 'pass' },
          { label: 'Deployer has clean history', status: 'warning' },
        ],
      },
      {
        title: 'Liquidity',
        checks: [
          { label: 'Liquidity locked', status: 'pass' },
          { label: 'Lock duration: 180 days', status: 'pass' },
          { label: 'Locked amount: 92%', status: 'pass' },
        ],
      },
      {
        title: 'Holder concentration',
        checks: [
          { label: 'Top 1 holder: 4.2%', status: 'pass' },
          { label: 'Top 10 holders: 18.6%', status: 'pass' },
          { label: 'No bundled wallets detected', status: 'pass' },
          { label: 'Deployer holds 1.1%', status: 'pass' },
        ],
      },
      {
        title: 'Positive signals',
        checks: [
          { label: '2,340 holders, growing', status: 'pass' },
          { label: 'Buyer/seller ratio: 1.3', status: 'pass' },
          { label: 'Token age: 14 days', status: 'warning' },
          { label: 'Consistent volume', status: 'pass' },
        ],
      },
    ],
  };
}

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = address.trim();

    if (!trimmed) {
      setError('Paste a contract address to scan.');
      return;
    }

    setError('');
    setLoading(true);
    setResult(null);

    // Simule le temps de réponse d'un vrai scan backend
    setTimeout(() => {
      setResult(getMockScanResult(trimmed));
      setLoading(false);
    }, 900);
  };

  return (
    <div className="scanner-page">
      <Navbar />

      <main className="scanner">
        <h1 className="scanner-title">Scan a token</h1>
        <p className="scanner-subtitle">
          Paste a token contract address on Robinhood Chain to see its safety score.
        </p>

        <form className="scanner-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="scanner-input"
            placeholder="0x..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <button type="submit" className="scanner-submit" disabled={loading}>
            {loading ? 'Scanning...' : 'Scan'}
          </button>
        </form>

        {error && <p className="scanner-error">{error}</p>}

        {loading && (
          <p className="scanner-loading">Analyzing contract, liquidity and holders...</p>
        )}

        {result && !loading && (
          <div className="scanner-result">
            <div className={`score-card verdict-${result.verdict}`}>
              <div className="score-card-token">
                <span className="score-card-symbol">${result.tokenSymbol}</span>
                <span className="score-card-name">{result.tokenName}</span>
              </div>
              <div className="score-card-number">{result.score}</div>
              <div className="score-card-out-of">/ 100</div>
              <div className={`score-card-badge verdict-${result.verdict}`}>
                {verdictLabel(result.verdict)}
              </div>
            </div>

            <div className="category-grid">
              {result.categories.map((category) => (
                <div className="category-card" key={category.title}>
                  <h3 className="category-title">{category.title}</h3>
                  <ul className="category-checks">
                    {category.checks.map((check) => (
                      <li className="category-check" key={check.label}>
                        <StatusIcon status={check.status} />
                        <span>{check.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <SocialLinks socials={result.socials} />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Scanner;