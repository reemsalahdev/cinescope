import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// React Router keeps the scroll position between pages; reset it on navigation
// (but not when only the ?query changes, e.g. while typing a search).
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
