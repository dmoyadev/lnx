import { h } from 'vue';
import { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import HomeHeroDemo from '../components/HomeHeroDemo.vue';
import ThemeSwitcher from '../components/ThemeSwitcher.vue';
import DemoContainer from '../components/DemoContainer.vue';
import ComponentChanger from '../components/ComponentChanger.vue';
import TokenPreview from '../components/TokenPreview.vue';

import 'virtual:group-icons.css';
import '../../packages/components/src/themes/base/index.scss';
import './custom.scss';

export default {
	extends: DefaultTheme,

	Layout: () => h(DefaultTheme.Layout, null, { 'home-hero-image': () => h(HomeHeroDemo) }),

	enhanceApp: ({ app }) => {
		app.component('DemoContainer', DemoContainer);
		app.component('ThemeSwitcher', ThemeSwitcher);
		app.component('ComponentChanger', ComponentChanger);
		app.component('TokenPreview', TokenPreview);
	},
} satisfies Theme;