import test from "node:test";
import assert from "node:assert/strict";
import { PARTS, TEAM } from "../src/content/team.js";
import { OUTLINE, partTimes, presenterTimes, totalSecs, turns } from "../src/content/outline.js";

test("every part has exactly one presenter, and that presenter is on the team", () => {
  for (const p of PARTS) {
    assert.equal(typeof p.presenter, "string", `${p.id} needs one presenter`);
    assert.ok(p.presenter.length > 0, `${p.id} needs a presenter`);
    if (p.id !== "qa") assert.ok(TEAM.members.includes(p.presenter), `${p.presenter} is not a team member`);
  }
});

test("every team member presents at least one part", () => {
  const speaking = new Set(PARTS.filter((p) => p.id !== "qa").map((p) => p.presenter));
  for (const m of TEAM.members) assert.ok(speaking.has(m), `${m} has no part`);
});

test("every slide belongs to a known part and every part has slides", () => {
  const ids = new Set(PARTS.map((p) => p.id));
  for (const s of OUTLINE) assert.ok(ids.has(s.part), `${s.id} has unknown part ${s.part}`);
  const used = partTimes();
  for (const p of PARTS) assert.ok(p.id in used, `part ${p.id} has no slides`);
});

test("slide ids are unique, hash-safe and avoid names the host reserves", () => {
  const reserved = /^(settings|sidebar|customize|upgrade|downloads|comment-.*)$/;
  const seen = new Set();
  for (const s of OUTLINE) {
    assert.match(s.id, /^[a-z0-9-]+$/);
    assert.doesNotMatch(s.id, reserved);
    assert.ok(!seen.has(s.id), `duplicate id ${s.id}`);
    seen.add(s.id);
  }
});

test("the last slide is the Q&A", () => {
  assert.equal(OUTLINE.at(-1).id, "qa");
});

test("the talk fits in 30 minutes and nobody speaks for more than six", () => {
  assert.ok(totalSecs() <= 30 * 60, `talk runs ${totalSecs()} seconds`);
  for (const [who, secs] of Object.entries(presenterTimes())) {
    assert.ok(secs <= 6 * 60, `${who} speaks for ${secs} seconds`);
  }
});

test("parts run in the order they are listed, and each part's slides sit together", () => {
  const order = [];
  for (const s of OUTLINE) if (order.at(-1) !== s.part) order.push(s.part);
  assert.deepEqual(order, PARTS.map((p) => p.id));
});

test("speaking turns cover every part once, in order, and add up to the talk", () => {
  const list = turns();
  assert.deepEqual(list.flatMap((t) => t.parts.map((p) => p.id)), PARTS.map((p) => p.id));
  for (let i = 1; i < list.length; i++) {
    assert.notEqual(list[i].presenter, list[i - 1].presenter, "neighbouring turns must change presenter");
  }
  for (const t of list) {
    for (const p of t.parts) assert.equal(p.presenter, t.presenter);
  }
  assert.equal(list.reduce((a, t) => a + t.secs, 0), totalSecs());
  assert.equal(list.at(-1).presenter, "Everyone");
});
