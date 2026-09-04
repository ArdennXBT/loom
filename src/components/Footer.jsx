import { Link } from 'react-router-dom';
import './Footer.css';

function LogoMark() {
  return (
    <svg
      className="footer-logo-icon"
      viewBox="0 0 120 120"
      role="img"
      aria-label="LoomScan logo"
    >
      <rect x="2" y="2" width="116" height="116" rx="16" fill="#22C55E" />
      <circle cx="52" cy="52" r="30" fill="none" stroke="#0B3D1E" strokeWidth="5" />
      <circle cx="52" cy="52" r="16" fill="none" stroke="#0B3D1E" strokeWidth="5" />
      <line
        x1="74"
        y1="74"
        x2="100"
        y2="100"
        stroke="#0B3D1E"
        strokeWidth="7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <Link to="/" className="footer-logo" aria-label="LoomScan home">
          <LogoMark />
          <span className="footer-logo-text">LoomScan</span>
        </Link>

        <div className="footer-meta">
          <a
            href="https://twitter.com/ArdennXBT"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-builtby"
          >
            Built by ArdennXBT
          </a>
          <span className="footer-copyright">© {year} LoomScan. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;