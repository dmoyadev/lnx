<script setup lang="ts" generic="F extends DateValueFormat = 'date'">
import { computed, Ref, ref, useAttrs, useTemplateRef, WritableComputedRef } from 'vue';
import { DROPDOWN_WIDTHS, LnxDropdown } from '../dropdown';
import { onClickOutside } from '../select/onClickOutside';
import { CALENDAR_VIEW_TYPES, CalendarViewType, Item, LnxDatePickerWindow } from '../date-picker-window';
import { DATE_FORMATS, DATE_VALUE_FORMATS, DateValueFormat, formatDate } from './helpers';
import { toDate } from '../date-picker-window/helpers';
import { LnxInput } from '../input';
import { LnxIcon } from '../icon';
import { useLnxConfig } from '../config';

type Value = F extends 'iso-date' ? string : Date;
const model = defineModel<Value>();
const startModel = defineModel<Value>('start');
const endModel = defineModel<Value>('end');

const props = withDefaults(defineProps<{
	monthsNames?: string[]; /* Names of months to be shown. By default, from the `createLnx` locale */
	weekDaysNames?: string[]; /* Names of week days to be shown in the header of the month, starting on Sunday. By default, from the `createLnx` locale */
	firstDayOfWeek?: number; /* Day to be used as the start of the week, from 0 (Sunday) to 6. By default, from the `createLnx` locale, or Monday */
	todayText?: string; /* Text for the "select today" button. By default, the `today` text of `createLnx` */
	valueFormat?: F; /* What the v-models hold: a `Date` at 00:00 UTC, or with `iso-date` a 'YYYY-MM-DD' text that is '' when empty */
	min?: Date | string; /* The first date that can be selected, as a Date or as 'YYYY-MM-DD'. Days before it are disabled, and months and years only when all their days are */
	max?: Date | string; /* The last date that can be selected, as a Date or as 'YYYY-MM-DD'. Days after it are disabled, and months and years only when all their days are */
	isItemDisabledFn?: ((item: Item) => boolean) | null; /* A function that sets an item as disabled */
	calendarType?: CalendarViewType; /* What is going to be the selection type of the calendar */
	isRange?: boolean; /* If two dates in a range can be selected, or if it's a single date selection */
	allowDeselect?: boolean; /* If clicking over a selected date will deselect it */
	showFormat?: (date?: Date) => string; /* How the date should be shown in the input when selected. By default, as the `createLnx` locale writes dates, or dd-mm-yyyy */
	isLoading?: boolean; /* When loading, it is disabled and shows different content */
	hasError?: boolean; /* Indicates if it should show the error slot */
	customValidity?: string; /* The error message of the input. It is the default value for the `error` slot */
}>(), {
	monthsNames: undefined,
	weekDaysNames: undefined,
	firstDayOfWeek: undefined,
	valueFormat: undefined,
	min: undefined,
	max: undefined,
	isItemDisabledFn: undefined,
	calendarType: CALENDAR_VIEW_TYPES.DAY,
	todayText: undefined,
	showFormat: undefined,
	customValidity: undefined,
});

// The calendar works with Dates: with `iso-date` they are converted from and to 'YYYY-MM-DD' at 00:00 UTC, so the day shown is the day stored
function asDate(value: Ref<Value | undefined>): WritableComputedRef<Date | undefined> {
	return computed({
		get: () => toDate(value.value),
		set: (date) => {
			value.value = (props.valueFormat === DATE_VALUE_FORMATS.ISO_DATE
				? (date ? date.toISOString().slice(0, 10) : '')
				: date) as Value;
		},
	});
}
const modelValue = asDate(model);
const start = asDate(startModel);
const end = asDate(endModel);

// Emptying the field clears the selection
function clear(value?: string | number) {
	if(value) { return; }
	modelValue.value = undefined;
	if(props.isRange) {
		start.value = undefined;
		end.value = undefined;
	}
}

const config = useLnxConfig();
const monthsNames = computed(() => props.monthsNames ?? config.monthsNames);
function formatShown(date?: Date) {
	if(props.showFormat) { return props.showFormat(date); }
	if(!date) { return ''; }
	return config.showFormat?.(date) ?? formatDate(date, DATE_FORMATS.SHORT_NUMERIC);
}

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
				if(formatShown(start.value)) {
					value += formatShown(start.value);
				}
				if(formatShown(end.value)) {
					value += ` — ${formatShown(end.value)}`;
				}
				return value;
			}

			return formatShown(modelValue.value);
		}

		case CALENDAR_VIEW_TYPES.MONTH: {
			if(props.isRange) {
				let value = '';
				if(start.value) {
					value += formatDate(start.value, DATE_FORMATS.MONTH_YEAR, monthsNames.value);
				}
				if(end.value) {
					value += ` — ${formatDate(end.value, DATE_FORMATS.MONTH_YEAR, monthsNames.value)}`;
				}
				return value;
			}

			if(modelValue.value) {
				return formatDate(modelValue.value, DATE_FORMATS.MONTH_YEAR, monthsNames.value);
			}

			return formatShown(modelValue.value);
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

			return formatShown(modelValue.value);
		}

		default:
			return formatShown(modelValue.value);
	}
});
</script>

<template>
	<LnxDropdown
		:class="$attrs.class"
		:style="$attrs.style"
		:is-open="isOpen"
		:offset-y="dropdownOffsetY"
		:width="DROPDOWN_WIDTHS.CONTENT"
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
				:is-loading
				:has-error
				:custom-validity
				@update:model-value="clear($event)"
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
					:min
					:max
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
