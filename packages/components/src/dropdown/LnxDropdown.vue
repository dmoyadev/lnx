<script setup lang="ts">
import { useDropdownPosition } from './useDropdownPosition';
import { computed, reactive, Ref, ref, useTemplateRef, watch } from 'vue';
import { DROPDOWN_WIDTHS, DropdownWidth } from './types';

const props = defineProps<{
	isOpen?: boolean; /* Whether to show the dropdown */
	offsetX?: number; /* Horizontal offset of the dropdown */
	offsetY?: number; /* Vertical offset of the dropdown */
	width?: DropdownWidth; /* How wide the content is: as the element that opens it, at least as wide, or as its own content */
	fitContent?: boolean; /* Deprecated: use `width="min-anchor"` */
}>();

const width = computed<DropdownWidth>(() => props.width ?? (props.fitContent ? DROPDOWN_WIDTHS.MIN_ANCHOR : DROPDOWN_WIDTHS.ANCHOR));

defineSlots<{
	default(): unknown; /* The element that triggers the dropdown */
	content(): unknown; /* The content of the dropdown */
}>();

const $handler = useTemplateRef('$handler');
const $dropdown = useTemplateRef('$dropdown');
const { calculatePosition } = useDropdownPosition($dropdown as Ref<HTMLElement>, $handler as Ref<HTMLElement>, reactive({
	offsetX: computed(() => props.offsetX),
	offsetY: computed(() => props.offsetY),
	width,
}));
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
					:class="{ 'fit-content': width !== DROPDOWN_WIDTHS.ANCHOR }"
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
	width: 100%; /* Fields fill their container, like the input does */
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