import { computed, ref } from 'vue';
import { ComponentEvent, ComponentProp, ComponentSlot } from '../../../../.vitepress/components/types';
import { useProps } from '../../../../.vitepress/components/useProps';
import { getDemoCode, resetComponent } from '../../../../.vitepress/components/utils';
import { RADIO_GROUP_MODES } from './types';

export function useComponent() {
	const componentProps = ref<Record<string, ComponentProp>>({
		'v-model': {
			description: 'The value of the picked option, or the values of the picked ones with `multiple`',
			controlType: 'none',
			type: 'T | T[]',
			defaultValue: 'undefined',
			value: undefined,
		},
		options: {
			description: 'The options to pick from',
			controlType: 'none',
			type: 'RadioGroupOption<T>[]',
			value: [{ value: 'month', label: 'Month' }, { value: 'quarter', label: 'Quarter' }, { value: 'year', label: 'Year' }],
		},
		mode: {
			description: 'Pills that wrap, a joined block for 2 to 4 options, or classic radios in a column',
			controlType: 'select',
			type: 'RadioGroupMode',
			options: Object.values(RADIO_GROUP_MODES),
			defaultValue: 'RADIO_GROUP_MODES.CHIPS',
			value: RADIO_GROUP_MODES.CHIPS,
		},
		multiple: {
			description: 'Checkboxes instead of radios: several can be picked and `v-model` is an array',
			controlType: 'switch',
			type: 'boolean',
			defaultValue: 'false',
			value: false,
		},
		name: {
			description: 'Name of the inputs in a form. By default, a unique one, so the arrows move between the options',
			controlType: 'input',
			type: 'string',
			defaultValue: 'undefined',
			value: undefined,
		},
		hideLegend: {
			description: 'Hides the legend, the default slot, but screen readers still read it',
			controlType: 'switch',
			type: 'boolean',
			defaultValue: 'false',
			value: false,
		},
		isBlock: {
			description: 'Takes the whole width of its container',
			controlType: 'switch',
			type: 'boolean',
			defaultValue: 'false',
			value: false,
		},
		required: {
			description: 'A radio must be picked to submit the form',
			controlType: 'switch',
			type: 'boolean',
			defaultValue: 'false',
			value: false,
		},
	});
	const { props } = useProps(componentProps);

	const componentSlots = ref<Record<string, ComponentSlot>>({
		default: {
			description: 'The legend of the group: what the options answer',
			value: 'Period',
			initialValue: 'Period',
		},
		option: {
			description: 'Content of each option, instead of its icon and label. Gets `{ option, checked }`',
			value: '',
		},
	});

	const componentEvents = ref<Record<string, ComponentEvent>>({
		'update:modelValue': {
			description: 'Two way binding of the component',
			type: 'T | T[]',
		},
	});

	const demoCode = computed(() => getDemoCode({
		componentName: 'LnxRadioGroup',
		props: { ...componentProps.value },
		slots: componentSlots.value,
		listeners: componentEvents.value,
		checkDefault: (defaultValue, value) => eval(defaultValue as string) !== value,
	}));

	function reset() {
		resetComponent({
			props: componentProps.value,
			slots: componentSlots.value,
			evalDefaultValue: (defaultValue) => eval(defaultValue as string),
		});
	}

	return {
		componentProps,
		props,
		componentSlots,
		componentEvents,
		demoCode,
		reset,
	};
}
