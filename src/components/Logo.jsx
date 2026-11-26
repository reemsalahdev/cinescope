// The CineScope mark: a camera lens / aperture ring in the brand gradient.
export default function Logo({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <defs>
        <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd27a" />
          <stop offset="1" stopColor="#ff7a59" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="16" fill="none" stroke="url(#logo-g)" strokeWidth="4" />
      <circle cx="20" cy="20" r="6" fill="url(#logo-g)" />
      <circle cx="29" cy="11" r="2.2" fill="#fff4dc" />
    </svg>
  );
}
