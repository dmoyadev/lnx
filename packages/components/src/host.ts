import { Component, createVNode, render } from 'vue';
import { getLnxAppContext } from './config';

const mounted = new Set<Component>();

/**
 * Mounts a host component, like the toaster, at the end of the body the first time it's needed,
 * unless the app already renders one. It uses the app context of `createLnx`, so it gets the same config
 */
export function ensureHost(component: Component, isMounted: () => boolean) {
	if(typeof document === 'undefined' || isMounted() || mounted.has(component)) { return; }
	mounted.add(component);

	const container = document.createElement('div');
	document.body.appendChild(container);
	const vnode = createVNode(component);
	vnode.appContext = getLnxAppContext();
	render(vnode, container);
}
