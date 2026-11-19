# Cup2Farm

An interactive React slide deck for Team Coda's case presentation, **Coda Coffee Benevolence Strategy** (CMU 95-722 Digital Transformation, Data Adoption module, November 2026).

The recommendation: a code on every Coda cup opens a web app that shows the lot's verified journey and proof the farmers were paid, then carries a thank-you, feedback or a tip back to the growers.

Live at **[95722-coda.pages.dev](https://95722-coda.pages.dev)**.

## What is in the deck

- 51 slides, one idea each, on a fixed 1600 x 900 stage that scales to any screen
- A handover slide at every change of speaker: the agenda again, with the next presenter and their part highlighted
- A working phone prototype of the app: scan, see the journey, meet a grower, send thanks, open the passport
- An ROI model with three phases and sliders, built on stated assumptions
- Stepped slides driven by the right arrow: timeline, supply chain, benevolence spectrum, prototype, data sources, ROI phases, scorecard, how it works and risk tabs
- The references each slide cites in its footer, in APA 7 style, and the deck's address at bottom right
- Speaker notes with per-slide timing and hand-over cues for seven presenters
- Prepared answers for Q&A on the last slide
- A PDF export with a page for every step, with real text and working links

All lot, grower and receipt data in the prototype is sample data. Every QR code in the deck is real and opens the deck's own address.

## Presenting

| Key | Action |
| --- | --- |
| Right arrow, Space, Page Down | Next step of the slide, then the next slide |
| Left arrow, Shift+Space, Page Up | Back one step, then the previous slide |
| Home / End | First slide / Q&A |
| O | Overview of all slides |
| N | Speaker notes and timing |
| F | Fullscreen |
| Esc | Close the overview or the prepared answers |

The whole talk runs on the right arrow; nothing on a slide needs a click. On a slide with several states the control bar shows where you are, for example "step 2 of 7". Clicking a state still works, and the arrow carries on from there. On the Q&A slide each further press shows one prepared answer.

Presenter names appear on the slides only in the agenda and the handover slides. Timings appear only in the speaker notes (N) and the overview (O).

Every slide has its own link, for example `95722-coda.pages.dev/#roi`.

For a room with unreliable Wi-Fi, use `standalone/cup2farm-deck.html`. React, the fonts and the styles are inlined, so it opens from disk with no network. A PDF is the second fallback; see [PDF export](#pdf-export).

## Running locally

Requires Node `^20.19.0` or `>=22.12.0`.

```bash
npm install
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build |
| `npm run build:standalone` | Rebuild `standalone/cup2farm-deck.html` |
| `npm run gen:qr` | Regenerate the QR matrix after changing the site address |
| `npm test` | Presenter rules, talk timing, references, the QR code, the ROI model and release numbering |
| `npm run check:layout` | Opens every slide in Chromium, presses the right arrow through every step, clicks every toggle, and reports overflow or a step that does not respond |
| `npm run shots` | Screenshots of every slide into `shots/`; add `-- --steps` for every step |
| `npm run export:pdf` | Rebuilds the standalone file and prints the deck to `pdf/cup2farm-deck.pdf` |

`check:layout`, `shots` and `export:pdf` drive headless Chromium through Playwright. Playwright comes with `npm install`; its browser is a separate download, needed once:

```bash
npx playwright install chromium
```

To use a Chrome that is already installed instead, set `CHROME_PATH` to its executable.

## Editing

| To change | Edit |
| --- | --- |
| Presenters, parts, team names | `src/content/team.js` |
| Slide order, timing, speaker notes, what each slide cites | `src/content/outline.js` |
| Slide content | `src/slides/*.jsx` |
| Prototype screens and sample data | `src/prototype/` |
| ROI assumptions and scenarios | `src/model/roi.js` |
| References (APA 7) | `src/content/sources.js` |
| Site address in the footer and the QR codes | `src/content/site.js`, then `npm run gen:qr` |
| Styles | `src/styles.css` |

`npm test` enforces the team's rules: every part has exactly one presenter, every member presents at least one part, the last slide is the Q&A, the talk fits in 30 minutes, and nobody speaks for more than six. It also checks that every slide cites references that exist, that every reference is used, and that the QR code matches the site address. Run `npm run check:layout` after changing text or references, since a longer sentence or a taller footer can overflow a slide.

Handover slides are generated in `src/content/outline.js` (`withHandovers`): one opens every speaking turn after the first, except the Q&A, and its 5 seconds count against the incoming speaker. Do not add them by hand.

To add a slide, add an entry to `TALK` in `src/content/outline.js` and register its component in `src/content/slides.jsx`. List what it cites in `refs`; the footer is drawn from that.

To give a slide several steps, set `steps` on its component and read the current one with `useStep()`:

```jsx
export function MySlide() {
  const [step, setStep] = useStep(); // 0-based; setStep keeps clicks and arrow keys in sync
  return <Slide title="...">{ITEMS[step].text}</Slide>;
}
MySlide.steps = ITEMS.length;
```

## PDF export

```bash
npm run export:pdf                      # pdf/cup2farm-deck.pdf
npm run export:pdf -- pdf/handout.pdf   # another file name
```

The PDF has one 16:9 page for every state the right arrow reaches, in talk order (104 pages for the 51 slides today), without the speaker notes. Text stays text, the deck's fonts are embedded, and the links in the footers work.

It is printed from the deck's print view, which you can open yourself by adding `?print` to the address, for example `95722-coda.pages.dev/?print`. The browser's own print dialog works on that page too.

The script fails instead of writing a bad file: it checks that every slide and step is there, that the fonts loaded, and that the PDF has exactly one sheet per page. Text is laid out without font hinting, the way macOS, Windows and print do it, so the PDF matches what the audience sees.

Every deploy publishes this PDF as a numbered GitHub Release; see [PDF releases](#pdf-releases).

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which tests, builds and deploys `dist/` to the Cloudflare Pages project `95722-coda`, and then releases the deck as a PDF.

### PDF releases

After every successful deploy, a second job exports the same commit to PDF and attaches it to a new GitHub Release. The number counts up: release `v8` carries `cup2farm-deck-v8.pdf`, and the next run makes `v9`. The newest PDF is always on the repository's [latest release](https://github.com/WilliamOdinson/cup2farm-deck/releases/latest).

The number is one more than the highest `v<N>` tag (`node scripts/next-release-number.mjs` prints it), so it never repeats, and a failed run does not use one up. If tests or the deploy fail, nothing is released.

This needs no setup: the job uses the workflow's own token, with write access to contents for that job only.

### One-time setup

1. Add the repository secrets `CLOUDFLARE_API_TOKEN` (with Cloudflare Pages edit permission) and `CLOUDFLARE_ACCOUNT_ID`.
2. Create the Pages project:
   ```bash
   npx wrangler pages project create 95722-coda --production-branch=main
   ```
3. Optional: to serve the deck from your own domain, open Workers & Pages in the Cloudflare dashboard, then `95722-coda`, then Custom domains. Then set `SITE_URL` in `src/content/site.js` to that address and run `npm run gen:qr`, so the footer and the QR codes point to it.

## Sources

The deck draws on the course case (Youngdahl and Hunsaker, 2018), Urban and Sultan (2015), Hagiu and Wright (2020), the module lecture, and market data retrieved in November 2026. Each slide lists what it cites in its footer in APA 7 style; the full list is in `src/content/sources.js`. ROI figures are team estimates for illustration, not Coda financials.

## Team

Ang Li, Guhan Kesavasamy, Hao Li, Junhong Lin, Lisa Chung, William Sun, Yilin Wang.
