import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Icon, QR, Receipt, Stamp } from "../ui/primitives.jsx";
import { GROWER, JOURNEY, LOT, QUICK_NOTES, TIPS } from "./data.js";

const TABS = [
  { id: "scan", label: "Scan", icon: "qr" },
  { id: "cup", label: "Your cup", icon: "cup" },
  { id: "passport", label: "Passport", icon: "globe" },
];

const tabFor = (screen) => (screen === "scan" ? "scan" : screen === "passport" ? "passport" : "cup");

const calmMotion = () => {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return true;
  }
};

/* The journey on the cup screen. `openStep` is the step the slide wants open; a tap opens another. */
function Journey({ openStep, scroller }) {
  const [open, setOpen] = useState(openStep);
  const list = useRef(null);

  // Bring the step the slide asked for into view inside the phone. The stage is scaled with a
  // CSS transform, so on-screen boxes are converted back to the phone's own pixels.
  useEffect(() => {
    const box = scroller.current;
    const row = list.current ? list.current.children[openStep] : null;
    if (!box || typeof box.scrollTo !== "function") return;
    let top = 0;
    if (row && openStep > 0) {
      const outer = box.getBoundingClientRect();
      const inner = row.getBoundingClientRect();
      const scale = box.offsetHeight ? outer.height / box.offsetHeight : 1;
      const rowTop = (inner.top - outer.top) / scale + box.scrollTop;
      top = Math.max(0, rowTop - (box.clientHeight - inner.height / scale) / 2);
    }
    box.scrollTo({ top, behavior: calmMotion() ? "auto" : "smooth" });
  }, [openStep, scroller]);

  return (
    <ol className="ph-journey" ref={list}>
      {JOURNEY.map((j, i) => (
        <li key={j.step} className={`ph-step ${open === i ? "is-open" : ""}`}>
          <button className="ph-step__btn" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
            <span className={`ph-step__dot ph-step__dot--${j.status}`}>
              <Icon name={j.status === "ledger" ? "check" : "info"} />
            </span>
            <span className="ph-step__name">{j.step}</span>
            <span className="ph-step__date">{j.date}</span>
          </button>
          {open === i && (
            <div className="ph-step__more">
              <p>{j.detail}</p>
              <p className="ph-step__rec">
                {j.status === "ledger" ? "Ledger record " : "Not yet on the ledger: "}
                <span className="mono">{j.record}</span>
              </p>
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}

/**
 * The app prototype. The slide controls it: `screen` is the screen showing, `openStep` the
 * journey step open on the cup screen, and `onScreen` reports a tap that leads to another
 * screen. Notes, tips and ratings typed into the phone stay inside it.
 */
export default function Phone({ screen, onScreen, openStep = 0 }) {
  const body = useRef(null);
  const [note, setNote] = useState(QUICK_NOTES[0]);
  const [custom, setCustom] = useState("");
  const [tip, setTip] = useState(0);
  const [rating, setRating] = useState(0);
  // Arriving on the last screens from the next slide still shows a sent thank-you.
  const [sent, setSent] = useState(() => screen === "sent" || screen === "passport");
  const [sentTip, setSentTip] = useState(0);
  const [email, setEmail] = useState("");
  const [emailSaved, setEmailSaved] = useState(false);

  const verified = JOURNEY.filter((j) => j.status === "ledger").length;
  const message = custom.trim() || note;

  // The thank-you is sent when the delivered screen opens, whether the arrow key or the
  // Send button led there. Runs before paint, so the screen never shows a stale tip.
  useLayoutEffect(() => {
    if (screen !== "sent") return;
    setSent(true);
    setSentTip(tip);
    // Keyed on the screen alone: only the arrival sends. A tip changed later waits for the next send.
  }, [screen]);

  return (
    <div className="phone" data-noswipe>
      <div className="phone__notch" aria-hidden="true" />
      <div className="phone__screen">
        <div className="ph-status" aria-hidden="true">
          <span>9:41</span>
          <span>cup2farm.coda</span>
        </div>

        <div className="ph-body" key={screen} ref={body}>
          {screen === "scan" && (
            <div className="ph-scan">
              <p className="ph-eyebrow">Cup2Farm by Coda Coffee</p>
              <h3 className="ph-h1">Who grew your coffee?</h3>
              <div className="ph-finder">
                <span className="ph-finder__c ph-finder__c--tl" />
                <span className="ph-finder__c ph-finder__c--tr" />
                <span className="ph-finder__c ph-finder__c--bl" />
                <span className="ph-finder__c ph-finder__c--br" />
                <QR size={150} quiet={2} />
              </div>
              <p className="ph-muted ph-center">Point your camera at the code on your cup or bag.</p>
              <button className="ph-btn ph-btn--primary" onClick={() => onScreen("cup")}>
                Scan the cup
              </button>
              <p className="ph-fine ph-center">Opens in your browser. No app, no account.</p>
            </div>
          )}

          {screen === "cup" && (
            <div>
              <p className="ph-eyebrow">Your cup today</p>
              <h3 className="ph-h1">{LOT.name}</h3>
              <p className="ph-lot lot">LOT {LOT.id}</p>
              <div className="ph-chips">
                <span className="ph-chip ph-chip--leaf">
                  <Icon name="check" /> {verified} of {JOURNEY.length} steps on the ledger
                </span>
                <span className="ph-chip ph-chip--ochre">
                  <Icon name="info" /> {JOURNEY.length - verified} reported
                </span>
              </div>
              <div className="ph-stats">
                <div>
                  <b>{LOT.cupScore}</b>
                  <span>cup score est.</span>
                </div>
                <div>
                  <b>Same day</b>
                  <span>growers paid</span>
                </div>
                <div>
                  <b>{LOT.premium}</b>
                  <span>vs local price</span>
                </div>
              </div>
              <h4 className="ph-h2">The journey</h4>
              <Journey key={openStep} openStep={openStep} scroller={body} />
              <div className="ph-actions">
                <button className="ph-btn" onClick={() => onScreen("grower")}>
                  Meet the growers
                </button>
                <button className="ph-btn ph-btn--primary" onClick={() => onScreen("thank")}>
                  Say thanks
                </button>
              </div>
            </div>
          )}

          {screen === "grower" && (
            <div>
              <button className="ph-back" onClick={() => onScreen("cup")}>
                <Icon name="chevL" /> Your cup
              </button>
              <div className="ph-grower">
                <span className="ph-avatar">{GROWER.initials}</span>
                <div>
                  <h3 className="ph-h1 ph-h1--sm">{GROWER.name}</h3>
                  <p className="ph-muted">{LOT.region}</p>
                </div>
              </div>
              <p className="ph-p">
                One of {LOT.growers} growers whose cherries are in this lot. {GROWER.farm}. {GROWER.since}.
              </p>
              <span className="ph-chip ph-chip--leaf">
                <Icon name="shield" /> Shown with her consent
              </span>
              <h4 className="ph-h2">Her receipt from the bextmachine</h4>
              <Receipt className="ph-receipt" head="BEXT360 STATION 04" rows={GROWER.receipt} stamp="Paid same day" />
              <p className="ph-fine">You see the premium, never the amount. That stays with the grower.</p>
              <div className="ph-actions ph-actions--one">
                <button className="ph-btn ph-btn--primary" onClick={() => onScreen("thank")}>
                  Say thanks
                </button>
              </div>
            </div>
          )}

          {screen === "thank" && (
            <div>
              <button className="ph-back" onClick={() => onScreen("cup")}>
                <Icon name="chevL" /> Your cup
              </button>
              <h3 className="ph-h1">Thank the growers</h3>
              <p className="ph-muted">Everything here is optional.</p>

              <h4 className="ph-h2" id="ph-note-label">
                Your note
              </h4>
              <div className="ph-notes" role="group" aria-labelledby="ph-note-label">
                {QUICK_NOTES.map((q) => (
                  <button
                    key={q}
                    className={`ph-pick ${!custom.trim() && note === q ? "is-on" : ""}`}
                    onClick={() => {
                      setNote(q);
                      setCustom("");
                    }}
                    aria-pressed={!custom.trim() && note === q}
                  >
                    {q}
                  </button>
                ))}
              </div>
              <label className="ph-label" htmlFor="ph-custom">
                Or write your own
              </label>
              <textarea
                id="ph-custom"
                className="ph-input"
                rows={1}
                maxLength={140}
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                placeholder="Up to 140 characters"
              />

              <h4 className="ph-h2" id="ph-tip-label">
                Add a tip for the co-op fund
              </h4>
              <div className="ph-seg" role="group" aria-labelledby="ph-tip-label">
                {TIPS.map((t) => (
                  <button key={t} className={`ph-seg__btn ${tip === t ? "is-on" : ""}`} onClick={() => setTip(t)} aria-pressed={tip === t}>
                    {t === 0 ? "None" : `$${t}`}
                  </button>
                ))}
              </div>
              <p className="ph-fine">Every dollar reaches the community fund. Coda covers the card fees.</p>

              <h4 className="ph-h2" id="ph-rate-label">
                How did it taste?
              </h4>
              <div className="ph-rate" role="group" aria-labelledby="ph-rate-label">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    className={`ph-rate__btn ${rating >= n ? "is-on" : ""}`}
                    onClick={() => setRating(rating === n ? 0 : n)}
                    aria-label={`${n} of 5`}
                    aria-pressed={rating >= n}
                  >
                    <Icon name="bean" />
                  </button>
                ))}
              </div>

              <div className="ph-actions ph-actions--one">
                <button className="ph-btn ph-btn--primary" onClick={() => onScreen("sent")}>
                  Send thanks{tip > 0 ? ` and $${tip}` : ""}
                </button>
              </div>
            </div>
          )}

          {screen === "sent" && (
            <div className="ph-sent">
              <div className="ph-sent__stamp">
                <Stamp>Thanks sent</Stamp>
              </div>
              <p className="ph-quote">“{message}”</p>
              <p className="ph-p ph-center">
                Your note is number {LOT.notes + 1} for this lot
                {sentTip > 0 ? `, with $${sentTip} for the community fund.` : "."}
              </p>
              <h4 className="ph-h2">What happens next</h4>
              <ol className="ph-next">
                <li>Translated, then checked by a person.</li>
                <li>Read out at the co-op’s next meeting.</li>
                <li>The growers’ reply lands in your passport.</li>
              </ol>
              {emailSaved ? (
                <p className="ph-chip ph-chip--leaf">
                  <Icon name="check" /> We will email you the reply
                </p>
              ) : (
                <form
                  className="ph-email"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (email.trim()) setEmailSaved(true);
                  }}
                >
                  <label className="ph-label" htmlFor="ph-email">
                    Want the reply by email?
                  </label>
                  <div className="ph-email__row">
                    <input
                      id="ph-email"
                      className="ph-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                    <button className="ph-btn" type="submit">
                      Notify me
                    </button>
                  </div>
                </form>
              )}
              <div className="ph-actions ph-actions--one">
                <button className="ph-btn ph-btn--primary" onClick={() => onScreen("passport")}>
                  Open my passport
                </button>
              </div>
            </div>
          )}

          {screen === "passport" && (
            <div>
              <p className="ph-eyebrow">Kept on this phone</p>
              <h3 className="ph-h1">Your coffee passport</h3>
              <div className="ph-stamps">
                <span className={`ph-pstamp ${sent ? "is-new" : ""}`}>
                  <b>Uganda</b>
                  <i>Nov 2026</i>
                </span>
                <span className="ph-pstamp ph-pstamp--b">
                  <b>Brazil</b>
                  <i>Aug 2025</i>
                </span>
                <span className="ph-pstamp ph-pstamp--c">
                  <b>Honduras</b>
                  <i>Mar 2025</i>
                </span>
                <span className="ph-pstamp ph-pstamp--empty" />
                <span className="ph-pstamp ph-pstamp--empty" />
                <span className="ph-pstamp ph-pstamp--empty" />
              </div>
              <div className="ph-stats ph-stats--4">
                <div>
                  <b>7</b>
                  <span>cups traced</span>
                </div>
                <div>
                  <b>{sent ? 4 : 3}</b>
                  <span>notes sent</span>
                </div>
                <div>
                  <b>1</b>
                  <span>reply</span>
                </div>
                <div>
                  <b>${6 + sentTip}</b>
                  <span>to co-op funds</span>
                </div>
              </div>
              <div className="ph-reply">
                <p className="ph-reply__from">
                  <Icon name="message" /> Reply from the growers, Brazil
                </p>
                <p>“Thank you. We read your notes aloud at our January meeting.”</p>
              </div>
              <p className="ph-fine">
                <Icon name="bell" /> Next: Brazil harvest news in May.
              </p>
              <div className="ph-actions ph-actions--one">
                <button className="ph-btn" onClick={() => onScreen("scan")}>
                  Scan another cup
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="ph-tabs" role="group" aria-label="App sections">
          {TABS.map((t) => (
            <button
              key={t.id}
              aria-pressed={tabFor(screen) === t.id}
              className={`ph-tab ${tabFor(screen) === t.id ? "is-on" : ""}`}
              onClick={() => onScreen(t.id)}
            >
              <Icon name={t.icon} />
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
