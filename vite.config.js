import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Relative asset paths, so the built deck can be hosted under any folder.
  base: "./",
  plugins: [react()],
});
