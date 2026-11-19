import { Cup, Slide } from "../ui/primitives.jsx";
import { teamLine } from "../content/team.js";

/* ---------- Q&A: the last slide ---------- */
// The closing slide. Prepared answers to likely questions are in docs/qa.md, for the team to
// read before the talk; they are not part of the deck.
export function QASlide() {
  return (
    <Slide variant="stage" hideHead className="s-qa">
      <div className="qa">
        <div className="qa__copy">
          <p className="t-kicker">Thank you</p>
          <h2 className="qa__big">Questions?</h2>
          <p className="qa__line">Farm2Cup made Coda worth trusting. Cup2Farm lets people feel it.</p>
          <p className="qa__team">{teamLine()}</p>
        </div>
        <div className="qa__art" aria-hidden="true">
          <Cup height={540} label="Scan to say thanks" />
        </div>
      </div>
    </Slide>
  );
}
