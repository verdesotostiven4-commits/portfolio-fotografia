import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      fflate: new URL("./src/fflate-local.ts", import.meta.url).pathname,
    },
  },
});
