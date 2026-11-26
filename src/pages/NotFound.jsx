import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import './NotFound.css';

/**
 * Used for unknown URLs, and also by the detail page when a title doesn't exist.
 */
export default function NotFound({ title = 'This scene was cut.', message }) {
  useDocumentTitle('Not found');
  return (
    <div className="page container not-found">
      <div className="not-found__reel" aria-hidden="true">
        <span>4</span>
        <FilmReel />
        <span>4</span>
      </div>
      <h1 className="not-found__title">{title}</h1>
      <p className="not-found__text">
        {message ?? "The page you're looking for never made it past the editing room. Let's get you back to the good part."}
      </p>
      <div className="not-found__actions">
        <Link to="/" className="btn btn--primary">Back to home</Link>
        <Link to="/browse" className="btn btn--ghost">Browse titles</Link>
      </div>
    </div>
  );
}

function FilmReel() {
  return (
    <svg className="not-found__svg" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="reel-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd27a" />
          <stop offset="1" stopColor="#ff7a59" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="44" fill="none" stroke="url(#reel-g)" strokeWidth="7" />
      <circle cx="50" cy="50" r="7" fill="url(#reel-g)" />
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <circle
          key={deg}
          cx={50 + 24 * Math.cos((deg * Math.PI) / 180)}
          cy={50 + 24 * Math.sin((deg * Math.PI) / 180)}
          r="9"
          fill="url(#reel-g)"
          opacity="0.85"
        />
      ))}
    </svg>
  );
}
