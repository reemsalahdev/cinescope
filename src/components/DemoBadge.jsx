import { isDemoMode } from '../api/index.js';
import './DemoBadge.css';

/** Small pill in the navbar that tells visitors they're looking at local demo data. */
export default function DemoBadge() {
  if (!isDemoMode) return null;
  return (
    <span
      className="demo-badge"
      title="No TMDB API key found. Add VITE_TMDB_API_KEY to .env to load live data."
    >
      <span className="demo-badge__dot" />
      <span>
        Demo<span className="demo-badge__extra"> data</span>
      </span>
    </span>
  );
}
