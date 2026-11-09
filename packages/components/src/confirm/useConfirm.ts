import { ConfirmOptions } from './types';
import { ensureHost } from '../host';
import { confirmQueue, mountedConfirmHosts } from './state';
import LnxConfirmHost from './LnxConfirmHost.vue';

let lastId = 0;

/**
 * Returns a function that asks the user to confirm an action in a dialog
 * @example
 * const confirm = useConfirm();
 * if(!await confirm({ title: 'Delete «Minutes 2026»?', message: "It can't be undone.", variant: 'danger' })) { return; }
 */
export function useConfirm() {
	return (options: ConfirmOptions | string): Promise<boolean> => {
		ensureHost(LnxConfirmHost, () => mountedConfirmHosts.value > 0);
		const request = typeof options === 'string' ? { title: options } : options;
		return new Promise((resolve) => {
			confirmQueue.push({ ...request, id: ++lastId, resolve });
		});
	};
}
