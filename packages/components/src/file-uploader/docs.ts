import { computed, ref } from 'vue';
import {
	ComponentEvent,
	ComponentProp,
	ComponentSlot,
} from '../../../../.vitepress/components/types';
import { useProps } from '../../../../.vitepress/components/useProps';
import { getDemoCode, resetComponent } from '../../../../.vitepress/components/utils';

export function useComponent() {
	const componentProps = ref<Record<string, ComponentProp>>({
		'v-model': {
			description: 'Binds the value of the input to the reactive variable used as prop',
			controlType: 'none',
			type: {
				name : 'File[]',
				link: 'https://developer.mozilla.org/en-US/docs/Web/API/File',
			},
			defaultValue: 'undefined',
			value: undefined,
		},
		fileUrls: {
			description: 'When a file is uploaded, the url to it',
			controlType: 'input-array',
			type: 'string[]',
			defaultValue: 'undefined',
			value: undefined,
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

	const componentOptions = ref<Record<string, ComponentProp>>({
		'Make it disabled': {
			description: 'Native HTML attribute to disable the input',
			configurableOptionName: 'disabled',
			controlType: 'switch',
			type: 'boolean',
			defaultValue: 'false',
			value: false,
		},
		'Multiple': {
			description: 'Native HTML attribute to allow multiple file selection',
			configurableOptionName: 'multiple',
			controlType: 'switch',
			type: 'boolean',
			defaultValue: 'undefined',
			value: undefined,
		},
		'Capture': {
			description: 'Native HTML attribute to select the capture mode',
			configurableOptionName: 'capture',
			controlType: 'select',
			options: [undefined, 'user', 'environment'],
			type: {
				name: '"user" | "environment"',
				link: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/capture',
			},
			defaultValue: 'undefined',
			value: undefined,
		},
	});

	const componentSlots = ref<Record<string, ComponentSlot>>({
		default: {
			description: 'Label content of the input',
			value: 'Enter something',
			initialValue: 'Enter something',
		},
		error: {
			description: 'Message to be shown when the input has an error',
			value: 'This is an error message',
		},
		helper: {
			description: 'Message to be shown below the input to add extra context',
			value: 'This is a helper message',
		},
		textWaitingState: {
			description: 'Text to be shown when idle',
			value: '',
			defaultValue: 'Drop a file or click',
		},
		textDraggedOverState: {
			description: 'Text to be shown when a file is being dragged over the component',
			value: '',
			defaultValue: 'Drop it!',
		},
		textClearBtn: {
			description: 'Text to be shown for the clear input button',
			value: '',
			defaultValue: 'Clear file',
		},
	});

	const componentEvents = ref<Record<string, ComponentEvent>>({
		'update:modelValue': {
			description: 'Two way binding of the component',
			type: {
				name : 'File | File[]',
				link: 'https://developer.mozilla.org/en-US/docs/Web/API/File', 
			},
		},
	});

	const { props } = useProps(componentProps);

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
		componentName: 'LnxFileUpload',
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
		configurableOptions,
		demoCode,
		reset,
	};
}