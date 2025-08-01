import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
	plugins: [dts()],
	build: {
		target: "es2015",
		lib: {
			entry: "src/inview.ts",
			name: "InView",
			fileName: "inview",
		},
	},
});
