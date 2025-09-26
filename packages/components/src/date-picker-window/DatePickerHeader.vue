<script setup lang="ts">
import { BUTTON_MODES, BUTTON_SHAPES, BUTTON_SIZES, BUTTON_VARIANTS, LnxButton } from '../button';
import { LnxIcon } from '../icon';
import { CALENDAR_VIEW_TYPES, CalendarViewType, DisplayedMonth } from './types';

const calendarView = defineModel<CalendarViewType>('calendarView');

defineProps<{
	monthsNames: string[]; /* Names of the months */
	item: DisplayedMonth; /* The current item (month or year) */
	index: number | string; /* The current index (year or decade start) */
}>();

defineEmits<{
	changeBig: [direction: 1 | -1] /* When the view has to change in a leap step */
	changeSmall: [direction: 1 | -1] /* When the view has to change by one step */
}>();
</script>

<template>
	<header class="date-picker-header">
		<div class="month-changers">
			<LnxButton
				:variant="BUTTON_VARIANTS.GRAYSCALE"
				:mode="BUTTON_MODES.CLEAR"
				:size="BUTTON_SIZES.SMALL"
				:shape="BUTTON_SHAPES.ICON"
				class="month-button"
				@click="$emit('changeBig', -1)"
			>
				<LnxIcon icon="mdi:chevron-double-left" />
			</LnxButton>
			<LnxButton
				:variant="BUTTON_VARIANTS.GRAYSCALE"
				:mode="BUTTON_MODES.CLEAR"
				:size="BUTTON_SIZES.SMALL"
				:shape="BUTTON_SHAPES.ICON"
				class="month-button"
				@click="$emit('changeSmall', -1)"
			>
				<LnxIcon icon="mdi:chevron-left" />
			</LnxButton>

			<span v-if="calendarView === CALENDAR_VIEW_TYPES.DAY">
				<span
					class="change-view-type"
					@click="calendarView = CALENDAR_VIEW_TYPES.MONTH"
				>
					{{ (monthsNames[item.month]?.substring(0, 3) || item.month) + (monthsNames[item.month]?.length > 3 ? '.' : '') }}
				</span>
				<span
					class="change-view-type"
					@click="calendarView = CALENDAR_VIEW_TYPES.YEAR"
				>
					{{ item.year }}
				</span>
			</span>

			<span v-if="calendarView === CALENDAR_VIEW_TYPES.MONTH">
				<span
					class="change-view-type"
					@click="calendarView = CALENDAR_VIEW_TYPES.YEAR"
				>
					{{ index }}
				</span>
			</span>

			<span v-if="calendarView === CALENDAR_VIEW_TYPES.YEAR">
				<span>{{ index }} - {{ (+index) + 9 }}</span>
			</span>

			<LnxButton
				:variant="BUTTON_VARIANTS.GRAYSCALE"
				:mode="BUTTON_MODES.CLEAR"
				:size="BUTTON_SIZES.SMALL"
				:shape="BUTTON_SHAPES.ICON"
				class="month-button"
				@click="$emit('changeBig', 1)"
			>
				<LnxIcon icon="mdi:chevron-double-right" />
			</LnxButton>
			<LnxButton
				:variant="BUTTON_VARIANTS.GRAYSCALE"
				:mode="BUTTON_MODES.CLEAR"
				:size="BUTTON_SIZES.SMALL"
				:shape="BUTTON_SHAPES.ICON"
				class="month-button"
				@click="$emit('changeSmall', 1)"
			>
				<LnxIcon icon="mdi:chevron-right" />
			</LnxButton>
		</div>
	</header>
</template>

<style scoped lang="scss">
.date-picker-header {
	width: 100%;
	height: 50px;
	max-height: 50px;
	display: flex;
	align-items: center;
	padding: 8px;
	border-bottom: 1px solid var(--lnx-color-gray-2);
	font-weight: var(--lnx-font-regular);
	font-size: var(--lnx-font-size-body-1);
	color: var(--lnx-color-text);

	.month-changers {
		width: 100%;
		display: flex;
		align-items: center;

		span {
			display: flex;
			align-items: center;
			gap: 4px;
			margin: 0 auto;

			.change-view-type:hover {
				cursor: pointer;
				opacity: .8;
			}
		}
	}
}
</style>