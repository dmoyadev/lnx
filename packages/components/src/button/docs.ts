import { computed, ref } from 'vue';
import { ComponentEvent, ComponentProp, ComponentSlot } from '../../../../.vitepress/components/types';
import { useProps } from '../../../../.vitepress/components/useProps';
import { getDemoCode, resetComponent } from '../../../../.vitepress/components/utils';
import { ButtonModes, ButtonShapes, ButtonSizes, ButtonVariants } from './types';

export function useComponent() {
	const componentProps = ref<Record<string, ComponentProp>>({
		variant: {
			description: 'Applies different palette of colors',
			controlType: 'select',
			type: 'TButtonVariant',
			options: Object.values(ButtonVariants),
			defaultValue: 'ButtonVariants.PRIMARY',
			value: ButtonVariants.PRIMARY,
		},
		mode: {
			description: 'Display mode. Recommended for changing the importance',
			controlType: 'select',
			type: 'TButtonMode',
			options: Object.values(ButtonModes),
			defaultValue: 'ButtonModes.SOLID',
			value: ButtonModes.SOLID,
		},
		size: {
			description: 'Modifies spacing and font sizing',
			controlType: 'select',
			type: 'TButtonSizes',
			options: Object.values(ButtonSizes),
			defaultValue: 'ButtonSizes.MEDIUM',
			value: ButtonSizes.MEDIUM,
		},
		shape: {
			description: 'Reimagines how it\'s built',
			controlType: 'select',
			type: 'TButtonShapes',
			options: Object.values(ButtonShapes),
			defaultValue: 'ButtonShapes.NORMAL',
			value: ButtonShapes.NORMAL,
		},
		href: {
			description: 'Converts the button in an anchor tag with the given URL',
			controlType: 'input',
			type: 'string',
			defaultValue: 'undefined',
			value: undefined,
		},
		to: {
			description: 'Converts the button in a router-link with the given route. If `href` is set, this is ignored.',
			controlType: 'input',
			type: 'string | object',
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
		isBlock: {
			description: 'Indicates if the button should take the full width of its parent',
			controlType: 'switch',
			type: 'boolean',
			defaultValue: 'false',
			value: false,
		},
	});
	const { props } = useProps(componentProps);

	const componentOptions = ref<Record<string, ComponentProp>>({
		'Make it disabled': {
			description: 'Native HTML attribute to disable the button',
			configurableOptionName: 'disabled',
			controlType: 'switch',
			type: 'boolean',
			defaultValue: false,
			value: false,
		},
		'Add a `target` attribute': {
			description: 'Only works if `href` prop is set. Native HTML attribute to define where the link should open',
			configurableOptionName: 'target',
			controlType: 'input',
			type: 'string',
			defaultValue: 'undefined',
			value: undefined,
		},
	});

	const componentSlots = ref<Record<string, ComponentSlot>>({
		default: {
			description: 'Actual content of the button',
			value: 'Click me!',
			initialValue: 'Click me!',
		},
		loading: {
			description: 'Displayed content when the button is loading',
			value: '',
		},
		prefix: {
			description: 'Icon that should be prefixed before to the content',
			value: '',
		},
		suffix: {
			description: 'Icon that should be suffixed after to the content',
			value: '',
		},
	});

	const componentEvents = ref<Record<string, ComponentEvent>>({
		click: {
			description: 'Emitted when the button is clicked',
			type: {
				name: 'PointerEvent',
				link: 'https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent', 
			},
			isNative: true,
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
		componentName: 'LnxButton',
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