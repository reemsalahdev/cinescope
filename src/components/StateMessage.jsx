import './StateMessage.css';

/** A friendly centered message for empty results, errors, etc. */
export default function StateMessage({ icon, title, children, action }) {
  return (
    <div className="state-msg" role="status">
      {icon && <div className="state-msg__icon">{icon}</div>}
      <h2 className="state-msg__title">{title}</h2>
      {children && <p className="state-msg__text">{children}</p>}
      {action && <div className="state-msg__action">{action}</div>}
    </div>
  );
}
