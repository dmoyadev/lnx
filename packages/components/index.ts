import { App, Plugin } from 'vue';
import * as components from './src';

export default {
	install (app: App) {
		for (const componentName in components) {
			app.component(componentName, (components as any)[componentName]);
		}
	},
} as Plugin;

export * from './src';