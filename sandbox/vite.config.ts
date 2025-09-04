import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

export default defineConfig({
	plugins: [
		vue({ template: { compilerOptions: { isCustomElement: tag => tag === 'iconify-icon' } } }),
		vueDevTools(),
	],
});
