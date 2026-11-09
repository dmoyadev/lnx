import { ref } from 'vue';
import { ComponentProp } from '../../../../.vitepress/components/types';

export function useComponent() {
	// The toaster has no props: what it shows comes from each `toast()` call, described in the ToastOptions type
	const componentProps = ref<Record<string, ComponentProp>>({});

	return { componentProps };
}
