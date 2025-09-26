<script setup lang="ts">
import { computed, provide, useTemplateRef } from 'vue';
import {
	CalendarViewType,
	CALENDAR_VIEW_TYPES,
	Item,
	DisplayedMonth,
	Day, Month, Year,
} from './types';
import { useCalendar } from './useCalendar';
import DatePickerHeader from './DatePickerHeader.vue';
import { BUTTON_MODES, LnxButton } from '../button';
import DatePickerViewMonth from './DatePickerViewMonth.vue';
import DatePickerViewYear from './DatePickerViewYear.vue';
import DatePickerViewDecade from './DatePickerViewDecade.vue';

const modelValue = defineModel<Date>();
const start = defineModel<Date>('start');
const end = defineModel<Date>('end');

const props = withDefaults(defineProps<{
	monthsNames?: string[]; /* Names of months to be shown */
	weekDaysNames?: string[]; /* Names of week days to be shown in the header of the month */
	firstDayOfWeek?: number; /* Day to be used as the start of the week */
	todayText?: string; /* Text for the "select today" button */
	isItemDisabledFn?: (item: Item) => boolean; /* A function that sets an item as disabled */
	calendarType?: CalendarViewType; /* What is going to be the selection type of the calendar */
	isRange?: boolean; /* If two dates in a range can be selected, or if it's a single date selection */
	allowDeselect?: boolean; /* If clicking over a selected date will deselect it */
}>(), {
	monthsNames: () => ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	weekDaysNames: () => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	firstDayOfWeek: 1,
	isItemDisabledFn: undefined,
	calendarType: CALENDAR_VIEW_TYPES.DAY,
	todayText: 'Today',
});

const _componentUID = Date.now().toString(36) + Math.random().toString(36).substring(2);

provide('_componentUID', _componentUID);
provide('isRange', computed(() => props.isRange));
provide('modelValue', computed(() => modelValue));
provide('start', computed(() => start));
provide('end', computed(() => end));

const {
	currentYear,
	currentMonth,
	displayedElements,
	calendarViewType,
	changeBig,
	changeSmall,
	setToday,
} = useCalendar({
	firstDayOfWeek: props.firstDayOfWeek,
	isRange: computed(() => props.isRange),
	isItemDisabledFn: props.isItemDisabledFn,
	initialViewType: props.calendarType,
});

function setRangeSelection(date: Date) {
	let endSelection = date;
	if(props.calendarType === CALENDAR_VIEW_TYPES.MONTH) {
		endSelection = new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1, 0));
	} else if(props.calendarType === CALENDAR_VIEW_TYPES.YEAR) {
		endSelection = new Date(Date.UTC(date.getFullYear(), 11, 31));
	}

	// When no start is set
	if(!start.value) {
		start.value = date;
		return;
	}

	// When start is set, but not the end
	if(!end.value) {
		// If the selection is before the start, then the start should be changed
		if(date < start.value) {
			start.value = date;
			return;
		}
		end.value = endSelection;
		return;
	}

	// When both start and end are set
	// If the selection is after the end, the end should be extended
	if(date > end.value) {
		end.value = endSelection;
		return;
	}

	// If the selection is before the start, the start should be extended
	if(date < start.value) {
		start.value = date;
		return;
	}

	// If the selection is between the start and the end, the start should be selected and the end cleared
	start.value = date;
	end.value = undefined;
}

const $view = useTemplateRef<typeof DatePickerViewMonth>('$view');
function selectDay(day: Day) {
	if(props.calendarType !== CALENDAR_VIEW_TYPES.DAY) { return; }
	if(day.isDisabled) { return; }

	const selection = new Date(Date.UTC(day.year, day.month, day.number));
	if(!props.isRange) {
		// If the date selected is the same as the one already selected, clear it
		if(props.allowDeselect && modelValue.value?.getTime() === selection.getTime()) {
			modelValue.value = undefined;
			return;
		}
		modelValue.value = selection;
		return;
	}

	setRangeSelection(selection);
}

function selectMonth(month: Month) {
	if(month.isDisabled) { return; }

	// If the calendar type is day, just change the month and year being viewed
	if(props.calendarType === CALENDAR_VIEW_TYPES.DAY) {
		currentYear.value = month.year;
		currentMonth.value = month.number;
		calendarViewType.value = CALENDAR_VIEW_TYPES.DAY;
		return;
	}

	const selection = new Date(Date.UTC(month.year, month.number, 1));
	if(!props.isRange) {
		// If the date selected is the same as the one already selected, clear it
		if(props.allowDeselect && modelValue.value?.getTime() === selection.getTime()) {
			modelValue.value = undefined;
			return;
		}
		modelValue.value = selection;
		return;
	}

	setRangeSelection(selection);
}

function selectYear(year: Year) {
	if(year.isDisabled) { return; }

	// If the calendar type is day, just change the month and year being viewed
	if(props.calendarType !== CALENDAR_VIEW_TYPES.YEAR) {
		currentYear.value = year.number;
		currentMonth.value = 0;
		calendarViewType.value = calendarViewType.value === CALENDAR_VIEW_TYPES.YEAR
			? CALENDAR_VIEW_TYPES.MONTH
			: CALENDAR_VIEW_TYPES.DAY;
		return;
	}

	const selection = new Date(Date.UTC(year.number, 0, 1));
	if(!props.isRange) {
		// If the date selected is the same as the one already selected, clear it
		if(props.allowDeselect && modelValue.value?.getTime() === selection.getTime()) {
			modelValue.value = undefined;
			return;
		}
		modelValue.value = selection;
		return;
	}

	setRangeSelection(selection);
}
</script>

<template>
	<div
		:id="_componentUID"
		class="date-picker-window"
	>
		<div
			v-for="(item, index) in displayedElements"
			:key="index"
			class="view"
		>
			<DatePickerHeader
				v-if="monthsNames?.length"
				v-model:calendar-view="calendarViewType"
				:months-names="monthsNames"
				:item="item as DisplayedMonth"
				:index
				@change-big="changeBig($event)"
				@change-small="changeSmall($event)"
			/>

			<!-- Month calendar type -->
			<DatePickerViewMonth
				v-if="calendarViewType === CALENDAR_VIEW_TYPES.DAY"
				ref="$view"
				:displayed-month="item as DisplayedMonth"
				:week-days-names
				:first-day-of-week
				@day-selected="selectDay($event)"
			/>

			<!-- Year calendar type -->
			<DatePickerViewYear
				v-if="calendarViewType === CALENDAR_VIEW_TYPES.MONTH"
				:displayed-year="item as Month[]"
				@month-selected="selectMonth($event)"
			/>

			<!-- Decade calendar type -->
			<DatePickerViewDecade
				v-if="calendarViewType === CALENDAR_VIEW_TYPES.YEAR"
				:displayed-decade="item as Year[]"
				@year-selected="selectYear($event)"
			/>

			<!-- Today button -->
			<div
				v-if="!isRange"
				class="btn-today"
			>
				<LnxButton
					:mode="BUTTON_MODES.CLEAR"
					is-block
					@click="modelValue = setToday()"
				>
					{{ todayText }}
				</LnxButton>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.date-picker-window {
	display: flex;
	min-width: 280px;
	background: var(--lnx-date-picker-window-color-bg, var(--lnx-color-gray-9));

	.view {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 280px;
		max-width: 280px;
		padding: 8px;

		.btn-today {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			border-top: 1px solid var(--lnx-color-gray-4);
		}
	}
}
</style>