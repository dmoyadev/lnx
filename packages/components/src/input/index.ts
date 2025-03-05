import type { App, Plugin } from 'vue';
import LnxInput from './LnxInput.vue';

export default {
	install(app: App) {
		app.component(LnxInput.name!, LnxInput);
	},
} as Plugin;

export { LnxInput };
