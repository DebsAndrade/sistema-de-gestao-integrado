import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@models": path.resolve(__dirname, "./src/models"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@ui": path.resolve(__dirname, "./src/ui"),
    },
  },
});
