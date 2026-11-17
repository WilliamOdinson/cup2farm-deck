import { Cup, Icon, Receipt, Slide } from "../ui/primitives.jsx";
import { Cols, Strip } from "../ui/layout.jsx";
import { TEAM, teamLine } from "../content/team.js";
import { turns } from "../content/outline.js";

export function TitleSlide() {
  return (
    <Slide variant="stage" hideHead className="s-title">
      <div className="t-grid">
        <div className="t-copy">
          <p className="t-kicker">Coda Coffee Benevolence Strategy</p>
          <h1 className="t-title">Cup2Farm</h1>
          <p className="t-sub">A code on every cup that shows the farmer was paid, and carries a thank-you back.</p>
          <p className="t-meta">
            <strong>{TEAM.name}</strong>
            <span>{teamLine()}</span>
          </p>
        </div>
        <div className="t-art" aria-hidden="true">
          <div className="t-cup">
            <Cup height={580} />
          </div>
          <Receipt
            className="t-receipt"
            head="LOT UG-GLC-0417"
            rows={[
              ["ORIGIN", "EASTERN UGANDA"],
              ["CUP SCORE EST.", "86"],
              ["STEPS ON LEDGER", "8 OF 9"],
              "-",
              ["FARMERS PAID", "SAME DAY"],
              ["THANK-YOUS BACK", "127"],
            ]}
            stamp="Sample lot"
          />
        </div>
      </div>
    </Slide>
  );
}

const COUNT_WORDS = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];

export function AgendaSlide() {
  const rows = turns();
  const voices = TEAM.members.length;
  const word = COUNT_WORDS[voices] || String(voices);
  let n = 0;
  return (
    <Slide title={`${word} ${voices === 1 ? "voice" : "voices"}, one recommendation`}>
      <ol className={`agenda ${rows.length > 9 ? "agenda--dense" : ""}`}>
        {rows.map((t, i) => {
          const isQa = t.parts.every((p) => p.id === "qa");
          const label = t.parts.map((p) => p.label).join(", ");
          if (!isQa) n += 1;
          return (
            <li key={`${t.presenter}-${i}`} className="agenda__row">
              <span className="agenda__n">{isQa ? "" : n}</span>
              <span className="agenda__who">{t.presenter}</span>
              <span className="agenda__part">{label}</span>
            </li>
          );
        })}
      </ol>
    </Slide>
  );
}

const STEPS = [
  { icon: "qr", name: "Scan", text: "A code on the cup opens a web app. Nothing to download, no account." },
  { icon: "eye", name: "See", text: "The lot’s journey, checked against Bext360’s ledger, with proof the farmers were paid." },
  { icon: "heart", name: "Thank", text: "Send a note or a tip. Growers hear it, and every dollar reaches their co-op." },
];

export function BlufSlide() {
  return (
    <Slide title="Our recommendation: one feature, three taps">
      <ol className="steps3">
        {STEPS.map((s, i) => (
          <li key={s.name} className="steps3__item">
            <div className="steps3__top">
              <span className="steps3__n">{i + 1}</span>
              <Icon name={s.icon} className="steps3__ico" />
            </div>
            <h3 className="steps3__name">{s.name}</h3>
            <p className="steps3__text">{s.text}</p>
          </li>
        ))}
      </ol>
    </Slide>
  );
}

const WHY = [
  {
    icon: "heart",
    head: "It is benevolent",
    text: "It informs and connects. It sells nothing, so it earns trust instead of spending it.",
  },
  {
    icon: "ledger",
    head: "The data already exists",
    text: "Machine-vision grades and blockchain records from the Bext360 partnership.",
  },
  {
    icon: "cup",
    head: "It reaches the unseen 95%",
    text: "Most people drink Coda in someone else’s cafe. The cup becomes Coda’s first consumer channel.",
  },
];

export function WhySlide() {
  return (
    <Slide title="Why this one area">
      <Cols items={WHY} />
      <Strip icon="target">
        <strong>One area, on purpose.</strong> Ordering and loyalty points belong to other areas of the future app.
      </Strip>
    </Slide>
  );
}
