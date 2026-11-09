import { reactive, ref } from 'vue';
import { BUTTON_VARIANTS } from '../button/types';
import { getLnxConfig } from '../config';
import { ensureHost } from '../host';
import LnxToaster from './LnxToaster.vue';
import type { Toast, ToastOptions } from './types';

const DURATION_MS = 4000;
const UNDO_DURATION_MS = 7000;
const DANGER_DURATION_MS = 9000;

/* The toasts on screen, the newest last */
export const toasts = reactive<Toast[]>([]);
export const mountedToasters = ref(0);
let lastId = 0;

/**
 * Shows a message for a few seconds at the bottom of the page, and returns its id
 * @example toast('Receipt saved', { undo: () => deleteReceipt(id) })
 */
export function toast(message: string, options: ToastOptions = {}) {
	ensureHost(LnxToaster, () => mountedToasters.value > 0);
	const variant = options.variant ?? BUTTON_VARIANTS.GRAYSCALE;
	const defaultDuration = variant === BUTTON_VARIANTS.DANGER ? DANGER_DURATION_MS : options.undo ? UNDO_DURATION_MS : DURATION_MS;
	const item: Toast = {
		...options,
		id: ++lastId,
		message,
		variant,
		duration: options.duration ?? defaultDuration,
	};
	toasts.push(item);
	return item.id;
}

/* Closes a toast */
export function dismiss(id: number) {
	const index = toasts.findIndex(item => item.id === id);
	if(index !== -1) {
		toasts.splice(index, 1);
	}
}

/* Undoes the given toast, or the newest that can be undone. Resolves to whether there was one */
export async function undo(id = toasts.findLast(item => item.undo)?.id) {
	const item = toasts.find(candidate => candidate.id === id);
	if(!item?.undo) { return false; }

	const { texts, onUndoError } = getLnxConfig();
	dismiss(item.id);
	try {
		await item.undo();
		toast(texts.undone);
	} catch(error) {
		const detail = error instanceof Error ? error.message : String(error);
		toast(`${texts.undoFailed}: ${detail}`, { variant: BUTTON_VARIANTS.DANGER });
		onUndoError?.(error);
	}
	return true;
}
