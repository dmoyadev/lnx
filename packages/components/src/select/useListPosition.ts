import { nextTick, onMounted, onUnmounted, Ref } from 'vue';
import { isOutOfViewport, OutOfView } from '../helpers';

export function useListPosition($list: Ref<HTMLElement>, $input: Ref<HTMLElement>) {
	async function calculateListPosition() {
		await nextTick();
		if (!$list.value || !$input.value) {
			return;
		}

		/* @ts-expect-error Vue internals */
		const inputPosition = $input.value.$el.getBoundingClientRect();
		const scrollAmount = document.documentElement.scrollTop || document.body.scrollTop;

		$list.value.style.width = `${inputPosition.width}px`;
		$list.value.style.transform = `translate(${inputPosition.x}px, ${inputPosition.y + scrollAmount + 56 + 4}px)`;

		const isListOutOfViewport: OutOfView = isOutOfViewport($list.value);
		if(isListOutOfViewport.bottom) {
			$list.value.style.transform = `translate(${inputPosition.x}px, ${inputPosition.y + scrollAmount - $list.value.offsetHeight - 4}px)`;
		}
	}

	onMounted(() => {
		addEventListener('resize', calculateListPosition);
		addEventListener('scroll', calculateListPosition);
	});
	onUnmounted(() => {
		removeEventListener('resize', calculateListPosition);
		removeEventListener('scroll', calculateListPosition);
	});

	return { calculateListPosition };
}