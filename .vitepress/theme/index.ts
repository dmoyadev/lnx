import DefaultTheme from 'vitepress/theme';
import DemoContainer from '../components/DemoContainer.vue';

import 'virtual:group-icons.css';
import '../../packages/components/src/themes/base/index.scss';
import './custom.scss';

export default {
	...DefaultTheme,

	enhanceApp: ({ app }) => {
		app.component('DemoContainer', DemoContainer);
	},
};