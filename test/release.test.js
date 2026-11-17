import test from "node:test";
import assert from "node:assert/strict";
import { nextReleaseNumber, releaseNumbers } from "../scripts/lib/release.mjs";

const line = (ref) => `0123456789abcdef0123456789abcdef01234567\t${ref}`;
const tags = (...names) => names.map((n) => line(`refs/tags/${n}`)).join("\n") + "\n";

test("the first release is number 1", () => {
  assert.equal(nextReleaseNumber(""), 1);
  assert.equal(nextReleaseNumber("\n"), 1);
});

test("the next number is one more than the highest, compared as numbers", () => {
  assert.equal(nextReleaseNumber(tags("v1")), 2);
  assert.equal(nextReleaseNumber(tags("v9", "v10", "v2")), 11);
});

test("a deleted release leaves a gap that is never reused", () => {
  assert.equal(nextReleaseNumber(tags("v1", "v2", "v5")), 6);
});

test("only tags named exactly v<N> count", () => {
  const other = tags("v1.2.0", "deck-v40", "v03", "V7", "v8-draft", "pdf-12", "v0") + line("refs/heads/v99") + "\n";
  assert.deepEqual(releaseNumbers(other), []);
  assert.equal(nextReleaseNumber(other + tags("v3")), 4);
});

test("an annotated tag is counted once, with or without its peeled line", () => {
  const annotated = tags("v4") + line("refs/tags/v4^{}") + "\n";
  assert.deepEqual(releaseNumbers(annotated), [4, 4]);
  assert.equal(nextReleaseNumber(annotated), 5);
});
