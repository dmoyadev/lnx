import { ref } from 'vue';
import { ComponentProp } from '../../../../.vitepress/components/types';

export function useComponent() {
	// The host has no props: what it shows comes from each `confirm()` call, described in the ConfirmOptions type
	const componentProps = ref<Record<string, ComponentProp>>({});

	return { componentProps };
}
