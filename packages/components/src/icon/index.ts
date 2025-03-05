import type { App, Plugin } from 'vue';
import LnxIcon from './LnxIcon.vue';

export default {
	install(app: App) {
		app.component(LnxIcon.name!, LnxIcon);
	},
} as Plugin;

export { LnxIcon };
