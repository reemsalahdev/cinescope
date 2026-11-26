import './Skeletons.css';

// Grey placeholder shapes shown while data loads, shaped like the real content
// so the layout doesn't jump when it arrives.

export function CardSkeleton() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton-card__poster" />
      <div className="skeleton skeleton-line" style={{ width: '80%' }} />
      <div className="skeleton skeleton-line skeleton-line--sm" style={{ width: '45%' }} />
    </div>
  );
}

export function GridSkeleton({ count = 12 }) {
  return (
    <div className="title-grid" aria-busy="true" aria-label="Loading titles">
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="skeleton-hero" aria-busy="true" aria-label="Loading featured titles">
      <div className="container skeleton-hero__content">
        <div className="skeleton skeleton-line" style={{ width: 120 }} />
        <div className="skeleton skeleton-hero__title" />
        <div className="skeleton skeleton-line" style={{ width: '50%' }} />
        <div className="skeleton skeleton-line" style={{ width: '42%' }} />
        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <div className="skeleton skeleton-btn" />
          <div className="skeleton skeleton-btn" />
        </div>
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading title">
      <div className="skeleton skeleton-backdrop" />
      <div className="container skeleton-detail">
        <div className="skeleton skeleton-detail__poster" />
        <div className="skeleton-detail__info">
          <div className="skeleton skeleton-hero__title" />
          <div className="skeleton skeleton-line" style={{ width: '40%' }} />
          <div className="skeleton skeleton-line" style={{ width: '90%' }} />
          <div className="skeleton skeleton-line" style={{ width: '85%' }} />
          <div className="skeleton skeleton-line" style={{ width: '60%' }} />
        </div>
      </div>
    </div>
  );
}
