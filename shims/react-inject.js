// Standalone build only: the classic JSX transform calls React.createElement,
// and this gives every module a `React` binding without an import in each file.
export const React = window.React;
