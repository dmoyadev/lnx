import fs from 'fs';
import path from 'path';
import { runnerImport } from 'vite';
import type { MarkdownRenderer } from 'vitepress';
import type { Ref } from 'vue';
import type { ComponentCSSVars, ComponentEvent, ComponentProp, ComponentSlot } from './components/types';
import { toDashCase } from './components/utils';

interface ComponentDocs {
	componentProps: Ref<Record<string, ComponentProp>>;
	componentOptions?: Ref<Record<string, ComponentProp>>;
	componentSlots?: Ref<Record<string, ComponentSlot>>;
	componentEvents?: Ref<Record<string, ComponentEvent>>;
	componentCSSVars?: Ref<Record<string, ComponentCSSVars>>;
}

/* Component pages write this where their API tables should go */
const API_MARKER = '<!--@api-->';

function formatCell(text: unknown) {
	return text === undefined || text === '' ? '—' : String(text).replaceAll('|', '\\|').replaceAll('\n', ' ');
}

function formatType(type: ComponentProp['type'], src: string) {
	if(typeof type === 'object') {
		return `[\`${type.name}\`](${type.link})`;
	}

	/* Link to the type's own section when the page has one */
	return src.includes(`### ${type}\n`) ? `[\`${type}\`](#${type.toLowerCase()})` : `\`${type}\``;
}

/* The default goes under the description: in its own column, long values (like arrays) squeeze the description */
function formatDescription(description?: string, defaultValue?: unknown) {
	const hasDefault = defaultValue !== undefined && defaultValue !== 'undefined';
	return [description, hasDefault && `Default: \`${defaultValue}\``].filter(Boolean).join('<br>');
}

function getTable(title: string, headers: string[], rows: unknown[][]) {
	if(!rows.length) {
		return '';
	}

	return [
		`### ${title}`,
		`| ${headers.join(' | ')} |`,
		`| ${headers.map(() => '---').join(' | ')} |`,
		...rows.map(row => `| ${row.map(formatCell).join(' | ')} |`),
	].join('\n');
}

function getApiMarkdown(docs: ComponentDocs, src: string) {
	const attributes = Object.values(docs.componentOptions?.value ?? {}).filter(option => option.configurableOptionName);

	return [
		'<div class="lnx-api">',
		'## API',
		getTable('Props', ['Prop', 'Type', 'Description'], Object.entries(docs.componentProps.value).map(([name, prop]) => [
			`\`${toDashCase(name)}\``,
			formatType(prop.type, src),
			formatDescription(prop.description, prop.defaultValue),
		])),
		getTable('Native attributes', ['Attribute', 'Type', 'Description'], attributes.map(option => [
			`\`${option.configurableOptionName}\``,
			formatType(option.type, src),
			formatDescription(option.description, option.defaultValue),
		])),
		getTable('Events', ['Event', 'Payload', 'Description'], Object.entries(docs.componentEvents?.value ?? {}).map(([name, event]) => [
			`\`${name}\``,
			formatType(event.type, src),
			[event.description, event.isNative && '_Native HTML event_'].filter(Boolean).join('. '),
		])),
		getTable('Slots', ['Slot', 'Scope', 'Description'], Object.entries(docs.componentSlots?.value ?? {}).map(([name, slot]) => [
			`\`${name}\``,
			slot.scopes?.map(scope => `\`${scope.name}: ${scope.type}\``).join(', '),
			slot.description,
		])),
		getTable('CSS variables', ['Variable', 'Description'], Object.entries(docs.componentCSSVars?.value ?? {}).map(([name, cssVar]) => [
			`\`${name}\``,
			cssVar.description,
		])),
		'</div>',
	].filter(Boolean).join('\n\n');
}

/* Reads the playground data of every component (its `docs.ts`), so the API is written once and shown twice */
// shortcut: read once when the config loads, so the dev server needs a restart to show changes to a `docs.ts`
export async function loadComponentDocs(componentsPath: string) {
	const docs: Record<string, ComponentDocs> = {};

	await Promise.all(fs.readdirSync(componentsPath).map(async folder => {
		const docsPath = path.join(componentsPath, folder, 'docs.ts');
		if(!fs.existsSync(docsPath)) {
			return;
		}

		/* Vite's module runner handles the TypeScript and extensionless imports Node can't */
		const { module } = await runnerImport<{ useComponent: () => ComponentDocs }>(docsPath, {
			configFile: false,
			logLevel: 'error',
		});
		docs[path.dirname(docsPath)] = module.useComponent();
	}));

	return docs;
}

/* Swaps the marker for Markdown tables before parsing, so they render like the rest of the page and the local search indexes them */
export function componentApiPlugin(md: MarkdownRenderer, docs: Record<string, ComponentDocs>) {
	md.core.ruler.before('normalize', 'lnx-component-api', state => {
		/* Pages get the rewritten path in `path` and the source file in `realPath`; the search only sets `path`, to the source file. Inline renders set neither */
		const file = state.env?.realPath ?? state.env?.path;
		const componentDocs = file && docs[path.dirname(file)];
		if(componentDocs) {
			/* Blank lines around keep the tables out of any HTML block right above the marker */
			state.src = state.src.replace(API_MARKER, () => `\n${getApiMarkdown(componentDocs, state.src)}\n`);
		}
	});
}
