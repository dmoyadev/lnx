<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { LnxButton } from '../../packages/components/src/button';
import { LnxInput } from '../../packages/components/src/input';
import { LnxSelect } from '../../packages/components/src/select';
import { LnxInputOTP } from '../../packages/components/src/input-otp';
import { LnxDatePickerWindow } from '../../packages/components/src/date-picker-window';
import { getContrast } from './contrast';

const TOKENS = {
	primary: {
		name: '--lnx-color-primary',
		label: 'Primary',
		hint: 'Solid buttons and selected items. Changing it suggests the other three',
	},
	light: {
		name: '--lnx-color-primary-light',
		label: 'Light',
		hint: 'Highlights, like a date range or a file dragged over the uploader',
	},
	dark: {
		name: '--lnx-color-primary-dark',
		label: 'Dark',
		hint: 'Not used by the components yet, available for your own styles',
	},
	accent: {
		name: '--lnx-color-primary-accent',
		label: 'Accent',
		hint: 'Text and icons on top of the primary color',
	},
} as const;
type TokenKey = keyof typeof TOKENS;

const HEX = /^#[0-9a-f]{6}$/i;
const DARK_TEXT = '#191919';
const LIGHT_TEXT = '#ffffff';

function toRgb(hex: string) {
	return [1, 3, 5].map(index => parseInt(hex.slice(index, index + 2), 16));
}

function toHex(rgb: number[]) {
	return `#${rgb.map(channel => Math.round(channel).toString(16).padStart(2, '0')).join('')}`;
}

/* Moves each channel `amount` (0 to 1) of the way to `target` (0 for black, 255 for white) */
function mix(hex: string, target: number, amount: number) {
	return toHex(toRgb(hex).map(channel => channel + (target - channel) * amount));
}

const colors = ref<Record<TokenKey, string>>({
	primary: '#7fc1dc',
	light: '#8acde8',
	dark: '#075c80',
	accent: DARK_TEXT,
});

function suggestFromPrimary(primary: string) {
	const accent = getContrast(toRgb(DARK_TEXT), toRgb(primary)) >= getContrast(toRgb(LIGHT_TEXT), toRgb(primary)) ? DARK_TEXT : LIGHT_TEXT;
	colors.value = {
		primary,
		light: mix(primary, 255, 0.1),
		dark: mix(primary, 0, 0.45),
		accent,
	};
}

function onColorInput(key: TokenKey, event: Event) {
	const value = (event.target as HTMLInputElement).value;
	if(key === 'primary') {
		suggestFromPrimary(value);
		return;
	}

	colors.value[key] = value;
}

/* Set on <html>, so the whole page follows the colors, including dropdowns and dialogs rendered outside the preview */
function applyColors() {
	for(const [key, token] of Object.entries(TOKENS)) {
		document.documentElement.style.setProperty(token.name, colors.value[key as TokenKey]);
	}
}
watch(colors, applyColors, { deep: true });

const background = ref<number[]>();
onMounted(() => {
	const styles = getComputedStyle(document.documentElement);
	/* Start from the theme the docs are using */
	const current = Object.fromEntries(Object.entries(TOKENS).map(([key, token]) => [key, styles.getPropertyValue(token.name).trim()]));
	if(Object.values(current).every(value => HEX.test(value))) {
		colors.value = current as Record<TokenKey, string>;
	}

	const backgroundColor = styles.getPropertyValue('--lnx-color-bg').trim();
	background.value = HEX.test(backgroundColor) ? toRgb(backgroundColor) : undefined;
	applyColors();
});
onBeforeUnmount(() => {
	for(const token of Object.values(TOKENS)) {
		document.documentElement.style.removeProperty(token.name);
	}
});

const checks = computed(() => [
	{
		label: 'Text on solid buttons',
		ratio: getContrast(toRgb(colors.value.accent), toRgb(colors.value.primary)),
	},
	...(background.value ? [{
		label: 'Primary on the page background',
		ratio: getContrast(toRgb(colors.value.primary), background.value),
	}] : []),
]);

const themeName = ref('my-theme');
const themeSlug = computed(() => themeName.value.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '') || 'my-theme');
const css = computed(() => [
	`html[data-theme='${themeSlug.value}'] {`,
	...Object.entries(TOKENS).map(([key, token]) => `\t${token.name}: ${colors.value[key as TokenKey]};`),
	'}',
].join('\n'));

const copyStatus = ref('');
async function copyCss() {
	try {
		await navigator.clipboard.writeText(css.value);
		copyStatus.value = 'Copied to the clipboard';
	} catch {
		copyStatus.value = 'Your browser blocked the clipboard: select the CSS and copy it';
	}
	setTimeout(() => copyStatus.value = '', 3000);
}

/* Preview state */
const name = ref('');
const plan = ref('');
const code = ref('');
const day = ref<Date>();
</script>

