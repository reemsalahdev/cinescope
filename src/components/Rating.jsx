import Icon from './Icon.jsx';

export default function Rating({ value, className = '' }) {
  if (!value) return null;
  return (
    <span className={`rating ${className}`} aria-label={`Rated ${value} out of 10`}>
      <Icon name="star" size={13} />
      {value.toFixed(1)}
    </span>
  );
}
