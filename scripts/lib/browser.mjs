// Shared by the browser-based dev checks, which drive the standalone build in headless Chromium.
// Playwright is optional and is not listed in package.json. Install it once with:
//   npm i -D playwright && npx playwright install chromium
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { OUTLINE } from "../../src/content/outline.js";

export const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

/** Slide ids in deck order. */
export const slideIds = OUTLINE.map((s) => s.id);

function deckUrl() {
  const file = resolve(root, "standalone/cup2farm-deck.html");
  if (!existsSync(file)) throw new Error('standalone/cup2farm-deck.html is missing. Run "npm run build:standalone" first.');
  return pathToFileURL(file).href;
}

/**
 * Opens the deck in a headless browser sized so the 1600x900 stage renders at 1:1.
 * Returns { page, errors, show, close }. `show(id)` loads one slide in its default state.
 */
export async function openDeck() {
  const url = deckUrl();
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    throw new Error("This check needs Playwright. Install it once with: npm i -D playwright && npx playwright install chromium");
  }
  const browser = await chromium.launch({
    // Playwright's own Chromium, unless CHROME_PATH points at another browser.
    ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
    // Chromium refuses to start its sandbox as root, which is how containers usually run.
    args: process.getuid?.() === 0 ? ["--no-sandbox"] : [],
  });
  const page = await browser.newPage({ viewport: { width: 1600, height: 952 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  const show = async (id) => {
    await page.goto(`${url}#${id}`);
    await page.reload(); // a hash change alone keeps the old slide state
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(200);
  };
  return { page, errors, show, close: () => browser.close() };
}

/** Runs a check and turns any failure into one readable line and a non-zero exit code. */
export async function run(main) {
  try {
    await main();
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
  }
}
