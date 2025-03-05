<script setup lang="ts">
import { ref, watch } from 'vue';
import DemoContainerActions from './DemoContainerActions.vue';
import ComponentChanger from './ComponentChanger.vue';
import DemoCode from './DemoCode.vue';
import { ComponentEvent, ComponentProp, ComponentSlot, EmittedEvent } from './types';

defineProps<{ demoCode: string }>();
defineEmits<{ reset: [] }>();

const props = defineModel<Record<string, ComponentProp>>('props');
const options = defineModel<Record<string, ComponentProp>>('options');
const slots = defineModel<Record<string, ComponentSlot>>('slots');
const events = defineModel<Record<string, ComponentEvent>>('events');
const showcasedProp = defineModel<string>('showcasedProp', { default: '' });

const isDark = ref(true);
const showCode = ref(false);
const emitted = ref<EmittedEvent[]>([]);

function addEmittedEvent(name: string, data: unknown) {
	// The timestamp property should include the current hours and minutes
	emitted.value.push({
		name,
		timestamp: new Date(),
		data: JSON.stringify(data).replaceAll('\\"', '"').trimStart(),
	});
}

const possibleVariations = ref<unknown[]>([true]);
watch(showcasedProp, (newVal) => {
	const affectedProp = props.value[newVal] || options.value[newVal];

	if (affectedProp?.controlType === 'select' || affectedProp?.controlType === 'options') {
		if(Array.isArray(affectedProp.options)) {
			possibleVariations.value = affectedProp.options;
			return;
		}
		possibleVariations.value = Object.values(affectedProp.options);
		return;
	}

	if(affectedProp?.controlType === 'switch') {
		possibleVariations.value = [true, false];
		return;
	}

	possibleVariations.value = [true];
});
</script>

<template>
	<section>
		<div class="demo-container-wrapper">
			<h2
				id="showcase"
				class="section-title"
			>
				Showcase
			</h2>

			<header>
				<DemoContainerActions
					v-model:is-dark="isDark"
					v-model:show-code="showCode"
					class="actions"
					@reset="$emit('reset')"
				/>
			</header>

			<span
				v-if="!!showcasedProp"
				class="txt-variations"
			>
				*Showing all variations of <code>{{ showcasedProp }}</code> prop/option,
				<span @click="showcasedProp = ''">click here to reset</span>
			</span>

			<div
				class="vp-raw demo-container"
				v-bind="$attrs"
				:class="{ 'light-mode': !isDark }"
			>
				<div
					v-for="(variation, index) in possibleVariations"
					:key="index"
					class="variation-container"
				>
					<template v-if="possibleVariations.length > 1">
						<span class="title">{{ variation }}</span>
					</template>
					<slot
						:add-emit="addEmittedEvent"
						:showcased-prop="showcasedProp.replaceAll(' ', '')"
						:variation="variation"
					/>
				</div>
			</div>
		</div>

		<DemoCode
			v-if="showCode"
			:code="demoCode"
			:showcased-prop="showcasedProp"
		/>

		<ComponentChanger
			v-model:showcased-prop="showcasedProp"
			:props
			:options
			:slots
			:events
			:emitted
		/>
	</section>
</template>

<style lang="scss" scoped>
section {
	display: flex;
	flex-direction: column;

	.demo-container-wrapper {
		display: flex;
		flex-direction: column;
		position: sticky;
		gap: 8px;
		top: 112px;
		padding: 16px 0;
		z-index: 100000;
		background: var(--vp-c-bg);

		h2 {
			margin-top: 0;
		}

		header {
			display: flex;
			justify-content: flex-end;
			margin-top: -54px;
		}

		.txt-variations {
			font-size: 12px;
			margin: 0 0 -8px;

			span {
				color: var(--lnx-color-primary);

				&:hover {
					text-decoration: underline;
					cursor: pointer;
				}
			}
		}

		.demo-container {
			transition: all .2s;
			background: var(--vp-code-block-bg);
			border-radius: 8px;
			display: flex;
			overflow-y: auto;
			overflow-x: auto;

			.variation-container {
				flex: 1;
				padding: 16px 8px;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: flex-start;

				&:not(:last-child) {
					border-right: 1px solid var(--vp-code-tab-divider);
				}

				&:has(.title) {
					padding-top: 4px;
				}

				.title {
					align-self: flex-start;
					font-size: 12px;
					font-weight: bold;
					font-family: var(--lnx-font-family-mono), monospace;
					color: var(--vp-c-text-2);
					margin-bottom: 8px;
				}
			}

			&.light-mode {
				background: var(--lnx-color-gray-0);
				color: var(--lnx-color-gray-9);
			}
		}
	}
}
</style>
