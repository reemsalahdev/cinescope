import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import TitleCard from './TitleCard.jsx';
import { CardSkeleton } from './Skeletons.jsx';
import Icon from './Icon.jsx';
import './Row.css';

/** A titled, horizontally scrolling list of cards with arrow buttons. */
export default function Row({ title, subtitle, items, loading, error, onRetry, seeAllTo }) {
  const scrollerRef = useRef(null);
  const [canScroll, setCanScroll] = useState({ left: false, right: false });

  // Enable/disable each arrow depending on where the list is scrolled to.
  const updateArrows = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScroll({
      left: el.scrollLeft > 4,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    });
  };

  useEffect(() => {
    updateArrows();
    window.addEventListener('resize', updateArrows);
    return () => window.removeEventListener('resize', updateArrows);
  }, [items]);

  // Scroll by ~one "page" of cards.
  const scroll = (direction) => {
    const el = scrollerRef.current;
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: 'smooth' });
  };

  if (!loading && !error && items?.length === 0) return null;

  return (
    <section className="row">
      <div className="row__header container">
        <div>
          <h2 className="row__title">{title}</h2>
          {subtitle && <p className="row__subtitle">{subtitle}</p>}
        </div>
        <div className="row__controls">
          {seeAllTo && (
            <Link to={seeAllTo} className="row__see-all">
              See all
            </Link>
          )}
          <button className="icon-btn" onClick={() => scroll(-1)} disabled={!canScroll.left} aria-label={`Scroll ${title} left`}>
            <Icon name="chevronLeft" />
          </button>
          <button className="icon-btn" onClick={() => scroll(1)} disabled={!canScroll.right} aria-label={`Scroll ${title} right`}>
            <Icon name="chevronRight" />
          </button>
        </div>
      </div>

      {error ? (
        <div className="container row__error">
          Couldn't load this row. <button className="link-btn" onClick={onRetry}>Try again</button>
        </div>
      ) : (
        <div className="row__scroller" ref={scrollerRef} onScroll={updateArrows}>
          {loading
            ? Array.from({ length: 8 }, (_, i) => <CardSkeleton key={i} />)
            : items.map((item) => <TitleCard key={`${item.mediaType}-${item.id}`} item={item} />)}
        </div>
      )}
    </section>
  );
}
