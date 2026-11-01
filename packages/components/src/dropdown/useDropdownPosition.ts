import { nextTick, onMounted, onUnmounted, Ref } from 'vue';
import { isOutOfViewport, OutOfView } from '../helpers';

interface DropdownPositionOptions {
	offsetX?: number;
	offsetY?: number;
	fitContent?: boolean;
}

export function useDropdownPosition($dropdown: Ref<HTMLElement>, $handler: Ref<HTMLElement>, options: DropdownPositionOptions = {}) {
	async function calculatePosition() {
		const { offsetX = 0, offsetY = 0, fitContent = false } = options;
		await nextTick();
		if (!$dropdown.value || !$handler.value) {
			return;
		}

		const handlerPosition = $handler.value.getBoundingClientRect();

		$dropdown.value.style[fitContent ? 'minWidth' : 'width'] = `${handlerPosition.width}px`;

		// Keep it inside the viewport on the right when it is wider than the handler
		const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
		const x = Math.max(0, Math.min(handlerPosition.x + offsetX, viewportWidth - $dropdown.value.offsetWidth));
		$dropdown.value.style.transform = `translate(${x}px, ${handlerPosition.y + offsetY + handlerPosition.height}px)`;

		const isListOutOfViewport: OutOfView = isOutOfViewport($dropdown.value);
		const dropdownHeight = $dropdown.value.offsetHeight;

		// If is out of viewport botton and enough space on top
		if (isListOutOfViewport.bottom && !isListOutOfViewport.top && (handlerPosition.top > dropdownHeight)) {
			// A negative offsetY compensates content below the handler (helper/error messages), so it does not apply above it
			$dropdown.value.style.transform = `translate(${x}px, ${handlerPosition.y - Math.max(offsetY, 0) - $dropdown.value.offsetHeight}px)`;
		}
	}

	let resizeObserver: ResizeObserver;
	onMounted(() => {
		addEventListener('resize', calculatePosition);
		// capture: also scrolls of inner containers
		addEventListener('scroll', calculatePosition, {
			capture: true,
			passive: true,
		});
		resizeObserver = new ResizeObserver(calculatePosition);
		resizeObserver.observe($handler.value);
	});
	onUnmounted(() => {
		removeEventListener('resize', calculatePosition);
		removeEventListener('scroll', calculatePosition, { capture: true });
		resizeObserver.disconnect();
	});

	return { calculatePosition };
}