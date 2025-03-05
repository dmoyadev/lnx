import { computed, ref } from 'vue';
import { ComponentEvent, ComponentProp, ComponentSlot } from '../../../../.vitepress/components/types';
import { useProps } from '../../../../.vitepress/components/useProps';
import { getDemoCode, resetComponent } from '../../../../.vitepress/components/utils';

export function useComponent() {
	const componentProps = ref<Record<string, ComponentProp>>({
		'v-model': {
			description: 'Binds the value of the input to the reactive variable used as prop',
			controlType: 'none',
			type: 'string | number',
			defaultValue: 'undefined',
			value: undefined,
		},
		isClearable: {
			description: 'Indicates if a button should render to quickly clear the input',
			controlType: 'switch',
			type: 'boolean',
			defaultValue: 'false',
			value: false,
		},
		isLoading: {
			description: 'When loading, it is disabled and shows a different content',
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
			helper: 'Try enabling the "hasError" prop and hitting "Enter" on the showcased input to see it in action',
			type: 'string',
			defaultValue: 'undefined',
			value: undefined,
		},
	});
	const { props } = useProps(componentProps);

	const componentOptions = ref<Record<string, ComponentProp>>({
		'Input type': {
			description: 'Changes the input type',
			configurableOptionName: 'type',
			controlType: 'select',
			options: ['text', 'number', 'email', 'password', 'search', 'tel', 'url'],
			type: {
				name: 'Input type',
				link: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types', 
			},
			defaultValue: '"text"',
			value: 'text',
		},
		'Placeholder': {
			description: 'Changes the placeholder of the input',
			configurableOptionName: 'placeholder',
			controlType: 'input',
			type: 'string',
			defaultValue: 'undefined',
			value: undefined,
		},
		'Make it readonly': {
			description: 'Prevents the input to be edited',
			configurableOptionName: 'readonly',
			controlType: 'switch',
			type: 'boolean',
			defaultValue: 'false',
			value: false,
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
			type: 'string | number',
		},
		'input': {
			description: 'Emitted on every keystroke on the input',
			type: {
				name: 'InputEvent',
				link: 'https://developer.mozilla.org/en-US/docs/Web/API/InputEvent',
			},
		},
		'change': {
			description: 'Emitted when the value of the input changes (on blur, for example)',
			type: {
				name: 'Event',
				link: 'https://developer.mozilla.org/en-US/docs/Web/API/Event',
			},
		},
	});

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
		componentName: 'LnxInput',
		props: {
			...componentProps.value,
			...configurableOptions.value,
		},
		slots: componentSlots.value,
		listeners: componentEvents.value,
		checkDefault: (defaultValue, value) => eval(defaultValue as string) !== value,
	}));

	function reset() {
		resetComponent({
			props: componentProps.value,
			options: componentOptions.value,
			evalDefaultValue: (defaultValue) => eval(defaultValue as string),
		});
	}

	return {
		componentProps,
		props,
		componentOptions,
		componentEvents,
		componentSlots,
		configurableOptions,
		demoCode,
		reset,
	};
}