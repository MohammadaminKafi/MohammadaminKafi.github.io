import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://mohammadaminkafi.github.io",
  output: "static",
  trailingSlash: "always",
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    server: { host: "0.0.0.0", port: 4321 },
  },
});
