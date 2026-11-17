import { createContext, useContext, useMemo } from "react";
import { QR_ROWS } from "../content/qr.js";
import { SITE_URL } from "../content/site.js";
import { refsFor } from "../content/sources.js";

/* ---------- Icons: small stroke set drawn for this deck ---------- */
const ICONS = {
  chevL: <path d="M15 18l-6-6 6-6" />,
  chevR: <path d="M9 6l6 6-6 6" />,
  grid: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />,
  notes: <path d="M5 4h14v16H5zM9 9h6M9 13h6M9 17h3" />,
  expand: <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  shield: <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.500-7-9V6zM9 12l2.200 2.200L15.500 10" />,
  sprout: <path d="M12 21v-9M12 13c0-4-3-6-7-6 0 4 3 6 7 6zM12 11c0-3 2.500-5 6-5 0 3-2.500 5-6 5z" />,
  cup: <path d="M6.500 9h11l-1.100 10.200a2 2 0 0 1-2 1.800H9.600a2 2 0 0 1-2-1.800zM5 5.500h14V9H5zM8 5.500l1-2.500h6l1 2.500" />,
  qr: (
    <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2.500v2.500H14zM17.500 17.500H20V20h-2.500zM14 20h.010M20 14h.010" />
  ),
  heart: <path d="M12 20s-7-4.400-7-10a4 4 0 0 1 7-2.600A4 4 0 0 1 19 10c0 5.600-7 10-7 10z" />,
  message: <path d="M4 5h16v11H10l-5 4v-4H4z" />,
  coin: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10M14.500 9.500c-.500-.900-1.400-1.300-2.500-1.300-1.400 0-2.500.700-2.500 1.900 0 2.500 5 1.300 5 3.800 0 1.200-1.100 1.900-2.500 1.900-1.100 0-2-.400-2.500-1.300" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  eyeOff: (
    <path d="M3 3l18 18M10.600 6.200A9.700 9.700 0 0 1 12 6c5 0 8.500 4 9.500 6-.400.800-1.200 2-2.400 3.100M6.500 7.600C4.600 8.900 3.200 10.700 2.500 12c1 2 4.500 6 9.500 6 1.400 0 2.600-.300 3.700-.800M9.900 9.900a3 3 0 0 0 4.200 4.200" />
  ),
  alert: <path d="M12 4l9 16H3zM12 10v5M12 17.600v.100" />,
  flame: <path d="M12 3c1 3 4.500 4.500 4.500 9a4.500 4.500 0 0 1-9 0c0-1.600.700-2.800 1.500-3.600C9.500 9.700 11 7 12 3zM8 21h8" />,
  ship: <path d="M3 16l1.500 4h15L21 16zM6 16v-6h8l3 6M10 10V6h3v4" />,
  store: (
    <path d="M4 9l1.500-5h13L20 9M5 9v11h14V9M4 9a2.700 2.700 0 0 0 5.300 0 2.700 2.700 0 0 0 5.400 0A2.700 2.700 0 0 0 20 9M9.500 20v-6h5v6" />
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.500-4 4.500-6 8-6s6.500 2 8 6" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.500" />
      <path d="M2.500 20c1-3.500 3.500-5.500 6.500-5.500s5.500 2 6.500 5.500M16 4.800a3.500 3.500 0 0 1 0 6.400M18 14.800c1.800.800 3 2.600 3.600 5.200" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
      <circle cx="12" cy="13" r="3.500" />
    </>
  ),
  receipt: <path d="M6 3h12v18l-2-1.500L14 21l-2-1.500L10 21l-2-1.500L6 21zM9 8h6M9 12h6" />,
  loop: <path d="M4 12a8 8 0 0 1 14-5.300L20 9M20 4v5h-5M20 12a8 8 0 0 1-14 5.300L4 15M4 20v-5h5" />,
  ledger: <path d="M3 9h5v6H3zM9.500 9h5v6h-5zM16 9h5v6h-5zM8 12h1.500M14.500 12H16" />,
  phone: (
    <>
      <rect x="7" y="3" width="10" height="18" rx="2.500" />
      <path d="M11 17.500h2" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-6-5.500-6-11a6 6 0 0 1 12 0c0 5.500-6 11-6 11z" />
      <circle cx="12" cy="10" r="2.200" />
    </>
  ),
  star: <path d="M12 4l2.400 5 5.500.700-4 3.800 1 5.500-4.900-2.700L7.100 19l1-5.500-4-3.800 5.500-.700z" />,
  scale: <path d="M12 4v16M6 20h12M5 8h14M5 8l-2.500 6a2.800 2.800 0 0 0 5 0zM19 8l-2.500 6a2.800 2.800 0 0 0 5 0z" />,
  handshake: (
    <path d="M3 8l4-2 5 2 5-2 4 2v7l-3 1M3 8v7l3 1M8.500 13.500L12 10l5.500 5.500-2 2-1.500-1.500-2 2-4-4M6 16l3 3" />
  ),
  chip: (
    <>
      <rect x="7" y="7" width="10" height="10" rx="1.500" />
      <path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4" />
    </>
  ),
  cloud: <path d="M7 18a4 4 0 0 1-.500-8A6 6 0 0 1 18 9.500 4.500 4.500 0 0 1 17.500 18z" />,
  sliders: <path d="M5 6h8M17 6h2M5 12h2M11 12h8M5 18h10M19 18h0M15 4v4M9 10v4M17 16v4" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7.500v.100" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3.200 3 14.800 0 18M12 3c-3 3.200-3 14.800 0 18" />
    </>
  ),
  bell: <path d="M6 16V11a6 6 0 0 1 12 0v5l1.500 2h-15zM10 20h4" />,
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  box: <path d="M4 8l8-4 8 4v8l-8 4-8-4zM4 8l8 4 8-4M12 12v8" />,
  eye: (
    <>
      <path d="M2.500 12c1.600-3.200 5-6 9.500-6s7.900 2.800 9.500 6c-1.600 3.200-5 6-9.500 6s-7.900-2.800-9.500-6z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  bean: (
    <>
      <ellipse cx="12" cy="12" rx="6" ry="8.500" transform="rotate(28 12 12)" />
      <path d="M9.500 5.500c2.600 2.600.200 5.400 2.400 7.200s.300 4.600 2.600 5.800" />
    </>
  ),
  cherry: (
    <>
      <circle cx="8" cy="16" r="4" />
      <circle cx="16.500" cy="15" r="3.500" />
      <path d="M8 12c0-4 3-7 8-8M16.500 11.500c0-3-.500-5.500-.500-7.500" />
    </>
  ),
  truck: <path d="M3 6h11v10H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />,
  translate: <path d="M4 6h9M8.500 4v2M6 6c.500 3.500 3 6 6 7M11.500 6c-.500 3.500-3 6-7 7.500M13 20l4-9 4 9M14.500 17h5" />,
  external: <path d="M14 5h5v5M19 5l-8 8M11 7H6v11h11v-5" />,
  link: <path d="M10 14a4 4 0 0 0 5.700 0l3-3a4 4 0 0 0-5.700-5.700l-1 1M14 10a4 4 0 0 0-5.700 0l-3 3a4 4 0 0 0 5.700 5.700l1-1" />,
};

