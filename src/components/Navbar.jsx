import { Link } from 'react-router-dom';
import './Navbar.css';

function LogoMark() {
  return (
    <svg
      className="navbar-logo-icon"
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

function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="navbar-logo" aria-label="LoomScan home">
        <LogoMark />
        <span className="navbar-logo-text">LoomScan</span>
      </Link>

      <button type="button" className="navbar-login-btn">
        Login
      </button>
    </header>
  );
}

export default Navbar;