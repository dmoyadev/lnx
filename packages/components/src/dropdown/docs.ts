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
		isOpen: {
			description: 'Whether to show the dropdown',
			controlType: 'none',
			type: 'boolean',
			defaultValue: 'false',
			value: false,
			helper: 'Try clicking the input to open the dropdown',
		},
		offsetX: {
			description: 'Horizontal offset of the dropdown',
			controlType: 'number',
			type: 'number',
			defaultValue: '0',
			value: 0,
		},
		offsetY: {
			description: 'Vertical offset of the dropdown',
			controlType: 'number',
			type: 'number',
			defaultValue: '0',
			value: 0,
		},
	});

	const componentSlots = ref<Record<string, ComponentSlot>>({
		default: {
			description: 'The element that triggers the dropdown',
			value: '<LnxInput @click="showDropdown = true">Open dropdown</LnxInput>',
			initialValue: '<LnxInput @click="showDropdown = true">Open dropdown</LnxInput>',
			readonly: true,
		},
		content: {
			description: 'The content of the dropdown',
			value: '<ul><li>Option 1</li><li>Option 2</li></ul>',
			initialValue: '<ul><li>Option 1</li><li>Option 2</li></ul>',
		},
	});

	const { props } = useProps(componentProps);

	const demoCode = computed(() => getDemoCode({
		componentName: 'LnxDropdown',
		props: { ...componentProps.value },
		checkDefault: (defaultValue, value) => eval(defaultValue as string) !== value,
		slots: componentSlots.value,
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
		demoCode,
		reset,
	};
}