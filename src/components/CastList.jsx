import { useState } from 'react';
import { hashString } from '../utils/art.js';
import { initials } from '../utils/format.js';
import './CastList.css';

function Avatar({ person }) {
  const [failed, setFailed] = useState(false);
  // Same name -> same color, so initials avatars look intentional.
  const hue = hashString(person.name) % 360;

  if (person.photoUrl && !failed) {
    return <img className="cast__avatar" src={person.photoUrl} alt="" loading="lazy" onError={() => setFailed(true)} />;
  }
  return (
    <div
      className="cast__avatar cast__avatar--initials"
      style={{ background: `linear-gradient(135deg, hsl(${hue} 55% 42%), hsl(${(hue + 50) % 360} 60% 26%))` }}
      aria-hidden="true"
    >
      {initials(person.name)}
    </div>
  );
}

export default function CastList({ cast }) {
  return (
    <ul className="cast">
      {cast.map((person) => (
        <li key={person.name + person.character} className="cast__person">
          <Avatar person={person} />
          <div>
            <p className="cast__name">{person.name}</p>
            {person.character && <p className="cast__character">{person.character}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}
