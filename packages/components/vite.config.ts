import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
	plugins: [ vue() ],

	css: {
		preprocessorOptions: { scss: { api: 'modern' } }
	},

	build: {
		emptyOutDir: false, // to retain the types folder generated by tsc

		rollupOptions: {
			external: [ 'vue' ], // external modules won't be bundled into your library
			output: {
				exports: 'named', // disable warning on src/index.ts using both default and named export
				globals: { vue: 'Vue' }, // Provide global variables to use in the UMD build for externalized deps (not useful if 'umd' is not in lib.formats)
			},
		},

		lib: {
			entry: './index.ts',
			fileName: 'lnx',
			formats: ['es'],
		},
	},
});