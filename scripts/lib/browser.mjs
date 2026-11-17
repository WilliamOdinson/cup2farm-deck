// Shared by the browser-based tools (layout check, screenshots, PDF export), which drive the
// standalone build in headless Chromium through Playwright. Playwright is a dev dependency;
// its browser is a separate download, needed once:
//   npx playwright install chromium
// To use a Chrome that is already installed instead, set CHROME_PATH to its executable.
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { OUTLINE } from "../../src/content/outline.js";

export const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

/** Slide ids in deck order. */
export const slideIds = OUTLINE.map((s) => s.id);

/** file:// address of the standalone build. */
export function deckUrl() {
  const file = resolve(root, "standalone/cup2farm-deck.html");
  if (!existsSync(file)) throw new Error('standalone/cup2farm-deck.html is missing. Run "npm run build:standalone" first.');
  return pathToFileURL(file).href;
}

/** Starts headless Chromium. The caller closes it. */
export async function launch() {
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    throw new Error('Playwright is not installed. Run "npm install" first.');
  }
  try {
    return await chromium.launch({
      // Playwright's own Chromium, unless CHROME_PATH points at another browser.
      ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
      args: [
        // Lay text out with exact glyph widths, as macOS, Windows and print do. Linux hints
        // glyphs by default, which changes their widths a little: enough to move a line
        // break, and to make a PDF differ from what the audience sees on screen.
        "--font-render-hinting=none",
        // Chromium refuses to start its sandbox as root, which is how containers usually run.
        ...(process.getuid?.() === 0 ? ["--no-sandbox"] : []),
      ],
    });
  } catch (err) {
    const reason = String(err instanceof Error ? err.message : err).split("\n")[0];
    throw new Error(`Chromium did not start: ${reason}\nRun "npx playwright install chromium" once, or set CHROME_PATH to an installed Chrome.`);
  }
}

/**
 * Opens the deck in a headless browser sized so the 1600x900 stage renders at 1:1.
 * Returns { page, errors, show, close }. `show(id)` loads one slide in its default state.
 */
export async function openDeck() {
  const url = deckUrl();
  const browser = await launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 952 }, deviceScaleFactor: 1 });
  const errors = watchErrors(page);

  const show = async (id) => {
    await page.goto(`${url}#${id}`);
    await page.reload(); // a hash change alone keeps the old slide state
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(200);
  };
  return { page, errors, show, close: () => browser.close() };
}

/** Collects uncaught errors and console errors from a page into the returned list. */
export function watchErrors(page) {
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  return errors;
}

/** Runs a tool and turns any failure into one readable message and a non-zero exit code. */
export async function run(main) {
  try {
    await main();
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
  }
}
