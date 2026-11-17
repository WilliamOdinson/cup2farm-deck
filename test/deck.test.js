import test from "node:test";
import assert from "node:assert/strict";
import QRCode from "qrcode";
import { PARTS, TEAM } from "../src/content/team.js";
import { OUTLINE, partTimes, presenterTimes, totalSecs, turns } from "../src/content/outline.js";
import { REFS, refsFor } from "../src/content/sources.js";
import { SITE_URL } from "../src/content/site.js";
import { QR_ROWS, QR_TEXT } from "../src/content/qr.js";

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

test("the last slide is the Q&A, and it is the only slide of its part", () => {
  assert.equal(OUTLINE.at(-1).id, "qa");
  assert.deepEqual(OUTLINE.filter((s) => s.part === "qa").map((s) => s.id), ["qa"]);
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

test("every slide cites references that exist, and every reference is cited", () => {
  const cited = new Set();
  for (const s of OUTLINE) {
    const ids = s.refs ?? [];
    assert.ok(Array.isArray(ids), `${s.id}: refs must be a list of ids`);
    assert.equal(new Set(ids).size, ids.length, `${s.id} cites a reference twice`);
    assert.doesNotThrow(() => refsFor(ids), `${s.id} cites an unknown reference`);
    for (const id of ids) cited.add(id);
  }
  for (const id of Object.keys(REFS)) assert.ok(cited.has(id), `reference "${id}" is not cited on any slide`);
});

test("references follow the APA pattern: a date in parentheses, an italic title or source, a full stop or a link", () => {
  const date = /\((?:n\.d\.|\d{4}(?:, (?:January|February|March|April|May|June|July|August|September|October|November|December)(?: \d{1,2})?)?)\)\./;
  for (const [id, ref] of Object.entries(REFS)) {
    assert.match(ref.text, date, `${id}: no APA date such as (2020, January 6).`);
    assert.equal((ref.text.match(/\*/g) || []).length % 2, 0, `${id}: unbalanced * italics marker`);
    assert.match(ref.text, /\*[^*]+\*/, `${id}: nothing is set in italics`);
    if (ref.url) assert.match(ref.url, /^https:\/\/\S+$/, `${id}: the link must be an https address`);
    else assert.match(ref.text, /\.$/, `${id}: a reference without a link ends with a full stop`);
  }
});

test("references are listed in APA order: alphabetical by author, or by title when there is no author", () => {
  assert.deepEqual(refsFor(["urban", "case", "confluence"]).map((r) => r.id), ["confluence", "urban", "case"]);
  assert.deepEqual(refsFor(["starbucks", "case", "nca"]).map((r) => r.id), ["nca", "starbucks", "case"]);
  assert.throws(() => refsFor(["no-such-reference"]), /Unknown reference/);
});

test("the QR code opens the deck's own address", () => {
  assert.match(SITE_URL, /^https:\/\/[a-z0-9.-]+(\/\S*)?$/);
  assert.equal(QR_TEXT, SITE_URL, 'src/content/qr.js is out of date. Run "npm run gen:qr".');
  const qr = QRCode.create(SITE_URL, { errorCorrectionLevel: "M" });
  const n = qr.modules.size;
  const rows = Array.from({ length: n }, (_, y) => Array.from({ length: n }, (_, x) => (qr.modules.get(x, y) ? "1" : "0")).join(""));
  assert.deepEqual(QR_ROWS, rows, 'src/content/qr.js is out of date. Run "npm run gen:qr".');
});
