import { onActivated, onBeforeUnmount, onDeactivated, onMounted, reactive } from 'vue';

const hasDOM = typeof window !== 'undefined';

export const isMac = hasDOM && /Mac|iPhone|iPad/.test(navigator.userAgent);

const SEQUENCE_MS = 1000;
const SEPARATOR_REGEX = /[ +]/;
const MODIFIER_KEYS = ['meta', 'control', 'alt', 'shift'];
const TEXT_FIELDS = 'textarea, select, [contenteditable=""], [contenteditable="true"], input:not([type=checkbox], [type=radio], [type=button], [type=submit], [type=reset], [type=file], [type=range], [type=color])';
const KEY_LABELS: Record<string, string> = {
	mod: isMac ? '⌘' : 'Ctrl',
	alt: isMac ? '⌥' : 'Alt',
	shift: '⇧',
	enter: '↵',
	escape: 'Esc',
	arrowup: '↑',
	arrowdown: '↓',
	arrowleft: '←',
	arrowright: '→',
	backspace: '⌫',
};

/* Whether the event comes from a text field, where single keys are text and only shortcuts with mod apply */
export function isTyping(target: EventTarget | null) {
	return hasDOM && target instanceof HTMLElement && !!target.closest(TEXT_FIELDS);
}

/* The labels of the keys of a combo, like ['⌘', '↵'] for 'mod+enter' */
export function shortcutKeys(combo: string) {
	return combo.split(SEPARATOR_REGEX).map(key => KEY_LABELS[key] ?? key.toUpperCase());
}

/* A title with its shortcut, like 'New receipt (N)', for the `title` of a button */
export function shortcutTitle(label: string, combo: string) {
	return `${label} (${shortcutKeys(combo).join(isMac ? '' : '+')})`;
}

/* Kept alive components are only deactivated, so whatever they listen to must stop then too */
function useActive(on: () => void, off: () => void) {
	onMounted(on);
	onActivated(on);
	onDeactivated(off);
	onBeforeUnmount(off);
}

/* addEventListener while the component is mounted and active, also inside KeepAlive */
export function useEventListener<K extends keyof WindowEventMap>(
	target: Window | Document | HTMLElement,
	type: K,
	handler: (event: WindowEventMap[K]) => void,
	options?: AddEventListenerOptions,
) {
	let isAttached = false;
	useActive(() => {
		if(!isAttached) {
			target.addEventListener(type, handler as EventListener, options);
			isAttached = true;
		}
	}, () => {
		target.removeEventListener(type, handler as EventListener, options);
		isAttached = false;
	});
}

// #region ShortcutOptions
export interface ShortcutOptions {
	description?: string; /* Lists the shortcut in the shortcuts sheet */
	enabled?: () => boolean; /* While it returns false, it's as if the shortcut didn't exist */
}
// #endregion ShortcutOptions

export interface ShortcutBinding extends ShortcutOptions {
	combo: string;
	handler: (event: KeyboardEvent) => void;
}

/* The shortcuts of the mounted components, the newest last */
export const shortcutBindings = reactive<ShortcutBinding[]>([]);

/**
 * Runs the handler when the keys are pressed, while the component is mounted and active.
 * combo: keys joined with '+' (mod is ⌘ on Mac and Ctrl elsewhere), and a space for sequences: 'mod+enter', 'n', 'g i', '?'.
 * The newest wins, so the `n` of a page takes over the `n` of its layout
 */
export function useShortcut(combo: string, handler: (event: KeyboardEvent) => void, options: ShortcutOptions = {}) {
	const binding: ShortcutBinding = { combo: combo.toLowerCase(), handler, ...options };
	listen();
	useActive(() => {
		if(!shortcutBindings.includes(binding)) {
			shortcutBindings.push(binding);
		}
	}, () => {
		const index = shortcutBindings.indexOf(binding);
		if(index !== -1) {
			shortcutBindings.splice(index, 1);
		}
	});
}

function comboOf(event: KeyboardEvent) {
	const key = event.key.toLowerCase();
	return [
		...((isMac ? event.metaKey : event.ctrlKey) ? ['mod'] : []),
		...(event.altKey ? ['alt'] : []),
		// ? and ! already carry the shift in their key
		...(event.shiftKey && key.length > 1 ? ['shift'] : []),
		key,
	].join('+');
}

let pending: { combo: string; at: number } | undefined;

function onKeydown(event: KeyboardEvent) {
	if(event.defaultPrevented || event.repeat || event.isComposing || MODIFIER_KEYS.includes(event.key?.toLowerCase())) { return; }

	const combo = comboOf(event);
	const typing = isTyping(event.target);
	const sequence = pending && event.timeStamp - pending.at < SEQUENCE_MS ? `${pending.combo} ${combo}` : undefined;
	pending = undefined;

	const find = (wanted: string) => shortcutBindings.findLast(binding => binding.combo === wanted
		&& (binding.enabled?.() ?? true)
		&& (!typing || binding.combo.includes('mod+') || binding.combo === 'escape'));
	const binding = (sequence && find(sequence)) || find(combo);
	if(binding) {
		event.preventDefault();
		binding.handler(event);
		return;
	}
	if(!typing && shortcutBindings.some(candidate => candidate.combo.startsWith(`${combo} `))) {
		pending = { combo, at: event.timeStamp };
	}
}

let isListening = false;
function listen() {
	if(!hasDOM || isListening) { return; }
	window.addEventListener('keydown', onKeydown);
	isListening = true;
}
