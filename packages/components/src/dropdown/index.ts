import type { App, Plugin } from 'vue';
import LnxDropdown from './LnxDropdown.vue';

export default {
	install(app: App) {
		app.component(LnxDropdown.name!, LnxDropdown);
	},
} as Plugin;

export { LnxDropdown };