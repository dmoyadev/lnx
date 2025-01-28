import { defineConfig } from 'vitepress';
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons';
import pkg from '../package.json';

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: 'Lnx',
	description: 'Components & Utils Library',

	lastUpdated: true,

	// Makes easy to link doc files through the project tree
	rewrites: {
		'docs/:slug*': ':slug*',
		'packages/components/src/themes/:theme/:slug*': 'themes/:theme/:slug*',
		'packages/components/src/:component/:slug*': 'components/:component/:slug*',
		'packages/components/:slug*': 'components/:slug*',
	},

	markdown: {
		lineNumbers: true,
		config(md) {
			md.use(groupIconMdPlugin);
		},
	},

	vite: {
		plugins: [groupIconVitePlugin()],
		css: { preprocessorOptions: { scss: { api: 'modern' } } },
	},

	appearance: 'force-dark',

	themeConfig: {
		externalLinkIcon: true,

		docFooter: {
			next: false,
			prev: false,
		},

		nav: [
			{
				text: 'Docs',
				link: 'docs/know-hows',
			},

			{
				text: 'v' + pkg.version,
				items: [
					{
						text: 'npm',
						link: 'https://www.npmjs.com/package/lnxjs-components',
					},
					{
						text: 'Components Changelog',
						link: 'components/CHANGELOG.md',
					},
				],
			},

			{
				component: 'ThemeSwitcher',
				props: {},
			},
		],

		socialLinks: [
			{
				icon: 'github',
				link: 'https://github.com/dmoyadev/lnx',
			},
		],

		sidebar: [
			{
				text: 'Reference',
				collapsed: false,
				base: 'docs/',
				items: [
					{
						text: 'Know-Hows',
						link: 'know-hows',
					},
				],
			},
			{
				text: 'Themes',
				collapsed: false,
				base: 'themes/',
				items: [
					{
						text: 'Bobcat',
						link: 'bobcat',
					},
					{
						text: 'Iberian',
						link: 'iberian',
					},
				],
			},
			{
				text: 'Components',
				collapsed: false,
				base: 'components/',
				items: [
					{
						text: 'Button',
						link: 'button',
					},
				],
			},
		],

		editLink: {
			pattern: 'https://github.com/dmoyadev/lnx/edit/main/:path',
			text: 'Edit this page on GitHub',
		},
	},
});
