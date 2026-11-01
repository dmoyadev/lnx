<script setup lang="ts">
import { computed, Ref, ref, useAttrs, useTemplateRef } from 'vue';
import { LnxDropdown } from '../dropdown';
import { onClickOutside } from '../select/onClickOutside';
import { CALENDAR_VIEW_TYPES, CalendarViewType, Item, LnxDatePickerWindow } from '../date-picker-window';
import { DATE_FORMATS, formatDate } from './helpers';
import { LnxInput } from '../input';
import { LnxIcon } from '../icon';
import { BUTTON_SIZES, ButtonSize } from '../button';

const modelValue = defineModel<Date>();
const start = defineModel<Date>('start');
const end = defineModel<Date>('end');

const props = withDefaults(defineProps<{
	size?: ButtonSize; /* Height, spacing and font size. Same scale as buttons, so they line up side by side */
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
	size: BUTTON_SIZES.MEDIUM,
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

// class and style go to the dropdown; the rest goes to the input
defineOptions({ inheritAttrs: false });
const $attrs = useAttrs();
const inputAttrs = computed(() => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { class: _class, style, ...rest } = $attrs;
	return rest;
});
const isReadonly = computed(() => props.isLoading || !!('readonly' in $attrs && ($attrs.readonly || $attrs.readonly === '')));
const isDisabled = computed(() => props.isLoading || !!('disabled' in $attrs && ($attrs.disabled || $attrs.disabled === '')));

const isOpen = ref(false);
function open() {
	if(isReadonly.value || isDisabled.value) { return; }
	isOpen.value = true;
}
function close() {
	isOpen.value = false;
}
const $calendar = useTemplateRef<HTMLElement>('$calendar');
onClickOutside($calendar as Ref<HTMLElement>, close);

// The helper and error messages are part of the handler, below the input
const dropdownOffsetY = computed(() => 6 - (!!slots.helper ? 16 : 0) - (!!slots.error ? 16 : 0));

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
					value += start.value.getUTCFullYear();
				}
				if(end.value) {
					value += ` — ${end.value.getUTCFullYear()}`;
				}
				return value;
			}

			if(modelValue.value) {
				return modelValue.value.getUTCFullYear();
			}

			return props.showFormat(modelValue.value);
		}

		default:
			return props.showFormat(modelValue.value);
	}
});
</script>

<template>
	<LnxDropdown
		:class="$attrs.class"
		:style="$attrs.style"
		:is-open="isOpen"
		:offset-y="dropdownOffsetY"
		fit-content
	>
		<div
			@click="open()"
			@keydown.enter="open()"
			@keydown.esc="close()"
		>
			<LnxInput
				v-bind="inputAttrs"
				type="text"
				:model-value="inputValue"
				:size
				:is-loading
				:has-error
				:custom-validity
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
		</div>

		<template #content>
			<div
				ref="$calendar"
				@keydown.esc="close()"
			>
				<LnxDatePickerWindow
					v-model="modelValue"
					v-model:start="start"
					v-model:end="end"
					:months-names
					:week-days-names
					:first-day-of-week
					:today-text
					:is-item-disabled-fn
					:calendar-type
					:is-range
					:allow-deselect
					@update:model-value="close()"
					@update:end="close()"
				/>
			</div>
		</template>
	</LnxDropdown>
</template>
