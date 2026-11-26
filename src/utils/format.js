export function formatRuntime(minutes) {
  if (!minutes) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
}

export function formatSeasons(count) {
  if (!count) return null;
  return `${count} season${count === 1 ? '' : 's'}`;
}

export const titlePath = (item) => `/title/${item.mediaType}/${item.id}`;

export const trailerUrl = (item) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${item.title} ${item.year ?? ''} official trailer`
  )}`;

export const initials = (name) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
