import { useState } from "react";
import { Cup, Icon, Slide, Src } from "../ui/primitives.jsx";
import { Cols, Rows, Stat, Strip } from "../ui/layout.jsx";

/* ---------- What Coda stands for ---------- */
const COMMITMENTS = [
  { icon: "coin", head: "Pays farmers more", text: "About three times the commodity price for raw coffee." },
  { icon: "sprout", head: "Coaches for quality", text: "Farm2Cup trains growers and pays premiums for results." },
  { icon: "shield", head: "Holds itself to account", text: "Certified B Corp since 2013. Roast Magazine’s Macro Roaster of the Year." },
  { icon: "users", head: "Gives back", text: "Health and education projects at origin. Neurodiverse hiring in Denver." },
];

export function StandsForSlide() {
  return (
    <Slide title="Coda stands for coffee that does good" sources={<Src>Case.</Src>}>
      <Rows items={COMMITMENTS} n={2} />
      <Strip icon="lock">
        <strong>Our guardrails:</strong> farmer premiums stay untouched, quality comes first, and trust is never traded
        for a sale.
      </Strip>
    </Slide>
  );
}

/* ---------- Timeline ---------- */
const TIMELINE = [
  {
    y: "2005",
    t: "Founded in Denver",
    d: "Brothers Tim and Tommy Thwaites start a wholesale roaster with $150,000 from their father’s retirement savings.",
  },
  {
    y: "2011",
    t: "Farm2Cup",
    d: "Coda’s own certification. Farmers learn to raise quality, and earn significant premiums when they do.",
  },
  {
    y: "2013",
    t: "B Corp, top roaster",
    d: "B Corp certification and Roast Magazine’s Macro Roaster of the Year arrive in the same year.",
  },
  {
    y: "2015",
    t: "First cafe",
    d: "A store opens in Edgewater, Colorado. By 2018 there are four: modest sales, strong branding, a live test lab.",
  },
  {
    y: "2017",
    t: "Bext360 pilot",
    d: "In Uganda a bextmachine grades each farmer’s cherries and writes every step to a blockchain. Farmers are paid on the spot.",
  },
  {
    y: "2018",
    t: "Scaling the proof",
    d: "A larger project follows in Brazil with supplier AFASA. More than 95% of the business is still wholesale.",
  },
  {
    y: "2020",
    t: "Joins PFG",
    d: "Coda becomes the top-tier coffee brand of Performance Food Group, a national foodservice distributor.",
  },
];

export function TimelineSlide() {
  const [sel, setSel] = useState(4);
  const item = TIMELINE[sel];
  return (
    <Slide
      title="Fifteen years of doing good, then proving it"
      sources={<Src>Case; PFG 2022 (2020 acquisition); codacoffee.com.</Src>}
    >
      <div className="tl" role="group" aria-label="Coda Coffee timeline" data-noswipe>
        {TIMELINE.map((t, i) => (
          <button key={t.y} aria-pressed={i === sel} className={`tl__stop ${i === sel ? "is-on" : ""}`} onClick={() => setSel(i)}>
            <span className="tl__dot" />
            <span className="tl__year">{t.y}</span>
            <span className="tl__label">{t.t}</span>
          </button>
        ))}
      </div>
      <div className="tl__detail" aria-live="polite">
        <div className="tl__detail-year">{item.y}</div>
        <div>
          <h3 className="tl__detail-head">{item.t}</h3>
          <p className="tl__detail-text">{item.d}</p>
        </div>
      </div>
    </Slide>
  );
}

/* ---------- Supply chain stakeholders ---------- */
const CHAIN = [
  {
    icon: "sprout",
    name: "Smallholder farmer",
    role: "Grows and hand-picks cherries on a few acres. About 25 million smallholders grow 80% of the world’s coffee.",
    wants: "Fair pay without a 30-day wait.",
    data: "Deliveries and payments.",
  },
  {
    icon: "users",
    name: "Co-op and washing station",
    role: "Buys cherries, then depulps, washes, ferments and dries them. Hosts the bextmachine.",
    wants: "Better prices, direct buyers, credit.",
    data: "Members, grades, receipts.",
  },
  {
    icon: "ship",
    name: "Miller and exporter",
    role: "Mills, grades and ships green coffee. Great Lakes Coffee in Uganda, AFASA in Brazil.",
    wants: "Proof of quality that earns a premium.",
    data: "Milling and shipping records.",
  },
  {
    icon: "flame",
    name: "Coda roastery",
    role: "Sources face to face, roasts in Denver, trains the cafes that serve its coffee.",
    wants: "Quality, and a story it can prove.",
    data: "Roast batches and the Bext360 record.",
  },
  {
    icon: "truck",
    name: "Wholesale customers",
    role: "Distributors, restaurants, cafes, food suppliers. More than 95% of Coda’s business.",
    wants: "Something that sets their cup apart.",
    data: "Where the coffee is served.",
  },
  {
    icon: "store",
    name: "Coda cafes",
    role: "Four Colorado stores by 2018. Good for branding and for testing new coffees.",
    wants: "Regulars and honest feedback.",
    data: "Sales and reactions at the counter.",
  },
  {
    icon: "cup",
    name: "Coffee drinker",
    role: "Enjoys the cup, usually without knowing it is Coda’s.",
    wants: "A reason to trust what is behind it.",
    data: "None reaches Coda today.",
  },
];

