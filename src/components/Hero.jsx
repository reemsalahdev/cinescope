import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ArtImage from './ArtImage.jsx';
import Icon from './Icon.jsx';
import Rating from './Rating.jsx';
import WatchlistButton from './WatchlistButton.jsx';
import { formatRuntime, formatSeasons, titlePath, trailerUrl } from '../utils/format.js';
import './Hero.css';

const ROTATE_MS = 7000;

/** Big featured banner that cycles through a few titles automatically. */
export default function Hero({ items }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Advance to the next slide every few seconds, unless the user is hovering.
  // Because `index` is a dependency, clicking a dot also restarts the timer.
  useEffect(() => {
    if (paused || items.length < 2) return;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % items.length), ROTATE_MS);
    return () => clearTimeout(timer);
  }, [index, paused, items.length]);

  const current = items[index];

  return (
    <section
      className="hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured titles"
    >
      {/* All backdrops are stacked; only the active one is visible (cross-fade). */}
      <div className="hero__backdrops">
        {items.map((item, i) => (
          <div key={`${item.mediaType}-${item.id}`} className={`hero__backdrop ${i === index ? 'is-active' : ''}`}>
            <ArtImage item={item} src={item.backdropUrl} variant="backdrop" />
          </div>
        ))}
        <div className="hero__shade" />
      </div>

      <div className="container hero__layout">
        {/* `key` re-mounts the content on each slide so its entrance animation replays. */}
        <div className="hero__content" key={`${current.mediaType}-${current.id}`}>
          <p className="hero__kicker">
            <span className="hero__pill">Featured</span>
            {current.mediaType === 'tv' ? 'Series' : 'Movie'}
          </p>
          <h1 className="hero__title">{current.title}</h1>
          <div className="hero__meta">
            <Rating value={current.rating} />
            {current.year && <span>{current.year}</span>}
            {current.mediaType === 'tv'
              ? formatSeasons(current.seasons) && <span>{formatSeasons(current.seasons)}</span>
              : formatRuntime(current.runtime) && <span>{formatRuntime(current.runtime)}</span>}
            {current.genres.slice(0, 3).map((g) => (
              <span key={g} className="hero__genre">{g}</span>
            ))}
          </div>
          <p className="hero__overview">{current.overview}</p>
          <div className="hero__actions">
            <Link to={titlePath(current)} className="btn btn--primary">
              <Icon name="info" size={18} /> View details
            </Link>
            <a href={trailerUrl(current)} target="_blank" rel="noreferrer" className="btn btn--ghost">
              <Icon name="play" size={16} /> Trailer
            </a>
            <WatchlistButton item={current} />
          </div>
        </div>

        <Link to={titlePath(current)} className="hero__poster" key={`poster-${current.id}`} aria-hidden="true" tabIndex={-1}>
          <ArtImage item={current} src={current.posterUrl} />
        </Link>
      </div>

      <div className="container hero__dots" role="tablist" aria-label="Choose featured title">
        {items.map((item, i) => (
          <button
            key={item.id}
            role="tab"
            aria-selected={i === index}
            aria-label={`Show ${item.title}`}
            className={`hero__dot ${i === index ? 'is-active' : ''} ${paused ? 'is-paused' : ''}`}
            onClick={() => setIndex(i)}
            style={{ '--duration': `${ROTATE_MS}ms` }}
          >
            <span />
          </button>
        ))}
      </div>
    </section>
  );
}
