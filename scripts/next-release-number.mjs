// Prints the number for the next PDF release: one more than the highest v<N> tag on the remote.
// The deploy workflow names the release and the file with it (v8, cup2farm-deck-v8.pdf).
//   node scripts/next-release-number.mjs             reads the tags of "origin"
//   node scripts/next-release-number.mjs upstream    reads another remote
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { nextReleaseNumber } from "./lib/release.mjs";

const repo = fileURLToPath(new URL("..", import.meta.url));
const remote = process.argv[2] ?? "origin";
let tags;
try {
  // The remote is asked directly, so a shallow CI checkout without tags still sees them all.
  tags = execFileSync("git", ["ls-remote", "--tags", "--refs", remote], { cwd: repo, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
} catch (err) {
  const lines = String(err.stderr || err.message || err).split("\n").map((l) => l.trim()).filter(Boolean);
  const reason = lines.find((l) => l.startsWith("fatal:")) ?? lines[0] ?? "git failed";
  console.error(`Could not read the tags of "${remote}": ${reason}`);
  process.exit(1);
}
console.log(nextReleaseNumber(tags));