export function ChainSlide() {
  const [sel, setSel] = useState(6);
  const node = CHAIN[sel];
  return (
    <Slide title="Seven hands touch the coffee. Only the last never hears the story." sources={<Src>Case.</Src>}>
      <div className="chain" role="group" aria-label="Coffee supply chain" data-noswipe>
        {CHAIN.map((c, i) => (
          <button
            key={c.name}
            aria-pressed={i === sel}
            className={`chain__node ${i === sel ? "is-on" : ""} ${i === 3 ? "is-coda" : ""}`}
            onClick={() => setSel(i)}
          >
            <span className="chain__ico">
              <Icon name={c.icon} />
            </span>
            <span className="chain__name">{c.name}</span>
          </button>
        ))}
      </div>
      <div className="chain__split" aria-hidden="true">
        <span>Supply chain at origin</span>
        <span>Denver</span>
        <span>B2B and B2C customers</span>
      </div>
      <div className="chain__detail card" aria-live="polite">
        <p className="chain__role">
          <strong>{node.name}.</strong> {node.role}
        </p>
        <dl className="chain__dl">
          <div>
            <dt>Wants</dt>
            <dd>{node.wants}</dd>
          </div>
          <div>
            <dt>Data it holds</dt>
            <dd>{node.data}</dd>
          </div>
        </dl>
      </div>
    </Slide>
  );
}

/* ---------- Competitors ---------- */
const RIVALS = [
  {
    icon: "truck",
    head: "Wholesale roasters",
    text: "Sell to the same kinds of cafes and restaurants. Dillanos, where the founders trained, is one.",
    tag: "Compete on quality and price",
  },
  {
    icon: "phone",
    head: "Chains with apps",
    text: "Starbucks has 35.8 million active US Rewards members. Dutch Bros and Dunkin’ run similar apps.",
    tag: "Compete on points and speed",
  },
  {
    icon: "bean",
    head: "Specialty peers",
    text: "Independent roasters and subscription brands, each with a farm story on the bag.",
    tag: "Compete on stories",
  },
];

export function RivalsSlide() {
  return (
    <Slide
      title="Everyone tells an origin story. Almost no one shows the receipt."
      sources={<Src>Case; Restaurant Dive 2026 (Starbucks Rewards).</Src>}
    >
      <Cols items={RIVALS} />
    </Slide>
  );
}

/* ---------- Trends ---------- */
export function TrendsASlide() {
  return (
    <Slide title="People drink better coffee, and pay more for it" sources={<Src>NCA 2026; StoneX 2026; Fairtrade 2023.</Src>}>
      <div className="stats">
        <Stat
          theme="Specialty is mainstream"
          value="48%"
          label="of US adults drank specialty coffee yesterday"
          note="A record. Specialty now outdrinks traditional coffee."
        />
        <Stat
          theme="Prices raise questions"
          value="$9.72"
          label="a pound for ground coffee at US retail, April 2026"
          note="An all-time high. Growers typically keep about 1% of the price of a cafe cup."
        />
      </div>
    </Slide>
  );
}

export function TrendsBSlide() {
  return (
    <Slide title="They already scan, and they buy on trust" sources={<Src>Uniqode 2026; PwC 2024; Edelman 2025.</Src>}>
      <div className="stats">
        <Stat
          theme="Scanning is a habit"
          value="70%"
          label="of US consumers scan a QR code at least once a month"
          note="Restaurants are the most common place to do it."
        />
        <Stat
          theme="Trust decides purchases"
          value="9.7%"
          label="more is what shoppers say they would pay for sustainable sourcing"
          note="Trust now ranks with price and quality in what people buy."
        />
      </div>
    </Slide>
  );
}

export function SoWhatSlide() {
  return (
    <Slide variant="stage" hideHead sources={<Src>EUDR; Lecture (the age of algorithms).</Src>}>
      <div className="sowhat">
        <p className="sowhat__big">Proof is becoming expected. Benevolence is still rare.</p>
        <div className="sowhat__rows">
          <p>
            <Icon name="scale" />
            <span>From 30 December 2026 the EU requires farm-plot locations for coffee. Tracing becomes table stakes.</span>
          </p>
          <p>
            <Icon name="bell" />
            <span>People are tired of apps that farm attention. One that asks for little stands out.</span>
          </p>
        </div>
      </div>
    </Slide>
  );
}

/* ---------- Problem and opportunity ---------- */
export function ProblemSlide() {
  return (
    <Slide variant="stage" title="Coda earns trust at origin. It never reaches the cup." sources={<Src>Case.</Src>}>
      <div className="pb-grid">
        <div>
          <p className="pb-num">95%+</p>
          <p className="pb-cap">of Coda’s business is wholesale. Most people who drink its coffee never learn whose it is.</p>
        </div>
        <div className="pb-cups" aria-hidden="true">
          <figure>
            <Cup withCode={false} height={360} sleeve="#8a7a7e" label={null} />
            <figcaption>Today</figcaption>
          </figure>
          <figure>
            <Cup height={360} label={null} />
            <figcaption>With Cup2Farm</figcaption>
          </figure>
        </div>
      </div>
    </Slide>
  );
}

const GAPS = [
  { icon: "eyeOff", head: "The proof stops at the roastery", text: "A ledger records every step. No drinker ever sees it." },
  { icon: "users", head: "Coda cannot know its drinkers", text: "It knows its farmers by name, and almost none of the people it serves." },
  { icon: "store", head: "Four cafes are not a channel", text: "Good for branding and tests, too few for reach." },
];

export function GapsSlide() {
  return (
    <Slide title="Three gaps, one opening" sources={<Src>Case (wholesale share, retail stores, closing questions).</Src>}>
      <Cols items={GAPS} />
      <Strip icon="cup">
        <strong>The opening:</strong> the cup is the one channel Coda already has in every cafe and restaurant it
        supplies.
      </Strip>
    </Slide>
  );
}
