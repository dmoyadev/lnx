import { defineConfig } from 'vitepress';
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons';

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: 'Lnx',
	description: 'Components & Utils Library',

	// Makes easy to link doc files through the project tree
	rewrites: {
		'docs/:slug*': ':slug*',
		'packages/components/src/:component/:slug*': 'components/:component/:slug*',
		'packages/components/src/themes/:theme/:slug*': 'themes/:theme/:slug*',
	},

	markdown: {
		lineNumbers: true,
		config(md) {
			md.use(groupIconMdPlugin);
		},
	},

	vite: {
		plugins: [
			groupIconVitePlugin(),
		],
	},

	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		nav: [
			{
				text: 'Home',
				link: '/', 
			},
		],

		sidebar: [
			{
				text: 'Themes',
				collapsed: false,
				items: [
					{
						text: 'Iberian',
						link: 'themes/iberian',
					},
				],
			},
			{
				text: 'Components',
				collapsed: false,
				items: [
					{
						text: 'Button',
						link: 'components/button',
					},
				],
			},
		],

		socialLinks: [
			{
				icon: 'github',
				link: 'https://github.com/dmoyadev/lnx',
			},
		],
	},
});
