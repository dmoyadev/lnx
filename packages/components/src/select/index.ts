import type { App, Plugin } from 'vue';
import LnxSelect from './LnxSelect.vue';

export default {
	install(app: App) {
		// @ts-expect-error - Vue type seems wrong since LnxSelect is a generic component
		app.component(LnxSelect.name!, LnxSelect);
	},
} as Plugin;

export { LnxSelect };