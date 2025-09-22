import type { App, Plugin } from 'vue';
import LnxDatePicker from './LnxDatePicker.vue';

export default {
	install(app: App) {
		app.component(LnxDatePicker.name!, LnxDatePicker);
	},
} as Plugin;

export { LnxDatePicker };