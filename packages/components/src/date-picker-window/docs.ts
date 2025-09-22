import { computed, ref } from 'vue';
import {
	ComponentEvent,
	ComponentProp,
} from '../../../../.vitepress/components/types';
import { useProps } from '../../../../.vitepress/components/useProps';
import { getDemoCode, resetComponent } from '../../../../.vitepress/components/utils';
import { CALENDAR_VIEW_TYPES } from './types';

export function useComponent() {
	const componentProps = ref<Record<string, ComponentProp>>({
		'v-model': {
			description: 'Binds the selected date to the reactive variable used as prop',
			controlType: 'none',
			type: {
				name: 'Date',
				link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date', 
			},
			defaultValue: 'undefined',
			value: undefined,
		},
		'v-model:start': {
			description: 'Binds the selected start date. Should be used with the `isRange` prop as `true`',
			controlType: 'none',
			type: {
				name: 'Date',
				link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date', 
			},
			defaultValue: 'undefined',
			value: undefined,
		},
		'v-model:end': {
			description: 'Binds the selected end date. Should be used with the `isRange` prop as `true`',
			controlType: 'none',
			type: {
				name: 'Date',
				link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date', 
			},
			defaultValue: 'undefined',
			value: undefined,
		},
		monthsNames: {
			description: 'Names of months to be shown',
			controlType: 'input-array',
			type: 'string[]',
			defaultValue: '[\'January\', \'February\', \'March\', \'April\', \'May\', \'June\', \'July\', \'August\', \'September\', \'October\', \'November\', \'December\']',
			value: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		},
		weekDaysNames: {
			description: 'Names of week days to be shown in the header of the month',
			controlType: 'input-array',
			type: 'string[]',
			defaultValue: '[\'Sun\', \'Mon\', \'Tue\', \'Wed\', \'Thu\', \'Fri\', \'Sat\']',
			value: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
		},
		firstDayOfWeek: {
			description: 'Day to be used as the start of the week',
			controlType: 'number',
			type: 'number',
			defaultValue: '1',
			value: 1,
		},
		todayText: {
			description: 'Text for the "select today" button',
			controlType: 'input',
			type: 'string',
			defaultValue: '"Today"',
			value: 'Today',
		},
		isItemDisabledFn: {
			description: 'A function that sets an item as disabled',
			controlType: 'none',
			type: '(item: Item) => boolean',
			defaultValue: '() => false',
			value: () => false,
		},
		calendarType: {
			description: 'What is going to be the selection type of the calendar',
			controlType: 'select',
			type: 'CalendarViewType',
			options: Object.values(CALENDAR_VIEW_TYPES),
			defaultValue: 'CALENDAR_VIEW_TYPES.DAY',
			value: CALENDAR_VIEW_TYPES.DAY,
		},
		isRange: {
			description: 'If two dates in a range can be selected, or if it\'s a single date selection',
			controlType: 'switch',
			type: 'boolean',
			defaultValue: 'false',
			value: false,
		},
		allowDeselect: {
			description: 'If clicking over a selected date will deselect it',
			controlType: 'switch',
			type: 'boolean',
			defaultValue: 'false',
			value: false,
		},
	});

	const componentEvents = ref<Record<string, ComponentEvent>>({
		'update:modelValue': {
			description: 'Two way binding of the component',
			type: {
				name: 'Date',
				link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date',
			},
		},
		'update:start': {
			description: 'Two way binding of the component start date',
			type: {
				name: 'Date',
				link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date',
			},
		},
		'update:end': {
			description: 'Two way binding of the component end date',
			type: {
				name: 'Date',
				link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date',
			},
		},
	});

	const { props } = useProps(componentProps);

	const demoCode = computed(() => getDemoCode({
		componentName: 'LnxDatePickerWindow',
		props: { ...componentProps.value },
		checkDefault: (defaultValue, value) => {
			if(Array.isArray(value)) {
				return eval(defaultValue).toString() !== value.toString();
			}
			return eval(defaultValue) !== value;
		},
		listeners: componentEvents.value,
	}));

	function reset() {
		resetComponent({
			props: componentProps.value,
			evalDefaultValue: (defaultValue) => eval(defaultValue as string),
		});
	}

	return {
		componentProps,
		props,
		componentEvents,
		demoCode,
		reset,
	};
}