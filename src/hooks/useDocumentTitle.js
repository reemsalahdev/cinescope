import { useEffect } from 'react';

/** Sets the browser tab title, e.g. "Dune: Part Two · CineScope". */
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · CineScope` : 'CineScope — Discover movies & TV';
  }, [title]);
}
