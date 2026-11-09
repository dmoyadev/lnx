import { computed, ref } from 'vue';
import { ComponentProp } from '../../../../.vitepress/components/types';
import { useProps } from '../../../../.vitepress/components/useProps';
import { getDemoCode, resetComponent } from '../../../../.vitepress/components/utils';
import { SKELETON_VARIANTS } from './types';

export function useComponent() {
	const componentProps = ref<Record<string, ComponentProp>>({
		variant: {
			description: 'The shape: a line of text, a title, small text, a circle or a rectangle',
			controlType: 'select',
			type: 'SkeletonVariant',
			options: Object.values(SKELETON_VARIANTS),
			defaultValue: 'SKELETON_VARIANTS.TEXT',
			value: SKELETON_VARIANTS.TEXT,
		},
		lines: {
			description: 'Number of lines, for a paragraph. The last one is shorter',
			controlType: 'number',
			type: 'number',
			defaultValue: '1',
			value: 1,
		},
		width: {
			description: 'Any CSS width. By default, the whole width, or `size`',
			controlType: 'input',
			type: 'string',
			defaultValue: 'undefined',
			value: undefined,
		},
		height: {
			description: 'Any CSS height. By default, the height of the text of the variant, or `size`',
			controlType: 'input',
			type: 'string',
			defaultValue: 'undefined',
			value: undefined,
		},
		size: {
			description: 'Width and height at once, for circles and squares',
			controlType: 'input',
			type: 'string',
			defaultValue: 'undefined',
			value: undefined,
		},
	});

	const { props } = useProps(componentProps);

	const demoCode = computed(() => getDemoCode({
		componentName: 'LnxSkeleton',
		props: { ...componentProps.value },
		checkDefault: (defaultValue, value) => eval(defaultValue as string) !== value,
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
