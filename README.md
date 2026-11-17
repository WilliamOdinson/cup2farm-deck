# Cup2Farm

An interactive React slide deck for Team Coda's case presentation, **Coda Coffee Benevolence Strategy** (CMU 95-722 Digital Transformation, Data Adoption module, November 2026).

The recommendation: a code on every Coda cup opens a web app that shows the lot's verified journey and proof the farmers were paid, then carries a thank-you, feedback or a tip back to the growers.

Live at **[dt.wsun.io](https://dt.wsun.io)**.

## What is in the deck

- 48 slides, one idea each, on a fixed 1600 x 900 stage that scales to any screen
- A working phone prototype of the app: scan, see the journey, meet a grower, send thanks, open the passport
- An ROI model with presets and sliders, built on stated assumptions
- Interactive timeline, supply chain, data sources, benevolence spectrum, scorecard and risk tabs
- Speaker notes with per-slide timing and hand-over cues for seven presenters
- Prepared answers for Q&A on the last slide

All lot, grower and receipt data in the prototype is sample data.

## Presenting

| Key | Action |
| --- | --- |
| Right arrow, Space, Page Down | Next slide |
| Left arrow, Page Up | Previous slide |
| Home / End | First slide / Q&A |
| O | Overview of all slides |
| N | Speaker notes and timing |
| F | Fullscreen |
| Esc | Close the overview |

Every slide has its own link, for example `dt.wsun.io/#roi`.

For a room with unreliable Wi-Fi, use `standalone/cup2farm-deck.html`. React, the fonts and the styles are inlined, so it opens from disk with no network.

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
| `npm test` | Presenter rules, talk timing and the ROI model |
| `npm run check:layout` | Opens every slide and toggle in Chromium and reports overflow |
| `npm run shots` | Screenshots of every slide into `shots/` |

`check:layout` and `shots` need Playwright, which is not a dependency:

```bash
npm i -D playwright && npx playwright install chromium
```

## Editing

| To change | Edit |
| --- | --- |
| Presenters, parts, team names | `src/content/team.js` |
| Slide order, timing, speaker notes | `src/content/outline.js` |
| Slide content | `src/slides/*.jsx` |
| Prototype screens and sample data | `src/prototype/` |
| ROI assumptions and scenarios | `src/model/roi.js` |
| References | `src/content/sources.js` |
| Styles | `src/styles.css` |

`npm test` enforces the team's rules: every part has exactly one presenter, every member presents at least one part, the last slide is the Q&A, the talk fits in 30 minutes, and nobody speaks for more than six. Run `npm run check:layout` after changing text, since longer names or sentences can overflow a card.

To add a slide, add an entry to `OUTLINE` in `src/content/outline.js` and register its component in `src/content/slides.jsx`.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which tests, builds and deploys `dist/` to the Cloudflare Pages project `dt-wsun`.

One-time setup:

1. Add the repository secrets `CLOUDFLARE_API_TOKEN` (with Cloudflare Pages edit permission) and `CLOUDFLARE_ACCOUNT_ID`.
2. Create the Pages project:
   ```bash
   npx wrangler pages project create dt-wsun --production-branch=main
   ```
3. In the Cloudflare dashboard, open Workers & Pages, then `dt-wsun`, then Custom domains, and add `dt.wsun.io`.

## Sources

The deck draws on the course case (Youngdahl and Hunsaker, 2018), Urban and Sultan (2015), Hagiu and Wright (2020), the module lecture, and market data retrieved in November 2026. The full list is on slides 44 to 46 and in `src/content/sources.js`. ROI figures are team estimates for illustration, not Coda financials.

## Team

Ang Li, Guhan Kesavasamy, Hao Li, Junhong Lin, Lisa Chung, William Sun, Yilin Wang.
