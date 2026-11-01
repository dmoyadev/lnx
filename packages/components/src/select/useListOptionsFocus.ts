import { MaybeRefOrGetter, ref, toValue } from 'vue';

export function useListOptionsFocus(optionCount: MaybeRefOrGetter<number>) {
	const focusedOptionIndex = ref<number | null>(null);

	function focusOption(direction: 1 | -1) {
		const optionNumber = toValue(optionCount);
		if (!optionNumber) {
			return;
		}

		if (focusedOptionIndex.value == null) {
			focusedOptionIndex.value = 0;
			return;
		}

		if (direction === -1 && focusedOptionIndex.value === 0) {
			focusedOptionIndex.value = optionNumber - 1;
			return;
		}

		if (direction === 1 && focusedOptionIndex.value === optionNumber - 1) {
			focusedOptionIndex.value = 0;
			return;
		}
		focusedOptionIndex.value += direction;
	}

	return {
		focusedOptionIndex,
		focusOption,
	};
}