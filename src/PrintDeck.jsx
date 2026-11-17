import { useEffect, useMemo, useState } from "react";
import { SlideMeta } from "./ui/primitives.jsx";
import { SLIDES } from "./content/slides.jsx";

// The print view: one page for every state the right arrow reaches, in talk order.
// Open the deck with "?print" to see it; "npm run export:pdf" prints it to a PDF, and the
// browser's own print dialog works too. Speaker notes are not part of it.
const PAGES = SLIDES.flatMap((slide) => Array.from({ length: slide.steps }, (_, step) => ({ slide, step })));

const still = () => {}; // a printed page does not change step

const twoFrames = () => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));

function Page({ slide, step }) {
  const meta = useMemo(
    () => ({
      sectionNo: slide.section.no,
      sectionLabel: slide.section.label,
      refs: slide.refs,
      footnote: slide.footnote,
      step,
      setStep: still,
    }),
    [slide, step]
  );
  const Current = slide.Component;
  return (
    <section className="print__page" data-slide={slide.id} data-step={step + 1} data-steps={slide.steps}>
      {/* The sheet is always laid out at 1600x900; print scales it to the paper (see styles.css). */}
      <div className="print__sheet">
        <SlideMeta.Provider value={meta}>
          <Current />
        </SlideMeta.Provider>
      </div>
    </section>
  );
}

export default function PrintDeck() {
  // The pages are laid out twice. The first pass makes the browser fetch the fonts the deck
  // really uses. The second, once they are in, mounts every page again, so anything a slide
  // measures on mount (the phone scrolling to a journey step) sees the final text metrics.
  const [pass, setPass] = useState(0);

  useEffect(() => {
    let live = true;
    (async () => {
      await twoFrames();
      if (pass === 0) {
        try {
          await document.fonts.ready;
        } catch {
          /* without the Font Loading API there is nothing to wait for */
        }
        if (live) setPass(1);
      } else if (live) {
        // This effect runs after every page's own mount effects, and two frames have passed
        // since, so the layout is final. The export script waits for this flag.
        document.documentElement.dataset.printReady = "true";
      }
    })();
    return () => {
      live = false;
    };
  }, [pass]);

  return (
    <main className="print" key={pass} aria-label="Cup2Farm deck, print view">
      {PAGES.map(({ slide, step }) => (
        <Page key={`${slide.id}-${step}`} slide={slide} step={step} />
      ))}
    </main>
  );
}
