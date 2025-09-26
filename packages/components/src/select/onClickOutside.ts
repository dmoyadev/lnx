import { onMounted, onUnmounted, Ref } from 'vue';

export function onClickOutside(element: Ref<HTMLElement>, callbackOutside: () => void) {
	function onClickOutside(event: MouseEvent | TouchEvent) {
		const clickedEl = event.target;
		if(!clickedEl) { return; }

		if((element.value as HTMLElement)?.contains(clickedEl as HTMLElement)) {
			return;
		}

		callbackOutside();
	}

	onMounted(() => {
		window.addEventListener('mouseup', onClickOutside);
		window.addEventListener('touchend', onClickOutside);
	});

	onUnmounted(() => {
		window.removeEventListener('mouseup', onClickOutside);
		window.removeEventListener('touchend', onClickOutside);
	});
}