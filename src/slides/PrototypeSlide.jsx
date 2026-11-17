import { useContext, useState } from "react";
import { Icon, SlideMeta, Tag } from "../ui/primitives.jsx";
import Phone from "../prototype/Phone.jsx";
import { SCREENS } from "../prototype/data.js";

export function PrototypeSlide() {
  const meta = useContext(SlideMeta);
  const [screen, setScreen] = useState("scan");
  const idx = Math.max(0, SCREENS.findIndex((s) => s.id === screen));
  const info = SCREENS[idx];

  return (
    <section className="slide slide--paper proto" aria-label="Interactive prototype">
      <div className="proto__phone">
        <Phone screen={screen} onScreen={setScreen} />
      </div>
      <div className="proto__side">
        <div className="proto__meta">
          <p className="sec">
            <span className="sec__n">{meta.sectionNo}</span>
            {meta.sectionLabel}
          </p>
          {meta.presenter && (
            <p className="who">
              <Icon name="user" />
              {meta.presenter}
            </p>
          )}
        </div>
        <h2 className="title">Try it: from scan to thank-you in a minute</h2>

        <div className="proto__steps" role="group" aria-label="Prototype screens" data-noswipe>
          {SCREENS.map((s, i) => (
            <button key={s.id} aria-pressed={i === idx} className={`proto__step ${i === idx ? "is-on" : ""}`} onClick={() => setScreen(s.id)}>
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
          <span className="foot__mark">
            <span>Cup2Farm</span>
            <span className="foot__num">
              {String(meta.index + 1).padStart(2, "0")} / {String(meta.total).padStart(2, "0")}
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}
