import { useWatchlist } from '../context/WatchlistContext.jsx';
import Icon from './Icon.jsx';

/**
 * Add/remove toggle used on cards, the hero and the detail page.
 * `compact` renders a small round icon button (for cards).
 */
export default function WatchlistButton({ item, compact = false, className = '' }) {
  const { isSaved, toggle } = useWatchlist();
  const saved = isSaved(item);
  const label = saved ? `Remove ${item.title} from watchlist` : `Add ${item.title} to watchlist`;

  const handleClick = (event) => {
    event.preventDefault(); // cards sit next to links; never trigger navigation
    toggle(item);
  };

  if (compact) {
    return (
      <button
        className={`watch-btn-compact ${saved ? 'is-saved' : ''} ${className}`}
        onClick={handleClick}
        aria-label={label}
        aria-pressed={saved}
        title={saved ? 'In your watchlist' : 'Add to watchlist'}
      >
        <Icon name={saved ? 'bookmarkFilled' : 'bookmark'} size={17} />
      </button>
    );
  }

  return (
    <button
      className={`btn btn--ghost ${saved ? 'is-saved' : ''} ${className}`}
      onClick={handleClick}
      aria-pressed={saved}
      aria-label={label}
    >
      <Icon name={saved ? 'bookmarkFilled' : 'bookmark'} size={18} />
      {saved ? 'In watchlist' : 'Watchlist'}
    </button>
  );
}
