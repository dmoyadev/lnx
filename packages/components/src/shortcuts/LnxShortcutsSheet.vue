<script setup lang="ts">
import { computed, useId, useTemplateRef } from 'vue';
import { useLnxConfig } from '../config';
import { LnxIcon } from '../icon';
import LnxKbd from './LnxKbd.vue';
import { shortcutBindings, useShortcut } from './shortcuts';
import type { ShortcutRow } from './types';

const props = withDefaults(defineProps<{
	combo?: string; /* Shortcut that opens and closes the sheet */
	rows?: ShortcutRow[]; /* Rows always listed after the shortcuts, for those not registered with useShortcut, like the undo of the toasts */
}>(), {
	combo: '?',
	rows: () => [],
});

const config = useLnxConfig();
const titleId = useId();
const $dialog = useTemplateRef<HTMLDialogElement>('$dialog');

/* The shortcut that wins for each combo, and the combos that do the same thing in one row */
const described = computed(() => {
	const winners = new Map(shortcutBindings
		.filter(binding => binding.description && (binding.enabled?.() ?? true))
		.map(binding => [binding.combo, binding]));
	const rows = new Map<string, string[]>();
	for(const { combo, description } of [...winners.values()].reverse()) {
		rows.set(description!, [...(rows.get(description!) ?? []), combo]);
	}
	return [
		...Array.from(rows, ([description, combos]) => ({ description, combos })),
		...props.rows,
	];
});

function toggle() {
	if($dialog.value?.open) {
		$dialog.value.close();
	} else {
		$dialog.value?.showModal();
	}
}

useShortcut(props.combo, toggle, { description: config.texts.shortcuts });

function onDialogClick(event: MouseEvent) {
	// Clicks on the backdrop target the dialog itself, outside its box
	const rect = $dialog.value!.getBoundingClientRect();
	if(event.target === $dialog.value && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) {
		$dialog.value!.close();
	}
}

defineExpose({ toggle });
</script>

<template>
	<!-- A closed dialog gives the focus back to the element that opened it by itself -->
	<dialog
		ref="$dialog"
		class="lnx-shortcuts-sheet"
		:aria-labelledby="titleId"
		@click="onDialogClick"
	>
		<header>
			<h2 :id="titleId">
				{{ config.texts.shortcuts }}
			</h2>
			<button
				type="button"
				class="close"
				:aria-label="config.texts.close"
				@click="$dialog?.close()"
			>
				<LnxIcon
					icon="lucide:x"
					:size="18"
				/>
			</button>
		</header>
		<dl>
			<div
				v-for="row in described"
				:key="row.description"
			>
				<dt>{{ row.description }}</dt>
				<dd>
					<LnxKbd
						v-for="combo in row.combos"
						:key="combo"
						:combo
					/>
				</dd>
			</div>
		</dl>
	</dialog>
</template>

<style scoped lang="scss">
.lnx-shortcuts-sheet {
	width: min(420px, 100dvw - 2 * var(--lnx-spacing-4));
	padding: var(--lnx-spacing-4);
	background: var(--lnx-color-surface);
	color: var(--lnx-color-text);
	border-radius: var(--lnx-surface-radius);
	border: 1px solid var(--lnx-color-border);
	opacity: 0;
	scale: .96;
	transition: opacity .2s ease, scale .2s ease, overlay .2s allow-discrete, display .2s allow-discrete;

	&[open] {
		opacity: 1;
		scale: 1;

		@starting-style {
			opacity: 0;
			scale: .96;
		}
	}

	&::backdrop {
		background: rgba(0, 0, 0, 0.5);
	}

	header {
		margin-bottom: var(--lnx-spacing-3);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--lnx-spacing-3);
	}

	h2 {
		margin: 0;
		font-size: var(--lnx-font-size-big);
		line-height: var(--lnx-line-height-big);
	}

	.close {
		padding: var(--lnx-spacing-1);
		display: grid;
		border: none;
		border-radius: var(--lnx-radius-circle);
		background: none;
		color: var(--lnx-color-text-muted);
		cursor: pointer;

		&:hover {
			background: var(--lnx-color-gray-bg-accent);
			color: var(--lnx-color-text);
		}
	}

	dl {
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--lnx-spacing-2);

		div {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: var(--lnx-spacing-3);
			font-size: var(--lnx-font-size-small);
		}

		dd {
			margin: 0;
			display: flex;
			gap: var(--lnx-spacing-2);
			color: var(--lnx-color-text-muted);
		}
	}
}

@media (prefers-reduced-motion: reduce) {
	.lnx-shortcuts-sheet {
		scale: 1;
		transition-property: opacity, overlay, display;
	}
}
</style>
