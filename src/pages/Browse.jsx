import { useSearchParams } from 'react-router-dom';
import { api, DECADE_OPTIONS, SORT_OPTIONS } from '../api/index.js';
import { useFetch } from '../hooks/useFetch.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import Icon from '../components/Icon.jsx';
import TitleGrid from '../components/TitleGrid.jsx';
import StateMessage from '../components/StateMessage.jsx';
import { GridSkeleton } from '../components/Skeletons.jsx';
import './Browse.css';

const RATING_OPTIONS = [6, 7, 8, 8.5];

export default function Browse() {
  // All filters live in the URL (?type=tv&genre=Drama...), so a filtered view
  // can be bookmarked or shared, and the back button works as expected.
  const [params, setParams] = useSearchParams();
  const filters = {
    mediaType: params.get('type') === 'tv' ? 'tv' : 'movie',
    genre: params.get('genre') || '',
    decade: Number(params.get('decade')) || null,
    minRating: Number(params.get('rating')) || null,
    sort: params.get('sort') || 'popular',
  };

  useDocumentTitle(filters.genre ? `${filters.genre} ${filters.mediaType === 'tv' ? 'series' : 'movies'}` : 'Browse');

  const genres = useFetch(() => api.getGenres(filters.mediaType), [filters.mediaType]);
  const results = useFetch(
    () => api.discover(filters),
    [filters.mediaType, filters.genre, filters.decade, filters.minRating, filters.sort]
  );

  // Update one URL param; an empty value removes it to keep URLs tidy.
  const setFilter = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const hasFilters = filters.genre || filters.decade || filters.minRating || filters.sort !== 'popular';
  const clearFilters = () => setParams(filters.mediaType === 'tv' ? { type: 'tv' } : {}, { replace: true });

  return (
    <div className="page container browse">
      <header className="page-header browse__header">
        <div>
          <p className="page-eyebrow">Browse</p>
          <h1 className="page-title">
            {filters.genre || 'Everything'}{' '}
            <span className="browse__title-type">{filters.mediaType === 'tv' ? 'series' : 'movies'}</span>
          </h1>
        </div>

        <div className="segmented" role="group" aria-label="Media type">
          {[
            ['movie', 'Movies'],
            ['tv', 'Series'],
          ].map(([value, label]) => (
            <button
              key={value}
              className={filters.mediaType === value ? 'is-active' : ''}
              aria-pressed={filters.mediaType === value}
              onClick={() => setFilter('type', value === 'tv' ? 'tv' : '')}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <div className="browse__filters">
        <div className="browse__genres" aria-label="Genres">
          <button className={`chip ${!filters.genre ? 'is-active' : ''}`} onClick={() => setFilter('genre', '')}>
            All genres
          </button>
          {genres.data?.map((genre) => (
            <button
              key={genre}
              className={`chip ${filters.genre === genre ? 'is-active' : ''}`}
              onClick={() => setFilter('genre', genre)}
              aria-pressed={filters.genre === genre}
            >
              {genre}
            </button>
          ))}
        </div>

        <div className="browse__selects">
          <Icon name="sliders" className="browse__sliders" />
          <label className="select">
            <span>Year</span>
            <select value={filters.decade ?? ''} onChange={(e) => setFilter('decade', e.target.value)}>
              <option value="">Any year</option>
              {DECADE_OPTIONS.map((d) => (
                <option key={d} value={d}>{d}s</option>
              ))}
            </select>
          </label>
          <label className="select">
            <span>Rating</span>
            <select value={filters.minRating ?? ''} onChange={(e) => setFilter('rating', e.target.value)}>
              <option value="">Any rating</option>
              {RATING_OPTIONS.map((r) => (
                <option key={r} value={r}>{r}+ ★</option>
              ))}
            </select>
          </label>
          <label className="select">
            <span>Sort</span>
            <select value={filters.sort} onChange={(e) => setFilter('sort', e.target.value === 'popular' ? '' : e.target.value)}>
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
          {hasFilters && (
            <button className="browse__reset" onClick={clearFilters}>
              Reset
            </button>
          )}
        </div>
      </div>

      {results.loading && <GridSkeleton count={12} />}

      {results.error && (
        <StateMessage
          icon={<Icon name="info" size={30} />}
          title="Couldn't load titles"
          action={<button className="btn btn--primary" onClick={results.retry}>Try again</button>}
        >
          The movie database didn't respond. Please try again in a moment.
        </StateMessage>
      )}

      {results.data?.length === 0 && (
        <StateMessage
          icon={<Icon name="sliders" size={30} />}
          title="No titles match"
          action={<button className="btn btn--ghost" onClick={clearFilters}>Clear filters</button>}
        >
          Try loosening a filter — a wider year range or a lower rating usually helps.
        </StateMessage>
      )}

      {results.data?.length > 0 && (
        <>
          <p className="browse__count">
            {results.data.length} title{results.data.length === 1 ? '' : 's'}
          </p>
          <TitleGrid items={results.data} />
        </>
      )}
    </div>
  );
}
