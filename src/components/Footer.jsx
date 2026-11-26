import { isDemoMode } from '../api/index.js';
import Logo from './Logo.jsx';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Logo size={22} />
          <span>CineScope</span>
        </div>
        <p className="footer__note">
          {isDemoMode
            ? 'Running on a local demo dataset. Add a TMDB API key to explore the full catalogue.'
            : 'This product uses the TMDB API but is not endorsed or certified by TMDB.'}
        </p>
        <p className="footer__copy">A portfolio project · Built with React & Vite</p>
      </div>
    </footer>
  );
}
