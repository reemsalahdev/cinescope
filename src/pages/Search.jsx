import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api/index.js';
import { useFetch } from '../hooks/useFetch.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import Icon from '../components/Icon.jsx';
import TitleGrid from '../components/TitleGrid.jsx';
import StateMessage from '../components/StateMessage.jsx';
import { GridSkeleton } from '../components/Skeletons.jsx';
import './Search.css';

const SUGGESTIONS = ['Dune', 'Nolan', 'Pedro Pascal', 'Godfather', 'Spider-Man', 'Severance'];

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  // The input updates instantly; the URL and the request use the debounced value.
  const [input, setInput] = useState(searchParams.get('q') ?? '');
  const query = useDebounce(input.trim(), 400);
  const inputRef = useRef(null);

  useDocumentTitle(query ? `“${query}”` : 'Search');

  // Focus the box when the page opens so you can type straight away.
  useEffect(() => inputRef.current?.focus(), []);

  // Keep ?q= in the URL so searches can be shared and survive a refresh.
  // `replace` avoids adding a history entry for every pause in typing.
  useEffect(() => {
    setSearchParams(query ? { q: query } : {}, { replace: true });
  }, [query, setSearchParams]);

  const { data, loading, error, retry } = useFetch(
    () => (query ? api.searchTitles(query) : Promise.resolve([])),
    [query]
  );

  const isTyping = input.trim() !== query;

  return (
    <div className="page container search">
      <header className="page-header">
        <p className="page-eyebrow">Search</p>
        <h1 className="page-title">Find your next obsession</h1>
      </header>

      <form className="search__box" onSubmit={(e) => e.preventDefault()} role="search">
        <Icon name="search" size={22} className="search__icon" />
        <label htmlFor="search-input" className="visually-hidden">Search movies and TV shows</label>
        <input
          id="search-input"
          ref={inputRef}
          type="search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search titles, actors, directors…"
          autoComplete="off"
        />
        {(isTyping || (loading && query)) && <span className="search__spinner" aria-label="Searching" />}
        {input && !isTyping && !loading && (
          <button type="button" className="search__clear" onClick={() => setInput('')} aria-label="Clear search">
            <Icon name="close" size={18} />
          </button>
        )}
      </form>

      {!query && (
        <div className="search__suggestions">
          <span>Try:</span>
          {SUGGESTIONS.map((s) => (
            <button key={s} className="chip" onClick={() => setInput(s)}>
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="search__results">
        {query && loading && <GridSkeleton count={6} />}

        {error && (
          <StateMessage
            icon={<Icon name="info" size={30} />}
            title="Something went wrong"
            action={<button className="btn btn--primary" onClick={retry}>Try again</button>}
          >
            We couldn't reach the movie database. Check your connection and try again.
          </StateMessage>
        )}

        {query && !loading && !error && data.length === 0 && (
          <StateMessage icon={<Icon name="search" size={30} />} title="No matches">
            Nothing found for “{query}”. Try a different spelling or a broader term.
          </StateMessage>
        )}

        {query && !loading && data?.length > 0 && (
          <>
            <p className="search__count">
              {data.length} result{data.length === 1 ? '' : 's'} for <strong>“{query}”</strong>
            </p>
            <TitleGrid items={data} />
          </>
        )}

        {!query && (
          <StateMessage icon={<Icon name="search" size={30} />} title="Start typing to search">
            Look up a movie or show by name — or search by an actor or director you love.
          </StateMessage>
        )}
      </div>
    </div>
  );
}
