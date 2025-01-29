import { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import ThemeSwitcher from '../components/ThemeSwitcher.vue';
import DemoContainer from '../components/DemoContainer.vue';
import ComponentChanger from '../components/ComponentChanger.vue';

import 'virtual:group-icons.css';
import '../../packages/components/src/themes/base/index.scss';
import './custom.scss';

export default {
	extends: DefaultTheme,

	enhanceApp: ({ app }) => {
		app.component('DemoContainer', DemoContainer);
		app.component('ThemeSwitcher', ThemeSwitcher);
		app.component('ComponentChanger', ComponentChanger);
	},
} satisfies Theme;