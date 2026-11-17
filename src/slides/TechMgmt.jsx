import { Icon, Slide, Tag, useStep } from "../ui/primitives.jsx";
import { Rows, Strip } from "../ui/layout.jsx";

/* ---------- How it works ---------- */
const FLOW = [
  { icon: "sprout", name: "Farmer", text: "Delivers cherries to the washing station.", tech: ["In place"] },
  {
    icon: "camera",
    name: "bextmachine",
    text: "Two cameras photograph every cherry. AI grades color, brightness and defects, estimates a cup score and prints a receipt.",
    tech: ["Machine vision", "AI", "IoT"],
  },
  {
    icon: "ledger",
    name: "Ledger",
    text: "Each step and each payment becomes a blockchain record that cannot be quietly changed.",
    tech: ["Blockchain", "Bext360 platform"],
  },
  {
    icon: "cloud",
    name: "Coda data layer",
    text: "Links lot to roast batch to printed code. Holds farmer consent and what each viewer may see.",
    tech: ["New", "Permissions"],
  },
  { icon: "qr", name: "Code on the cup", text: "Carries the lot and the venue. It holds nothing about the drinker.", tech: ["New", "Sleeves and bags"] },
  {
    icon: "phone",
    name: "Web app",
    text: "Opens in the phone’s browser. Shows the journey and takes thanks, tips and ratings.",
    tech: ["New", "Web app"],
  },
];

const RETURN_PATH = {
  icon: "heart",
  name: "Return path",
  text: "Notes are translated and read out by the co-op. Tips reach the community fund through a payment partner. Ratings go to the Farm2Cup team.",
  tech: ["New", "Translation", "Mobile money"],
};

// The arrow walks the six nodes left to right; the last press shows the return path.
const RETURN_STEP = FLOW.length;

export function FlowSlide() {
  const [sel, setSel] = useStep();
  const node = sel === RETURN_STEP ? RETURN_PATH : FLOW[sel];
  return (
    <Slide title="How it works: one ledger, two directions">
      <div className="flow" data-noswipe>
        <div className="chain chain--6" role="group" aria-label="System flow">
          {FLOW.map((c, i) => (
            <button key={c.name} aria-pressed={i === sel} className={`chain__node ${i === sel ? "is-on" : ""}`} onClick={() => setSel(i)}>
              <span className="chain__ico">
                <Icon name={c.icon} />
              </span>
              <span className="chain__name">{c.name}</span>
            </button>
          ))}
        </div>
        <div className="flow__back">
          <svg viewBox="0 0 1456 78" aria-hidden="true" preserveAspectRatio="none">
            <defs>
              <marker id="flow-back" viewBox="0 0 12 12" refX="9" refY="6" markerWidth="5" markerHeight="5" orient="auto">
                <path d="M0 0L12 6L0 12z" fill="#c5162e" />
              </marker>
            </defs>
            <path d="M 1334 4 V 40 H 122 V 12" fill="none" stroke="#c5162e" strokeWidth="5" strokeLinejoin="round" markerEnd="url(#flow-back)" />
          </svg>
          <button className={`flow__pill ${sel === RETURN_STEP ? "is-on" : ""}`} onClick={() => setSel(RETURN_STEP)} aria-pressed={sel === RETURN_STEP}>
            <Icon name="heart" /> Return path: thanks, tips, feedback
          </button>
        </div>
        <div className="flow__detail card" aria-live="polite">
          <div>
            <h3 className="flow__name">{node.name}</h3>
            <div className="flow__tags">
              {node.tech.map((t) => (
                <Tag key={t} tone={t === "New" ? "cherry" : t === "In place" ? "leaf" : ""}>
                  {t}
                </Tag>
              ))}
            </div>
          </div>
          <p className="flow__text">{node.text}</p>
        </div>
      </div>
    </Slide>
  );
}
FlowSlide.steps = FLOW.length + 1;

/* ---------- Two technology choices ---------- */
const WEB = ["Opens from a scan, with nothing to install", "No app-store fees or gatekeepers in between", "Replies can still arrive as notifications"];
const AI = ["Grading cherries at origin, where it already works", "Translating notes, checked by a person", "No chatbots, no machine-written farmer stories"];

