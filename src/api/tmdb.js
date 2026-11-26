/**
 * TMDB data source (https://www.themoviedb.org/documentation/api).
 * Every function converts TMDB's raw JSON into our normalized "Title" shape
 * (see api/index.js) so the UI code stays identical in demo mode.
 */
import { NotFoundError } from './errors.js';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p';

async function request(path, params = {}) {
  const url = new URL(BASE_URL + path);
  url.searchParams.set('api_key', API_KEY);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, value);
  });

  const res = await fetch(url);
  if (res.status === 404) throw new NotFoundError();
  if (!res.ok) throw new Error(`TMDB request failed (${res.status})`);
  return res.json();
}

// --- Genres ---------------------------------------------------------------
// TMDB returns genre *ids* on list results, so we load the id -> name maps once
// and cache the promise (later calls reuse it instead of refetching).
let genreMapsPromise = null;

function getGenreMaps() {
  if (!genreMapsPromise) {
    genreMapsPromise = Promise.all([request('/genre/movie/list'), request('/genre/tv/list')]).then(
      ([movie, tv]) => ({
        movie: new Map(movie.genres.map((g) => [g.id, g.name])),
        tv: new Map(tv.genres.map((g) => [g.id, g.name])),
      })
    );
    // If it failed, allow a retry next time instead of caching the error.
    genreMapsPromise.catch(() => (genreMapsPromise = null));
  }
  return genreMapsPromise;
}

async function genreIdFor(mediaType, name) {
  const maps = await getGenreMaps();
  for (const [id, genreName] of maps[mediaType]) if (genreName === name) return id;
  return undefined;
}

// --- Normalizing ---------------------------------------------------------
function normalize(raw, mediaType, genreMaps) {
  const type = raw.media_type || mediaType;
  const date = raw.release_date || raw.first_air_date || '';
  const genres = raw.genres
    ? raw.genres.map((g) => g.name)
    : (raw.genre_ids || []).map((id) => genreMaps?.[type]?.get(id)).filter(Boolean);

  return {
    id: raw.id,
    mediaType: type,
    title: raw.title || raw.name,
    year: date ? Number(date.slice(0, 4)) : null,
    genres,
    rating: Math.round((raw.vote_average || 0) * 10) / 10,
    overview: raw.overview,
    posterUrl: raw.poster_path ? `${IMAGE_URL}/w500${raw.poster_path}` : null,
    backdropUrl: raw.backdrop_path ? `${IMAGE_URL}/w1280${raw.backdrop_path}` : null,
    runtime: raw.runtime || raw.episode_run_time?.[0] || null,
    seasons: raw.number_of_seasons || null,
    tagline: raw.tagline || null,
  };
}

async function normalizeList(results, mediaType) {
  const maps = await getGenreMaps();
  return results
    .filter((r) => (r.media_type ? ['movie', 'tv'].includes(r.media_type) : true))
    .map((r) => normalize(r, mediaType, maps));
}

// --- Public API (same names as demo.js) -----------------------------------
export async function getTrending() {
  const data = await request('/trending/all/week');
  return normalizeList(data.results);
}

export async function getFeatured() {
  const list = await getTrending();
  // Only titles with a backdrop look good in the big hero.
  return list.filter((t) => t.backdropUrl).slice(0, 5);
}

export async function getTopRated() {
  const data = await request('/movie/top_rated');
  return normalizeList(data.results, 'movie');
}

export async function getByGenre(genre) {
  return discover({ mediaType: 'movie', genre });
}

export async function getGenres(mediaType = 'movie') {
  const maps = await getGenreMaps();
  return [...maps[mediaType].values()].sort();
}

export async function searchTitles(query) {
  if (!query.trim()) return [];
  const data = await request('/search/multi', { query, include_adult: false });
  return normalizeList(data.results);
}

export async function discover({ mediaType = 'movie', genre, decade, minRating, sort = 'popular' }) {
  const isMovie = mediaType === 'movie';
  const dateField = isMovie ? 'primary_release_date' : 'first_air_date';
  const today = new Date().toISOString().slice(0, 10);

  const sortParams = {
    popular: { sort_by: 'popularity.desc' },
    rating: { sort_by: 'vote_average.desc', 'vote_count.gte': 300 },
    newest: { sort_by: `${dateField}.desc`, [`${dateField}.lte`]: today },
    oldest: { sort_by: `${dateField}.asc`, 'vote_count.gte': 50 },
    title: { sort_by: isMovie ? 'original_title.asc' : 'name.asc', 'vote_count.gte': 50 },
  }[sort];

  const decadeParams = decade
    ? { [`${dateField}.gte`]: `${decade}-01-01`, [`${dateField}.lte`]: `${decade + 9}-12-31` }
    : {};

  const data = await request(`/discover/${mediaType}`, {
    with_genres: genre ? await genreIdFor(mediaType, genre) : undefined,
    'vote_average.gte': minRating || undefined,
    ...sortParams,
    ...decadeParams,
  });
  return normalizeList(data.results, mediaType);
}

export async function getDetails(mediaType, id) {
  const raw = await request(`/${mediaType}/${id}`, { append_to_response: 'credits,similar' });
  const title = normalize(raw, mediaType);

  const crew = raw.credits?.crew || [];
  return {
    ...title,
    director: crew.find((c) => c.job === 'Director')?.name,
    creator: raw.created_by?.map((c) => c.name).join(', ') || undefined,
    cast: (raw.credits?.cast || []).slice(0, 12).map((c) => ({
      name: c.name,
      character: c.character,
      photoUrl: c.profile_path ? `${IMAGE_URL}/w185${c.profile_path}` : null,
    })),
    similar: await normalizeList(raw.similar?.results || [], mediaType),
  };
}
