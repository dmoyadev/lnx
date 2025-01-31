import { computed, defineModel, ref, Ref, watch } from 'vue';
import { ComponentProp } from './types';

export function useProps(componentProps: Ref<Record<string, ComponentProp>>, showAllVariationsOfProp: Ref<string>) {
	const possibleVariations = ref<any[]>([true]);

	watch(showAllVariationsOfProp, (newVal) => {
		const affectedProp = componentProps.value[newVal];

		if (affectedProp?.controlType === 'select') {
			if(Array.isArray(affectedProp.options)) {
				possibleVariations.value = affectedProp.options;
				return;
			}
			possibleVariations.value = Object.values(affectedProp.options);
			return;
		}

		if(affectedProp?.controlType === 'switch') {
			possibleVariations.value = [true, false];
			return;
		}

		possibleVariations.value = [true];
	});

	const props = computed(() => {
		return Object.entries(componentProps.value).reduce((acc, [key, value]) => {
			acc[key] = value.value;
			return acc;
		}, {});
	});

	return {
		showAllVariationsOfProp,
		possibleVariations,
		props,
	};
}