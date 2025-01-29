<script setup lang="ts">
import { ref } from 'vue';
import DemoContainerActions from './DemoContainerActions.vue';
import ComponentChanger from './ComponentChanger.vue';
import { ComponentEvent, ComponentProp, ComponentSlot, EmittedEvent } from './types';

const props = defineModel<Record<string, ComponentProp>>('props');
const options = defineModel<Record<string, ComponentProp>>('options');
const slots = defineModel<Record<string, ComponentSlot>>('slots');
const events = defineModel<Record<string, ComponentEvent>>('events');

const isDark = ref(true);
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
	<div
		class="vp-raw demo-container"
		v-bind="$attrs"
		:class="{ 'light-mode': !isDark }"
	>
		<h3 id="showcase">
			SHOWCASE
		</h3>
		<DemoContainerActions
			v-model:is-dark="isDark"
			class="actions"
		/>
		<slot :emitted="addEmittedEvent" />
	</div>

	<ComponentChanger
		:props
		:options
		:slots
		:events
		:emitted
	/>
</template>

<style lang="scss" scoped>
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
	margin-top: 24px;

	&.light-mode {
		background: var(--lnx-color-gray-1);
		color: var(--lnx-color-gray-9);
	}

	#showcase {
		position: absolute;
		font-family: sans-serif;
		color: var(--vp-c-text-2);
		font-size: 12px;
		top: -8px;
		left: 8px;
		margin: 0;
	}

	.actions {
		position: absolute;
		z-index: 1000;
		top: -20px;
		right: -20px;
	}

	details {
		summary {
			font-size: var(--lnx-font-size-legal);
		}

		pre {

		}
	}
}
</style>
