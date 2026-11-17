// Bundles the deck into one self-contained HTML file: standalone/cup2farm-deck.html.
// The app, its styles, React and the fonts are all inlined, so the file opens straight
// from disk, works with no network, and can be hosted anywhere as a single page.
//   npm run build:standalone
import { build } from "esbuild";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const TITLE = "Coda Coffee Cup2Farm Deck";
const ICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%233b0d1c'/%3E%3Cpath d='M9 9h14l-1.600 15.200a2 2 0 0 1-2 1.800h-6.800a2 2 0 0 1-2-1.800z' fill='%23fbf3ec'/%3E%3Cpath d='M9.900 14h12.200l-.700 7H10.600z' fill='%23c5162e'/%3E%3Crect x='7.500' y='6' width='17' height='3.400' rx='1.200' fill='%23e9c46a'/%3E%3C/svg%3E";

// Keep in step with the @fontsource imports in src/main.jsx.
const FONTS = [
  ["Besley", "besley", [500, 600, 700]],
  ["Schibsted Grotesk", "schibsted-grotesk", [400, 500, 600, 700, 800]],
  ["IBM Plex Mono", "ibm-plex-mono", [400, 500, 600]],
  ["Saira Stencil One", "saira-stencil-one", [400]],
];

// React's browser builds. The app bundle reads them from window (see shims/).
const LIBS = [
  ["react", "react.production.min.js"],
  ["react-dom", "react-dom.production.min.js"],
];

// A closing script tag inside inline JavaScript would end the element early.
const inlineSafe = (js) => js.replace(/<\/script/gi, "<\\/script");

function read(...parts) {
  const file = resolve(root, ...parts);
  try {
    return readFileSync(file);
  } catch (err) {
    throw new Error(`Cannot read ${file}. Run "npm install" first. (${err.code || err.message})`);
  }
}

async function bundleApp() {
  const result = await build({
    entryPoints: [resolve(root, "src/main.jsx")],
    bundle: true,
    format: "iife",
    minify: true,
    write: false,
    target: ["es2020"],
    jsx: "transform",
    jsxFactory: "React.createElement",
    jsxFragment: "React.Fragment",
    inject: [resolve(root, "shims/react-inject.js")],
    alias: {
      react: resolve(root, "shims/react.cjs"),
      "react-dom/client": resolve(root, "shims/react-dom-client.cjs"),
    },
    // Styles and fonts are placed in the page by this script instead.
    loader: { ".css": "empty" },
    legalComments: "none",
  });
  return inlineSafe(result.outputFiles[0].text);
}

function fontFaces() {
  let faces = "";
  for (const [family, slug, weights] of FONTS) {
    for (const weight of weights) {
      const data = read("node_modules/@fontsource", slug, "files", `${slug}-latin-${weight}-normal.woff2`).toString("base64");
      faces += `@font-face{font-family:"${family}";font-style:normal;font-weight:${weight};font-display:block;src:url(data:font/woff2;base64,${data}) format("woff2");}\n`;
    }
  }
  return faces;
}

const app = await bundleApp();
const libs = LIBS.map(([pkg, file]) => `<script>\n${inlineSafe(read("node_modules", pkg, "umd", file).toString("utf8"))}\n</script>`).join("\n");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${TITLE}</title>
<link rel="icon" href="${ICON}">
<style>
${fontFaces()}</style>
<style>
${read("src/styles.css").toString("utf8")}
</style>
</head>
<body>
<div id="root"><p style="font:16px/1.5 Arial,sans-serif;color:#fbf3ec;padding:24px">Loading the Cup2Farm deck.</p></div>
${libs}
<script>
${app}
</script>
</body>
</html>
`;

// Its own folder, because "vite build" empties dist/ on every run.
mkdirSync(resolve(root, "standalone"), { recursive: true });
const out = resolve(root, "standalone/cup2farm-deck.html");
writeFileSync(out, html);
console.log(`${out}  ${(Buffer.byteLength(html) / 1024).toFixed(0)} KB`);
