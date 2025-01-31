<script setup lang="ts">
import { ref } from 'vue';
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
</script>

<template>
	<section>
		<header>
			<h3 id="showcase">
				SHOWCASE
			</h3>

			<DemoContainerActions
				v-model:is-dark="isDark"
				v-model:show-code="showCode"
				class="actions"
				@reset="$emit('reset')"
			/>
		</header>

		<div
			class="vp-raw demo-container"
			v-bind="$attrs"
			:class="{ 'light-mode': !isDark }"
		>
			<slot :emitted="addEmittedEvent" />
		</div>

		<DemoCode
			v-if="showCode"
			:code="demoCode"
		/>

		<ComponentChanger
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
	margin-top: 24px;
	gap: 8px;

	header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;

		h3 {
			color: var(--vp-c-text-2);
			margin: 0;
		}
	}

	.demo-container {
		transition: all .2s;
		background: var(--vp-code-block-bg);
		border-radius: 8px;
		padding: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow-x: visible;
		overflow-y: visible;
		position: relative;

		&.light-mode {
			background: var(--lnx-color-gray-1);
			color: var(--lnx-color-gray-9);
		}
	}
}
</style>
