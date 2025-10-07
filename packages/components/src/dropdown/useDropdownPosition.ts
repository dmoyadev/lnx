import { nextTick, onMounted, onUnmounted, Ref } from 'vue';
import { isOutOfViewport, OutOfView } from '../helpers';

interface DropdownPositionOptions {
	offsetX?: number;
	offsetY?: number;
}

export function useDropdownPosition($dropdown: Ref<HTMLElement>, $handler: Ref<HTMLElement>, options: DropdownPositionOptions = {}) {
	const { offsetX = 0, offsetY = 0 } = options;

	async function calculatePosition() {
		await nextTick();
		if (!$dropdown.value || !$handler.value) {
			return;
		}

		const handlerPosition = $handler.value.getBoundingClientRect();
		const scrollAmount = document.documentElement.scrollTop || document.body.scrollTop;

		$dropdown.value.style.width = `${handlerPosition.width}px`;
		$dropdown.value.style.transform = `translate(${handlerPosition.x + offsetX}px, ${handlerPosition.y + offsetY + scrollAmount + handlerPosition.height}px)`;

		const isListOutOfViewport: OutOfView = isOutOfViewport($dropdown.value);
		const dropdownHeight = $dropdown.value.offsetHeight;

		// If is out of viewport botton and enough space on top
		if (isListOutOfViewport.bottom && !isListOutOfViewport.top && (handlerPosition.top > dropdownHeight)) {
			$dropdown.value.style.transform = `translate(${handlerPosition.x + offsetX}px, ${handlerPosition.y - offsetY + scrollAmount - $dropdown.value.offsetHeight}px)`;
		}
	}

	let resizeObserver: ResizeObserver;
	onMounted(() => {
		addEventListener('resize', calculatePosition);
		addEventListener('scroll', calculatePosition);
		resizeObserver = new ResizeObserver(calculatePosition);
		resizeObserver.observe($handler.value);
	});
	onUnmounted(() => {
		removeEventListener('resize', calculatePosition);
		removeEventListener('scroll', calculatePosition);
		resizeObserver.disconnect();
	});

	return { calculatePosition };
}