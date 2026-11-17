// Standalone build only: maps "react-dom/client" onto the ReactDOM browser global.
module.exports = { createRoot: (el, opts) => window.ReactDOM.createRoot(el, opts) };
