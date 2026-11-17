// Standalone build only: React is inlined in the page as its browser (UMD) build,
// so the app bundle reads it from window instead of bundling a second copy.
module.exports = window.React;