export function Icon({ name, className = "", title }) {
  const body = ICONS[name];
  if (!body) return null;
  return (
    <svg
      className={`ico ${className}`}
      viewBox="0 0 24 24"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {body}
    </svg>
  );
}

/* ---------- Slide frame ---------- */
// What the deck tells the slide on stage: its rubric section, what it cites, and which step of
// the slide is showing. `setStep` lets a click on the slide move the deck to that step.
export const SlideMeta = createContext({ sectionNo: null, sectionLabel: "", refs: [], footnote: "", step: 0, setStep: () => {} });

/**
 * The step this slide is on, and a setter. Slides with several states (a timeline, a set of
 * tabs) read their selection from here, so the right arrow walks through them in order and a
 * click lands on the same state the arrow would. A slide says how many steps it has with a
 * static `steps` property on its component.
 */
export function useStep() {
  const { step, setStep } = useContext(SlideMeta);
  return [step, setStep];
}

/* One APA reference: *asterisks* in the text become italics, the URL becomes a link. */
function Reference({ text, url }) {
  const parts = text.split("*");
  return (
    <p className="refs__item">
      {parts.map((part, i) => (i % 2 ? <em key={i}>{part}</em> : part))}
      {url && (
        <>
          {" "}
          <a href={url} target="_blank" rel="noopener noreferrer">
            {url}
          </a>
        </>
      )}
    </p>
  );
}

/* Slide footer: the references this slide cites (APA order), then the site address. */
export function Foot({ children }) {
  const { refs, footnote } = useContext(SlideMeta);
  const list = refsFor(refs);
  return (
    <footer className="foot">
      <div className="refs">
        {children}
        {list.map((r) => (
          <Reference key={r.id} text={r.text} url={r.url} />
        ))}
        {footnote && (
          <p className="refs__item">
            <em>Note.</em> {footnote}
          </p>
        )}
      </div>
      <a className="foot__site" href={SITE_URL} target="_blank" rel="noopener noreferrer">
        {SITE_URL}
      </a>
    </footer>
  );
}

