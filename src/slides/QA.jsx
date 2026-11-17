import { useEffect } from "react";
import { Cup, Icon, Slide, useStep } from "../ui/primitives.jsx";
import { teamLine } from "../content/team.js";
import { SITE_URL } from "../content/site.js";

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

// Step 0 is the closing slide. Each further press of the right arrow shows one prepared
// answer, so the backup material needs no mouse; Escape or Close returns to the closing slide.
export function QASlide() {
  const [step, setStep] = useStep();
  const open = step > 0;
  const sel = Math.min(ANSWERS.length, Math.max(1, step)) - 1;

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setStep(0);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setStep]);

  return (
    <Slide variant="stage" hideHead className="s-qa">
      <div className="qa">
        <div className="qa__copy">
          <p className="t-kicker">Thank you</p>
          <h2 className="qa__big">Questions?</h2>
          <p className="qa__line">Farm2Cup made Coda worth trusting. Cup2Farm lets people feel it.</p>
          <p className="qa__team">{teamLine()}</p>
          <button className="qa__btn" onClick={() => setStep(1)} data-noswipe>
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
            <button className="qa__close" onClick={() => setStep(0)}>
              <Icon name="x" /> Close
            </button>
          </div>
          <div className="qa__cols">
            <ul className="qa__qs">
              {ANSWERS.map((x, i) => (
                <li key={x.q}>
                  <button className={i === sel ? "is-on" : ""} onClick={() => setStep(i + 1)} aria-pressed={i === sel}>
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
          <a className="foot__site qa__site" href={SITE_URL} target="_blank" rel="noopener noreferrer">
            {SITE_URL}
          </a>
        </div>
      )}
    </Slide>
  );
}
QASlide.steps = ANSWERS.length + 1;
