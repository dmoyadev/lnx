import type { App, Plugin } from 'vue';
import LnxDatePickerWindow from './LnxDatePickerWindow.vue';

export default {
	install(app: App) {
		app.component(LnxDatePickerWindow.name!, LnxDatePickerWindow);
	},
} as Plugin;

export { LnxDatePickerWindow };

export * from './types';