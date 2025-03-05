import { computed, MaybeRefOrGetter, toRef } from 'vue';
import { ComponentProp } from './types';

export function useProps(componentProps: MaybeRefOrGetter<Record<string, ComponentProp>>) {
	const componentPropsValue = toRef(componentProps);

	const props = computed(() => {
		return Object.entries(componentPropsValue.value).reduce((acc, [key, value]) => {
			acc[key] = value.value;
			return acc;
		}, {} as Record<string, unknown>);
	});

	return { props };
}