import { defineConfig } from 'vitepress';
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons';
import pkg from '../package.json';

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
				const fileLink = filePath
					.replace(folderPath, '')
					.replace(/\.md$/, '')
					.replace(/\/index$/, '')
					.replace(/\/$/, '');
				const fileText = fileLink.split('/').pop() ?? '';

				/* PascalCase the text */
				const pascalCaseFileText = fileText
					.split('-')
					.map(part => part.charAt(0).toUpperCase() + part.slice(1))
					.join('');
				/* If the text contains uppercase letters, use it as is, otherwise use the pascalCase version */
				const finalFileText = /[A-Z]/.test(fileText) ? fileText : pascalCaseFileText;

				docs.push({
					text: finalFileText,
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
		},
	},

	vite: { plugins: [groupIconVitePlugin()] },

	vue: { template: { compilerOptions: { isCustomElement: tag => tag === 'iconify-icon' } } },

	appearance: 'force-dark',

	themeConfig: {
		externalLinkIcon: true,

		docFooter: {
			next: false,
			prev: false,
		},

		nav: [
			{
				text: 'Get started',
				link: 'docs/get-started',
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
						text: 'Get started',
						link: 'get-started',
					},
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
				items: await getDocFiles('../packages/components/src/themes'),
			},
			{
				text: 'Components',
				collapsed: false,
				base: 'components/',
				items: await getDocFiles('../packages/components/src', ['themes']),
			},
		],

		editLink: {
			pattern: 'https://github.com/dmoyadev/lnx/edit/main/:path',
			text: 'Edit this page on GitHub',
		},
	},
});
