import { computed, ref } from 'vue';
import { ComponentEvent, ComponentProp, ComponentSlot } from '../../../../.vitepress/components/types';
import { useProps } from '../../../../.vitepress/components/useProps';
import { getDemoCode, resetComponent } from '../../../../.vitepress/components/utils';

export function useComponent() {
	const componentProps = ref<Record<string, ComponentProp>>({
		'v-model': {
			description: 'Binds the text to the reactive variable used as prop',
			controlType: 'none',
			type: 'string',
			defaultValue: 'undefined',
			value: undefined,
		},
		isLoading: {
			description: 'When loading, it is readonly and disabled',
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
			description: 'The error message of the textarea. It is the default value for the `error` slot',
			controlType: 'input',
			type: 'string',
			defaultValue: 'undefined',
			value: undefined,
		},
		autoGrow: {
			description: 'Grows with the text, from `rows` up to `maxRows`. Where the browser has no `field-sizing`, it keeps its size',
			controlType: 'switch',
			type: 'boolean',
			defaultValue: 'false',
			value: false,
		},
		maxRows: {
			description: 'With `autoGrow`, the rows it grows up to before it scrolls',
			controlType: 'number',
			type: 'number',
			defaultValue: 'undefined',
			value: undefined,
		},
		showCount: {
			description: 'With `maxlength`, shows how many characters are used, like 120/500',
			controlType: 'switch',
			type: 'boolean',
			defaultValue: 'false',
			value: false,
		},
	});
	const { props } = useProps(componentProps);

	const componentSlots = ref<Record<string, ComponentSlot>>({
		default: {
			description: 'The label of the textarea',
			value: 'Comments',
			initialValue: 'Comments',
		},
		helper: {
			description: 'Message below the textarea to add extra context',
			value: '',
		},
		error: {
			description: 'Message shown when the textarea has an error',
			value: '',
		},
	});

	const componentEvents = ref<Record<string, ComponentEvent>>({
		'update:modelValue': {
			description: 'Two way binding of the component',
			type: 'string',
		},
	});

	const demoCode = computed(() => getDemoCode({
		componentName: 'LnxTextarea',
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
