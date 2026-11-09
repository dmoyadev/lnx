import { ref, shallowReactive } from 'vue';
import { ConfirmOptions } from './types';

export interface ConfirmRequest extends ConfirmOptions {
	id: number;
	resolve: (confirmed: boolean) => void;
}

/* Requests waiting to be answered: the first one is shown */
export const confirmQueue = shallowReactive<ConfirmRequest[]>([]);
export const mountedConfirmHosts = ref(0);
