import { computed, ref } from 'vue';
import { ComponentEvent, ComponentProp, ComponentSlot } from '../../../../.vitepress/components/types';
import { useProps } from '../../../../.vitepress/components/useProps';
import { getDemoCode, resetComponent } from '../../../../.vitepress/components/utils';

export function useComponent() {
	const componentProps = ref<Record<string, ComponentProp>>({
		'v-model': {
			description: 'A boolean, or an array to add and remove the `value` of the checkbox, like a native one',
			controlType: 'none',
			type: 'boolean | T[]',
			defaultValue: 'undefined',
			value: undefined,
		},
		isLoading: {
			description: 'When loading, it is disabled and shows a spinner in the box',
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
			description: 'The error message of the checkbox. It is the default value for the `error` slot',
			controlType: 'input',
			type: 'string',
			defaultValue: 'undefined',
			value: undefined,
		},
		indeterminate: {
			description: 'Shows a dash instead of a check, for a group partly checked. It\'s read out as "mixed"',
			controlType: 'switch',
			type: 'boolean',
			defaultValue: 'false',
			value: false,
		},
	});
	const { props } = useProps(componentProps);

	const componentSlots = ref<Record<string, ComponentSlot>>({
		default: {
			description: 'The label of the checkbox',
			value: 'I accept the terms',
			initialValue: 'I accept the terms',
		},
		helper: {
			description: 'Message below the checkbox to add extra context',
			value: '',
		},
		error: {
			description: 'Message shown when the checkbox has an error',
			value: '',
		},
	});

	const componentEvents = ref<Record<string, ComponentEvent>>({
		'update:modelValue': {
			description: 'Two way binding of the component',
			type: 'boolean | T[]',
		},
	});

	const demoCode = computed(() => getDemoCode({
		componentName: 'LnxCheckbox',
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
