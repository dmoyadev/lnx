import { computed, ref } from 'vue';
import { ComponentEvent, ComponentProp, ComponentSlot } from '../../../../.vitepress/components/types';
import { useProps } from '../../../../.vitepress/components/useProps';
import { getDemoCode, resetComponent } from '../../../../.vitepress/components/utils';

export function useComponent() {
	const componentProps = ref<Record<string, ComponentProp>>({
		'v-model': {
			description: 'The value of the selected tab. With `to`, the tab of the current route',
			controlType: 'none',
			type: 'T',
			defaultValue: 'undefined',
			value: 'overview',
		},
		tabs: {
			description: 'The tabs. Each one shows the slot named as its value, if there is one',
			controlType: 'none',
			type: 'Tab<T>[]',
			value: [
				{ value: 'overview', label: 'Overview', icon: 'lucide:house' },
				{ value: 'documents', label: 'Documents', badge: 12 },
				{ value: 'tenants', label: 'Tenants' },
				{ value: 'archive', label: 'Archive', disabled: true },
			],
		},
		'aria-label': {
			description: 'What the tabs are about, for screen readers. It goes to the tab list',
			controlType: 'input',
			type: 'string',
			defaultValue: 'undefined',
			value: 'Property',
		},
	});
	const { props } = useProps(componentProps);

	const componentSlots = ref<Record<string, ComponentSlot>>({
		'[value]': {
			description: 'The panel of the tab with that value. Without slots only the bar is shown',
			value: '',
			readonly: true,
		},
	});

	const componentEvents = ref<Record<string, ComponentEvent>>({
		'update:modelValue': {
			description: 'Two way binding of the component',
			type: 'T',
		},
	});

	const demoCode = computed(() => getDemoCode({
		componentName: 'LnxTabs',
		props: { ...componentProps.value },
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
