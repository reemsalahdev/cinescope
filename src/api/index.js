/**
 * The single entry point components use to load data.
 *
 * Both data sources (TMDB and the local demo dataset) export the SAME functions
 * and return the SAME normalized object shape, so components never need to know
 * where the data came from:
 *
 *   getFeatured()                  -> Title[]   (for the home hero)
 *   getTrending()                  -> Title[]
 *   getTopRated()                  -> Title[]
 *   getByGenre(genreName)          -> Title[]
 *   getGenres(mediaType)           -> string[]  ('movie' | 'tv')
 *   searchTitles(query)            -> Title[]
 *   discover({ mediaType, genre, decade, minRating, sort }) -> Title[]
 *   getDetails(mediaType, id)      -> Title with { cast, similar }
 *
 * A normalized Title looks like:
 *   { id, mediaType, title, year, genres: string[], rating, overview,
 *     posterUrl, backdropUrl, runtime?, seasons?, director?, creator?, tagline? }
 */
import * as tmdb from './tmdb.js';
import * as demo from './demo.js';

// No key in .env -> automatically fall back to the demo dataset.
export const isDemoMode = !import.meta.env.VITE_TMDB_API_KEY;

export const api = isDemoMode ? demo : tmdb;

export const SORT_OPTIONS = [
  { value: 'popular', label: 'Most popular' },
  { value: 'rating', label: 'Highest rated' },
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'title', label: 'Title A–Z' },
];

export const DECADE_OPTIONS = [2020, 2010, 2000, 1990, 1980, 1970];

export { NotFoundError } from './errors.js';
