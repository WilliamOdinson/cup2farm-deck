import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import PrintDeck from "./PrintDeck.jsx";

// Fonts ship with the app, so the deck never waits on a font CDN.
// Keep in step with FONTS in scripts/build-standalone.mjs.
import "@fontsource/besley/500.css";
import "@fontsource/besley/600.css";
import "@fontsource/besley/700.css";
import "@fontsource/schibsted-grotesk/400.css";
import "@fontsource/schibsted-grotesk/500.css";
import "@fontsource/schibsted-grotesk/600.css";
import "@fontsource/schibsted-grotesk/700.css";
import "@fontsource/schibsted-grotesk/800.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/ibm-plex-mono/600.css";
import "@fontsource/saira-stencil-one/400.css";
import "./styles.css";

const el = document.getElementById("root");
if (!el) throw new Error('The page is missing its <div id="root"> mount point.');

// "?print" lays the whole deck out as pages, for the PDF export and the print dialog.
// The flag on <html> is set before the first render, so styles and slides can rely on it.
const printing = new URLSearchParams(window.location.search).has("print");
if (printing) document.documentElement.dataset.view = "print";

createRoot(el).render(printing ? <PrintDeck /> : <App />);
