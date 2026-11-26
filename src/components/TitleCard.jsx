import { Link } from 'react-router-dom';
import ArtImage from './ArtImage.jsx';
import Rating from './Rating.jsx';
import WatchlistButton from './WatchlistButton.jsx';
import { titlePath } from '../utils/format.js';
import './TitleCard.css';

export default function TitleCard({ item }) {
  return (
    <article className="card">
      <Link to={titlePath(item)} className="card__link">
        <div className="card__poster">
          <ArtImage item={item} src={item.posterUrl} alt={`${item.title} poster`} />
          <div className="card__shine" />
          <Rating value={item.rating} className="card__rating" />
        </div>
        <h3 className="card__title">{item.title}</h3>
        <p className="card__meta">
          {item.year ?? '—'} · {item.mediaType === 'tv' ? 'Series' : 'Movie'}
        </p>
      </Link>
      {/* The button lives outside the <Link> because buttons can't be nested in links. */}
      <WatchlistButton item={item} compact className="card__save" />
    </article>
  );
}