export function TechChoicesSlide() {
  return (
    <Slide title="Two technology choices">
      <div className="duo">
        <div className="duo__col">
          <h3 className="duo__head">Web app, not native app</h3>
          <ul className="checks">
            {WEB.map((t) => (
              <li key={t}>
                <span className="checks__ico checks__ico--leaf">
                  <Icon name="check" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="duo__col">
          <h3 className="duo__head">AI only where it works</h3>
          <ul className="checks">
            {AI.map((t) => (
              <li key={t}>
                <span className="checks__ico checks__ico--leaf">
                  <Icon name="check" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Slide>
  );
}

/* ---------- What changes inside Coda ---------- */
const CHANGES = [
  { icon: "lock", head: "Own the data", text: "License Bext360 or contract read rights, so a co-op’s license never locks Coda out." },
  { icon: "user", head: "Name two owners", text: "A product owner for the app. A data steward for consent and accuracy." },
  { icon: "store", head: "Equip the front line", text: "Coded sleeves and a ten-second script for baristas and partners." },
  { icon: "handshake", head: "Staff the return path", text: "A co-op liaison delivers notes, gathers replies, reports on the fund." },
];

export function InsideCodaSlide() {
  return (
    <Slide title="What changes inside Coda">
      <Rows items={CHANGES} n={2} />
      <Strip icon="coin">
        <strong>One cost to plan for:</strong> Bext360’s platform fee, 1 to 2% of the wholesale bean price.
      </Strip>
    </Slide>
  );
}

/* ---------- Rollout ---------- */
const PHASES = [
  { name: "Design", when: "Months 1 to 2", text: "The light version first: one Uganda lot, three screens." },
  { name: "Pilot", when: "Months 3 to 5", text: "Coda’s own cafes. A trust survey before and after, with a control group." },
  { name: "Partner beta", when: "Months 6 to 11", text: "Ten to twenty wholesale cafes. Brazil lots join." },
  { name: "Scale", when: "Year 2", text: "The wholesale network, with launch marketing behind it." },
];

export function RolloutSlide() {
  return (
    <Slide title="Start in Coda’s own cafes, then earn the wider launch">
      <ol className="phases">
        {PHASES.map((p, i) => (
          <li key={p.name} className="phases__item">
            <span className="phases__n">{i + 1}</span>
            <p className="phases__when">{p.when}</p>
            <h3 className="phases__name">{p.name}</h3>
            <p className="phases__text">{p.text}</p>
          </li>
        ))}
      </ol>
      <Strip icon="target">
        <strong>Go or no-go at each step</strong> on two numbers: the scan rate and the lift in trust.
      </Strip>
    </Slide>
  );
}

/* ---------- Data risks ---------- */
const RISKS = [
  {
    tab: "Collection",
    items: [
      {
        risk: "Farmer privacy and safety",
        what: "Publishing names and payments can expose growers.",
        fix: "Opt-in profiles, first name and district only. Pay shown as a co-op premium, never an amount.",
      },
      {
        risk: "Drinker privacy",
        what: "Apps tend to collect everything they can.",
        fix: "Six fields, no account, no location tracking, no advertising IDs.",
      },
    ],
  },
  {
    tab: "Use",
    items: [
      {
        risk: "Mission drift",
        what: "Pressure to turn scans into ad targeting.",
        fix: "No sale or sharing of personal data. Feedback is pooled, and farmers get it too.",
      },
      {
        risk: "Dressing up the truth",
        what: "A screen can make every lot look perfect.",
        fix: "Unverified steps are labeled as unverified. No streaks, no nagging.",
      },
    ],
  },
  {
    tab: "Ownership and integrity",
    items: [
      {
        risk: "Locked out of its own story",
        what: "Co-ops that license Bext360 control the records.",
        fix: "Coda’s own license or contractual read rights, with an export clause.",
      },
      {
        risk: "A true-looking false record",
        what: "A ledger proves nothing was altered, not that it was right. Beans can be swapped.",
        fix: "Verification level shown per step, audits, and marker technology as it matures.",
      },
    ],
  },
];

// One group of risks per press.
export function RisksSlide() {
  const [tab, setTab] = useStep();
  return (
    <Slide title="Data risks, and how we handle them">
      <div className="risks" data-noswipe>
        <div className="risks__tabs" role="group" aria-label="Type of risk">
          {RISKS.map((r, i) => (
            <button key={r.tab} aria-pressed={i === tab} className={`risks__tab ${i === tab ? "is-on" : ""}`} onClick={() => setTab(i)}>
              {r.tab}
            </button>
          ))}
        </div>
        <div className="risks__cards" aria-live="polite">
          {RISKS[tab].items.map((it) => (
            <div className="risks__card card" key={it.risk}>
              <h3 className="risks__risk">
                <Icon name="alert" /> {it.risk}
              </h3>
              <p className="risks__what">{it.what}</p>
              <p className="risks__fix">
                <Icon name="shield" />
                <span>{it.fix}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}
RisksSlide.steps = RISKS.length;

/* ---------- Competitive landscape ---------- */
const SHIFT = [
  { who: "Wholesale buyers", now: "Choose on quality and price", then: "Also get a trust feature their own customers can see" },
  { who: "Chains", now: "Win on points and convenience", then: "Cannot match farmer-level proof and a human reply" },
  { who: "Specialty peers", now: "Print origin stories on the bag", then: "Face a rival whose stories come with receipts" },
];

export function LandscapeSlide() {
  return (
    <Slide title="It changes what Coda sells to a cafe, not only to a drinker">
      <table className="shift">
        <thead>
          <tr>
            <th scope="col" />
            <th scope="col">Today</th>
            <th scope="col">With Cup2Farm</th>
          </tr>
        </thead>
        <tbody>
          {SHIFT.map((s) => (
            <tr key={s.who}>
              <th scope="row">{s.who}</th>
              <td>{s.now}</td>
              <td>{s.then}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Slide>
  );
}

/* ---------- Precedents ---------- */
export function PrecedentsSlide() {
  return (
    <Slide title="Two precedents, one lesson">
      <div className="prec">
        <div className="prec__card card">
          <Tag tone="sea">2020</Tag>
          <h3 className="prec__name">Starbucks Digital Traceability</h3>
          <p>Enter a bag’s code to see where the beans came from. One way only, and for bagged beans, not cups.</p>
        </div>
        <div className="prec__card card">
          <Tag tone="sea">2020</Tag>
          <h3 className="prec__name">Thank My Farmer</h3>
          <p>IBM and Farmer Connect let drinkers trace and donate. Shared by many brands, owned by none; its maker later turned to compliance software and was sold in 2025.</p>
        </div>
      </div>
      <Strip icon="handshake">
        <strong>The lesson:</strong> a thank-you needs someone who will keep the promise. Coda’s direct farm relationships can.
      </Strip>
    </Slide>
  );
}

/* ---------- Partnerships ---------- */
const PARTNERS = [
  { icon: "ledger", head: "Bext360", text: "ledger, machines, data access" },
  { icon: "users", head: "Co-ops and exporters", text: "consent, replies, fund reports" },
  { icon: "store", head: "Wholesale cafes", text: "carry the code, tell the story" },
  { icon: "truck", head: "PFG’s network", text: "national foodservice reach" },
  { icon: "shield", head: "B Lab, Fair Trade USA", text: "independent standards" },
  { icon: "coin", head: "Payment and lending", text: "mobile-money tips, farm credit later" },
];

export function PartnersSlide() {
  return (
    <Slide title="Partners that make it work">
      <div className="fields fields--tight">
        {PARTNERS.map((f) => (
          <div className="fields__item" key={f.head}>
            <Icon name={f.icon} />
            <div>
              <h3>{f.head}</h3>
              <p>{f.text}</p>
            </div>
          </div>
        ))}
      </div>
      <Strip icon="link">Each partner gains something of its own, which is what keeps the loop running.</Strip>
    </Slide>
  );
}
