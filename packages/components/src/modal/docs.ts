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
		title: {
			description: 'Title of the modal',
			controlType: 'input',
			type: 'string',
			defaultValue: '',
			value: 'This is the title',
		},
		hideCloseButton: {
			description: 'Hide the close button in the top right corner',
			controlType: 'switch',
			type: 'boolean',
			defaultValue: 'false',
			value: false,
		},
		allowCloseOnOverlayClick: {
			description: 'Allow closing the modal when clicking on the overlay',
			controlType: 'switch',
			type: 'boolean',
			defaultValue: 'false',
			value: false,
		},
	});

	const componentSlots = ref<Record<string, ComponentSlot>>({
		default: {
			description: 'Opener element',
			value: '<LnxButton @click="open()">Open extra-long dialog</LnxButton>',
			initialValue: '<LnxButton @click="open()">Open extra-long dialog</LnxButton>',
			readonly: true,
			scopes: [
				{
					name: 'open',
					type: '() => void',
				},
				{
					name: 'close',
					type: '() => void',
				},
			],
		},
		icon: {
			description: 'Shown next to the title of the modal',
			value: '<LnxIcon icon="mdi:warning" size="24" style="color: var(--lnx-color-danger)" />',
			initialValue: '<LnxIcon icon="mdi:warning" size="24" style="color: var(--lnx-color-danger)" />',
			readonly: true,
		},
		content: {
			description: 'The main content of the modal',
			value: 'The content of the modal goes here.',
			initialValue: 'The content of the modal goes here.',
			scopes: [
				{
					name: 'close',
					type: '() => void',
				},
			],
		},
		actions: {
			description: 'Some actions to show at the end of the dialog',
			value: '<LnxButton :variant="ButtonVariants.GRAYSCALE" :mode="ButtonModes.CLEAR" > A secondary action </LnxButton> <LnxButton :variant="ButtonVariants.GRAYSCALE"> Another action </LnxButton> <LnxButton @click="scopes.close()"> Close </LnxButton> </template>',
			initialValue: '<LnxButton :variant="ButtonVariants.GRAYSCALE" :mode="ButtonModes.CLEAR" > A secondary action </LnxButton> <LnxButton :variant="ButtonVariants.GRAYSCALE"> Another action </LnxButton> <LnxButton @click="scopes.close()"> Close </LnxButton> </template>',
			readonly: true,
			scopes: [
				{
					name: 'close',
					type: '() => void',
				},
			],
		},
	});

	const componentEvents = ref<Record<string, ComponentEvent>>({
		open: {
			description: 'Emitted when the modal dialog is opened',
			type: 'void',
		},
		close: {
			description: 'Emitted when the modal dialog is closed',
			type: 'void',
		},
	});

	const { props } = useProps(componentProps);

	const demoCode = computed(() => getDemoCode({
		componentName: 'LnxModal',

		props: { ...componentProps.value },
		checkDefault: (defaultValue, value) => eval(defaultValue as string) !== value,
		slots: componentSlots.value,
		listeners: componentEvents.value,
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
		componentEvents,
		componentSlots,
		demoCode,
		reset,
	};
}