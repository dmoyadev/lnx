import { computed, Ref } from 'vue';
import { ComponentProp } from './types';

export function useProps(componentProps: Ref<Record<string, ComponentProp>>) {
	const props = computed(() => {
		return Object.entries(componentProps.value).reduce((acc, [key, value]) => {
			acc[key] = value.value;
			return acc;
		}, {});
	});

	return { props };
}