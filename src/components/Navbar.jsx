import { useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate('/')}>
        LoomScan
      </div>
      <button className="navbar-login-btn">Login</button>
    </nav>
  );
}

export default Navbar;