export function Slide({ variant = "paper", title, lede, children, className = "", hideHead = false }) {
  const meta = useContext(SlideMeta);
  return (
    <section className={`slide slide--${variant} ${className}`} aria-label={typeof title === "string" ? title : undefined}>
      <header className="slide__head">
        {!hideHead && (
          <p className="sec">
            {meta.sectionNo && <span className="sec__n">{meta.sectionNo}</span>}
            {meta.sectionLabel}
          </p>
        )}
        {!hideHead && title && <h2 className="title">{title}</h2>}
        {!hideHead && lede && <p className="lede">{lede}</p>}
      </header>
      <div className="slide__body">{children}</div>
      <Foot />
    </section>
  );
}

export function Tag({ tone = "", icon, children }) {
  return (
    <span className={`tag ${tone ? `tag--${tone}` : ""}`}>
      {icon && <Icon name={icon} />}
      {children}
    </span>
  );
}

export function Stamp({ children, style }) {
  return (
    <span className="stamp" style={style}>
      {children}
    </span>
  );
}

/* ---------- QR code: a real, scannable matrix that opens the deck's own address (see site.js) ---------- */
export function QR({ size = 120, fg = "#1f1215", bg = "#ffffff", quiet = 2, title = "QR code that opens this deck" }) {
  const n = QR_ROWS.length;
  const d = useMemo(() => {
    let p = "";
    for (let y = 0; y < n; y++) {
      const row = QR_ROWS[y];
      let x = 0;
      while (x < n) {
        if (row[x] === "1") {
          let w = 1;
          while (x + w < n && row[x + w] === "1") w++;
          p += `M${x + quiet} ${y + quiet}h${w}v1h-${w}z`;
          x += w;
        } else {
          x++;
        }
      }
    }
    return p;
  }, [n, quiet]);
  const total = n + quiet * 2;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${total} ${total}`}
      shapeRendering="crispEdges"
      {...(title ? { role: "img", "aria-label": title } : { "aria-hidden": true })}
    >
      <rect width={total} height={total} fill={bg} />
      <path d={d} fill={fg} />
    </svg>
  );
}

/* ---------- To-go cup with a sleeve; the sleeve can carry the QR ---------- */
export function Cup({ withCode = true, height = 420, sleeve = "#c5162e", label }) {
  const w = (height * 300) / 430;
  return (
    <svg width={w} height={height} viewBox="0 0 300 430" role="img" aria-label={withCode ? "Coffee cup with a QR code on its sleeve" : "Plain coffee cup"}>
      <ellipse cx="150" cy="418" rx="104" ry="9" fill="rgba(0,0,0,0.22)" />
      <path d="M62 34h176l12 26H50z" fill="#e4d9d2" />
      <path d="M30 58h240a10 10 0 0 1 10 10v20H20V68a10 10 0 0 1 10-10z" fill="#f3ebe5" />
      <path d="M20 84h260v6H20z" fill="#d9ccc4" />
      <path d="M38 92h224l-26 308q-1 12-13 12H77q-12 0-13-12z" fill="#fbf7f2" />
      <path d="M206 92h56l-26 308q-1 12-13 12h-36z" fill="#efe6df" />
      <path d="M40.500 172h219l-12.800 150H53.300z" fill={sleeve} />
      <path d="M208 172h51.500l-12.800 150H194z" fill="rgba(0,0,0,0.14)" />
      {withCode ? (
        <g>
          <rect x="97" y="190" width="106" height="106" rx="8" fill="#ffffff" />
          <g transform="translate(102 195)">
            <QR size={96} quiet={1} />
          </g>
          {label !== null && (
            <text x="150" y="312" textAnchor="middle" fontFamily="'Schibsted Grotesk', Arial, sans-serif" fontWeight="600" fontSize="10.500" fill="#ffffff">
              {label || "Scan to meet the grower"}
            </text>
          )}
        </g>
      ) : (
        label !== null && (
          <text x="150" y="254" textAnchor="middle" fontFamily="'Schibsted Grotesk', Arial, sans-serif" fontWeight="600" fontSize="15" fill="rgba(255,255,255,0.85)">
            {label || "coffee"}
          </text>
        )
      )}
    </svg>
  );
}

/* ---------- Thermal receipt, the farmer's proof of payment ---------- */
export function Receipt({ head, rows, stamp, style, className = "" }) {
  return (
    <div className={`receipt ${className}`} style={style}>
      {head && <div className="receipt__head">{head}</div>}
      {rows.map((r, i) =>
        r === "-" ? (
          <div className="receipt__rule" key={i} />
        ) : (
          <div className="receipt__row" key={i}>
            <span>{r[0]}</span>
            <b>{r[1]}</b>
          </div>
        )
      )}
      {stamp && (
        <span className="receipt__stamp">
          <Stamp>{stamp}</Stamp>
        </span>
      )}
    </div>
  );
}
