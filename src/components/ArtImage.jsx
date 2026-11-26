import { useState } from 'react';
import GeneratedArt from './GeneratedArt.jsx';

/**
 * Shows a real image when we have a URL, with generated art underneath.
 * - No URL (demo mode)      -> generated art only
 * - Image still loading     -> generated art is visible, image fades in on load
 * - Image fails (blocked/404) -> we drop the <img> and keep the generated art
 */
export default function ArtImage({ item, src, variant = 'poster', alt = '' }) {
  const [status, setStatus] = useState('loading'); // 'loading' | 'loaded' | 'error'
  const showImage = src && status !== 'error';

  return (
    <>
      {status !== 'loaded' && <GeneratedArt item={item} variant={variant} />}
      {showImage && (
        <img
          className={`art-image ${status === 'loaded' ? 'is-loaded' : ''}`}
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
        />
      )}
    </>
  );
}
