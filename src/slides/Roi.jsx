import { useEffect, useId, useMemo, useState } from "react";
import { Icon, Slide, useStep } from "../ui/primitives.jsx";
import { Cols, Strip } from "../ui/layout.jsx";
import { ASSUMPTIONS, PRESETS, count, money, roi } from "../model/roi.js";

/* ---------- Evidence: before and after a benevolent app ---------- */
const EVIDENCE = [
  { name: "Would consider the brand", scale: "1 to 10", min: 1, max: 10, before: 5.4, after: 6.7, fmt: (v) => v.toFixed(1), lift: "+24%" },
  { name: "Likely to buy", scale: "1 to 5", min: 1, max: 5, before: 2.9, after: 3.3, fmt: (v) => v.toFixed(1), lift: "+14%" },
  { name: "Share of preference", scale: "0 to 25%", min: 0, max: 25, before: 9.2, after: 17, fmt: (v) => `${v}%`, lift: "+85%" },
];

function Dumbbell({ row }) {
  const pos = (v) => ((v - row.min) / (row.max - row.min)) * 100;
  const a = pos(row.before);
  const b = pos(row.after);
  return (
    <div className="db" role="img" aria-label={`${row.name}: ${row.fmt(row.before)} before, ${row.fmt(row.after)} after, ${row.lift}`}>
      <div className="db__label">
        <strong>{row.name}</strong>
        <span>scale {row.scale}</span>
      </div>
      <div className="db__track">
        <span className="db__line" style={{ left: `${a}%`, width: `${b - a}%` }} />
        <span className="db__dot db__dot--before" style={{ left: `${a}%` }}>
          <i>{row.fmt(row.before)}</i>
        </span>
        <span className="db__dot db__dot--after" style={{ left: `${b}%` }}>
          <i>{row.fmt(row.after)}</i>
        </span>
      </div>
      <div className="db__lift">{row.lift}</div>
    </div>
  );
}

export function EvidenceSlide() {
  return (
    <Slide title="Benevolent apps lift trust first, then sales potential">
      <div className="evi">
        <div className="evi__chart">
          <ul className="evi__legend">
            <li>
              <span className="db__key db__key--before" /> before using the app
            </li>
            <li>
              <span className="db__key db__key--after" /> after
            </li>
          </ul>
          {EVIDENCE.map((r) => (
            <Dumbbell row={r} key={r.name} />
          ))}
        </div>
        <div className="evi__hero">
          <p className="evi__num">1.41×</p>
          <p className="evi__cap">the sales potential among people who used Liberty Mutual’s benevolent app</p>
          <p className="evi__note">In Japan, Suruga Bank’s app lifted consideration from 4.3% to 14.2%.</p>
        </div>
      </div>
    </Slide>
  );
}

/* ---------- ROI model ---------- */
const SLIDERS = [
  { key: "pounds", label: "Coffee carrying the code", min: 20000, max: 800000, step: 10000, show: (v) => `${count(v)} lb a year` },
  { key: "scanRate", label: "Cups that get scanned", min: 0.005, max: 0.06, step: 0.005, show: (v) => `${(v * 100).toFixed(1)}%` },
  { key: "thankRate", label: "Scanners who send thanks", min: 0.05, max: 0.4, step: 0.05, show: (v) => `${Math.round(v * 100)}%` },
  { key: "accounts", label: "Wholesale accounts won or kept", min: 0, max: 40, step: 1, show: (v) => `${v}` },
];

