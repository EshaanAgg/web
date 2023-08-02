import { defineConfig, sharpImageService } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import { readFileSync } from "node:fs";
import expressiveCode from "astro-expressive-code";

/** @type {import('astro-expressive-code').AstroExpressiveCodeOptions} */
const astroExpressiveCodeOptions = {
	styleOverrides: {
		codeFontSize: "1rem",
	},
};

// https://astro.build/config
export default defineConfig({
	integrations: [tailwind(), sitemap(), expressiveCode(astroExpressiveCodeOptions)],
	experimental: {
		assets: true,
	},
	image: {
		service: sharpImageService(),
	},
	compressHTML: true,
	build: {
		inlineStylesheets: "auto",
	},
	site: "https://www.kevinzunigacuellar.com",
	vite: {
		plugins: [rawFonts([".ttf", ".woff"])],
		optimizeDeps: {
			exclude: ["@resvg/resvg-js"],
		},
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
