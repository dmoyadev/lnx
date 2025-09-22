<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { Dropdown } from 'floating-vue';
import { CALENDAR_VIEW_TYPES, CalendarViewType, Item, LnxDatePickerWindow } from '../date-picker-window';
import { DATE_FORMATS, formatDate } from './helpers';
import { LnxInput } from '../input';
import { LnxIcon } from '../icon';

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
	showFormat?: (date?: Date) => string; /* How the date should be shown in the input when selected */
	isLoading?: boolean; /* When loading, it is disabled and shows different content */
	hasError?: boolean; /* Indicates if it should show the error slot */
	customValidity?: string; /* The error message of the input. It is the default value for the `error` slot */
}>(), {
	monthsNames: () => ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	weekDaysNames: () => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	firstDayOfWeek: 1,
	isItemDisabledFn: undefined,
	calendarType: CALENDAR_VIEW_TYPES.DAY,
	todayText: 'Today',
	showFormat: (date?: Date) => (date ? formatDate(date, DATE_FORMATS.SHORT_NUMERIC) : '') as string,
	customValidity: undefined,
});

const slots = defineSlots<{
	default(): unknown; /* The label of the input */
	helper(): unknown; /* The helper message of the input */
	error(): unknown; /* The error message of the input */
}>();
const slotNames = Object.keys(slots) as (keyof typeof slots)[];

const $attrs = useAttrs();
const isReadonly = computed(() => props.isLoading || !!('readonly' in $attrs && ($attrs.readonly || $attrs.readonly === '')));
const isDisabled = computed(() => props.isLoading || !!('disabled' in $attrs && ($attrs.disabled || $attrs.disabled === '')));

const inputValue = computed(() => {
	switch (props.calendarType) {
		case CALENDAR_VIEW_TYPES.DAY: {
			if(props.isRange) {
				let value = '';
				if(props.showFormat(start.value)) {
					value += props.showFormat(start.value);
				}
				if(props.showFormat(end.value)) {
					value += ` — ${props.showFormat(end.value)}`;
				}
				return value;
			}

			return props.showFormat(modelValue.value);
		}

		case CALENDAR_VIEW_TYPES.MONTH: {
			if(props.isRange) {
				let value = '';
				if(start.value) {
					value += formatDate(start.value, DATE_FORMATS.MONTH_YEAR, props.monthsNames);
				}
				if(end.value) {
					value += ` — ${formatDate(end.value, DATE_FORMATS.MONTH_YEAR, props.monthsNames)}`;
				}
				return value;
			}

			if(modelValue.value) {
				return formatDate(modelValue.value, DATE_FORMATS.MONTH_YEAR, props.monthsNames);
			}

			return props.showFormat(modelValue.value);
		}

		case CALENDAR_VIEW_TYPES.YEAR: {
			if(props.isRange) {
				let value = '';
				if(start.value) {
					value += start.value.getFullYear();
				}
				if(end.value) {
					value += ` — ${end.value.getFullYear()}`;
				}
				return value;
			}

			if(modelValue.value) {
				return modelValue.value.getFullYear();
			}

			return props.showFormat(modelValue.value);
		}

		default:
			return props.showFormat(modelValue.value);
	}
});
</script>

<template>
	<Dropdown
		:distance="6"
		:disabled="isReadonly || isDisabled"
	>
		<LnxInput
			v-bind="{ ...$attrs, ...props }"
			type="text"
			:model-value="inputValue"
		>
			<!-- Pass all slots to the input -->
			<template
				v-for="name in slotNames"
				#[name]
			>
				<slot :name />
			</template>

			<template #icon>
				<LnxIcon icon="mdi:calendar" />
			</template>
		</LnxInput>

		<template #popper="{ hide }">
			<LnxDatePickerWindow
				v-bind="props"
				v-model="modelValue"
				v-model:start="start"
				v-model:end="end"
				@update:model-value="hide()"
				@update:end="hide()"
			/>
		</template>
	</Dropdown>
</template>

<style scoped lang="scss">
/* Component styles */
</style>