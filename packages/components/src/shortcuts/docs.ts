import { computed, ref } from 'vue';
import { ComponentProp } from '../../../../.vitepress/components/types';
import { useProps } from '../../../../.vitepress/components/useProps';
import { getDemoCode, resetComponent } from '../../../../.vitepress/components/utils';

export function useComponent() {
	const componentProps = ref<Record<string, ComponentProp>>({
		combo: {
			description: "Keys joined with `+`, and a space for sequences: `'mod+enter'`, `'n'`, `'g i'`. `mod` is ⌘ on Mac and Ctrl elsewhere, `alt` is ⌥ or Alt and `shift` is ⇧",
			controlType: 'input',
			type: 'string',
			defaultValue: "'mod+enter'",
			value: 'mod+enter',
		},
	});

	const { props } = useProps(componentProps);

	const demoCode = computed(() => getDemoCode({
		componentName: 'LnxKbd',
		props: { ...componentProps.value },
		checkDefault: () => true,
	}));

	function reset() {
		resetComponent({
			props: componentProps.value,
			evalDefaultValue: (defaultValue) => eval(defaultValue as string),
		});
	}

	return {
		componentProps,
		props,
		demoCode,
		reset,
	};
}
