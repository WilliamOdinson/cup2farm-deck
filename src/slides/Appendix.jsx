import { useEffect, useState } from "react";
import { Cup, Icon, Slide } from "../ui/primitives.jsx";
import { SOURCES } from "../content/sources.js";
import { ASSUMPTIONS, PRESETS, count, money } from "../model/roi.js";
import { teamLine } from "../content/team.js";

/* ---------- Sources, one group per slide ---------- */
function SourcesSlide({ id }) {
  const g = SOURCES.find((s) => s.id === id);
  return (
    <Slide title={`Sources: ${g.group.toLowerCase()}`}>
      <ol className={`srcs ${g.items.length > 5 ? "srcs--two" : ""}`}>
        {g.items.map((s) => (
          <li key={s.cite}>
            <p className="srcs__cite">
              {s.url ? (
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.cite}
                </a>
              ) : (
                s.cite
              )}
            </p>
            <p className="srcs__used">{s.used}</p>
          </li>
        ))}
      </ol>
    </Slide>
  );
}

export const SourcesCourseSlide = () => <SourcesSlide id="course" />;
export const SourcesMarketSlide = () => <SourcesSlide id="market" />;
export const SourcesCompanySlide = () => <SourcesSlide id="company" />;

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
    ["Coffee carrying the code", `${span((p) => p.pounds, count)} lb a year`, "scenario; Coda roasted about 500K lb in 2013"],
    ["Scan rate, thank rate", `${span((p) => p.scanRate, pct, "%")}, ${span((p) => p.thankRate, pct, "%")}`, "scenario; the pilot measures both"],
    ["Cups per pound of coffee", `${a.cupsPerPound}`, "12 oz cups at 20 g each"],
    ["Scans per scanning drinker", `${a.scansPerPerson} a year`, "team estimate"],
    ["Profit per engaged drinker", `${money(a.profitPerDrinker)} a year`, "about $150 in bags and visits at 40% margin"],
    ["Lift in sales potential", `${Math.round(a.researchLift * 100)}%`, "Urban and Sultan 2015"],
    ["Lift that carries over", `${Math.round(a.liftTransfer * 100)}%`, "team estimate; the study required app use"],
    ["Profit per wholesale account", `${money(a.profitPerAccount)} a year`, "about 60 lb a week at $2 a pound of margin"],
    ["Program cost", `${span((p) => p.cost, (x) => `$${count(x)}`)} a year`, "team estimate by phase"],
  ];
  return (
    <Slide title="Model assumptions" sources={<span>Team estimates for illustration, not Coda financials. 2013 volume: Confluence Denver 2013.</span>}>
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

/* ---------- Q&A: the last slide ---------- */
const ANSWERS = [
  {
    q: "Why would anyone scan a coffee cup?",
    a: "Seven in ten Americans already scan codes every month, most often in restaurants. This one answers a question record prices have made common: where does my money go?",
  },
  {
    q: "Isn’t this Starbucks’ tracing tool again?",
    a: "That tool runs one way and covers bagged beans. Cup2Farm adds proof of payment at farmer level and a channel back to the grower.",
  },
  {
    q: "What if only 1% of cups get scanned?",
    a: "The pilot gates on scan rate, so we learn that cheaply. Even at 1%, cafes get a trust feature that sets Coda apart in wholesale.",
  },
  {
    q: "Does showing pay put farmers at risk?",
    a: "Amounts are never shown. Drinkers see a co-op level premium, and profiles are opt-in with a first name and district only.",
  },
  {
    q: "Why not a native app with loyalty points?",
    a: "About 3% of food and drink app users remain after 30 days, and points would turn a benevolent app into a push app. Loyalty can live in another area of the app.",
  },
  {
    q: "What does it cost, and who pays?",
    a: "We model $120,000 to $240,000 a year, plus Bext360’s fee of 1 to 2% of the wholesale bean price. Year one is an investment; break-even comes with partner reach.",
  },
  {
    q: "What if a lot cannot be traced?",
    a: "The app says so. Part of Coda’s coffee comes through Fair Trade co-ops or client-supplied beans, and showing the gap is part of being trusted.",
  },
  {
    q: "How will you know it worked?",
    a: "A trust survey before and after, against a control group, the design Urban and Sultan used. Scan and thank-you rates are tracked weekly.",
  },
  {
    q: "Does PFG’s ownership change the plan?",
    a: "It widens it. PFG’s network puts Coda in more places without its name on the cup, which is the gap the code closes.",
  },
];

export function QASlide() {
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState(0);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <Slide variant="stage" hideHead className="s-qa">
      <div className="qa">
        <div className="qa__copy">
          <p className="t-kicker">Thank you</p>
          <h2 className="qa__big">Questions?</h2>
          <p className="qa__line">Farm2Cup made Coda worth trusting. Cup2Farm lets people feel it.</p>
          <p className="qa__team">{teamLine()}</p>
          <button className="qa__btn" onClick={() => setOpen(true)} data-noswipe>
            <Icon name="message" /> Prepared answers
          </button>
        </div>
        <div className="qa__art" aria-hidden="true">
          <Cup height={540} label="Scan to say thanks" />
        </div>
      </div>

      {open && (
        <div className="qa__panel" role="dialog" aria-label="Prepared answers" data-noswipe>
          <div className="qa__panel-head">
            <h3>Prepared answers</h3>
            <button className="qa__close" onClick={() => setOpen(false)}>
              <Icon name="x" /> Close
            </button>
          </div>
          <div className="qa__cols">
            <ul className="qa__qs">
              {ANSWERS.map((x, i) => (
                <li key={x.q}>
                  <button className={i === sel ? "is-on" : ""} onClick={() => setSel(i)} aria-pressed={i === sel}>
                    {x.q}
                  </button>
                </li>
              ))}
            </ul>
            <div className="qa__a" aria-live="polite">
              <h4>{ANSWERS[sel].q}</h4>
              <p>{ANSWERS[sel].a}</p>
            </div>
          </div>
        </div>
      )}
    </Slide>
  );
}
