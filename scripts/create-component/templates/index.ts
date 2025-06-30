import type { App, Plugin } from 'vue';
import Lnx<<ComponentName>> from './Lnx<<ComponentName>>.vue';

export default {
	install(app: App) {
		app.component(Lnx.name!, Lnx);
	},
} as Plugin;

export { Lnx<<ComponentName>> };

export * from './types';