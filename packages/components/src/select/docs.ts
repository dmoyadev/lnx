import { computed, ref } from 'vue';
import {
	ComponentCSSVars,
	ComponentEvent,
	ComponentProp,
	ComponentSlot,
} from '../../../../.vitepress/components/types';
import { useProps } from '../../../../.vitepress/components/useProps';
import { getDemoCode, resetComponent } from '../../../../.vitepress/components/utils';

export function useComponent() {
	const componentProps = ref<Record<string, ComponentProp>>({
		'v-model': {
			description: 'Binds the value of the select to the reactive variable used as prop',
			controlType: 'none',
			type: 'T extends { id: number | string }',
			defaultValue: 'undefined',
			value: undefined,
		},
		items: {
			description: 'The items to be shown in the select',
			controlType: 'none',
			type: '(T extends { id: number | string })[]',
			value: [{
				label: 'Option 1',
				value: 'option-1', 
			}, {
				label: 'Option 2',
				value: 'option-2', 
			}, {
				label: 'Option 3',
				value: 'option-3', 
			}],
		},
		labelProperty: {
			description: 'The property of the item to be shown as a label',
			controlType: 'input',
			type: 'string',
			defaultValue: '"label"',
			value: 'label',
		},
		isLoading: {
			description: 'When loading, it is disabled and shows different content',
			controlType: 'switch',
			type: 'boolean',
			defaultValue: 'false',
			value: false,
		},
		hasError: {
			description: 'Indicates if it should show the error slot',
			controlType: 'switch',
			type: 'boolean',
			defaultValue: 'false',
			value: false,
		},
		customValidity: {
			description: 'The error message of the input. It is the default value for the `error` slot',
			controlType: 'input',
			type: 'string',
			defaultValue: 'undefined',
			value: undefined,
		},
	});

	const componentOptions = ref<Record<string, ComponentProp>>({
		'Placeholder': {
			description: 'Changes the placeholder of the input',
			configurableOptionName: 'placeholder',
			controlType: 'input',
			type: 'string',
			defaultValue: 'undefined',
			value: undefined,
		},
		'Make it disabled': {
			description: 'Disables all actions on the input',
			configurableOptionName: 'disabled',
			controlType: 'switch',
			type: 'boolean',
			defaultValue: 'false',
			value: false,
		},
	});

	const componentSlots = ref<Record<string, ComponentSlot>>({
		default: {
			description: 'Label content of the input',
			value: 'Enter something',
			initialValue: 'Enter something',
		},
		item: {
			description: 'Custom content for each item',
			scopes: [
				{
					name: 'item',
					type: 'T', 
				},
			],
		},
		notFound: {
			description: 'What to display when no items are found',
			value: 'Nothing found',
		},
		icon: {
			description: 'Content to be displayed at the right of the input value',
			value: '',
		},
		error: {
			description: 'Message to be shown when the input has an error',
			value: 'This is an error message',
		},
		helper: {
			description: 'Message to be shown below the input to add extra context',
			value: 'This is a helper message',
		},
	});

	const componentEvents = ref<Record<string, ComponentEvent>>({
		'update:modelValue': {
			description: 'Two way binding of the component',
			type: 'T',
		},
	});

	const componentCSSVars = ref<Record<string, ComponentCSSVars>>({
		'--lnx-select-list-color-bg': {
			description: 'Background color of the options list dropdown',
			value: 'var(--lnx-color-gray-9)',
		},
	});

	const { props } = useProps(componentProps, componentCSSVars);

	const configurableOptions = computed<Record<string, ComponentProp>>(() => {
		return Object.values(componentOptions.value).reduce((acc, option) => {
			if(!option.configurableOptionName) {
				return acc;
			}

			acc[option.configurableOptionName] = {
				defaultValue: option.defaultValue,
				value: option.value,
			} as ComponentProp;
			return acc;
		}, {} as Record<string, ComponentProp>);
	});
	const demoCode = computed(() => getDemoCode({
		componentName: 'LnxSelect',
		props: {
			...componentProps.value,
			...configurableOptions.value, 
		},
		checkDefault: (defaultValue, value) => eval(defaultValue as string) !== value,
		slots: componentSlots.value,
		listeners: componentEvents.value,
	}));

	function reset() {
		resetComponent({
			props: componentProps.value,
			options: componentOptions.value,
			slots: componentSlots.value,
			evalDefaultValue: (defaultValue) => eval(defaultValue as string),
		});
	}

	return {
		componentProps,
		props,
		componentOptions,
		componentEvents,
		componentSlots,
		componentCSSVars,
		configurableOptions,
		demoCode,
		reset,
	};
}