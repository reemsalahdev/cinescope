import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, NotFoundError } from '../api/index.js';
import { useFetch } from '../hooks/useFetch.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import ArtImage from '../components/ArtImage.jsx';
import Icon from '../components/Icon.jsx';
import Rating from '../components/Rating.jsx';
import Row from '../components/Row.jsx';
import WatchlistButton from '../components/WatchlistButton.jsx';
import CastList from '../components/CastList.jsx';
import StateMessage from '../components/StateMessage.jsx';
import { DetailSkeleton } from '../components/Skeletons.jsx';
import NotFound from './NotFound.jsx';
import { formatRuntime, formatSeasons, trailerUrl } from '../utils/format.js';
import './Detail.css';

const MEDIA_TYPES = ['movie', 'tv'];

export default function Detail() {
  const { mediaType, id } = useParams();
  const navigate = useNavigate();
  const validType = MEDIA_TYPES.includes(mediaType);

  const { data: item, loading, error, retry } = useFetch(
    () => (validType ? api.getDetails(mediaType, id) : Promise.reject(new NotFoundError())),
    [mediaType, id]
  );

  useDocumentTitle(item?.title);

  if (loading) return <DetailSkeleton />;

  if (error instanceof NotFoundError) {
    return <NotFound title="We couldn't find that title." message="It may have been removed, or the link is incorrect." />;
  }

  if (error) {
    return (
      <div className="page container">
        <StateMessage
          icon={<Icon name="info" size={30} />}
          title="Couldn't load this title"
          action={<button className="btn btn--primary" onClick={retry}>Try again</button>}
        >
          Check your connection and try again.
        </StateMessage>
      </div>
    );
  }

  const length = item.mediaType === 'tv' ? formatSeasons(item.seasons) : formatRuntime(item.runtime);
  const madeBy = item.mediaType === 'tv' ? item.creator : item.director;

  return (
    <article className="detail">
      <div className="detail__backdrop">
        <ArtImage item={item} src={item.backdropUrl} variant="backdrop" />
        <div className="detail__backdrop-shade" />
      </div>

      <div className="container detail__layout">
        <div className="detail__poster">
          <ArtImage item={item} src={item.posterUrl} alt={`${item.title} poster`} />
        </div>

        <div className="detail__info">
          <button className="detail__back" onClick={() => navigate(-1)}>
            <Icon name="arrowLeft" size={16} /> Back
          </button>

          <p className="page-eyebrow">{item.mediaType === 'tv' ? 'Series' : 'Movie'}</p>
          <h1 className="detail__title">{item.title}</h1>
          {item.tagline && <p className="detail__tagline">“{item.tagline}”</p>}

          <div className="detail__meta">
            <Rating value={item.rating} />
            {item.year && <span>{item.year}</span>}
            {length && (
              <span className="detail__length">
                <Icon name="clock" size={15} /> {length}
              </span>
            )}
          </div>

          <div className="detail__genres">
            {item.genres.map((genre) => (
              <Link key={genre} to={`/browse?genre=${encodeURIComponent(genre)}${item.mediaType === 'tv' ? '&type=tv' : ''}`} className="chip">
                {genre}
              </Link>
            ))}
          </div>

          <p className="detail__overview">{item.overview || 'No overview available yet.'}</p>

          {madeBy && (
            <p className="detail__credit">
              <span>{item.mediaType === 'tv' ? 'Created by' : 'Directed by'}</span> {madeBy}
            </p>
          )}

          <div className="detail__actions">
            {/* We link to a YouTube search, which always works without an extra API call. */}
            <a href={trailerUrl(item)} target="_blank" rel="noreferrer" className="btn btn--primary">
              <Icon name="play" size={16} /> Watch trailer
            </a>
            <WatchlistButton item={item} />
          </div>
        </div>
      </div>

      {item.cast.length > 0 && (
        <section className="container detail__section">
          <h2 className="detail__section-title">Top cast</h2>
          <CastList cast={item.cast} />
        </section>
      )}

      {item.similar.length > 0 && <Row title="More like this" items={item.similar} loading={false} />}
    </article>
  );
}
