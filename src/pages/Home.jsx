import { Link } from 'react-router-dom';
import { api } from '../api/index.js';
import { useFetch } from '../hooks/useFetch.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import Hero from '../components/Hero.jsx';
import Row from '../components/Row.jsx';
import { HeroSkeleton } from '../components/Skeletons.jsx';
import './Home.css';

const GENRE_ROWS = [
  { genre: 'Science Fiction', subtitle: 'Other worlds, other times' },
  { genre: 'Animation', subtitle: 'Hand-drawn, stop-motion and pixel-perfect' },
  { genre: 'Crime', subtitle: 'Heists, detectives and bad decisions' },
  { genre: 'Comedy', subtitle: 'Guaranteed to lift your evening' },
];

const QUICK_GENRES = ['Action', 'Drama', 'Thriller', 'Mystery', 'Fantasy', 'Horror', 'Romance', 'Adventure'];

/** A row that loads its own data, so each row shows its own skeleton/error. */
function FetchRow({ title, subtitle, fetcher, seeAllTo }) {
  const { data, loading, error, retry } = useFetch(fetcher, [title]);
  return (
    <Row
      title={title}
      subtitle={subtitle}
      items={data}
      loading={loading}
      error={error}
      onRetry={retry}
      seeAllTo={seeAllTo}
    />
  );
}

export default function Home() {
  useDocumentTitle(null);
  const featured = useFetch(() => api.getFeatured(), []);

  return (
    <div className="home">
      {featured.loading && <HeroSkeleton />}
      {featured.data?.length > 0 && <Hero items={featured.data} />}
      {featured.error && <div className="home__hero-fallback" />}

      <FetchRow title="Trending this week" subtitle="What everyone is watching right now" fetcher={() => api.getTrending()} />
      <FetchRow title="Top rated" subtitle="Critics and audiences agree" fetcher={() => api.getTopRated()} seeAllTo="/browse?sort=rating" />

      <section className="container home__genres">
        <h2 className="home__genres-title">Explore by genre</h2>
        <div className="home__genre-list">
          {QUICK_GENRES.map((genre) => (
            <Link key={genre} to={`/browse?genre=${encodeURIComponent(genre)}`} className="chip">
              {genre}
            </Link>
          ))}
        </div>
      </section>

      {GENRE_ROWS.map(({ genre, subtitle }) => (
        <FetchRow
          key={genre}
          title={genre}
          subtitle={subtitle}
          fetcher={() => api.getByGenre(genre)}
          seeAllTo={`/browse?genre=${encodeURIComponent(genre)}`}
        />
      ))}
    </div>
  );
}
