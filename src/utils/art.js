/**
 * Helpers for the locally generated poster art.
 * The same title always gets the same colors and motif, because everything is
 * derived from a hash of its id + title (no randomness at render time).
 */

// Hand-picked duotone palettes: [deep background, mid tone, light accent].
const PALETTES = [
  ['#1b1035', '#5b2a86', '#ffb86b'],
  ['#071e2b', '#11698e', '#f6d365'],
  ['#0f2027', '#2c5364', '#7fffd4'],
  ['#231942', '#9f86c0', '#ffe5d9'],
  ['#1a1a2e', '#d6336c', '#f8e9a1'],
  ['#132a13', '#4f772d', '#ecf39e'],
  ['#2d1e2f', '#f28f3b', '#ffd5c2'],
  ['#03045e', '#0077b6', '#90e0ef'],
  ['#3d0e2a', '#c9184a', '#ffccd5'],
  ['#1e1b18', '#a47148', '#f3d5b5'],
  ['#10002b', '#7b2cbf', '#c8b6ff'],
  ['#0d1b2a', '#e07a5f', '#f2cc8f'],
];

export const MOTIFS = ['sun', 'rings', 'peaks', 'beams', 'orbit'];

// djb2 string hash -> positive 32-bit integer.
export function hashString(text) {
  let hash = 5381;
  for (let i = 0; i < text.length; i++) hash = (hash * 33) ^ text.charCodeAt(i);
  return hash >>> 0;
}

// Tiny seeded random generator (mulberry32) so "random" stars are stable.
export function seededRandom(seed) {
  let t = seed;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function artFor(item) {
  const hash = hashString(`${item.mediaType}-${item.id}-${item.title}`);
  const [bg, mid, accent] = PALETTES[hash % PALETTES.length];
  return {
    hash,
    bg,
    mid,
    accent,
    motif: MOTIFS[(hash >>> 4) % MOTIFS.length],
    angle: 140 + ((hash >>> 8) % 80), // gradient direction in degrees
  };
}
