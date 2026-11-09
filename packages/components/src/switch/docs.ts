import { computed, ref } from 'vue';
import { ComponentEvent, ComponentProp, ComponentSlot } from '../../../../.vitepress/components/types';
import { useProps } from '../../../../.vitepress/components/useProps';
import { getDemoCode, resetComponent } from '../../../../.vitepress/components/utils';
import { SWITCH_LABEL_POSITIONS } from './types';

export function useComponent() {
	const componentProps = ref<Record<string, ComponentProp>>({
		'v-model': {
			description: 'Whether the switch is on',
			controlType: 'switch',
			type: 'boolean',
			defaultValue: 'false',
			value: false,
		},
		isLoading: {
			description: 'When loading, it is disabled and the thumb shows a spinner',
			controlType: 'switch',
			type: 'boolean',
			defaultValue: 'false',
			value: false,
		},
		labelPosition: {
			description: 'The label before the switch, with the switch at the end of the row as in settings, or after it',
			controlType: 'select',
			type: 'SwitchLabelPosition',
			options: Object.values(SWITCH_LABEL_POSITIONS),
			defaultValue: 'SWITCH_LABEL_POSITIONS.END',
			value: SWITCH_LABEL_POSITIONS.END,
		},
		disabled: {
			description: 'Native attribute: it can\'t be switched',
			controlType: 'switch',
			type: 'boolean',
			defaultValue: 'false',
			value: false,
		},
	});
	const { props } = useProps(componentProps);

	const componentSlots = ref<Record<string, ComponentSlot>>({
		default: {
			description: 'The label of the switch',
			value: 'Email notifications',
			initialValue: 'Email notifications',
		},
		helper: {
			description: 'The helper message of the switch',
			value: '',
		},
	});

	const componentEvents = ref<Record<string, ComponentEvent>>({
		'update:modelValue': {
			description: 'Two way binding of the component',
			type: 'boolean',
		},
	});

	const demoCode = computed(() => getDemoCode({
		componentName: 'LnxSwitch',
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
