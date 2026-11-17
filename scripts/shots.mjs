// Saves a 1600x952 screenshot of every slide (or the ones named) into shots/.
// Handy for a PDF or image backup of the deck.
//   npm run shots              all slides
//   npm run shots -- roi qa    only these slide ids
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { openDeck, root, run, slideIds } from "./lib/browser.mjs";

await run(async () => {
  const wanted = process.argv.slice(2);
  const unknown = wanted.filter((id) => !slideIds.includes(id));
  if (unknown.length) throw new Error(`Unknown slide id: ${unknown.join(", ")}. Known ids: ${slideIds.join(", ")}`);
  const ids = wanted.length ? wanted : slideIds;

  const out = resolve(root, "shots");
  mkdirSync(out, { recursive: true });
  const deck = await openDeck();
  try {
    for (const id of ids) {
      await deck.show(id);
      const n = String(slideIds.indexOf(id) + 1).padStart(2, "0");
      await deck.page.screenshot({ path: resolve(out, `${n}-${id}.png`) });
    }
  } finally {
    await deck.close();
  }
  console.log(`shots: ${ids.length} saved to ${out}`);
  if (deck.errors.length) throw new Error(`Page errors:\n${deck.errors.join("\n")}`);
});
