<script setup lang="ts">
import { isAfterStart, isBeforeEnd, isEnd, isSelected, isStart, isToday } from './helpers';
import { Item } from './types';
import { inject, ref, Ref } from 'vue';

defineProps<{ item: Item; }>();

defineEmits<{ select: [item: Item]; }>();

const isRange = inject<boolean>('isRange', false);
const modelValue = inject<Ref<Date>>('modelValue');
const start = inject<Ref<Date | undefined>>('start', ref());
const end = inject<Ref<Date | undefined>>('end', ref());
const _componentUID = inject<string>('_componentUID');

function preselectDays(item: Item) {
	if(!isRange || (!start.value && !end.value)) { return; }

	if(isAfterStart(item, isRange, start.value)) {
		const $items = Array.from(document.querySelectorAll(`#${_componentUID} .is-after-start`));
		for (const $item of $items) {
			if ($item.matches(':hover')) {
				return;
			}

			$item.classList.add('is-hovered');
		}
	}

	if(isBeforeEnd(item, isRange, end.value)) {
		const $items = Array.from(document.querySelectorAll(`#${_componentUID} .is-before-end`));
		for (const $item of $items.reverse()) {
			if ($item.matches(':hover')) {
				return;
			}

			$item.classList.add('is-hovered');
		}
	}
}

function deselectPreselectedDays() {
	if(!isRange) { return; }
	if(!start.value) { return; }

	const $items = Array.from(document.querySelectorAll(`#${_componentUID} .is-hovered`));
	for(const $item of $items.reverse()) {
		$item.classList.remove('is-hovered');

		if($item.matches(':hover')) { return; }
	}
}
</script>

<template>
	<td
		class="date-picker-item"
		:class="{
			'is-today': isToday(item),
			'is-selected': isSelected(item, modelValue),
			'is-selected-start': isStart(item, start),
			'is-selected-end': isEnd(item, end),
			'is-after-start': isAfterStart(item, isRange, start),
			'is-before-end': isBeforeEnd(item, isRange, end),
			'is-in-range': isAfterStart(item, isRange, start) && isBeforeEnd(item, isRange, end),
			'is-disabled': item.isDisabled,
		}"
		@click="$emit('select', item)"
		@mouseover="preselectDays(item)"
		@mouseleave="deselectPreselectedDays()"
	>
		<slot />
	</td>
</template>

<style scoped lang="scss">
.date-picker-item {
	--cell-size: 25px;
	text-align: center;
	vertical-align: middle;
	min-width: var(--cell-size);
	width: var(--cell-size);
	max-width: var(--cell-size);
	min-height: var(--cell-size);
	height: var(--cell-size);
	max-height: var(--cell-size);
	border-radius: var(--lnx-radius-1);

	&:not(.is-disabled) {
		cursor: pointer;
	}

	&:hover:not(.is-disabled) {
		background: var(--lnx-color-gray-bg);
	}

	&.is-disabled {
		opacity: .5;
		cursor: not-allowed;
	}

	&.is-today {
		border: 1px solid var(--lnx-color-primary);
	}

	&.is-selected,
	&.is-selected-start,
	&.is-in-range,
	&.is-selected-end {
		background: var(--lnx-color-primary);

		&:not(.is-disabled) {
			color: var(--lnx-color-primary-accent);
		}

		&:hover:not(.is-disabled) {
			background: var(--lnx-color-primary-light);
		}
	}

	&.is-selected {
		background: var(--lnx-color-primary);
		color: var(--lnx-color-primary-accent);
		border: none;
	}

	&.is-selected-start {
		background: var(--lnx-color-primary);
		color: var(--lnx-color-primary-accent);
		border-radius: var(--lnx-radius-5) var(--lnx-radius-1) var(--lnx-radius-1) var(--lnx-radius-5);
	}

	&.is-in-range:not(.is-disabled) {
		background: var(--lnx-color-primary);
	}

	&.is-hovered:not(.is-disabled):not(.is-in-range):not(.is-selected-start):not(.is-selected-end) {
		border: 1px dashed var(--lnx-color-primary);
	}

	&.is-selected-end {
		background: var(--lnx-color-primary);
		color: var(--lnx-color-primary-accent);
		border-radius: var(--lnx-radius-1) var(--lnx-radius-5) var(--lnx-radius-5) var(--lnx-radius-1) ;
	}

	&.is-selected-start.is-selected-end {
		border-radius: var(--lnx-radius-1);
	}
}
</style>