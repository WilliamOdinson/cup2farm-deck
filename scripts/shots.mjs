// Saves a 1600x952 screenshot of every slide (or the ones named) into shots/.
// Handy for a PDF or image backup of the deck.
//   npm run shots                    every slide as it opens
//   npm run shots -- --steps         every slide at every arrow-key step
//   npm run shots -- roi qa          only these slide ids (works with --steps)
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { openDeck, root, run, slideIds } from "./lib/browser.mjs";

await run(async () => {
  const args = process.argv.slice(2);
  const everyStep = args.includes("--steps");
  const wanted = args.filter((a) => !a.startsWith("--"));
  const flags = args.filter((a) => a.startsWith("--") && a !== "--steps");
  if (flags.length) throw new Error(`Unknown option: ${flags.join(", ")}. The only option is --steps.`);
  const unknown = wanted.filter((id) => !slideIds.includes(id));
  if (unknown.length) throw new Error(`Unknown slide id: ${unknown.join(", ")}. Known ids: ${slideIds.join(", ")}`);
  const ids = wanted.length ? wanted : slideIds;

  const out = resolve(root, "shots");
  mkdirSync(out, { recursive: true });
  const deck = await openDeck();
  let saved = 0;
  try {
    for (const id of ids) {
      await deck.show(id);
      const n = String(slideIds.indexOf(id) + 1).padStart(2, "0");
      const steps = everyStep ? await deck.page.evaluate(() => Number(document.querySelector(".deck__stage").dataset.steps) || 1) : 1;
      for (let s = 1; s <= steps; s++) {
        if (s > 1) {
          await deck.page.keyboard.press("ArrowRight");
          await deck.page.waitForTimeout(700); // let transitions and the phone's scroll settle
        }
        const step = steps > 1 ? `-step${String(s).padStart(2, "0")}` : "";
        await deck.page.screenshot({ path: resolve(out, `${n}-${id}${step}.png`) });
        saved += 1;
      }
    }
  } finally {
    await deck.close();
  }
  console.log(`shots: ${saved} saved to ${out}`);
  if (deck.errors.length) throw new Error(`Page errors:\n${deck.errors.join("\n")}`);
});