<template>
	<div class="theme-builder vp-raw">
		<section aria-labelledby="theme-builder-colors">
			<h2 id="theme-builder-colors">
				Colors
			</h2>

			<div class="colors">
				<label
					v-for="(token, key) in TOKENS"
					:key="key"
					class="color"
				>
					<input
						type="color"
						:value="colors[key]"
						@input="onColorInput(key, $event)"
					>
					<span class="color-text">
						<strong>{{ token.label }}</strong>
						<code>{{ colors[key] }}</code>
						<span class="hint">{{ token.hint }}</span>
					</span>
				</label>
			</div>

			<ul class="checks">
				<li
					v-for="check in checks"
					:key="check.label"
				>
					{{ check.label }}: <strong>{{ check.ratio.toFixed(1) }}:1</strong>,
					<span :class="check.ratio >= 4.5 ? 'pass' : 'fail'">
						{{ check.ratio >= 4.5 ? 'passes WCAG AA' : 'below the 4.5:1 that WCAG AA asks for text' }}
					</span>
				</li>
			</ul>
		</section>

		<section aria-labelledby="theme-builder-preview">
			<h2 id="theme-builder-preview">
				Preview
			</h2>

			<div class="preview">
				<div class="buttons">
					<LnxButton>Save</LnxButton>
					<LnxButton mode="outline">
						Preview
					</LnxButton>
					<LnxButton mode="clear">
						Cancel
					</LnxButton>
					<LnxButton mode="link">
						Learn more
					</LnxButton>
					<LnxButton is-loading>
						Saving
					</LnxButton>
				</div>

				<div class="fields">
					<LnxInput
						v-model="name"
						placeholder="Ada Lovelace"
						is-clearable
					>
						Name
					</LnxInput>
					<LnxSelect
						v-model="plan"
						:options="['Free', 'Pro', 'Team']"
						placeholder="Choose a plan"
					>
						Plan
					</LnxSelect>
					<LnxInputOTP
						v-model="code"
						:length="4"
					>
						Code
					</LnxInputOTP>
				</div>

				<LnxDatePickerWindow v-model="day" />
			</div>
		</section>

		<section aria-labelledby="theme-builder-css">
			<h2 id="theme-builder-css">
				CSS
			</h2>

			<LnxInput v-model="themeName">
				Theme name
				<template #helper>
					Use it in the <code>data-theme</code> attribute of your <code>html</code> tag
				</template>
			</LnxInput>

			<pre class="css"><code>{{ css }}</code></pre>

			<div class="copy">
				<LnxButton
					mode="outline"
					@click="copyCss()"
				>
					Copy CSS
				</LnxButton>
				<span role="status">{{ copyStatus }}</span>
			</div>
		</section>
	</div>
</template>

<style scoped lang="scss">
.theme-builder {
	display: flex;
	flex-direction: column;
	gap: 40px;
	margin-top: 24px;
}

h2 {
	margin: 0 0 16px;
	padding: 0;
	border: 0;
	font-size: 20px;
}

.colors {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
	gap: 12px;
}

.color {
	display: flex;
	align-items: flex-start;
	gap: 12px;
	padding: 12px;
	border: 1px solid var(--vp-c-divider);
	border-radius: 8px;
	background: var(--vp-c-bg-soft);
	cursor: pointer;

	input {
		flex-shrink: 0;
		width: 44px;
		height: 44px;
		padding: 0;
		border: 0;
		border-radius: 6px;
		background: none;
		cursor: pointer;
	}
}

.color-text {
	display: flex;
	flex-direction: column;
	gap: 2px;
	font-size: 14px;
}

.hint {
	color: var(--vp-c-text-2);
	font-size: 12px;
	line-height: 1.4;
}

.checks {
	margin: 16px 0 0;
	padding: 0;
	list-style: none;
	font-size: 14px;

	li + li {
		margin-top: 4px;
	}

	.pass {
		color: var(--lnx-color-success);
	}

	.fail {
		color: var(--lnx-color-danger);
	}
}

.preview {
	display: flex;
	flex-direction: column;
	gap: 24px;
	padding: 24px;
	border: 1px solid var(--vp-c-divider);
	border-radius: 12px;
}

/* The calendar would otherwise stretch to the whole width */
.preview > :last-child {
	align-self: flex-start;
}

.buttons {
	display: flex;
	flex-wrap: wrap;
	gap: 12px;
}

.fields {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
	gap: 16px;
	align-items: start;
}

.css {
	margin: 16px 0 12px;
	padding: 16px;
	overflow-x: auto;
	border-radius: 8px;
	background: var(--vp-code-block-bg);
	font-family: var(--vp-font-family-mono);
	font-size: 14px;
	line-height: 1.6;
	tab-size: 2;
}

.copy {
	display: flex;
	align-items: center;
	gap: 12px;
	font-size: 14px;
	color: var(--vp-c-text-2);
}
</style>
