<script setup lang="ts">
import { computed } from 'vue';
import { shortcutKeys } from './shortcuts';

const props = defineProps<{
	combo: string; /* Keys joined with '+', and a space for sequences: 'mod+enter', 'n', 'g i'. mod is ⌘ on Mac and Ctrl elsewhere */
}>();

const keys = computed(() => shortcutKeys(props.combo));
</script>

<template>
	<!-- A visual hint: what the shortcut does is already in the name of the button next to it -->
	<span
		class="lnx-kbd"
		aria-hidden="true"
	>
		<kbd
			v-for="(key, index) in keys"
			:key="index"
		>{{ key }}</kbd>
	</span>
</template>

<style lang="scss">
.lnx-kbd {
	display: inline-flex;
	gap: 2px;
	vertical-align: middle;

	kbd {
		min-width: 1.6em;
		height: 1.6em;
		padding: 0 .35em;
		display: inline-grid;
		place-items: center;
		border: 1px solid color-mix(in srgb, currentColor 22%, transparent);
		border-bottom-width: 2px;
		border-radius: var(--lnx-radius-2);
		background: color-mix(in srgb, currentColor 6%, transparent);
		color: inherit;
		font: var(--lnx-font-weight-bold) 11px / 1 var(--lnx-font-family-body);
		font-variant-numeric: tabular-nums;
	}

	:is(button, a) & {
		opacity: .55;
		transition: opacity .15s ease;
	}

	:is(button, a):is(:hover, :focus-visible) & {
		opacity: 1;
	}

	/* Touch screens have no keyboard */
	@media (hover: none) {
		display: none;
	}
}
</style>
