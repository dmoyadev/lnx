import { computed, MaybeRefOrGetter, toRef } from 'vue';
import { ComponentCSSVars, ComponentProp } from './types';

export function useProps(
	componentProps: MaybeRefOrGetter<Record<string, ComponentProp>>,
	componentCSSVars?: MaybeRefOrGetter<Record<string, ComponentCSSVars>>,
) {
	const componentPropsValue = toRef(componentProps);
	const componentCSSVarsValue = toRef(componentCSSVars);

	const props = computed(() => {
		const finalProps = Object.entries(componentPropsValue.value).reduce((acc, [key, value]) => {
			acc[key] = value.value;
			return acc;
		}, {} as Record<string, unknown>);

		if(Object.keys(componentCSSVarsValue.value || {}).length === 0) {
			return finalProps;
		}

		finalProps.style = Object.entries(componentCSSVarsValue.value || {}).reduce((acc, [key, value]) => {
			acc[key] = value.value;
			return acc;
		}, {} as Record<string, unknown>);

		return finalProps;
	});

	return { props };
}