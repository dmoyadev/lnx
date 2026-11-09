<script setup lang="ts" generic="T extends string | number">
import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref, useId, useSlots, useTemplateRef, watch } from 'vue';
import { LnxIcon } from '../icon';
import type { Tab } from './types';

const props = defineProps<{
	tabs: Tab<T>[]; /* The tabs. Each one shows the slot named as its value, if there is one */
}>();

defineSlots<Record<string, () => unknown>>(); /* One slot per tab, named as its value, with its panel. Without slots only the bar is shown */

/* The value of the selected tab. With `to`, the tab of the current route */
const model = defineModel<T>();

// The aria-label goes to the tablist; class and style stay on the wrapper
defineOptions({ inheritAttrs: false });

const slots = useSlots();
const id = useId();
const tabId = (tab: Tab<T>) => `${id}-tab-${tab.value}`;
const panelId = (tab: Tab<T>) => `${id}-panel-${tab.value}`;

/* vue-router, when the app has it, without depending on it */
interface Router {
	resolve(to: unknown): { href: string; path: string };
	push(to: unknown): Promise<unknown>;
}
const globals = getCurrentInstance()?.appContext.config.globalProperties as { $router?: Router; $route?: { path: string } } | undefined;

function hrefOf(tab: Tab<T>) {
	if(!tab.to) { return undefined; }
	return globals?.$router?.resolve(tab.to).href ?? (typeof tab.to === 'string' ? tab.to : undefined);
}

/* The route tab whose path is the longest match of the current route, so nested routes keep their tab */
const routeTab = computed(() => {
	const path = globals?.$route?.path;
	if(!path || !globals?.$router) { return undefined; }
	let best: { tab: Tab<T>; length: number } | undefined;
	for(const tab of props.tabs) {
		if(!tab.to) { continue; }
		const tabPath = globals.$router.resolve(tab.to).path;
		if((path === tabPath || path.startsWith(`${tabPath.replace(/\/$/, '')}/`)) && tabPath.length > (best?.length ?? -1)) {
			best = { tab, length: tabPath.length };
		}
	}
	return best?.tab;
});

const selected = computed(() => routeTab.value ?? props.tabs.find(tab => tab.value === model.value));
/* The one Tab reaches: the selected tab, or the first that can be selected */
const focusable = computed(() => selected.value ?? props.tabs.find(tab => !tab.disabled));

function select(tab: Tab<T>) {
	if(tab.disabled) { return; }
	model.value = tab.value;
	if(tab.to && globals?.$router) {
		void globals.$router.push(tab.to);
	}
}

function onClick(event: MouseEvent, tab: Tab<T>) {
	// Links open in a new tab with modifiers, as usual; otherwise the router navigates
	if(tab.to && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !globals?.$router)) { return; }
	event.preventDefault();
	select(tab);
}

/* Roving tabindex: the arrows move between tabs and select them, Home and End go to the ends */
const $tablist = useTemplateRef<HTMLElement>('$tablist');
function onKeydown(event: KeyboardEvent) {
	const enabled = props.tabs.filter(tab => !tab.disabled);
	const index = enabled.indexOf(focusable.value!);
	const next = {
		ArrowRight: enabled[(index + 1) % enabled.length],
		ArrowLeft: enabled[(index - 1 + enabled.length) % enabled.length],
		Home: enabled[0],
		End: enabled.at(-1),
	}[event.key];
	if(!next) { return; }
	event.preventDefault();
	select(next);
	nextTick(() => document.getElementById(tabId(next))?.focus());
}

/* The underline slides to the selected tab */
const indicator = ref({ left: 0, width: 0 });
function placeIndicator() {
	const $tab = selected.value && document.getElementById(tabId(selected.value));
	indicator.value = $tab ? { left: $tab.offsetLeft, width: $tab.offsetWidth } : { left: 0, width: 0 };
}
watch(selected, async () => {
	await nextTick();
	placeIndicator();
	const $tab = selected.value && document.getElementById(tabId(selected.value));
	$tab?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
});
let observer: ResizeObserver | undefined;
onMounted(() => {
	placeIndicator();
	observer = new ResizeObserver(placeIndicator);
	observer.observe($tablist.value!);
});
onBeforeUnmount(() => observer?.disconnect());

