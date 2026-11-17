// The deck as data: order, owner (via `part`), speaking time, speaker notes, and what each
// slide cites. `refs` are ids from sources.js, shown in the slide footer in APA style;
// `footnote` is a line of our own under them (what is team judgment, what is a mock-up).
// No JSX here, so tests and tooling can import it directly.
import { PARTS } from "./team.js";

// Rubric areas from the assignment. Section 0 is the opening; 5 is the Q&A.
export const SECTIONS = [
  { no: null, label: "Opening" },
  { no: "1", label: "Problem scoping" },
  { no: "2", label: "Problem solving" },
  { no: "3", label: "Tech and managerial" },
  { no: "4", label: "Conclusions" },
  { no: null, label: "Q&A" },
];

export const OUTLINE = [
  /* Opening */
  { id: "cup2farm", part: "opening", label: "Cup2Farm", secs: 15, notes: "Introduce the team and the brief in one breath: Coda asked for one benevolent area of a future web app. Ours is called Cup2Farm." },
  { id: "agenda", part: "opening", label: "Who presents what", secs: 15, notes: "Seven of us, each owning a part. We follow the assignment’s outline: the problem, the benevolent use case, the solution in detail, then expected outcomes." },
  { id: "bluf", part: "opening", label: "The recommendation", secs: 45, refs: ["case", "urban"], notes: "Bottom line first. Scan a code on the cup, see the verified journey and proof of payment, send thanks back to the growers. One feature, three taps." },
  { id: "why", part: "opening", label: "Why this one area", secs: 40, refs: ["case", "urban"], notes: "Three reasons: it is benevolent, the data already exists through Bext360, and it reaches the drinkers Coda never meets. Ordering and loyalty are out of scope by design." },

  /* 1. Problem scoping: client and industry */
  { id: "stands-for", part: "client", label: "What Coda stands for", secs: 40, refs: ["case"], notes: "Coda is a Denver wholesale roaster built on paying farmers well and proving it. Its own mission statement speaks of coffee excellence through education, sustainability and partnerships. The guardrails at the bottom are the test for every design choice we make." },
  { id: "timeline", part: "client", label: "Fifteen years of proving it", secs: 35, refs: ["case", "pfg", "codasite"], notes: "Each press of the right arrow moves one stop along the timeline. Farm2Cup in 2011, B Corp in 2013, the Bext360 pilot in Uganda, and since 2020 ownership by PFG, which puts Coda in even more places without its name." },
  { id: "supply-chain", part: "client", label: "Seven hands in the chain", secs: 45, refs: ["case"], notes: "The right arrow walks the chain left to right: three stakeholders at origin, Coda in Denver, then its B2B and B2C customers. Everyone holds data except the drinker, who also knows the least." },
  { id: "rivals", part: "client", label: "Competitors", secs: 40, refs: ["case", "rewards"], notes: "Three kinds of rival. Wholesale roasters compete on quality and price, chains on points and speed, specialty peers on stories. None shows a farmer’s payment record." },

  /* 1. Problem scoping: trends and the problem */
  { id: "trends-coffee", part: "problem", label: "Trends: better coffee, higher prices", secs: 35, refs: ["nca", "stonex", "fairtrade"], notes: "Specialty coffee is now the majority habit, and retail prices are at a record. People are paying more and asking where the money goes." },
  { id: "trends-trust", part: "problem", label: "Trends: scanning and trust", secs: 35, refs: ["uniqode", "pwc", "edelman"], notes: "The behavior we need already exists: most people scan codes monthly, most often in restaurants. And trust now decides purchases alongside price and quality." },
  { id: "so-what", part: "problem", label: "Proof expected, benevolence rare", secs: 20, refs: ["eudr", "lecture"], notes: "Regulation is making traceability standard, so proof alone will not differentiate for long. What stays rare is an app that puts the user first." },
  { id: "problem", part: "problem", label: "The problem", secs: 35, refs: ["case"], notes: "This is the core problem. Over 95 percent of Coda’s business is wholesale, so the trust it earns at origin never reaches the person drinking the coffee." },
  { id: "gaps", part: "problem", label: "Three gaps, one opening", secs: 40, refs: ["case"], notes: "Three gaps, and one opening. The case ends by asking how Coda can sell the value of the Bext360 partnership to its customers. Our answer starts with the cup. Hand over to the use case." },

  /* 2. Problem solving: the benevolent use case */
  { id: "idea", part: "idea", label: "The idea: close the loop", secs: 45, refs: ["case"], notes: "Farm2Cup moves coffee and proof down the chain. Cup2Farm sends something back up: thanks, feedback and tips. One ledger, two directions." },
  { id: "exists-new", part: "idea", label: "What exists, what is new", secs: 35, refs: ["case", "freethink"], notes: "The expensive parts already run: machine-vision grading, the blockchain record, instant payment. We add a code, a web page and a return path." },
  { id: "spectrum", part: "idea", label: "The benevolence spectrum", secs: 45, refs: ["urban", "starbucks", "farmerconnect"], footnote: "Where the coffee apps and Cup2Farm sit is the team’s judgment.", notes: "Urban and Sultan place apps from product push to benevolent service. The right arrow crosses the spectrum, one example per zone: coffee chain apps on the left, Starbucks’ tracing tool in the middle, then Thank My Farmer and Cup2Farm at the far right, next to Sea Tow and The North Face." },
  { id: "benevolent", part: "idea", label: "What keeps it benevolent", secs: 40, refs: ["urban", "lecture"], notes: "Benevolence is a set of rules, not a tone. These are the commitments that stop the app sliding toward product push." },
  { id: "trust", part: "idea", label: "Three parts of trust", secs: 30, refs: ["urban", "case"], notes: "Trust is competence, confidence and benevolence. Coda has the first two on record. The app supplies the third. Hand over to the demo." },

  /* 2. Prototype */
  { id: "prototype", part: "prototype", label: "Prototype demo", secs: 140, notes: "Live demo, driven by the right arrow: scan the cup, see the journey, open the one step marked as reported, meet the grower and her receipt, send thanks, see it delivered, then open the passport. The panel on the right shows which data source feeds each screen. The phone also takes clicks, for adding a tip or a rating." },

  /* 2. Data */
  { id: "data-sources", part: "data", label: "Where the data comes from", secs: 50, refs: ["case", "bext"], notes: "Each source collects different data because of what does the collecting. The right arrow moves down the list: the bextmachine, the ledger, the co-op, the roastery, the cafes, and last the drinker’s own phone." },
  { id: "six-fields", part: "data", label: "Six fields from drinkers", secs: 35, refs: ["lecture"], notes: "We collect less on purpose. Six fields, all tied to an action the drinker chooses. This is the lecture’s point that trust plus value earns access to data." },
  { id: "learn", part: "data", label: "What the data lets Coda do", secs: 40, refs: ["lecture", "case"], notes: "Descriptive, predictive and prescriptive analytics, applied. The gains are in brand, sourcing and retail logistics, and quality. The same feedback goes back to farmers." },

  /* 2. Adoption and ROI */
  { id: "friction", part: "adoption", label: "Low friction", secs: 40, refs: ["braze", "uniqode"], footnote: "Retention figures are AppsFlyer data as reported by Braze.", notes: "Adoption starts with friction. Apps in this category lose almost everyone within a month, so we never ask for a download or an account." },
  { id: "motive", part: "adoption", label: "A real motive", secs: 40, refs: ["lecture"], notes: "The lecture’s algorithmic experience wheel: intent, interact, identity. We use the same loop, pointed at the drinker’s interest, and it ends when the cup does." },
  { id: "return", part: "adoption", label: "Reasons to come back", secs: 30, refs: ["urban"], notes: "Return visits come from real events: a new lot, a reply from growers, harvest news. No points and no streaks." },
  { id: "evidence", part: "adoption", label: "Evidence that benevolence pays", secs: 45, refs: ["urban"], footnote: "Liberty Mutual study of 750 consumers; Suruga Bank study of 1,500.", notes: "Liberty Mutual’s benevolent app raised consideration by 24 percent and purchase likelihood by 14 percent, for 1.41 times the sales potential among users. The Suruga Bank study in Japan found the same direction." },
  { id: "roi", part: "adoption", label: "ROI model", secs: 60, refs: ["urban"], footnote: "Team model for illustration. Its assumptions and their sources are on the next slide.", notes: "An illustrative model. It opens on year one: it does not pay for itself, and we say so. The right arrow moves to year two, then year three: returns rise with reach, mostly through wholesale, and year three only just clears break-even. The case rests on trust, not on this number. The sliders are there for questions." },
  { id: "assumptions", part: "adoption", label: "Model assumptions", secs: 15, refs: ["confluence", "consumeraffairs", "urban"], footnote: "Team estimates for illustration, not Coda financials.", notes: "The constants behind the model, for anyone who wants to check the arithmetic. Scenario inputs are ours; two rows cite sources. Do not read the table out." },
  { id: "reach", part: "adoption", label: "How it reaches people", secs: 30, refs: ["case"], notes: "Existing drinkers through Coda’s cafes and bags, new drinkers through partner cafes, and their friends through shared thank-you cards. Hand over to staying power." },

  /* 2. Staying power */
  { id: "innovation", part: "moat", label: "Infrastructure or innovation", secs: 40, refs: ["starbucks", "eudr", "case"], notes: "A code and a trace page are becoming infrastructure. What only Coda can add is proof of payment, a two-way channel and feedback into Farm2Cup." },
  { id: "scorecard", part: "moat", label: "Seven tests for a data advantage", secs: 45, refs: ["hagiu"], footnote: "Scores are the team’s assessment.", notes: "Hagiu and Wright’s seven questions, with our own scores and no flattery. The right arrow steps through the seven tests. The data alone is not a moat. The proprietary origin records and the partner network are." },

  /* 3. Tech and managerial */
  { id: "how-it-works", part: "tech", label: "How it works", secs: 45, refs: ["case", "bext", "freethink"], notes: "The right arrow walks the flow left to right. The first three steps exist today. The data layer, the code and the web app are new. The last press shows the return path, the red line." },
  { id: "tech-choices", part: "tech", label: "Two technology choices", secs: 40, refs: ["lecture", "webkit", "case"], notes: "A web app avoids app-store gatekeepers, the vendor data islands from the lecture. And AI stays where it already works; we avoid AI washing." },
  { id: "inside-coda", part: "tech", label: "What changes inside Coda", secs: 40, refs: ["case"], notes: "Four management changes. The first answers a question the case leaves open: Coda should secure its own rights to the data." },
  { id: "rollout", part: "tech", label: "Rollout", secs: 40, refs: ["urban", "case"], notes: "This follows Urban and Sultan’s steps: design a light version, test with users, then launch with marketing support. Coda’s cafes are the test lab. Hand over to risks." },

  /* 3. Risks and competition */
  { id: "data-risks", part: "risk", label: "Data risks", secs: 45, refs: ["case", "lecture"], notes: "Three groups, one press each: collection, use, and ownership and integrity. Two risks each, with the safeguard. The hardest is that a ledger proves a record was not changed, not that it was true." },
  { id: "landscape", part: "risk", label: "The competitive shift", secs: 35, refs: ["case"], footnote: "The shifts are the team’s analysis.", notes: "The biggest shift is in B2B. A cafe choosing a roaster now also chooses a feature its own customers can see." },
  { id: "precedents", part: "risk", label: "Precedents", secs: 35, refs: ["starbucks", "farmerconnect", "agridence"], notes: "Starbucks proved people will look. Thank My Farmer proved a shared platform with no owner does not last. Coda has the relationships to keep the promise." },
  { id: "partners", part: "risk", label: "Partnerships", secs: 35, refs: ["case", "pfg", "bext"], notes: "Six partners, each with something to gain. That mutual gain is what keeps the loop running." },

  /* 4. Conclusions */
  { id: "outcomes", part: "close", label: "Expected outcomes", secs: 40, refs: ["urban"], footnote: "Targets are the team’s. The survey design follows Urban and Sultan.", notes: "Trust first, business last. The trust measure copies the study design from the reading, so the result will be credible." },
  { id: "brand", part: "close", label: "What it does for the brand", secs: 30, refs: ["case"], footnote: "The sleeve is a mock-up.", notes: "Branding. The case says most people who drink Coda never learn whose coffee it is. The sleeve changes that: Coda’s name, a claim people can check, and the cafe’s name beside it." },
  { id: "who-gains", part: "close", label: "Who gains", secs: 35, refs: ["case", "fairtrade"], notes: "The socioeconomic case: farmers, drinkers, cafes and Coda each gain something different." },
  { id: "roadmap", part: "close", label: "Now, next, later", secs: 35, refs: ["case"], notes: "One area now, with room to grow. Engagement comes from real events, not from points." },
  { id: "brief", part: "close", label: "Meeting the brief", secs: 40, notes: "Seven things Coda asked for, and where we answered each. The next slide is Q&A." },

  /* The last slide */
  { id: "qa", part: "qa", label: "Q&A", secs: 0, notes: "Everyone answers. Nine likely questions have prepared answers: each press of the right arrow shows the next one, a click on a question jumps to it, and Escape returns to this slide." },
];

const partById = Object.fromEntries(PARTS.map((p) => [p.id, p]));

export const partOf = (slide) => partById[slide.part];
export const sectionOf = (slide) => SECTIONS[partOf(slide).section];

/** Seconds of speaking time per part id. */
export function partTimes() {
  const out = {};
  for (const s of OUTLINE) out[s.part] = (out[s.part] || 0) + s.secs;
  return out;
}

/** Seconds of speaking time per presenter. */
export function presenterTimes() {
  const out = {};
  for (const s of OUTLINE) {
    const who = partOf(s).presenter;
    out[who] = (out[who] || 0) + s.secs;
  }
  return out;
}

export const totalSecs = () => OUTLINE.reduce((a, s) => a + s.secs, 0);

/**
 * Speaking turns in talk order: consecutive parts with the same presenter are one turn.
 * A presenter who owns parts that are not next to each other gets one turn per run.
 */
export function turns() {
  const times = partTimes();
  const out = [];
  for (const p of PARTS) {
    const secs = times[p.id] || 0;
    const last = out[out.length - 1];
    if (last && last.presenter === p.presenter) {
      last.parts.push(p);
      last.secs += secs;
    } else {
      out.push({ presenter: p.presenter, parts: [p], secs });
    }
  }
  return out;
}
