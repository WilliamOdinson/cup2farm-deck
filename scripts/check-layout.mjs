// Layout check: opens every slide, presses the right arrow through every step, clicks every
// toggle, and reports anything that spills outside the stage, runs into the footer, or
// overflows its own card. It also checks the arrow keys themselves: each press changes the
// slide, the press after the last step opens the next slide, and the left arrow comes back
// to that last step.
// Run it after editing slide text, references or names. Exits non-zero when it finds a problem.
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
    if (el.closest(".ph-body") || el.closest("svg")) continue; // the phone scrolls by design
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

    // 3. Child boxes stay inside their parent's content box, so nothing eats into its padding.
    //    Table rows are skipped (collapsed borders overlap their cells), and so are inline
    //    children, which rule 4 covers as text (a hanging indent starts in the padding).
    if (cs.overflowX === "visible" && cs.overflowY === "visible" && !cs.display.startsWith("table")) {
      const edge = (side) => parseFloat(cs[`padding${side}`]) + parseFloat(cs[`border${side}Width`]);
      const box = { top: r.top + edge("Top"), bottom: r.bottom - edge("Bottom"), left: r.left + edge("Left"), right: r.right - edge("Right") };
      for (const child of el.children) {
        const cc = getComputedStyle(child);
        if (cc.position === "absolute" || cc.position === "fixed" || cc.display === "inline" || child.closest("svg")) continue;
        const c = child.getBoundingClientRect();
        if (c.width === 0 || c.height === 0) continue;
        if (c.bottom > box.bottom + 2 || c.top < box.top - 2) out.add(`${name(child)} is taller than ${name(el)} by ${px(Math.max(c.bottom - box.bottom, box.top - c.top))}px`);
        if (c.right > box.right + 2 || c.left < box.left - 2) out.add(`${name(child)} is wider than ${name(el)} by ${px(Math.max(c.right - box.right, box.left - c.left))}px`);
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

// Runs in the page: where the deck is, and what the slide says there.
const where = () => {
  const stage = document.querySelector(".deck__stage");
  return {
    id: window.location.hash.replace(/^#/, ""),
    step: Number(stage.dataset.step),
    steps: Number(stage.dataset.steps),
    text: document.querySelector(".slide").innerText,
  };
};

await run(async () => {
  const deck = await openDeck();
  const { page } = deck;
  const problems = [];
  let states = 0;

  try {
    for (const [at, id] of slideIds.entries()) {
      await deck.show(id);
      const check = async (label) => {
        states += 1;
        for (const found of await page.evaluate(measure)) problems.push(`${id} [${label}] ${found}`);
      };
      const press = async (key) => {
        await page.keyboard.press(key);
        await page.waitForTimeout(80);
        return page.evaluate(where);
      };
      await check("default");

      // The right arrow walks every step of the slide, and each press changes what it shows.
      let now = await page.evaluate(where);
      const { steps } = now;
      if (now.step !== 1) problems.push(`${id} opens on step ${now.step}, not step 1`);
      for (let s = 2; s <= steps; s++) {
        const before = now.text;
        now = await press("ArrowRight");
        if (now.id !== id || now.step !== s) problems.push(`${id} right arrow from step ${s - 1} went to ${now.id} step ${now.step}`);
        if (now.text === before) problems.push(`${id} step ${s} shows nothing new`);
        await check(`step ${s} of ${steps}`);
      }
      // One more press leaves for the next slide; the left arrow returns to the last step.
      const nextId = slideIds[at + 1] ?? id;
      now = await press("ArrowRight");
      if (now.id !== nextId) problems.push(`${id} right arrow after the last step went to ${now.id}, not ${nextId}`);
      if (nextId !== id) {
        now = await press("ArrowLeft");
        if (now.id !== id || now.step !== steps) problems.push(`${nextId} left arrow went to ${now.id} step ${now.step}, not ${id} step ${steps}`);
        await check(`back on step ${steps}`);
      }

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
  } finally {
    await deck.close();
  }

  console.log(`layout check: ${slideIds.length} slides, ${states} states`);
  if (deck.errors.length) throw new Error(`Page errors:\n${deck.errors.join("\n")}`);
  if (problems.length) throw new Error(`${problems.length} layout problems:\n${problems.join("\n")}`);
  console.log("no layout problems found");
});
