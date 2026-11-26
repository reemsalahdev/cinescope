import TitleCard from './TitleCard.jsx';

/** Responsive grid of cards used by Search, Browse and Watchlist. */
export default function TitleGrid({ items }) {
  return (
    <div className="title-grid">
      {items.map((item) => (
        <TitleCard key={`${item.mediaType}-${item.id}`} item={item} />
      ))}
    </div>
  );
}