// The arrow walks the three phases in order. The sliders stay free: move one and the phase
// buttons clear, press the arrow (or a phase) and the model snaps back to that phase.
export function RoiSlide() {
  const [step, setStep] = useStep();
  const uid = useId(); // the print view shows this slide once per phase, so ids must not repeat
  const [input, setInput] = useState(PRESETS[step] ?? PRESETS[0]);
  useEffect(() => setInput(PRESETS[step] ?? PRESETS[0]), [step]);
  const r = useMemo(() => roi(input), [input]);
  const matched = PRESETS.find((p) => SLIDERS.every((s) => p[s.key] === input[s.key]) && p.cost === input.cost);
  const pct = Math.min(100, (r.perDollar / 2) * 100);
  const verdict =
    r.perDollar >= 1
      ? "Pays for itself at these settings."
      : `Break-even needs ${r.accountsToBreakEven} wholesale accounts, or more reach.`;

  return (
    <Slide title="ROI builds with reach">
      <div className="roi" data-noswipe>
        <div className="roi__in">
          <div className="roi__presets" role="group" aria-label="Scenario">
            {PRESETS.map((p, i) => (
              <button
                key={p.id}
                className={`roi__preset ${matched && matched.id === p.id ? "is-on" : ""}`}
                onClick={() => {
                  setStep(i);
                  setInput(p);
                }}
                aria-pressed={!!matched && matched.id === p.id}
              >
                {p.label}
              </button>
            ))}
          </div>
          {SLIDERS.map((s) => (
            <div className="roi__slider" key={s.key}>
              <label htmlFor={`${uid}-${s.key}`}>
                <span>{s.label}</span>
                <strong>{s.show(input[s.key])}</strong>
              </label>
              <input
                id={`${uid}-${s.key}`}
                type="range"
                min={s.min}
                max={s.max}
                step={s.step}
                value={input[s.key]}
                onChange={(e) => setInput((cur) => ({ ...cur, [s.key]: Number(e.target.value) }))}
              />
            </div>
          ))}
          <p className="roi__cost">
            Program cost: <strong>{money(input.cost)}</strong> a year
          </p>
        </div>

        <div className="roi__out">
          <div className="roi__tiles">
            <div>
              <b>{count(r.people)}</b>
              <span>drinkers reached</span>
            </div>
            <div>
              <b>{count(r.thankers)}</b>
              <span>thank-yous to growers</span>
            </div>
            <div>
              <b>{money(r.fund)}</b>
              <span>to co-op funds</span>
            </div>
          </div>
          <div className="roi__return">
            <p className="roi__return-label">Return for every $1 spent</p>
            <p className="roi__return-num">${r.perDollar.toFixed(2)}</p>
            <div className="roi__meter" role="img" aria-label={`Return of ${r.perDollar.toFixed(2)} dollars per dollar spent; break-even is 1 dollar`}>
              <span className="roi__meter-fill" style={{ width: `${pct}%` }} />
              <span className="roi__meter-tick" />
            </div>
            <div className="roi__meter-scale" aria-hidden="true">
              <span>$0</span>
              <span>$1 break-even</span>
              <span>$2</span>
            </div>
            <p className="roi__verdict">
              {money(r.drinkerProfit)} from drinker loyalty plus {money(r.wholesaleProfit)} from wholesale. {verdict}
            </p>
          </div>
        </div>
      </div>
    </Slide>
  );
}
RoiSlide.steps = PRESETS.length;

