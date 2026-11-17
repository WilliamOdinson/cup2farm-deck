import { Slide, Src } from "../ui/primitives.jsx";
import { Rows, Stat, Strip } from "../ui/layout.jsx";

export function FrictionSlide() {
  return (
    <Slide title="Low friction: nothing to install, nothing to sign" sources={<Src>AppsFlyer 2026; Uniqode 2026.</Src>}>
      <div className="stats stats--3" style={{ "--n": 3 }}>
        <Stat
          value="3%"
          label="of food and drink app users are still active after 30 days"
          note="So we never ask for a download. The code opens a web page."
        />
        <Stat value="70%" label="of US consumers already scan codes every month" note="And this code is in their hand while they wait." />
        <Stat value="0" label="accounts needed to see the story" note="Signing in is only for getting the growers’ reply." />
      </div>
    </Slide>
  );
}

const WHEEL = [
  { name: "Intent", line: "Who grew this, and were they paid?" },
  { name: "Interact", line: "Scan, read the journey, send thanks." },
  { name: "Identity", line: "I know where my coffee comes from." },
];

// Three ring segments with gaps, drawn clockwise from the top.
function arc(cx, cy, r, a0, a1) {
  const p = (a) => [cx + r * Math.cos((a - 90) * (Math.PI / 180)), cy + r * Math.sin((a - 90) * (Math.PI / 180))];
  const [x0, y0] = p(a0);
  const [x1, y1] = p(a1);
  return `M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
}

export function MotiveSlide() {
  const colors = ["#c5162e", "#1e7fa8", "#b87c00"];
  return (
    <Slide title="A real motive, not a hook" sources={<Src>Lecture (algorithmic experience wheel: intent, interact, identity).</Src>}>
      <div className="motive">
        <svg className="motive__wheel" viewBox="0 0 460 460" role="img" aria-label="A wheel with three segments: intent, interact, identity">
          <defs>
            {colors.map((c, i) => (
              <marker key={c} id={`wheel-${i}`} viewBox="0 0 12 12" refX="6" refY="6" markerWidth="2.300" markerHeight="2.300" orient="auto">
                <path d="M0 0L12 6L0 12z" fill={c} />
              </marker>
            ))}
          </defs>
          {[0, 1, 2].map((i) => (
            <path key={i} d={arc(230, 230, 170, i * 120 + 8, i * 120 + 100)} fill="none" stroke={colors[i]} strokeWidth="50" markerEnd={`url(#wheel-${i})`} />
          ))}
          <text x="230" y="218" textAnchor="middle" className="motive__c1">
            ends when
          </text>
          <text x="230" y="258" textAnchor="middle" className="motive__c1">
            the cup does
          </text>
        </svg>
        <ol className="motive__list">
          {WHEEL.map((w, i) => (
            <li key={w.name}>
              <span className="motive__key" style={{ background: colors[i] }} />
              <span>
                <strong>{w.name}</strong>
                <span>{w.line}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
      <Strip plain>The same loop the attention economy uses, pointed at the drinker’s interest instead of their time.</Strip>
    </Slide>
  );
}

const RETURN = [
  { icon: "bean", head: "A new lot every time", text: "Each bag and each cafe visit carries a different story." },
  { icon: "message", head: "Growers write back", text: "Replies arrive within weeks." },
  { icon: "sprout", head: "Harvest news", text: "Twice a year from each origin you follow." },
  { icon: "globe", head: "A passport of origins", text: "It fills as you taste. There are no points to chase." },
];

export function ReturnSlide() {
  return (
    <Slide title="Four honest reasons to come back" sources={<Src>Urban and Sultan 2015 (Liberty Mutual study).</Src>}>
      <Rows items={RETURN} n={2} />
      <Strip icon="star">
        Users rated Liberty Mutual’s benevolent app above 4 out of 5 for being meaningful, believable and relevant.
      </Strip>
    </Slide>
  );
}
