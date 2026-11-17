import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Icon, SlideMeta } from "./ui/primitives.jsx";
import { SLIDES } from "./content/slides.jsx";
import { PARTS } from "./content/team.js";

const STAGE_W = 1600;
const STAGE_H = 900;

const fmt = (secs) => `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

// Slides grouped by part, in deck order, for the progress bar and the overview.
const GROUPS = PARTS.map((part) => ({
  part,
  items: SLIDES.map((s, i) => ({ s, i })).filter(({ s }) => s.part === part.id),
})).filter((g) => g.items.length > 0);

const TOTAL_SECS = SLIDES.reduce((a, s) => a + s.secs, 0);

function indexFromHash() {
  try {
    const id = (window.location.hash || "").replace(/^#/, "");
    const i = SLIDES.findIndex((s) => s.id === id);
    return i >= 0 ? i : 0;
  } catch {
    return 0;
  }
}

function writeHash(id) {
  try {
    window.history.replaceState(null, "", `#${id}`);
  } catch {
    try {
      window.location.hash = id;
    } catch {
      /* hash routing is a convenience; the deck works without it */
    }
  }
}

const isTypingTarget = (el) =>
  !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable);

export default function App() {
  // Where the deck is: which slide, and which step within that slide.
  const [pos, setPos] = useState(() => ({ index: indexFromHash(), step: 0 }));
  const [dir, setDir] = useState("");
  const [seen, setSeen] = useState(() => new Set([pos.index]));
  const [scale, setScale] = useState(1);
  const [overview, setOverview] = useState(false);
  const [notes, setNotes] = useState(false);
  const [toast, setToast] = useState("");
  const vpRef = useRef(null);
  const swipe = useRef(null);
  const closeRef = useRef(null);

  const total = SLIDES.length;
  const { index, step } = pos;
  const slide = SLIDES[index];
  const next = SLIDES[index + 1];

  // A ref mirrors the position so rapid key presses resolve against the latest one.
  const posRef = useRef(pos);
  const move = useCallback(
    (to) => {
      const cur = posRef.current;
      const i = clamp(to.index, 0, total - 1);
      const s = clamp(to.step, 0, SLIDES[i].steps - 1);
      if (i === cur.index && s === cur.step) return;
      posRef.current = { index: i, step: s };
      if (i !== cur.index) {
        setDir(i > cur.index ? "is-fwd" : "is-back");
        setSeen((set) => (set.has(i) ? set : new Set(set).add(i)));
      }
      setPos({ index: i, step: s });
    },
    [total]
  );

  // One press forward or back. Forward walks the steps of the slide first and then opens the
  // next slide; back retraces the same path, landing on the last step of the previous slide.
  const advance = useCallback(
    (delta) => {
      const cur = posRef.current;
      if (delta > 0) {
        if (cur.step < SLIDES[cur.index].steps - 1) move({ index: cur.index, step: cur.step + 1 });
        else if (cur.index < total - 1) move({ index: cur.index + 1, step: 0 });
      } else if (cur.step > 0) {
        move({ index: cur.index, step: cur.step - 1 });
      } else if (cur.index > 0) {
        move({ index: cur.index - 1, step: SLIDES[cur.index - 1].steps - 1 });
      }
    },
    [move, total]
  );

  const goTo = useCallback((i) => move({ index: i, step: 0 }), [move]);
  // For the slide on stage: a click on one of its states moves the deck to that step.
  const setStep = useCallback((s) => move({ index: posRef.current.index, step: s }), [move]);

  // Fit the fixed-size stage into the window.
  useEffect(() => {
    const el = vpRef.current;
    if (!el) return undefined;
    const fit = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width > 0 && height > 0) setScale(Math.min(width / STAGE_W, height / STAGE_H));
    };
    fit();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", fit);
      return () => window.removeEventListener("resize", fit);
    }
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Keep the address in step with the slide, and follow manual hash changes.
  useEffect(() => {
    writeHash(slide.id);
  }, [slide.id]);

  useEffect(() => {
    const onHash = () => {
      const i = indexFromHash();
      if (i !== posRef.current.index) goTo(i);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [goTo]);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      setToast("Fullscreen is blocked in this frame. Open the page in its own tab, then press F.");
    }
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(""), 4200);
    return () => clearTimeout(t);
  }, [toast]);

  // Opening the overview moves the keyboard into it.
  useEffect(() => {
    if (overview && closeRef.current) closeRef.current.focus();
  }, [overview]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target;
      if (isTypingTarget(t)) return;
      const onControl = t && (t.tagName === "BUTTON" || t.tagName === "A");
      // While the overview is open, the keys belong to it: only closing shortcuts pass.
      if (overview && !["Escape", "o", "O", "g", "G"].includes(e.key)) return;
      switch (e.key) {
        case "ArrowRight":
        case "PageDown":
          e.preventDefault();
          advance(1);
          break;
        case " ":
          if (onControl) return;
          e.preventDefault();
          advance(e.shiftKey ? -1 : 1);
          break;
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          advance(-1);
          break;
        case "Home":
          e.preventDefault();
          goTo(0);
          break;
        case "End":
          e.preventDefault();
          goTo(total - 1);
          break;
        case "o":
        case "O":
        case "g":
        case "G":
          setOverview((v) => !v);
          break;
        case "n":
        case "N":
          setNotes((v) => !v);
          break;
        case "f":
        case "F":
          toggleFullscreen();
          break;
        case "Escape":
          setOverview(false);
          break;
        default:
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [advance, goTo, total, toggleFullscreen, overview]);

  // After a mouse or touch click on a slide control, hand the keyboard back to the deck, so
  // Space and the arrow keys keep driving the slides. Keyboard activation keeps its focus.
  const releaseFocus = (e) => {
    if (e.detail === 0) return;
    const el = e.target instanceof Element ? e.target.closest("button, input[type=range]") : null;
    if (el) requestAnimationFrame(() => el.blur());
  };

  // Swipe to navigate on touch screens, ignoring gestures that start on a control.
  const onPointerDown = (e) => {
    if (e.pointerType === "mouse") return;
    if (e.target.closest("button, a, input, textarea, [data-noswipe]")) return;
    swipe.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.abs(dx) > 60 && Math.abs(dy) < 50) advance(dx < 0 ? 1 : -1);
  };

  const elapsed = useMemo(() => SLIDES.slice(0, index + 1).reduce((a, s) => a + s.secs, 0), [index]);

  const meta = useMemo(
    () => ({
      sectionNo: slide.section.no,
      sectionLabel: slide.section.label,
      refs: slide.refs,
      footnote: slide.footnote,
      step,
      setStep,
    }),
    [slide, step, setStep]
  );

  const handover = next && next.presenter !== slide.presenter ? `Hand over to ${next.presenter}: ${next.partLabel}.` : "";
  const atStart = index === 0 && step === 0;
  const atEnd = index === total - 1 && step === slide.steps - 1;
  const Current = slide.Component;

  return (
    <div className="deck">
      <div className="deck__viewport" ref={vpRef} onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
        <div
          className="deck__stage"
          style={{ transform: `translate(-50%, -50%) scale(${scale})` }}
          onClickCapture={releaseFocus}
          data-step={step + 1}
          data-steps={slide.steps}
        >
          <SlideMeta.Provider value={meta}>
            <div className={`slide-wrap ${dir}`} key={slide.id}>
              <Current />
            </div>
          </SlideMeta.Provider>
          {notes && (
            <aside className="notes" aria-label="Speaker notes">
              <div>
                <p className="notes__label">
                  {slide.presenter}, {slide.partLabel}
                </p>
                <p className="notes__text">{slide.notes}</p>
                {handover && <p className="notes__handover">{handover}</p>}
              </div>
              <div className="notes__time">
                this slide <strong>{fmt(slide.secs)}</strong>
                <br />
                by the end {fmt(elapsed)} of {fmt(TOTAL_SECS)}
              </div>
            </aside>
          )}
        </div>

        {overview && (
          <div className="overview" role="dialog" aria-label="All slides">
            <div className="overview__head">
              <h2 className="overview__title">All slides</h2>
              <button className="overview__close" ref={closeRef} onClick={() => setOverview(false)}>
                Close (Esc)
              </button>
            </div>
            {GROUPS.map(({ part, items }) => (
              <div key={part.id}>
                <p className="overview__sec">
                  {part.label} <span>{part.presenter}</span>
                </p>
                <div className="overview__grid">
                  {items.map(({ s, i }) => (
                    <button
                      key={s.id}
                      className={`overview__card ${i === index ? "is-now" : ""}`}
                      onClick={() => {
                        goTo(i);
                        setOverview(false);
                      }}
                    >
                      <span className="overview__num">{String(i + 1).padStart(2, "0")}</span>
                      <span>{s.label}</span>
                      <span className="overview__time">{fmt(s.secs)}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="rotate-hint">Turn your phone sideways for a larger view.</p>
        {toast && (
          <div className="bar__toast" role="status">
            {toast}
          </div>
        )}
      </div>

      <nav className="bar" aria-label="Slide controls">
        <span className="bar__brand">Cup2Farm</span>
        <span className="bar__sec">{slide.partLabel}</span>
        <div className="bar__progress">
          {GROUPS.map(({ part, items }) => (
            <div className="bar__group" key={part.id} style={{ flexGrow: items.length }} title={part.label}>
              {items.map(({ s, i }) => (
                <button
                  key={s.id}
                  className={`bar__seg ${i === index ? "is-now" : seen.has(i) ? "is-seen" : ""}`}
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}: ${s.label}`}
                  aria-current={i === index ? "step" : undefined}
                  title={`${i + 1}. ${s.label}`}
                />
              ))}
            </div>
          ))}
        </div>
        {slide.steps > 1 && (
          <span className="bar__step" aria-live="polite">
            step {step + 1} of {slide.steps}
          </span>
        )}
        <span className="bar__count">
          {index + 1} / {total}
        </span>
        <div className="bar__btns">
          <button className="bar__btn" onClick={() => advance(-1)} disabled={atStart} aria-label="Back one step" title="Back (left arrow)">
            <Icon name="chevL" />
          </button>
          <button className="bar__btn" onClick={() => advance(1)} disabled={atEnd} aria-label="Forward one step" title="Forward (right arrow or space)">
            <Icon name="chevR" />
          </button>
          <button className={`bar__btn ${overview ? "is-on" : ""}`} onClick={() => setOverview((v) => !v)} aria-label="All slides" aria-pressed={overview} title="All slides (O)">
            <Icon name="grid" />
          </button>
          <button className={`bar__btn ${notes ? "is-on" : ""}`} onClick={() => setNotes((v) => !v)} aria-label="Speaker notes" aria-pressed={notes} title="Speaker notes (N)">
            <Icon name="notes" />
          </button>
          <button className="bar__btn" onClick={toggleFullscreen} aria-label="Fullscreen" title="Fullscreen (F)">
            <Icon name="expand" />
          </button>
        </div>
      </nav>
    </div>
  );
}