/* ---------- Model assumptions ---------- */
export function AssumptionsSlide() {
  const a = ASSUMPTIONS;
  // Lowest and highest value of one scenario input across the phases, e.g. "2 to 3%".
  const span = (pick, show, unit = "") => {
    const xs = PRESETS.map(pick);
    const lo = show(Math.min(...xs));
    const hi = show(Math.max(...xs));
    return lo === hi ? `${lo}${unit}` : `${lo} to ${hi}${unit}`;
  };
  const pct = (x) => `${Math.round(x * 100)}`;
  const rows = [
    ["Coffee carrying the code", `${span((p) => p.pounds, count)} lb a year`, "scenario; below the 500K lb of 2013 (Peterson, 2013)"],
    ["Scan rate, thank rate", `${span((p) => p.scanRate, pct, "%")}, ${span((p) => p.thankRate, pct, "%")}`, "scenario; the pilot measures both"],
    ["Cups per pound of coffee", `${a.cupsPerPound}`, "12 oz cups at 20 g each (James, 2025)"],
    ["Scans per scanning drinker", `${a.scansPerPerson} a year`, "team estimate"],
    ["Profit per engaged drinker", `${money(a.profitPerDrinker)} a year`, "about $150 in bags and visits at 40% margin"],
    ["Lift in sales potential", `${Math.round(a.researchLift * 100)}%`, "Urban & Sultan (2015)"],
    ["Lift that carries over", `${Math.round(a.liftTransfer * 100)}%`, "team estimate; the study required app use"],
    ["Profit per wholesale account", `${money(a.profitPerAccount)} a year`, "about 60 lb a week at $2 a pound of margin"],
    ["Program cost", `${span((p) => p.cost, (x) => `$${count(x)}`)} a year`, "team estimate by phase"],
  ];
  return (
    <Slide title="Model assumptions">
      <table className="kpi kpi--assume">
        <tbody>
          {rows.map(([name, value, basis]) => (
            <tr key={name}>
              <th scope="row">{name}</th>
              <td>{value}</td>
              <td>{basis}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Slide>
  );
}

/* ---------- Reach ---------- */
const REACH = [
  { icon: "store", head: "Existing drinkers", text: "Coda’s own cafes and retail bags carry the code first." },
  { icon: "truck", head: "New drinkers", text: "Every partner cafe and restaurant that serves a coded cup: the unseen 95%." },
  { icon: "heart", head: "Their friends", text: "Each thank-you makes a card worth sharing." },
];

export function ReachSlide() {
  return (
    <Slide title="How it reaches people">
      <Cols items={REACH} />
      <Strip icon="cup">
        <strong>The cup is the channel.</strong> Reach grows with every partner that pours Coda.
      </Strip>
    </Slide>
  );
}

/* ---------- Innovation vs infrastructure ---------- */
const INFRA = ["Starbucks has traced bags since 2020", "EU law requires farm-plot data from December 2026", "Any roaster can buy a tracing service"];
const INNOV = ["Proof of payment, farmer by farmer", "A channel that runs both ways", "Drinker feedback that feeds Farm2Cup coaching"];

export function InnovationSlide() {
  return (
    <Slide title="Tracing is becoming infrastructure. The return path is the innovation.">
      <div className="duo">
        <div className="duo__col duo__col--quiet">
          <h3 className="duo__head">A code and a trace page</h3>
          <ul className="checks">
            {INFRA.map((t) => (
              <li key={t}>
                <span className="checks__ico checks__ico--quiet">
                  <Icon name="minus" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="duo__col duo__col--accent">
          <h3 className="duo__head">What only Coda can add</h3>
          <ul className="checks">
            {INNOV.map((t) => (
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

/* ---------- Hagiu and Wright: seven tests ---------- */
const TESTS = [
  { q: "Customer data adds real value", score: 3, why: "The trace page is useful from the first scan. Thanks and ratings add meaning rather than function." },
  { q: "Value keeps growing with more data", score: 2, why: "A few hundred ratings describe a lot. More scans mostly add reach, not learning." },
  { q: "The data stays relevant", score: 4, why: "A lot sells out in weeks, but each farm’s record of quality, payments and replies compounds every harvest." },
  { q: "The data is proprietary", score: 5, why: "Farmer-level payment and quality records cannot be bought. Coda must secure its own rights to them." },
  { q: "Improvements are hard to copy", score: 4, why: "Screens are easy to imitate. A staffed return path needs years of direct farm relationships." },
  { q: "One user’s data helps others", score: 3, why: "Pooled feedback improves the coffee for everyone, a mild network effect. The passport keeps each user." },
  { q: "Insights reach the product fast", score: 3, why: "App content changes with every roast. Farm practices change once a harvest." },
];

export function ScorecardSlide() {
  const [sel, setSel] = useStep();
  const avg = TESTS.reduce((a, t) => a + t.score, 0) / TESTS.length;
  const t = TESTS[sel];
  return (
    <Slide title="Will the data advantage last? Seven tests">
      <div className="score" data-noswipe>
        <ol className="score__list">
          {TESTS.map((x, i) => (
            <li key={x.q}>
              <button className={`score__row ${i === sel ? "is-on" : ""}`} onClick={() => setSel(i)} aria-pressed={i === sel}>
                <span className="score__q">{x.q}</span>
                <span className="score__meter" aria-hidden="true">
                  <span style={{ width: `${(x.score / 5) * 100}%` }} />
                </span>
                <span className="score__n">{x.score}/5</span>
              </button>
            </li>
          ))}
        </ol>
        <div className="score__side">
          <div className="score__why card" aria-live="polite">
            <p className="score__why-n">{t.score}/5</p>
            <h3 className="score__why-q">{t.q}</h3>
            <p className="score__why-text">{t.why}</p>
          </div>
          <p className="score__verdict">
            <strong>Average {avg.toFixed(1)} of 5.</strong> Data alone will not make this winner-take-all. Proprietary
            origin data and partner cafes make it hard to copy.
          </p>
        </div>
      </div>
    </Slide>
  );
}
ScorecardSlide.steps = TESTS.length;
