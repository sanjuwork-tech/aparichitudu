import { defineConfig } from "vite";
import type { PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const port = Number(process.env.PORT) || 3000;
const basePath = process.env.BASE_PATH ?? "/";
const isReplit = Boolean(process.env.REPL_ID);

const replitPlugins: PluginOption[] = [];
if (isReplit) {
  replitPlugins.push(
    (await import("@replit/vite-plugin-runtime-error-modal")).default()
  );
  if (process.env.NODE_ENV !== "production") {
    replitPlugins.push(
      (await import("@replit/vite-plugin-cartographer")).cartographer({
        root: path.resolve(import.meta.dirname, ".."),
      }),
      (await import("@replit/vite-plugin-dev-banner")).devBanner()
    );
  }
}

export default defineConfig({
  base: basePath,
  plugins: [react(), tailwindcss(), ...replitPlugins],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
