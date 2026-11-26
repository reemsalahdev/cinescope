/**
 * Demo data source: serves the local JSON dataset through the same functions
 * as tmdb.js. Each call waits a little so loading skeletons are visible,
 * just like a real network request.
 */
import titles from '../data/demo-titles.json';
import { NotFoundError } from './errors.js';

// Fake network latency between 250ms and 550ms.
const wait = () => new Promise((resolve) => setTimeout(resolve, 250 + Math.random() * 300));

// Demo items have no image URLs: the UI draws generated poster art instead.
const normalize = (item) => ({ ...item, posterUrl: null, backdropUrl: null });

const byPopularity = (a, b) => b.popularity - a.popularity;
const byRating = (a, b) => b.rating - a.rating || byPopularity(a, b);

const SORTERS = {
  popular: byPopularity,
  rating: byRating,
  newest: (a, b) => b.year - a.year,
  oldest: (a, b) => a.year - b.year,
  title: (a, b) => a.title.localeCompare(b.title),
};

export async function getFeatured() {
  await wait();
  // A hand-picked mix of movies and shows for the hero carousel.
  const featuredIds = [17, 38, 5, 43, 7];
  return featuredIds.map((id) => normalize(titles.find((t) => t.id === id)));
}

export async function getTrending() {
  await wait();
  return [...titles].sort(byPopularity).slice(0, 16).map(normalize);
}

export async function getTopRated() {
  await wait();
  return [...titles].sort(byRating).slice(0, 16).map(normalize);
}

export async function getByGenre(genre) {
  await wait();
  return titles.filter((t) => t.genres.includes(genre)).sort(byPopularity).map(normalize);
}

export async function getGenres(mediaType) {
  const pool = mediaType ? titles.filter((t) => t.mediaType === mediaType) : titles;
  return [...new Set(pool.flatMap((t) => t.genres))].sort();
}

export async function searchTitles(query) {
  await wait();
  const q = query.trim().toLowerCase();
  if (!q) return [];
  // Match on title first, but also on cast and director so "nolan" works.
  return titles
    .filter((t) =>
      [t.title, t.director, t.creator, ...t.cast].some((field) => field?.toLowerCase().includes(q))
    )
    .sort(byPopularity)
    .map(normalize);
}

export async function discover({ mediaType = 'movie', genre, decade, minRating, sort = 'popular' }) {
  await wait();
  return titles
    .filter((t) => t.mediaType === mediaType)
    .filter((t) => !genre || t.genres.includes(genre))
    .filter((t) => !decade || (t.year >= decade && t.year < decade + 10))
    .filter((t) => !minRating || t.rating >= minRating)
    .sort(SORTERS[sort] ?? byPopularity)
    .map(normalize);
}

export async function getDetails(mediaType, id) {
  await wait();
  const item = titles.find((t) => t.mediaType === mediaType && t.id === Number(id));
  if (!item) throw new NotFoundError(`No ${mediaType} with id ${id}`);

  // "Similar" = other titles ranked by how many genres they share.
  const similar = titles
    .filter((t) => t.id !== item.id)
    .map((t) => ({ t, shared: t.genres.filter((g) => item.genres.includes(g)).length }))
    .filter(({ shared }) => shared > 0)
    .sort((a, b) => b.shared - a.shared || byPopularity(a.t, b.t))
    .slice(0, 12)
    .map(({ t }) => normalize(t));

  return {
    ...normalize(item),
    cast: item.cast.map((name) => ({ name, character: null, photoUrl: null })),
    similar,
  };
}
