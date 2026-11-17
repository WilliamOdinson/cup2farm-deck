import { Icon, Slide, Tag, useStep } from "../ui/primitives.jsx";
import { Cols, Strip } from "../ui/layout.jsx";

/* ---------- Sources of data, by what collects it ---------- */
const COLLECTORS = [
  {
    icon: "camera",
    name: "bextmachine",
    where: "Machine vision and AI at the washing station",
    collects: ["Farmer ID", "Weight", "Two photos of every cherry", "Color, brightness, defects", "Predicted cup score"],
    use: "The quality badge and the count of growers on each lot page.",
    status: ["leaf", "In place"],
  },
  {
    icon: "ledger",
    name: "Blockchain ledger",
    where: "Bext360’s licensed platform",
    collects: ["A record per step", "Timestamps", "Payment receipt", "Premium over local price"],
    use: "The journey timeline, the verified ticks and the proof of payment.",
    status: ["leaf", "In place"],
  },
  {
    icon: "users",
    name: "Co-op and exporter",
    where: "Great Lakes Coffee, AFASA",
    collects: ["Member roster", "Lot make-up", "Export papers", "Community projects"],
    use: "Grower profiles shown with consent, fund reports, replies to notes.",
    status: ["ochre", "Needs an agreement"],
  },
  {
    icon: "flame",
    name: "Coda roastery",
    where: "Roasting and quality lab, Denver",
    collects: ["Roast date and batch", "Roast profile", "Cupping notes", "Lot-to-code mapping"],
    use: "Tasting notes and freshness, and the link from a printed code to a lot.",
    status: ["leaf", "In place"],
  },
  {
    icon: "store",
    name: "Cafes and partners",
    where: "Coda’s cafes and wholesale customers",
    collects: ["Venue code on the cup", "Scans per venue"],
    use: "The served-at line, and which partners bring the most engaged drinkers.",
    status: ["cherry", "New"],
  },
  {
    icon: "phone",
    name: "The drinker’s phone",
    where: "Only when the drinker acts",
    collects: ["Lot scanned", "Note", "Tip", "Taste rating", "Email for replies"],
    use: "The passport, growers’ replies, and pooled feedback for farmers and roasters.",
    status: ["cherry", "New"],
  },
];

// One collector per press, from the machine at origin to the drinker's phone.
export function DataSourcesSlide() {
  const [sel, setSel] = useStep();
  const c = COLLECTORS[sel];
  return (
    <Slide title="Every screen runs on data that is already being collected">
      <div className="dmap" data-noswipe>
        <div className="dmap__list" role="group" aria-label="Who collects the data">
          {COLLECTORS.map((k, i) => (
            <button key={k.name} aria-pressed={i === sel} className={`dmap__item ${i === sel ? "is-on" : ""}`} onClick={() => setSel(i)}>
              <Icon name={k.icon} />
              <span>{k.name}</span>
            </button>
          ))}
        </div>
        <div className="dmap__detail card" aria-live="polite">
          <div className="dmap__top">
            <div>
              <h3 className="dmap__name">{c.name}</h3>
              <p className="dmap__where">{c.where}</p>
            </div>
            <Tag tone={c.status[0]}>{c.status[1]}</Tag>
          </div>
          <p className="dmap__label">Collects</p>
          <ul className="dmap__chips">
            {c.collects.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <p className="dmap__label">Used in the app for</p>
          <p className="dmap__use">{c.use}</p>
        </div>
      </div>
    </Slide>
  );
}
DataSourcesSlide.steps = COLLECTORS.length;

/* ---------- Minimal collection from drinkers ---------- */
const FIELDS = [
  { icon: "qr", head: "Lot scanned", text: "which coffee, not who you are" },
  { icon: "pin", head: "Venue code", text: "which cafe’s cup, not your location" },
  { icon: "message", head: "Note", text: "only if you write one" },
  { icon: "coin", head: "Tip", text: "optional, through a payment partner" },
  { icon: "star", head: "Taste rating", text: "optional, used in aggregate" },
  { icon: "bell", head: "Email", text: "only to receive the growers’ reply" },
];

export function SixFieldsSlide() {
  return (
    <Slide title="From drinkers: six fields, and only when they act">
      <div className="fields">
        {FIELDS.map((f) => (
          <div className="fields__item" key={f.head}>
            <Icon name={f.icon} />
            <div>
              <h3>{f.head}</h3>
              <p>{f.text}</p>
            </div>
          </div>
        ))}
      </div>
      <Strip icon="eyeOff">
        <strong>Never collected:</strong> location tracking, advertising IDs, contacts. Never sold. As the lecture puts
        it, “Trust + Value = access to critical user data.”
      </Strip>
    </Slide>
  );
}

/* ---------- What Coda learns ---------- */
const LEARN = [
  {
    icon: "eye",
    head: "Describe",
    text: "Which lots, origins and venues people scan and thank, week by week.",
    tag: "Marketing and brand",
    tagTone: "cherry",
  },
  {
    icon: "target",
    head: "Predict",
    text: "Which coffees drinkers will love next, and how much of each origin to buy.",
    tag: "Sourcing and retail logistics",
    tagTone: "sea",
  },
  {
    icon: "sprout",
    head: "Prescribe",
    text: "What to roast more of, which partners to back, what to coach farmers on.",
    tag: "Quality and partnerships",
    tagTone: "leaf",
  },
];

export function LearnSlide() {
  return (
    <Slide title="What the data lets Coda do">
      <Cols items={LEARN} />
      <Strip icon="loop">The same feedback goes back to the farmers, so the data serves the people it describes.</Strip>
    </Slide>
  );
}
