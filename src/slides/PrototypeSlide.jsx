import { useContext } from "react";
import { Icon, SlideMeta, Tag, useStep } from "../ui/primitives.jsx";
import Phone from "../prototype/Phone.jsx";
import { JOURNEY, SCREENS } from "../prototype/data.js";
import { SITE_URL } from "../content/site.js";

// What the right arrow shows, in order: every screen once, with a second stop on the cup
// screen that opens the one journey step that is reported rather than verified.
const REPORTED = JOURNEY.findIndex((j) => j.status === "reported");
const DEMO = [
  { screen: "scan" },
  { screen: "cup", open: 0 },
  ...(REPORTED > 0 ? [{ screen: "cup", open: REPORTED }] : []),
  { screen: "grower" },
  { screen: "thank" },
  { screen: "sent" },
  { screen: "passport" },
];

export function PrototypeSlide() {
  const meta = useContext(SlideMeta);
  const [step, setStep] = useStep();
  const stop = DEMO[step] ?? DEMO[0];
  const idx = Math.max(0, SCREENS.findIndex((s) => s.id === stop.screen));
  const info = SCREENS[idx];

  // A tap in the phone or on a screen button moves the deck to that screen's first stop,
  // so the arrow carries on from wherever the tap went.
  const show = (id) => {
    if (id === stop.screen) return;
    const i = DEMO.findIndex((d) => d.screen === id);
    if (i >= 0) setStep(i);
  };

  return (
    <section className="slide slide--paper proto" aria-label="Interactive prototype">
      <div className="proto__phone">
        <Phone screen={stop.screen} onScreen={show} openStep={stop.open ?? 0} />
      </div>
      <div className="proto__side">
        <p className="sec">
          <span className="sec__n">{meta.sectionNo}</span>
          {meta.sectionLabel}
        </p>
        <h2 className="title">Try it: from scan to thank-you in a minute</h2>

        <div className="proto__steps" role="group" aria-label="Prototype screens" data-noswipe>
          {SCREENS.map((s, i) => (
            <button key={s.id} aria-pressed={i === idx} className={`proto__step ${i === idx ? "is-on" : ""}`} onClick={() => show(s.id)}>
              <span className="proto__step-n">{i + 1}</span>
              {s.label}
            </button>
          ))}
        </div>

        <div className="proto__panel card" aria-live="polite">
          <h3 className="proto__panel-head">What this screen runs on</h3>
          <dl className="proto__rows">
            {info.rows.map(([src, text]) => (
              <div key={src}>
                <dt>{src}</dt>
                <dd>{text}</dd>
              </div>
            ))}
          </dl>
          <p className="proto__rule">
            <Icon name="shield" />
            <span>{info.rule}</span>
          </p>
        </div>

        <div className="proto__foot">
          <Tag tone="ochre" icon="info">
            Working prototype, sample data
          </Tag>
          <a className="foot__site" href={SITE_URL} target="_blank" rel="noopener noreferrer">
            {SITE_URL}
          </a>
        </div>
      </div>
    </section>
  );
}
PrototypeSlide.steps = DEMO.length;
