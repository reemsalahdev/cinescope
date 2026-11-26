import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import Icon from '../components/Icon.jsx';
import TitleGrid from '../components/TitleGrid.jsx';
import StateMessage from '../components/StateMessage.jsx';
import './Watchlist.css';

const TYPE_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'movie', label: 'Movies' },
  { value: 'tv', label: 'Series' },
];

const SORTS = {
  added: { label: 'Recently added', fn: (a, b) => (b.addedAt ?? 0) - (a.addedAt ?? 0) },
  rating: { label: 'Highest rated', fn: (a, b) => b.rating - a.rating },
  title: { label: 'Title A–Z', fn: (a, b) => a.title.localeCompare(b.title) },
};

export default function Watchlist() {
  useDocumentTitle('Watchlist');
  const { items } = useWatchlist();
  const [type, setType] = useState('all');
  const [sort, setSort] = useState('added');

  // Derived data: computed on each render instead of stored in state.
  const visible = items.filter((item) => type === 'all' || item.mediaType === type).sort(SORTS[sort].fn);
  const movieCount = items.filter((item) => item.mediaType === 'movie').length;

  return (
    <div className="page container watchlist">
      <header className="page-header">
        <p className="page-eyebrow">Your collection</p>
        <h1 className="page-title">Watchlist</h1>
        {items.length > 0 && (
          <p className="page-subtitle">
            {movieCount} movie{movieCount === 1 ? '' : 's'} and {items.length - movieCount} series saved on this device.
          </p>
        )}
      </header>

      {items.length === 0 ? (
        <StateMessage
          icon={<Icon name="bookmark" size={30} />}
          title="Nothing saved yet"
          action={<Link to="/browse" className="btn btn--primary">Discover titles</Link>}
        >
          Tap the bookmark on any poster to save it here for later. Your list is stored in this browser.
        </StateMessage>
      ) : (
        <>
          <div className="watchlist__toolbar">
            <div className="segmented" role="group" aria-label="Filter by type">
              {TYPE_FILTERS.map((f) => (
                <button key={f.value} className={type === f.value ? 'is-active' : ''} aria-pressed={type === f.value} onClick={() => setType(f.value)}>
                  {f.label}
                </button>
              ))}
            </div>
            <label className="select">
              <span>Sort</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                {Object.entries(SORTS).map(([value, { label }]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
          </div>

          {visible.length > 0 ? (
            <TitleGrid items={visible} />
          ) : (
            <StateMessage title="No titles of this type">Switch the filter to see the rest of your list.</StateMessage>
          )}
        </>
      )}
    </div>
  );
}
