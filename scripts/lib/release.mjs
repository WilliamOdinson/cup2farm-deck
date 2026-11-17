// Numbering for the PDF releases. Each export is released as v1, v2, v3, ... so the number in
// "cup2farm-deck-v<N>.pdf" only ever goes up. No React or network here, so tests can import it.

/** The release numbers in the output of `git ls-remote --tags`: tags named exactly v<N>. */
export function releaseNumbers(lsRemote) {
  const numbers = [];
  for (const line of String(lsRemote).split("\n")) {
    // "<sha>\trefs/tags/v12", or the same with "^{}" for an annotated tag. Not v1.2.0 or v03.
    const tag = line.match(/\trefs\/tags\/v([1-9]\d*)(?:\^\{\})?$/);
    if (tag) numbers.push(Number(tag[1]));
  }
  return numbers;
}

/** The number for the next release: one more than the highest so far, starting at 1. */
export function nextReleaseNumber(lsRemote) {
  return Math.max(0, ...releaseNumbers(lsRemote)) + 1;
}
