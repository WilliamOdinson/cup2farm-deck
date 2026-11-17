import test from "node:test";
import assert from "node:assert/strict";
import { ASSUMPTIONS, PRESETS, roi } from "../src/model/roi.js";

const near = (a, b, eps = 0.5) => assert.ok(Math.abs(a - b) <= eps, `${a} is not within ${eps} of ${b}`);

test("pilot preset: hand-checked arithmetic", () => {
  const r = roi(PRESETS[0]);
  near(r.cups, 880000);
  near(r.scans, 26400);
  near(r.people, 13200);
  near(r.thankers, 3300);
  near(r.drinkerProfit, 3300 * 60 * 0.41 * 0.3); // 24,354
  near(r.wholesaleProfit, 12000);
  near(r.value, 36354);
  near(r.perDollar, 36354 / 120000, 0.001);
});

test("returns rise with reach across the three presets", () => {
  const [a, b, c] = PRESETS.map((p) => roi(p).perDollar);
  assert.ok(a < b && b < c, `${a} < ${b} < ${c}`);
  assert.ok(a < 1, "the pilot year should not claim to pay for itself");
  assert.ok(c > 1, "the network year should clear break-even");
});

test("break-even accounts cover the remaining cost exactly", () => {
  const p = PRESETS[1];
  const r = roi(p);
  const withEnough = roi({ ...p, accounts: r.accountsToBreakEven });
  const withOneLess = roi({ ...p, accounts: r.accountsToBreakEven - 1 });
  assert.ok(withEnough.net >= 0);
  assert.ok(withOneLess.net < 0);
});

test("bad input is clamped, not propagated", () => {
  const r = roi({ pounds: -5, scanRate: 9, thankRate: NaN, accounts: undefined, cost: 0 });
  assert.equal(r.cups, 0);
  assert.equal(r.value, 0);
  assert.equal(r.perDollar, 0);
  assert.ok(Number.isFinite(r.accountsToBreakEven));
});

test("study lift constant matches the reading (1.24 x 1.14)", () => {
  near(1 + ASSUMPTIONS.researchLift, 1.24 * 1.14, 0.01);
});
