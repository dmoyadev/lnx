import type { App, Plugin } from 'vue';
import LnxFileUploader from './LnxFileUploader.vue';

export default {
	install(app: App) {
		app.component(LnxFileUploader.name!, LnxFileUploader);
	},
} as Plugin;

export { LnxFileUploader };