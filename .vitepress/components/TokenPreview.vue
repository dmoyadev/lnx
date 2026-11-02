<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from 'vue';
import { getContrast } from './contrast';

/* The token file as text (`import tokens from './tokens/colors.scss?raw'`), so the preview can't drift from the code */
const props = defineProps<{ source: string }>();

interface Token {
	name: string;
	value: string;
	description?: string;
	kind?: string;
}

const DECLARATION = /^\s*(--lnx-[\w-]+):\s*([^;]+);\s*(?:\/\*\s*(.*?)\s*\*\/|\/\/\s*(.*))?$/;
/* A comment alone in one line, like `/** Brand **\/`, starts a group */
const GROUP_TITLE = /^\s*\/\*+\s*(.+?)\s*\*+\/\s*$/;
const KINDS = ['color', 'spacing', 'radius', 'elevation', 'font-size', 'font-family', 'font-weight'];

const groups = computed(() => {
	const result: { title?: string; tokens: Token[] }[] = [{ tokens: [] }];
	const seen = new Set<string>();
	for(const line of props.source.split('\n')) {
		const title = line.match(GROUP_TITLE)?.[1];
		if(title) {
			result.push({
				title,
				tokens: [],
			});
			continue;
		}

		const [, name, value, blockComment, lineComment] = line.match(DECLARATION) ?? [];
		/* Later blocks (like the light mode one) only override values already listed */
		if(!name || seen.has(name)) {
			continue;
		}

		seen.add(name);
		result.at(-1)!.tokens.push({
			name,
			value: value.trim(),
			description: blockComment ?? lineComment,
			kind: KINDS.find(kind => name.includes(`-${kind}`)),
		});
	}

	return result.filter(group => group.tokens.length);
});

/* Declared on the preview itself, so a theme page shows that theme's values whatever theme the docs use */
const declarations = computed(() => Object.fromEntries(groups.value.flatMap(group => group.tokens).map(token => [token.name, token.value])));

const root = useTemplateRef('root');
const probe = useTemplateRef('probe');
const resolved = ref<Record<string, string>>({});
const contrast = ref<Record<string, string>>({});

// shortcut: only reads rgb()/rgba() colors (every token today is hex); colors like oklch() get no contrast ratio
function toRgb(color: string) {
	probe.value!.style.color = color;
	const computedColor = getComputedStyle(probe.value!).color;
	const [r, g, b, alpha = 1] = computedColor.match(/[\d.]+/g)?.map(Number) ?? [];
	return computedColor.startsWith('rgb') && alpha === 1 ? [r, g, b] : undefined;
}

onMounted(() => {
	const styles = getComputedStyle(root.value!);
	const background = toRgb('var(--lnx-color-bg)');
	for(const token of groups.value.flatMap(group => group.tokens)) {
		resolved.value[token.name] = styles.getPropertyValue(token.name).trim();

		const color = token.kind === 'color' && background && toRgb(`var(${token.name})`);
		if(color) {
			contrast.value[token.name] = `${getContrast(color, background).toFixed(1)}:1`;
		}
	}
});
</script>

<template>
	<div
		ref="root"
		class="token-preview"
		:style="declarations"
	>
		<span
			ref="probe"
			hidden
		/>

		<section
			v-for="group in groups"
			:key="group.title"
		>
			<h4 v-if="group.title">
				{{ group.title }}
			</h4>

			<ul>
				<li
					v-for="token in group.tokens"
					:key="token.name"
				>
					<div
						v-if="token.kind"
						class="sample"
						:class="`sample-${token.kind}`"
						:style="{ '--token': `var(${token.name})` }"
						aria-hidden="true"
					>
						<template v-if="token.kind.startsWith('font')">
							Aa
						</template>
					</div>

					<code class="name">{{ token.name }}</code>
					<span class="value">{{ resolved[token.name] || token.value }}</span>
					<span
						v-if="token.value.includes('var(')"
						class="hint"
					>{{ token.value }}</span>
					<span
						v-if="contrast[token.name]"
						class="hint"
						title="Contrast against --lnx-color-bg. 4.5:1 or more passes WCAG AA for body text"
					>
						Contrast {{ contrast[token.name] }}
					</span>
					<span
						v-if="token.description"
						class="hint"
					>{{ token.description }}</span>
				</li>
			</ul>
		</section>
	</div>
</template>

<style scoped lang="scss">
.token-preview {
	margin: 16px 0;
}

h4 {
	margin: 24px 0 8px;
}

ul {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
	gap: 12px;
	margin: 0;
	padding: 0;
	list-style: none;
}

li {
	display: flex;
	flex-direction: column;
	gap: 2px;
	margin: 0;
	padding: 8px;
	border: 1px solid var(--vp-c-divider);
	border-radius: 8px;
	background: var(--vp-c-bg-soft);
	font-size: 13px;
	line-height: 1.4;
}

.sample {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 56px;
	margin-bottom: 6px;
	border-radius: 6px;
	background: var(--vp-c-bg);
	color: var(--vp-c-text-1);
}

.sample-color {
	background: var(--token);
	box-shadow: inset 0 0 0 1px var(--vp-c-divider); /* Keeps colors close to the background visible */
}

.sample-spacing {
	justify-content: flex-start;
	padding: 0 8px;

	&::after {
		content: '';
		width: var(--token);
		height: 12px;
		border-radius: 2px;
		background: var(--vp-c-brand-1);
	}
}

.sample-radius::after {
	content: '';
	width: 40px;
	height: 40px;
	border: 2px solid var(--vp-c-brand-1);
	border-radius: var(--token);
	background: var(--vp-c-brand-soft);
}

/* Light background: the shadows are too subtle to see on the dark one */
.sample-elevation {
	background: var(--lnx-color-gray-2);

	&::after {
		content: '';
		width: 64px;
		height: 32px;
		border-radius: 4px;
		background: var(--lnx-color-gray-0);
		box-shadow: var(--token);
	}
}

.sample-font-size {
	font-size: var(--token);
}

.sample-font-family {
	font-family: var(--token);
	font-size: 24px;
}

.sample-font-weight {
	font-weight: var(--token);
	font-size: 24px;
}

.name {
	overflow-wrap: anywhere;
}

.hint {
	color: var(--vp-c-text-2);
	font-size: 12px;
	overflow-wrap: anywhere;
}
</style>
