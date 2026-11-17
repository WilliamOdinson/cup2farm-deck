// Exports the deck to PDF: one 16in x 9in page for every state the right arrow reaches.
// It prints the deck's "?print" view in headless Chromium, so the PDF keeps real text, the
// deck's fonts and working links. Speaker notes are not included.
//   npm run export:pdf                       writes pdf/cup2farm-deck.pdf
//   npm run export:pdf -- pdf/handout.pdf    writes that file instead
// The npm script rebuilds the standalone file first, so the PDF always matches the source.
import { appendFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { SITE_URL } from "../src/content/site.js";
import { deckUrl, launch, run, slideIds, watchErrors } from "./lib/browser.mjs";

// The sheet. Keep in step with "@page" in src/styles.css; 16in x 9in is 1152 x 648 points.
const PAPER = { width: "16in", height: "9in", mediaBox: "0 0 1152 648" };
const STAGE = { width: 1600, height: 900 };
const READY_TIMEOUT_MS = 30_000;

/** Where to write: the one optional argument, or pdf/cup2farm-deck.pdf. */
function outputPath(args) {
  const flags = args.filter((a) => a.startsWith("-"));
  if (flags.length) throw new Error(`Unknown option: ${flags.join(", ")}. Usage: npm run export:pdf -- [file.pdf]`);
  if (args.length > 1) throw new Error(`Expected one output file, got ${args.length}: ${args.join(", ")}`);
  const file = args[0] ?? "pdf/cup2farm-deck.pdf";
  if (!file.toLowerCase().endsWith(".pdf")) throw new Error(`The output file must end in .pdf: ${file}`);
  return resolve(process.cwd(), file);
}

/** Runs in the page: what the print view laid out, and whether its fonts arrived. */
const inspect = () => ({
  pages: [...document.querySelectorAll(".print__page")].map((el) => ({
    id: el.dataset.slide,
    step: Number(el.dataset.step),
    steps: Number(el.dataset.steps),
    width: el.offsetWidth,
    height: el.offsetHeight,
  })),
  failedFonts: [...document.fonts].filter((f) => f.status === "error").map((f) => `${f.family} ${f.weight}`),
});

/** The pages must be every slide in deck order, each with all of its steps, each one stage in size. */
function checkPages(pages) {
  const problems = [];
  const order = [];
  for (const p of pages) if (order.at(-1) !== p.id) order.push(p.id);
  if (order.join() !== slideIds.join()) problems.push("the slides are not the deck's slides in order");
  let at = 0;
  while (at < pages.length) {
    const { id } = pages[at];
    const steps = Number.isInteger(pages[at].steps) && pages[at].steps > 0 ? pages[at].steps : 1;
    const group = pages.slice(at, at + steps);
    const numbered = group.length === steps && group.every((p, i) => p.id === id && p.step === i + 1 && p.steps === steps);
    if (!numbered) problems.push(`"${id}" does not have its ${steps} steps in order`);
    at += steps;
  }
  const offSize = pages.filter((p) => p.width !== STAGE.width || p.height !== STAGE.height);
  if (offSize.length) problems.push(`${offSize.length} pages are not ${STAGE.width}x${STAGE.height}, first "${offSize[0].id}" at ${offSize[0].width}x${offSize[0].height}`);
  return problems;
}

/**
 * Reads the page count and page sizes straight from the file. Chromium writes page objects
 * uncompressed, so a text scan finds them. If a future version does not, the scan finds
 * nothing and the caller skips the check instead of failing a good file.
 */
function readPdf(file) {
  const bytes = readFileSync(file);
  const text = bytes.toString("latin1");
  return {
    pages: (text.match(/\/Type\s*\/Page(?![A-Za-z])/g) || []).length,
    mediaBoxes: [...new Set([...text.matchAll(/\/MediaBox\s*\[\s*([^\]]*?)\s*\]/g)].map((m) => m[1].trim().replace(/\s+/g, " ")))],
    bytes: bytes.length,
  };
}

await run(async () => {
  const out = outputPath(process.argv.slice(2));
  const shown = relative(process.cwd(), out).startsWith("..") ? out : relative(process.cwd(), out);
  const url = `${deckUrl()}?print`;

  const browser = await launch();
  let pages;
  try {
    const page = await browser.newPage({ viewport: STAGE, deviceScaleFactor: 1 });
    const errors = watchErrors(page);
    await page.goto(url);
    try {
      await page.waitForSelector("html[data-print-ready]", { state: "attached", timeout: READY_TIMEOUT_MS });
    } catch {
      throw new Error(`The print view was not ready after ${READY_TIMEOUT_MS / 1000} s.${errors.length ? `\nPage errors:\n${errors.join("\n")}` : ""}`);
    }

    const found = await page.evaluate(inspect);
    pages = found.pages;
    if (errors.length) throw new Error(`Page errors:\n${errors.join("\n")}`);
    if (found.failedFonts.length) throw new Error(`Fonts failed to load, so the PDF would fall back to system fonts: ${found.failedFonts.join(", ")}`);
    if (!pages.length) throw new Error("The print view has no pages.");
    const problems = checkPages(pages);
    if (problems.length) throw new Error(`The print view is not laid out as expected:\n${problems.join("\n")}`);

    mkdirSync(dirname(out), { recursive: true });
    // The paper size comes from "@page" in the stylesheet; width and height are the fallback.
    await page.pdf({ path: out, width: PAPER.width, height: PAPER.height, preferCSSPageSize: true, printBackground: true });
  } finally {
    await browser.close();
  }

  // The file itself must have one sheet per page of the print view, all of the same size.
  const pdf = readPdf(out);
  if (pdf.pages === 0) {
    console.warn("pdf: could not read the page count from the file, so it was not checked");
  } else {
    if (pdf.pages !== pages.length) throw new Error(`${shown} has ${pdf.pages} pages, expected ${pages.length}: a page broke across sheets.`);
    const wrong = pdf.mediaBoxes.filter((box) => box !== PAPER.mediaBox);
    if (wrong.length) throw new Error(`${shown} has pages of the wrong size: [${wrong.join("], [")}], expected [${PAPER.mediaBox}].`);
  }

  console.log(`pdf: ${pages.length} pages for ${slideIds.length} slides, ${(pdf.bytes / 1e6).toFixed(1)} MB, written to ${shown}`);

  // In GitHub Actions, hand the numbers to later steps (the release notes use them).
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `file=${out}\npages=${pages.length}\nslides=${slideIds.length}\nsite=${SITE_URL}\n`);
  }
});
