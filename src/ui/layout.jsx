import { Icon, Tag } from "./primitives.jsx";

/* Parallel points under a top rule. items: [{ icon?, head, text, tag?, tagTone? }] */
export function Cols({ items, n, className = "" }) {
  return (
    <div className={`cols ${className}`} style={{ "--n": n || items.length }}>
      {items.map((it) => (
        <div className="col" key={it.head}>
          {it.icon && <Icon name={it.icon} className="col__ico" />}
          <h3 className="col__head">{it.head}</h3>
          <p className="col__text">{it.text}</p>
          {it.tag && (
            <p className="col__tag">
              <Tag tone={it.tagTone}>{it.tag}</Tag>
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

/* Large icon rows. items: [{ icon, head, text }] */
export function Rows({ items, n = 1, className = "" }) {
  return (
    <div className={`rows ${className}`} style={{ "--n": n }}>
      {items.map((it) => (
        <div className="row" key={it.head}>
          <span className="row__ico">
            <Icon name={it.icon} />
          </span>
          <span>
            <span className="row__head">{it.head}</span>
            {it.text && <span className="row__text">{it.text}</span>}
          </span>
        </div>
      ))}
    </div>
  );
}

/* One takeaway pinned to the bottom of a slide. */
export function Strip({ icon, children, plain = false }) {
  return (
    <p className={`strip ${plain ? "strip--plain" : ""}`}>
      {icon && <Icon name={icon} />}
      <span>{children}</span>
    </p>
  );
}

/* Headline number. The number uses the body sans, never the display face. */
export function Stat({ theme, value, label, note, src }) {
  return (
    <div className="stat">
      {theme && <p className="stat__theme">{theme}</p>}
      <p className="stat__num">{value}</p>
      <p className="stat__label">{label}</p>
      {note && <p className="stat__note">{note}</p>}
      {src && <p className="stat__src">{src}</p>}
    </div>
  );
}
