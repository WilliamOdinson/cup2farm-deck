import { useState } from "react";
import { Icon, Slide, Src } from "../ui/primitives.jsx";

/* ---------- The idea: a loop ---------- */
export function IdeaSlide() {
  return (
    <Slide title="Farm2Cup sends coffee down the chain. Cup2Farm sends thanks back up." sources={<Src>Case.</Src>}>
      <div className="loop">
        <svg className="loop__svg" viewBox="0 0 1456 450" aria-hidden="true">
          <defs>
            <marker id="loop-ink" viewBox="0 0 12 12" refX="9" refY="6" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M0 0L12 6L0 12z" fill="#1f1215" />
            </marker>
            <marker id="loop-cherry" viewBox="0 0 12 12" refX="9" refY="6" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M0 0L12 6L0 12z" fill="#c5162e" />
            </marker>
          </defs>
          <path d="M 262 176 C 520 26, 936 26, 1190 172" fill="none" stroke="#1f1215" strokeWidth="6" markerEnd="url(#loop-ink)" />
          <path d="M 1194 274 C 936 424, 520 424, 266 278" fill="none" stroke="#c5162e" strokeWidth="6" markerEnd="url(#loop-cherry)" />
        </svg>
        <div className="loop__node loop__node--farm">
          <span className="loop__ico">
            <Icon name="sprout" />
          </span>
          <span className="loop__cap">Grower</span>
        </div>
        <div className="loop__node loop__node--cup">
          <span className="loop__ico">
            <Icon name="cup" />
          </span>
          <span className="loop__cap">Drinker</span>
        </div>
        <div className="loop__label loop__label--top">
          <span className="loop__name">Farm2Cup</span>
          <span className="loop__what">coffee, quality grades, proof of payment</span>
        </div>
        <div className="loop__label loop__label--bottom">
          <span className="loop__name">Cup2Farm</span>
          <span className="loop__what">thanks, taste feedback, tips</span>
        </div>
      </div>
      <p className="loop__quote">
        “We know who gets paid what,” says co-founder Tim Thwaites. Now the drinker can know too.
      </p>
    </Slide>
  );
}

/* ---------- Exists today vs new ---------- */
const EXISTS = [
  "A bextmachine grades each farmer’s cherries with machine vision and AI",
  "Every step, and every payment, is written to a blockchain",
  "Farmers are paid at delivery, not 30 days later",
];

const ADDS = [
  "A code on the cup opens that lot’s verified journey",
  "Drinkers send thanks, taste feedback and optional tips",
  "Growers reply, and feedback feeds Farm2Cup coaching",
];

