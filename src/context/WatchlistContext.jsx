import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

const WatchlistContext = createContext(null);

// Movies and TV shows can share numeric ids on TMDB, so the key includes the type.
const keyOf = (item) => `${item.mediaType}-${item.id}`;

export function WatchlistProvider({ children }) {
  const [items, setItems] = useLocalStorage('cinescope:watchlist', []);

  const isSaved = (item) => items.some((saved) => keyOf(saved) === keyOf(item));

  const remove = (item) => setItems((list) => list.filter((saved) => keyOf(saved) !== keyOf(item)));

  const add = (item) => {
    // Store only what the cards need, not the whole details object (cast, similar...).
    const { id, mediaType, title, year, genres, rating, posterUrl, backdropUrl } = item;
    setItems((list) => [
      { id, mediaType, title, year, genres, rating, posterUrl, backdropUrl, addedAt: Date.now() },
      ...list,
    ]);
  };

  const toggle = (item) => (isSaved(item) ? remove(item) : add(item));

  return (
    <WatchlistContext.Provider value={{ items, isSaved, toggle, remove }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (!context) throw new Error('useWatchlist must be used inside <WatchlistProvider>');
  return context;
}
