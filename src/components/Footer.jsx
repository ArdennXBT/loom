import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <span className="footer-logo">LoomScan</span>
        <p className="footer-text">
          Built by{' '}
          <a
            href="https://twitter.com/ArdennXBT"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-author-link"
          >
            ArdennXBT
          </a>
        </p>
      </div>
      <p className="footer-copyright">
        © 2026 LoomScan. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;