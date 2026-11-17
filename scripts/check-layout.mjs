// Layout check: opens every slide, clicks through every toggle, and reports anything that
// spills outside the stage, runs into the footer, or overflows its own card.
// Run it after editing slide text or names. Exits non-zero when it finds a problem.
//   npm run check:layout
import { openDeck, run, slideIds } from "./lib/browser.mjs";

// Runs in the page: measure the current slide. Everything is compared as boxes on screen, so
// tight line-heights on display type do not count as overflow.
const measure = () => {
  const stage = document.querySelector(".deck__stage").getBoundingClientRect();
  const slide = document.querySelector(".slide");
  const foot = slide.querySelector(".foot, .proto__foot");
  const footBox = foot ? foot.getBoundingClientRect() : null;
  const footTop = footBox ? footBox.top : stage.bottom;
  const out = new Set();
  const name = (el) => `${el.tagName.toLowerCase()}.${String(el.className.baseVal ?? el.className).split(" ").filter(Boolean).join(".")}`;
  const px = (n) => Math.round(n);

  for (const el of slide.querySelectorAll("*")) {
    if (el.closest(".ph-body") || el.closest("svg") || el.closest(".qa__panel")) continue; // the phone scrolls by design
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const cs = getComputedStyle(el);
    const art = !!el.closest('[aria-hidden="true"]');

    // 1. Nothing may leave the stage.
    if (r.right > stage.right + 1 || r.left < stage.left - 1 || r.bottom > stage.bottom + 1 || r.top < stage.top - 1) {
      out.add(`outside the stage: ${name(el)}`);
    }
    // 2. Body content may not run into the footer.
    const besideFoot = footBox && (r.right <= footBox.left || r.left >= footBox.right); // e.g. the phone column
    if (foot && !art && !besideFoot && !foot.contains(el) && !el.contains(foot) && r.bottom > footTop + 1 && r.top < footTop) {
      out.add(`runs into the footer by ${px(r.bottom - footTop)}px: ${name(el)}`);
    }
    if (art || cs.display === "inline" || cs.display === "contents") continue;

    // 3. Child boxes stay inside their parent box.
    if (cs.overflowX === "visible" && cs.overflowY === "visible") {
      for (const child of el.children) {
        const cc = getComputedStyle(child);
        if (cc.position === "absolute" || cc.position === "fixed" || child.closest("svg")) continue;
        const c = child.getBoundingClientRect();
        if (c.width === 0 || c.height === 0) continue;
        if (c.bottom > r.bottom + 2 || c.top < r.top - 2) out.add(`${name(child)} is taller than ${name(el)} by ${px(Math.max(c.bottom - r.bottom, r.top - c.top))}px`);
        if (c.right > r.right + 2 || c.left < r.left - 2) out.add(`${name(child)} is wider than ${name(el)} by ${px(Math.max(c.right - r.right, r.left - c.left))}px`);
      }
    }
    // 4. Text stays inside the element that holds it (line boxes, with slack for tight leading).
    for (const node of el.childNodes) {
      if (node.nodeType !== 3 || !node.textContent.trim()) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      const t = range.getBoundingClientRect();
      const slack = parseFloat(cs.fontSize) * 0.45;
      if (t.right > r.right + 3 || t.left < r.left - 3) out.add(`text is wider than ${name(el)} by ${px(Math.max(t.right - r.right, r.left - t.left))}px`);
      if (t.bottom > r.bottom + slack || t.top < r.top - slack) out.add(`text is taller than ${name(el)} by ${px(Math.max(t.bottom - r.bottom, r.top - t.top))}px`);
    }
  }
  return [...out];
};

// Runs in the page: the prepared-answers panel must cover the stage and hold its answer.
const measurePanel = () => {
  const stage = document.querySelector(".deck__stage").getBoundingClientRect();
  const panel = document.querySelector(".qa__panel").getBoundingClientRect();
  const answer = document.querySelector(".qa__a").getBoundingClientRect();
  const out = [];
  if (Math.abs(panel.top - stage.top) > 1 || Math.abs(panel.bottom - stage.bottom) > 1) out.push("panel does not cover the stage");
  if (answer.bottom > panel.bottom - 20) out.push(`answer card runs past the panel by ${Math.round(answer.bottom - panel.bottom + 20)}px`);
  return out;
};

await run(async () => {
  const deck = await openDeck();
  const { page } = deck;
  const problems = [];
  let states = 0;

  try {
    for (const id of slideIds) {
      await deck.show(id);
      const check = async (label) => {
        states += 1;
        for (const found of await page.evaluate(measure)) problems.push(`${id} [${label}] ${found}`);
      };
      await check("default");
      // Every toggle outside the phone, one at a time.
      const controls = page.locator(".slide button[aria-pressed]:not(.phone *)");
      const n = await controls.count();
      for (let i = 0; i < n; i++) {
        const control = controls.nth(i);
        const label = ((await control.textContent()) || "").trim().slice(0, 40);
        await control.click();
        await page.waitForTimeout(60);
        await check(label);
      }
    }

    // The prepared answers on the last slide.
    await deck.show("qa");
    await page.getByRole("button", { name: "Prepared answers" }).click();
    const questions = page.locator(".qa__qs button");
    const count = await questions.count();
    for (let i = 0; i < count; i++) {
      await questions.nth(i).click();
      states += 1;
      for (const found of await page.evaluate(measurePanel)) problems.push(`qa [answer ${i + 1}] ${found}`);
    }
  } finally {
    await deck.close();
  }

  console.log(`layout check: ${slideIds.length} slides, ${states} states`);
  if (deck.errors.length) throw new Error(`Page errors:\n${deck.errors.join("\n")}`);
  if (problems.length) throw new Error(`${problems.length} layout problems:\n${problems.join("\n")}`);
  console.log("no layout problems found");
});
