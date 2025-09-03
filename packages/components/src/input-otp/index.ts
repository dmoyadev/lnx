import type { App, Plugin } from 'vue';
import LnxInputOTP from './LnxInputOTP.vue';

export default {
	install(app: App) {
		app.component(LnxInputOTP.name!, LnxInputOTP);
	},
} as Plugin;

export { LnxInputOTP };