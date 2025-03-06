<script setup lang="ts">
import { markRaw, ref, watch } from 'vue';
import ChangerProps from './ChangerProps.vue';
import ChangerSlots from './ChangerSlots.vue';
import ChangerEvents from './ChangerEvents.vue';
import ChangerCSSVars from './ChangerCSSVars.vue';
import { ComponentCSSVars, ComponentEvent, ComponentProp, ComponentSlot, EmittedEvent } from './types';

const props = defineModel<Record<string, ComponentProp>>('props');
const options = defineModel<Record<string, ComponentProp>>('options');
const slots = defineModel<Record<string, ComponentSlot>>('slots');
const events = defineModel<Record<string, ComponentEvent>>('events');
const emitted = defineModel<EmittedEvent[]>('emitted');
const cssVars = defineModel<Record<string, ComponentCSSVars>>('cssVars');
const showcasedProp = defineModel<string>('showcasedProp', { default: '' });

interface Tab {
	name: string;
	show: boolean;
	items: Record<string, ComponentProp | unknown>;
	tabComponent: unknown;
}
const Tabs: Record<string, Tab> = {
	props: {
		name: 'Props',
		show: !!Object.values(props.value || {}).length,
		items: { props: props.value },
		tabComponent: markRaw(ChangerProps),
	},
	options: {
		name: 'Options',
		show: !!Object.values(options.value || {}).length,
		items: {
			props: options.value,
			hideType: true,
		},
		tabComponent: markRaw(ChangerProps),
	},
	slots: {
		name: 'Slots',
		show: !!Object.values(slots.value || {}).length,
		items: { slots: slots.value },
		tabComponent: markRaw(ChangerSlots),
	},
	events: {
		name: 'Events',
		show: !!Object.values(events.value || {}).length,
		items: {
			events: events.value,
			emitted: emitted.value,
		},
		tabComponent: markRaw(ChangerEvents),
	},
	cssVars: {
		name: 'CSS variables',
		show: !!Object.values(cssVars.value || {}).length,
		items: { cssVars: cssVars.value },
		tabComponent: markRaw(ChangerCSSVars),
	},
} as const;

const selectedTab = ref<typeof Tabs[keyof typeof Tabs]>(Tabs.props);

const showEmittedNotification = ref(false);
const debouncer = ref<NodeJS.Timeout>();
watch(emitted, () => {
	showEmittedNotification.value = true;
	if(selectedTab.value.name === 'Events') {
		clearTimeout(debouncer.value);
		debouncer.value = setTimeout(() => showEmittedNotification.value = false, 1500);
	}
}, { deep: true });
watch(selectedTab, (newTab) => {
	if(newTab.name === 'Events') {
		showEmittedNotification.value = false;
	}
});
</script>

<template>
	<div class="vp-code-group vp-adaptive-theme">
		<div class="tabs">
			<template
				v-for="(tab, tabCode) in Tabs"
				:key="tab.name"
			>
				<label
					v-if="tab.show"
					:class="{ 'right': tabCode === 'cssVars' }"
				>
					<Transition name="bubble-up">
						<span
							v-if="tabCode === 'events' && showEmittedNotification"
							class="notification"
						>
							!
						</span>
					</Transition>

					<input
						v-model="selectedTab"
						type="radio"
						name="tab"
						:value="tab"
					>
					{{ tab.name }}
				</label>
			</template>
		</div>

		<div class="blocks">
			<div class="language-all vp-adaptive-theme active">
				<KeepAlive>
					<Component
						:is="selectedTab.tabComponent"
						v-model:showcased-prop="showcasedProp"
						v-bind="selectedTab.items"
					/>
				</KeepAlive>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
/* Most of the styles are inherited from VitePress theme, so we only need to change some colors due to the DOM modifications */
.vp-code-group label:has(input:checked) {
	color: var(--vp-code-tab-active-text-color);

	&::after {
		background-color: var(--vp-code-tab-active-bar-color);
	}
}

.language-all {
	padding: 4px 16px;
}

label {
	position: relative;

	&.right {
		margin-left: auto;
	}
}

.notification {
	position: absolute;
	top: 8px;
	right: 0;
	width: 16px;
	height: 16px;
	border-radius: 50%;
	background: var(--lnx-color-primary);
	color: var(--lnx-color-primary-accent);
	font-size: var(--lnx-font-size-legal);
	font-weight: var(--lnx-font-weight-black);
	display: flex;
	align-items: center;
	justify-content: center;
}

/* Transition: bubble-up */
.bubble-up-enter-active {
	animation: bubble-up .2s;
}

.bubble-up-leave-active {
	animation: bubble-up .2s reverse;
}

@keyframes bubble-up {
	0% {
		transform: translateY(50%) scale(.3);
	}
}
/* Transition: bubble-up */
</style>