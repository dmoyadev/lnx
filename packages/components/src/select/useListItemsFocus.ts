import { ref } from 'vue';

export function useListItemFocus(itemNumber: number) {
	const focusedItemIndex = ref<number | null>(null);

	function focusItem(direction: 1 | -1) {
		if (focusedItemIndex.value == null) {
			focusedItemIndex.value = 0;
			return;
		}

		if (direction === -1 && focusedItemIndex.value === 0) {
			focusedItemIndex.value = itemNumber - 1;
			return;
		}

		if (direction === 1 && focusedItemIndex.value === itemNumber - 1) {
			focusedItemIndex.value = 0;
			return;
		}
		focusedItemIndex.value += direction;
	}

	return {
		focusedItemIndex,
		focusItem,
	};
}