import { useCallback, useEffect, useState } from 'react';

/**
 * Runs an async function and tracks its { data, loading, error } state.
 *
 * Usage:
 *   const { data, loading, error, retry } = useFetch(() => api.getTrending(), []);
 *
 * `deps` works like useEffect's dependency array: when a value in it changes,
 * the request runs again (e.g. a new search query or a new movie id).
 */
export function useFetch(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  // Bumping this number re-runs the effect, which is how "Try again" works.
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    // If deps change (or the component unmounts) before the request finishes,
    // we ignore the old response so it can't overwrite newer data.
    let ignore = false;
    setState({ data: null, loading: true, error: null });

    fetcher()
      .then((data) => {
        if (!ignore) setState({ data, loading: false, error: null });
      })
      .catch((error) => {
        if (!ignore) setState({ data: null, loading: false, error });
      });

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return { ...state, retry };
}
