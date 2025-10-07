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
		// Example of a prop:
		// variant: {
		// 	description: 'Applies different palette of colors',
		// 	controlType: 'select',
		// 	type: 'ButtonVariant',
		// 	options: Object.values(BUTTON_VARIANTS),
		// 	defaultValue: 'BUTTON_VARIANTS.PRIMARY',
		// 	value: BUTTON_VARIANTS.PRIMARY,
		// },
	});

	const componentOptions = ref<Record<string, ComponentProp>>({
		// Example of a configurable option:
		// 'Make it disabled': {
		// 	description: 'Native HTML attribute to disable the button',
		// 	configurableOptionName: 'disabled',
		// 	controlType: 'switch',
		// 	type: 'boolean',
		// 	defaultValue: false,
		// 	value: false,
		// },
	});

	const componentSlots = ref<Record<string, ComponentSlot>>({
		// Example of a slot:
		// default: {
		// 	description: 'Actual content of the button',
		// 	value: 'Click me!',
		// 	initialValue: 'Click me!',
		// },
	});

	const componentEvents = ref<Record<string, ComponentEvent>>({
		// Example of an event::
		// click: {
		// 	description: 'Emitted when the button is clicked',
		// 	type: {
		// 		name: 'PointerEvent',
		// 		link: 'https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent',
		// 	},
		// 	isNative: true,
		// },
	});

	const componentCSSVars = ref<Record<string, ComponentCSSVars>>({
		// Example of a CSS variable:
		// '--lnx-button-content-gap': {
		// 	description: 'Separation between elements inside the button',
		// 	value: '',
		// },
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
		componentName: 'Lnx<<ComponentName>>',
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