const hasPanel = computed(() => !!selected.value && !!slots[String(selected.value.value)]);
</script>

<template>
	<div
		class="lnx-tabs"
		:class="$attrs.class"
		:style="$attrs.style"
	>
		<div
			v-bind="{ ...$attrs, class: undefined, style: undefined }"
			ref="$tablist"
			class="tablist"
			role="tablist"
			@keydown="onKeydown"
		>
			<component
				:is="tab.to ? 'a' : 'button'"
				v-for="tab in tabs"
				:id="tabId(tab)"
				:key="String(tab.value)"
				role="tab"
				class="tab"
				:type="tab.to ? undefined : 'button'"
				:href="hrefOf(tab)"
				:aria-selected="tab === selected"
				:aria-controls="tab === selected && hasPanel ? panelId(tab) : undefined"
				:aria-disabled="tab.disabled || undefined"
				:tabindex="tab === focusable ? 0 : -1"
				@click="onClick($event, tab)"
			>
				<LnxIcon
					v-if="tab.icon"
					:icon="tab.icon"
					:size="16"
				/>
				<span>{{ tab.label }}</span>
				<span
					v-if="tab.badge !== undefined && tab.badge !== ''"
					class="badge"
				>{{ tab.badge }}</span>
			</component>
			<span
				class="indicator"
				aria-hidden="true"
				:style="{ translate: `${indicator.left}px 0`, width: `${indicator.width}px` }"
			/>
		</div>

		<div
			v-if="hasPanel"
			:id="panelId(selected!)"
			:key="String(selected!.value)"
			class="panel"
			role="tabpanel"
			:aria-labelledby="tabId(selected!)"
			tabindex="0"
		>
			<slot :name="String(selected!.value)" />
		</div>
	</div>
</template>

<style scoped lang="scss">
.lnx-tabs {
	display: flex;
	flex-direction: column;
	gap: var(--lnx-spacing-3);
	min-width: 0;
}

.tablist {
	position: relative;
	display: flex;
	gap: var(--lnx-spacing-1);
	border-bottom: 1px solid var(--lnx-color-divider);
	/* Scrolls sideways when the tabs don't fit, without a bar */
	overflow-x: auto;
	scrollbar-width: none;

	&::-webkit-scrollbar {
		display: none;
	}
}

.tab {
	height: calc(var(--lnx-control-height) + var(--lnx-spacing-2));
	padding: 0 var(--lnx-control-padding-x);
	display: inline-flex;
	align-items: center;
	gap: var(--lnx-spacing-1);
	flex-shrink: 0;
	border: none;
	background: none;
	color: var(--lnx-color-text-muted);
	font: inherit;
	font-size: var(--lnx-control-font-size);
	text-decoration: none;
	white-space: nowrap;
	cursor: pointer;
	transition: color .15s;

	&:hover {
		color: var(--lnx-color-text);
	}

	&[aria-selected="true"] {
		color: var(--lnx-color-text);
		font-weight: var(--lnx-font-weight-bold);
	}

	&[aria-disabled="true"] {
		opacity: .5;
		cursor: default;
		pointer-events: none;
	}

	&:focus-visible {
		outline-offset: -2px;
	}
}

.badge {
	min-width: 1.5em;
	padding: 0 .45em;
	border-radius: var(--lnx-radius-5);
	background: var(--lnx-color-gray-bg-accent);
	color: var(--lnx-color-text);
	font-size: 11px;
	font-weight: var(--lnx-font-weight-bold);
	line-height: 1.6;
	text-align: center;
	font-variant-numeric: tabular-nums;
}

.indicator {
	position: absolute;
	left: 0;
	bottom: 0;
	height: 2px;
	background: var(--lnx-color-primary);
	pointer-events: none;
	transition: translate .25s ease, width .25s ease;
}

.panel:focus-visible {
	outline-offset: 4px;
}

@media (prefers-reduced-motion: reduce) {
	.indicator {
		transition: none;
	}
}
</style>
