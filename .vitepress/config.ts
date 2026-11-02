import { defineConfig } from 'vitepress';
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons';
import pkg from '../package.json';
import { componentApiPlugin, loadComponentDocs } from './componentApi';

const componentDocs = await loadComponentDocs(new URL('../packages/components/src', import.meta.url).pathname);

async function getDocFiles(docsPath: string, excludedFolders: string[] = []): Promise<{ text: string, link: string }[]> {
	const fs = await import('fs');
	const path = await import('path');

	const folderPath = path.resolve(__dirname, docsPath);
	const docs: { text: string, link: string }[] = [];

	function walk(dir: string) {
		const files = fs.readdirSync(dir);

		files.forEach(file => {
			const filePath = path.join(dir, file);
			const fileStat = fs.statSync(filePath);

			if (fileStat.isDirectory() && !excludedFolders.includes(file)) {
				walk(filePath);
			} else if (fileStat.isFile() && file.endsWith('.md')) {
				/* Keep the trailing slash of index pages so links match the real URL (`/components/button/`) */
				const fileLink = filePath
					.replace(folderPath, '')
					.replace(/\.md$/, '')
					.replace(/index$/, '');
				/* Use the page title (first `# ` heading) so the sidebar reads like the page */
				const title = fs.readFileSync(filePath, 'utf8').match(/^# (.+)$/m)?.[1];

				docs.push({
					text: title ?? fileLink,
					link: fileLink,
				});
			}
		});
	}
	walk(folderPath);
	
	return docs;
}

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

	srcExclude: ['**/scripts/**'],

	markdown: {
		lineNumbers: true,
		config(md) {
			md.use(groupIconMdPlugin);
			md.use(componentApiPlugin, componentDocs);
		},
	},

	vite: { plugins: [groupIconVitePlugin()] },

	vue: { template: { compilerOptions: { isCustomElement: tag => tag === 'iconify-icon' } } },

	appearance: 'force-dark',

	ignoreDeadLinks: 'localhostLinks',

	head: [
		/* Set the theme before the first paint so pages don't flash unstyled; ThemeSwitcher keeps it in sync */
		['script', {}, 'document.documentElement.dataset.theme = (() => { try { return localStorage.getItem(\'lnx-theme\'); } catch { return null; } })() || \'bobcat\';'],
	],

	themeConfig: {
		externalLinkIcon: true,

		search: { provider: 'local' },

		docFooter: {
			next: false,
			prev: false,
		},

		nav: [
			{
				text: 'Get started',
				link: 'get-started',
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
					{
						text: 'Migration guide',
						link: '/migration',
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
				items: [
					{
						text: 'Get started',
						link: '/get-started',
					},
					{
						text: 'Migration guide',
						link: '/migration',
					},
					{
						text: 'Know-Hows',
						link: '/know-hows',
					},
				],
			},
			{
				text: 'Themes',
				collapsed: false,
				base: '/themes',
				items: await getDocFiles('../packages/components/src/themes'),
			},
			{
				text: 'Components',
				collapsed: false,
				base: '/components',
				items: await getDocFiles('../packages/components/src', ['themes']),
			},
		],

		editLink: {
			pattern: 'https://github.com/dmoyadev/lnx/edit/main/:path',
			text: 'Edit this page on GitHub',
		},
	},
});
