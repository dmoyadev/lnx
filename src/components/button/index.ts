import type { App, Plugin } from 'vue';
import LnxButton from './LnxButton.vue';

export default {
	install(app: App) {
		app.component(LnxButton.name!, LnxButton);
	},
} as Plugin;

export { LnxButton };