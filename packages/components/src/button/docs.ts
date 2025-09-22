import { computed, ref } from 'vue';
import {
	ComponentCSSVars,
	ComponentEvent,
	ComponentProp,
	ComponentSlot,
} from '../../../../.vitepress/components/types';
import { useProps } from '../../../../.vitepress/components/useProps';
import { getDemoCode, resetComponent } from '../../../../.vitepress/components/utils';
import { BUTTON_MODES, BUTTON_SHAPES, BUTTON_SIZES, BUTTON_VARIANTS } from './types';

export function useComponent() {
	const componentProps = ref<Record<string, ComponentProp>>({
		variant: {
			description: 'Applies different palette of colors',
			controlType: 'select',
			type: 'ButtonVariant',
			options: Object.values(BUTTON_VARIANTS),
			defaultValue: 'BUTTON_VARIANTS.PRIMARY',
			value: BUTTON_VARIANTS.PRIMARY,
		},
		mode: {
			description: 'Display mode. Recommended for changing the importance',
			controlType: 'select',
			type: 'ButtonMode',
			options: Object.values(BUTTON_MODES),
			defaultValue: 'BUTTON_MODES.SOLID',
			value: BUTTON_MODES.SOLID,
		},
		size: {
			description: 'Modifies spacing and font sizing',
			controlType: 'select',
			type: 'ButtonSize',
			options: Object.values(BUTTON_SIZES),
			defaultValue: 'BUTTON_SIZES.MEDIUM',
			value: BUTTON_SIZES.MEDIUM,
		},
		shape: {
			description: 'Reimagines how it\'s built',
			controlType: 'select',
			type: 'ButtonShape',
			options: Object.values(BUTTON_SHAPES),
			defaultValue: 'BUTTON_SHAPES.NORMAL',
			value: BUTTON_SHAPES.NORMAL,
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

	const componentCSSVars = ref<Record<string, ComponentCSSVars>>({
		'--lnx-button-content-gap': {
			description: 'Separation between elements inside the button',
			value: '', 
		},
		'--lnx-button-border': { value: '' },
		'--lnx-button-border-color': { value: '' },
		'--lnx-button-border-radius': { value: '' },
		'--lnx-button-box-shadow': { value: '' },
		'--lnx-button-background': { value: '' },
		'--lnx-button-color': {
			description: 'Text color',
			value: '', 
		},
		'--lnx-button-padding': { value: '' },
		'--lnx-button-size': { value: '' },
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
		componentCSSVars,
		configurableOptions,
		demoCode,
		reset,
	};
}