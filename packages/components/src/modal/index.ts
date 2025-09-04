import type { App, Plugin } from 'vue';
import LnxModal from './LnxModal.vue';

export default {
	install(app: App) {
		app.component(LnxModal.name!, LnxModal);
	},
} as Plugin;

export { LnxModal };