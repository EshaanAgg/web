import netlify from "@astrojs/netlify";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import astroExpressiveCode from "astro-expressive-code";
import { defineConfig, sharpImageService } from "astro/config";
import { readFileSync } from "node:fs";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

import db from "@astrojs/db";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), sitemap(), preact(), astroExpressiveCode({
    theme: "slack-dark",
    styleOverrides: {
      codeFontSize: "0.8rem",
    },
    plugins: [pluginLineNumbers()],
    defaultProps: {
      showCopyButton: true,
      showLineNumbers: false,
    },
  }), db()],

  site: "https://eshaanagg.netlify.app/",

  image: {
    service: sharpImageService(),
  },

  compressHTML: false,

  build: {
    inlineStylesheets: "auto",
  },

  vite: {
    plugins: [rawFonts([".ttf", ".woff"])],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },

  markdown: {
    rehypePlugins: [rehypeKatex],
    remarkPlugins: [remarkMath],
  },

  output: "server",
  adapter: netlify(),
});

// Vite plugin to import fonts
function rawFonts(ext) {
  return {
    name: "vite-plugin-raw-fonts",
    transform(_, id) {
      if (ext.some((e) => id.endsWith(e))) {
        const buffer = readFileSync(id);
        return {
          code: `export default ${JSON.stringify(buffer)}`,
          map: null,
        };
      }
    },
  };
}