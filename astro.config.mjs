import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import expressiveCode from "astro-expressive-code";
import { defineConfig, sharpImageService } from "astro/config";
import { readFileSync } from "node:fs";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

/* Define the code-rendering options
 * Reference: https://github.com/expressive-code/expressive-code/blob/main/packages/astro-expressive-code/README.md#configuration
 */
/** @type {import('astro-expressive-code').AstroExpressiveCodeOptions} */
const astroExpressiveCodeOptions = {
  theme: "slack-dark",
  styleOverrides: {
    codeFontSize: "0.8rem",
  },
};

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    sitemap(),
    expressiveCode(astroExpressiveCodeOptions),
    preact(),
  ],
  experimental: {
    assets: true,
  },
  site: "https://eshaanagg.netlify.app/",
  image: {
    service: sharpImageService(),
  },
  compressHTML: true,
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
