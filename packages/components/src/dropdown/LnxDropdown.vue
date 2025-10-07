<script setup lang="ts">
import { useDropdownPosition } from './useDropdownPosition';
import { Ref, useTemplateRef, watch } from 'vue';

const props = defineProps<{
	isOpen?: boolean; /* Whether to show the dropdown */
	offsetX?: number; /* Horizontal offset of the dropdown */
	offsetY?: number; /* Vertical offset of the dropdown */
}>();

defineSlots<{
	default(): unknown; /* The element that triggers the dropdown */
	content(): unknown; /* The content of the dropdown */
}>();

const $handler = useTemplateRef('$handler');
const $dropdown = useTemplateRef('$dropdown');
const { calculatePosition } = useDropdownPosition($dropdown as Ref<HTMLElement>, $handler as Ref<HTMLElement>, {
	offsetX: props.offsetX,
	offsetY: props.offsetY,
});
watch(() => props.isOpen, async () => await calculatePosition());

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

		<Teleport to="body">
			<Transition>
				<div
					v-if="isOpen"
					ref="$dropdown"
					class="wrapper"
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
	position: absolute;
	top: 0;
	left: 0;
	will-change: opacity;
	background: var(--lnx-select-list-color-bg, var(--lnx-color-gray-9));
	z-index: calc(var(--lnx-zindex-modal) + 1);
	border: 1px solid var(--lnx-color-gray-3);
	border-radius: var(--lnx-radius-3);
	box-shadow: var(--lnx-elevation-3);
	max-height: 296px;
	overflow-y: auto;
	margin: 0;
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