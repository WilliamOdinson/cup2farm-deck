import { Icon, QR, Slide, Src } from "../ui/primitives.jsx";
import { Cols, Strip } from "../ui/layout.jsx";

/* ---------- Expected outcomes ---------- */
const KPIS = [
  { dim: "Trust", how: "Survey before and after, against a control group", goal: "A clear lift in “a brand I trust”" },
  { dim: "Reach", how: "Scans per 100 coded cups", goal: "2 to 3" },
  { dim: "Bond", how: "Scanners who send thanks", goal: "1 in 5" },
  { dim: "Origin", how: "Notes delivered to growers", goal: "Each answered within 30 days" },
  { dim: "Business", how: "Partner cafes carrying the code", goal: "20" },
];

export function OutcomesSlide() {
  return (
    <Slide title="What success looks like after 12 months" sources={<Src>Team targets. Survey design follows Urban and Sultan 2015.</Src>}>
      <table className="kpi">
        <thead>
          <tr>
            <th scope="col" />
            <th scope="col">How we measure it</th>
            <th scope="col">Target</th>
          </tr>
        </thead>
        <tbody>
          {KPIS.map((k) => (
            <tr key={k.dim}>
              <th scope="row">{k.dim}</th>
              <td>{k.how}</td>
              <td>{k.goal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Slide>
  );
}

/* ---------- Branding: what the sleeve says ---------- */
const BRAND = [
  { head: "A name", text: "Most drinkers never learn the coffee is Coda’s. Now the sleeve says so." },
  { head: "A promise to check", text: "“Coffee that does good” stops being a slogan and becomes a record." },
  { head: "A shared badge", text: "The cafe’s name sits beside Coda’s, so both earn the trust." },
];

export function BrandSlide() {
  return (
    <Slide
      title="The brand finally travels with the coffee"
      sources={<Src>Case (end consumers rarely know the coffee is Coda’s; the stores mainly help the brand). Sleeve is a mock-up.</Src>}
    >
      <div className="sleeve" role="img" aria-label="Mock-up of a cup sleeve: a QR code, the words Scan to meet the grower, a lot number, Roasted by Coda Coffee, and a space for the cafe’s name">
        <span className="sleeve__qr">
          <QR size={172} quiet={2} title="" />
        </span>
        <span className="sleeve__main">
          <span className="sleeve__cta">Scan to meet the grower</span>
          <span className="sleeve__lot lot">LOT UG-GLC-0417, EASTERN UGANDA</span>
        </span>
        <span className="sleeve__by">
          <span>Roasted by</span>
          <strong>Coda Coffee</strong>
          <span>Served at</span>
          <strong>your cafe’s name</strong>
        </span>
      </div>
      <Cols items={BRAND} />
    </Slide>
  );
}

/* ---------- Socioeconomic impact ---------- */
const GAINS = [
  { icon: "sprout", head: "Farmers", text: "Recognition, feedback, community income, and a record that can support credit." },
  { icon: "cup", head: "Drinkers", text: "A straight answer about where the money goes, in a year of record prices." },
  { icon: "store", head: "Cafes", text: "A trust feature that independents can offer and chains cannot copy quickly." },
  { icon: "flame", head: "Coda", text: "Its first relationship with drinkers, and a reason for buyers to stay." },
];

export function GainsSlide() {
  return (
    <Slide title="Who gains" sources={<Src>Case; Fairtrade 2023.</Src>}>
      <Cols items={GAINS} n={4} className="cols--tight" />
      <Strip icon="globe">
        <strong>The wider effect:</strong> growers keep about 1% of a cafe cup’s price. Cup2Farm adds recognition,
        feedback and tips on top.
      </Strip>
    </Slide>
  );
}

/* ---------- Now, next, later ---------- */
const ROAD = [
  { head: "Now", text: "The thank-you loop: scan, see, thank. One origin, Coda’s own cafes.", tag: "This recommendation", tagTone: "cherry" },
  { head: "Next", text: "A passport of origins, harvest news, and pages for partner cafes.", tag: "Keeps people coming back" },
  { head: "Later", text: "Brew guides for each lot, a find-a-cup map, and farm records that help growers borrow.", tag: "Expands the app" },
];

export function RoadmapSlide() {
  return (
    <Slide title="Now, next, later" sources={<Src>Case (lending and token ideas from Bext360).</Src>}>
      <Cols items={ROAD} className="cols--big" />
      <Strip icon="loop">Engagement comes from new lots, replies and harvests. Not from points.</Strip>
    </Slide>
  );
}

/* ---------- Meets the brief ---------- */
const BRIEF = [
  ["One focused area", "the verified thank-you loop"],
  ["Benevolent, not push", "it sells nothing"],
  ["Built on current technology", "bextmachine, AI, IoT, blockchain"],
  ["Keeps the model and values", "wholesale first, premiums untouched"],
  ["Not a store", "ordering stays out of this area"],
  ["Adoption defended", "no download, an existing habit, a real motive"],
  ["Room to grow", "passport, brew guides, map, farm credit"],
];

export function BriefSlide() {
  return (
    <Slide variant="stage" title="What Coda asked for, and how Cup2Farm answers">
      <ul className="brief">
        {BRIEF.map(([ask, answer]) => (
          <li key={ask}>
            <span className="brief__ico">
              <Icon name="check" />
            </span>
            <span>
              <strong>{ask}</strong>
              <span>{answer}</span>
            </span>
          </li>
        ))}
      </ul>
    </Slide>
  );
}