export function ExistsNewSlide() {
  return (
    <Slide title="Most of the machinery already exists" sources={<Src>Case; Freethink.</Src>}>
      <div className="duo">
        <div className="duo__col">
          <h3 className="duo__head">Running today</h3>
          <ul className="checks">
            {EXISTS.map((t) => (
              <li key={t}>
                <span className="checks__ico checks__ico--leaf">
                  <Icon name="check" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="duo__col duo__col--accent">
          <h3 className="duo__head">New with Cup2Farm</h3>
          <ul className="checks">
            {ADDS.map((t) => (
              <li key={t}>
                <span className="checks__ico checks__ico--cherry">
                  <Icon name="plus" />
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

/* ---------- Benevolence spectrum board ---------- */
const ZONES = ["Product push", "Convenience", "Entertainment", "Product assistance", "Benevolent service"];

// kind: "read" (examples in Urban and Sultan), "coffee" (our assessment), "ours"
const APPS = [
  { zone: 0, kind: "coffee", name: "Coffee chain rewards apps", why: "Starbucks, Dunkin’ and Dutch Bros: order ahead, pay, earn points. Built to drive visits. Our assessment." },
  { zone: 0, kind: "read", name: "Domino’s Pizza", why: "Order pizza and get deals. Built to generate sales." },
  { zone: 0, kind: "read", name: "Zappos", why: "Browse and buy shoes." },
  { zone: 1, kind: "read", name: "GasBuddy", why: "Shows nearby gas stations and their prices." },
  { zone: 2, kind: "read", name: "Chipotle Scarecrow", why: "A game that carries the brand’s food values." },
  { zone: 3, kind: "coffee", name: "Starbucks bag tracing", why: "Since 2020: enter a bag’s code to see where the beans came from. One way only. Our assessment." },
  { zone: 3, kind: "read", name: "Sherwin-Williams ColorSnap", why: "Capture a color and match it to paint you can buy." },
  { zone: 3, kind: "read", name: "Ikea", why: "Preview catalog furniture in your own room." },
  { zone: 4, kind: "ours", name: "Cup2Farm", why: "Shows the verified journey and payment, then carries thanks, feedback and tips back to the growers." },
  { zone: 4, kind: "coffee", name: "Thank My Farmer", why: "IBM and Farmer Connect, 2020: trace a coffee and fund origin projects. Shared by many brands, owned by none. Our assessment." },
  { zone: 4, kind: "read", name: "North Face Snow Report", why: "Free snow reports and avalanche advisories." },
  { zone: 4, kind: "read", name: "Sea Tow", why: "Tides, weather and GPS for boaters, even though safer boating means fewer tows." },
];

export function SpectrumSlide() {
  const [sel, setSel] = useState("Cup2Farm");
  const app = APPS.find((a) => a.name === sel) || APPS[0];
  return (
    <Slide
      title="Cup2Farm sits at the benevolent end of the spectrum"
      sources={<Src>Urban and Sultan 2015 (spectrum and examples); Tea and Coffee Trade Journal 2020; CoinDesk 2020. Coffee placements are the team’s.</Src>}
    >
      <div className="spec" data-noswipe>
        <div className="spec__axis" aria-hidden="true">
          <span>sells product</span>
          <span className="spec__bar" />
          <span>serves the customer</span>
        </div>
        <div className="spec__board">
          {ZONES.map((z, zi) => (
            <div className="spec__zone" key={z}>
              <h3 className="spec__zname">{z}</h3>
              <div className="spec__chips">
                {APPS.filter((a) => a.zone === zi).map((a) => (
                  <button
                    key={a.name}
                    className={`spec__chip spec__chip--${a.kind} ${a.name === sel ? "is-on" : ""}`}
                    onClick={() => setSel(a.name)}
                    onMouseEnter={() => setSel(a.name)}
                    onFocus={() => setSel(a.name)}
                    aria-pressed={a.name === sel}
                  >
                    {a.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="spec__foot">
          <p className="spec__detail" aria-live="polite">
            <strong>{app.name}.</strong> {app.why}
          </p>
          <ul className="spec__legend">
            <li>
              <span className="spec__key spec__key--ours" />
              Our proposal
            </li>
            <li>
              <span className="spec__key spec__key--coffee" />
              Coffee apps
            </li>
            <li>
              <span className="spec__key spec__key--read" />
              From the reading
            </li>
          </ul>
        </div>
      </div>
    </Slide>
  );
}

/* ---------- Does / never does ---------- */
const ALWAYS = [
  "Tells the truth, including steps it cannot verify",
  "Works with no download and no account",
  "Passes every tip dollar to the co-op fund",
  "Lets growers answer back",
];

const NEVER = [
  "Pushes offers or upsells",
  "Hides the story behind a purchase",
  "Sells or shares personal data",
  "Nags with streaks or notifications",
];

export function DoesDoesntSlide() {
  return (
    <Slide title="What keeps it benevolent" sources={<Src>Urban and Sultan 2015; Lecture (data hype, value and trust).</Src>}>
      <div className="duo">
        <div className="duo__col">
          <h3 className="duo__head">It always</h3>
          <ul className="checks">
            {ALWAYS.map((t) => (
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
          <h3 className="duo__head">It never</h3>
          <ul className="checks">
            {NEVER.map((t) => (
              <li key={t}>
                <span className="checks__ico checks__ico--cherry">
                  <Icon name="x" />
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

/* ---------- Trust formula ---------- */
const TRUST = [
  {
    name: "Competence",
    def: "a high-quality product",
    coda: "Roaster of the Year. Pilot lots cupped at 85 and above.",
    has: true,
  },
  {
    name: "Confidence",
    def: "the company stands behind its word",
    coda: "B Corp. Pays three times commodity, with a ledger to show it.",
    has: true,
  },
  {
    name: "Benevolence",
    def: "the customer’s interest comes first",
    coda: "No way to show drinkers yet. This is Cup2Farm’s job.",
    has: false,
  },
];

export function TrustSlide() {
  return (
    <Slide title="Trust has three parts. Coda already has two." sources={<Src>Urban and Sultan 2015 (three factors of trust); Case.</Src>}>
      <div className="trust">
        {TRUST.map((t) => (
          <div className={`trust__item ${t.has ? "" : "is-gap"}`} key={t.name}>
            <span className="trust__ico">
              <Icon name={t.has ? "check" : "plus"} />
            </span>
            <h3 className="trust__name">{t.name}</h3>
            <p className="trust__def">{t.def}</p>
            <p className="trust__coda">{t.coda}</p>
          </div>
        ))}
      </div>
    </Slide>
  );
}
