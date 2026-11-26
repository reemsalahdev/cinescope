import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Logo from './Logo.jsx';
import Icon from './Icon.jsx';
import DemoBadge from './DemoBadge.jsx';
import { useWatchlist } from '../context/WatchlistContext.jsx';
import './Navbar.css';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/browse', label: 'Browse' },
  { to: '/search', label: 'Search' },
  { to: '/watchlist', label: 'Watchlist' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { items } = useWatchlist();
  const location = useLocation();

  // Close the mobile menu whenever the route changes.
  useEffect(() => setMenuOpen(false), [location.pathname]);

  // The bar is transparent over the hero and becomes solid once you scroll.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Stop the page behind the open mobile menu from scrolling.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => (document.body.style.overflow = '');
  }, [menuOpen]);

  const navLinks = LINKS.map((link) => (
    <NavLink key={link.to} to={link.to} end={link.end} className="nav__link">
      {link.label}
      {link.to === '/watchlist' && items.length > 0 && (
        <span className="nav__count" aria-label={`${items.length} saved`}>
          {items.length}
        </span>
      )}
    </NavLink>
  ));

  return (
    <header className={`nav ${scrolled || menuOpen ? 'nav--solid' : ''}`}>
      <div className="nav__inner container">
        <Link to="/" className="nav__brand" aria-label="CineScope home">
          <Logo />
          <span>
            Cine<em>Scope</em>
          </span>
        </Link>

        <nav className="nav__links" aria-label="Main">
          {navLinks}
        </nav>

        <div className="nav__actions">
          <DemoBadge />
          <Link to="/search" className="icon-btn nav__search" aria-label="Search">
            <Icon name="search" />
          </Link>
          <button
            className="icon-btn nav__toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <Icon name={menuOpen ? 'close' : 'menu'} />
          </button>
        </div>
      </div>

      <nav
        id="mobile-menu"
        className={`nav__mobile ${menuOpen ? 'is-open' : ''}`}
        aria-label="Mobile"
        aria-hidden={!menuOpen}
      >
        {navLinks}
      </nav>
    </header>
  );
}
