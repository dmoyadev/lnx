<script setup lang="ts">
import { useDropdownPosition } from './useDropdownPosition';
import { Ref, ref, useTemplateRef, watch } from 'vue';

const props = defineProps<{
	isOpen?: boolean; /* Whether to show the dropdown */
	offsetX?: number; /* Horizontal offset of the dropdown */
	offsetY?: number; /* Vertical offset of the dropdown */
	fitContent?: boolean; /* Lets the content be wider than the element that opens the dropdown */
}>();

defineSlots<{
	default(): unknown; /* The element that triggers the dropdown */
	content(): unknown; /* The content of the dropdown */
}>();

const $handler = useTemplateRef('$handler');
const $dropdown = useTemplateRef('$dropdown');
const { calculatePosition } = useDropdownPosition($dropdown as Ref<HTMLElement>, $handler as Ref<HTMLElement>, props);
// Inside a modal <dialog> (top layer) the content must live in the dialog, or it would be hidden behind it and inert
const teleportTarget = ref<string | HTMLElement>('body');
watch(() => props.isOpen, async (isOpen) => {
	if(isOpen) {
		teleportTarget.value = $handler.value?.closest<HTMLElement>('dialog[open]') ?? 'body';
	}
	await calculatePosition();
});

defineExpose({ calculatePosition });
</script>

<template>
	<details
		class="dropdown"
		:open="isOpen"
	>
		<summary ref="$handler">
			<slot />
		</summary>

		<Teleport :to="teleportTarget">
			<Transition>
				<div
					v-if="isOpen"
					ref="$dropdown"
					class="wrapper"
					:class="{ 'fit-content': fitContent }"
					tabindex="0"
					v-bind="{ ...$attrs }"
				>
					<slot
						name="content"
					/>
				</div>
			</Transition>
		</Teleport>
	</details>
</template>

<style scoped lang="scss">
.dropdown {
	position: relative;
}

.wrapper {
	position: fixed;
	top: 0;
	left: 0;
	will-change: opacity;
	background: var(--lnx-select-list-color-bg, var(--lnx-color-surface));
	color: var(--lnx-color-text);
	z-index: calc(var(--lnx-zindex-modal) + 1);
	border: 1px solid var(--lnx-color-border);
	border-radius: var(--lnx-surface-radius);
	box-shadow: var(--lnx-elevation-3);
	max-height: 296px;
	overflow-y: auto;
	margin: 0;

	&.fit-content {
		max-height: none;
	}
}

.v-enter-active,
.v-leave-active {
	transition: opacity .2s;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
}
</style>