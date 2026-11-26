import { artFor, seededRandom } from '../utils/art.js';
import './GeneratedArt.css';

/**
 * Draws poster/backdrop art with SVG + CSS so the app looks good without any
 * remote images (demo mode, offline, or when a TMDB image fails to load).
 *
 * variant="poster"   -> 2:3 art with the title typeset on it
 * variant="backdrop" -> wide art without text (the page shows the title itself)
 */
export default function GeneratedArt({ item, variant = 'poster' }) {
  const art = artFor(item);
  const isPoster = variant === 'poster';
  // Poster coordinates are 100x150, backdrop coordinates are 160x90.
  const w = isPoster ? 100 : 160;
  const h = isPoster ? 150 : 90;
  const gradientId = `g-${variant}-${art.hash}`;

  // Long titles (or one very long word like "Oppenheimer") get a smaller font
  // so they fit without breaking in the middle of a word.
  const longestWord = Math.max(...item.title.split(' ').map((word) => word.length));
  const sizeClass =
    item.title.length > 28 || longestWord > 9
      ? 'is-long'
      : item.title.length > 14 || longestWord > 7
        ? 'is-medium'
        : 'is-short';

  return (
    <div
      className={`gen-art gen-art--${variant}`}
      style={{
        '--art-bg': art.bg,
        '--art-mid': art.mid,
        '--art-accent': art.accent,
        background: `linear-gradient(${art.angle}deg, ${art.bg} 15%, ${art.mid} 120%)`,
      }}
      aria-hidden="true"
    >
      <svg className="gen-art__motif" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={art.accent} />
            <stop offset="100%" stopColor={art.mid} />
          </linearGradient>
        </defs>
        <Motif type={art.motif} w={w} h={h} art={art} gradient={`url(#${gradientId})`} />
      </svg>

      {isPoster && (
        <div className="gen-art__text">
          <span className="gen-art__kicker">
            {item.year} · {item.genres?.[0] ?? (item.mediaType === 'tv' ? 'Series' : 'Film')}
          </span>
          <span className={`gen-art__title ${sizeClass}`}>{item.title}</span>
        </div>
      )}
    </div>
  );
}

// Each motif is a simple geometric "poster design". Coordinates scale with w/h.
function Motif({ type, w, h, art, gradient }) {
  const random = seededRandom(art.hash);
  const stars = Array.from({ length: 18 }, () => ({
    x: random() * w,
    y: random() * h * 0.6,
    r: 0.25 + random() * 0.55,
  }));
  const starDots = stars.map((s, i) => (
    <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={art.accent} opacity={0.5} />
  ));
  const size = Math.min(w, h);

  switch (type) {
    case 'sun': {
      // Retro sunset: a big gradient disc sliced by horizontal bars.
      const cx = w * 0.62;
      const cy = h * 0.36;
      const r = size * 0.32;
      return (
        <g>
          {starDots}
          <circle cx={cx} cy={cy} r={r} fill={gradient} />
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x={cx - r}
              y={cy + r * (0.15 + i * 0.22)}
              width={r * 2}
              height={1 + i * 0.9}
              fill={art.bg}
            />
          ))}
        </g>
      );
    }
    case 'rings': {
      const cx = w * 0.7;
      const cy = h * 0.3;
      return (
        <g fill="none" stroke={art.accent}>
          {[0.12, 0.22, 0.34, 0.48, 0.64, 0.82].map((f, i) => (
            <circle key={f} cx={cx} cy={cy} r={size * f} strokeWidth={0.6 + i * 0.15} opacity={0.75 - i * 0.1} />
          ))}
          <circle cx={cx} cy={cy} r={size * 0.06} fill={art.accent} stroke="none" />
        </g>
      );
    }
    case 'peaks':
      return (
        <g>
          {starDots}
          <circle cx={w * 0.28} cy={h * 0.24} r={size * 0.09} fill={art.accent} opacity={0.9} />
          <polygon points={`0,${h * 0.62} ${w * 0.35},${h * 0.36} ${w * 0.62},${h * 0.58} ${w * 0.82},${h * 0.42} ${w},${h * 0.55} ${w},${h} 0,${h}`} fill={art.mid} opacity={0.55} />
          <polygon points={`0,${h * 0.74} ${w * 0.25},${h * 0.55} ${w * 0.5},${h * 0.72} ${w * 0.75},${h * 0.5} ${w},${h * 0.7} ${w},${h} 0,${h}`} fill={art.bg} opacity={0.75} />
          <polygon points={`0,${h * 0.86} ${w * 0.4},${h * 0.7} ${w * 0.7},${h * 0.84} ${w},${h * 0.76} ${w},${h} 0,${h}`} fill={art.bg} />
        </g>
      );
    case 'beams':
      // Projector light fanning out from the top corner.
      return (
        <g>
          {[0, 1, 2, 3, 4].map((i) => (
            <polygon
              key={i}
              points={`${w * 0.95},0 ${w * (0.05 + i * 0.12)},${h} ${w * (0.13 + i * 0.12)},${h}`}
              fill={art.accent}
              opacity={0.07 + i * 0.03}
            />
          ))}
          <circle cx={w * 0.95} cy={0} r={size * 0.12} fill={art.accent} opacity={0.9} />
          {starDots}
        </g>
      );
    case 'orbit':
    default: {
      const cx = w * 0.6;
      const cy = h * 0.34;
      const r = size * 0.2;
      return (
        <g>
          {starDots}
          <circle cx={cx} cy={cy} r={r} fill={gradient} />
          <ellipse
            cx={cx}
            cy={cy}
            rx={r * 1.9}
            ry={r * 0.45}
            fill="none"
            stroke={art.accent}
            strokeWidth={0.9}
            opacity={0.8}
            transform={`rotate(-18 ${cx} ${cy})`}
          />
          <circle cx={w * 0.2} cy={h * 0.5} r={size * 0.025} fill={art.accent} />
        </g>
      );
    }
  }
}
