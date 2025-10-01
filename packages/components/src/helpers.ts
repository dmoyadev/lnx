export type ValueOf<T> = T[keyof T];

export function normalizeString(str: string) {
	return str
		.normalize('NFD') // Normalize to decompose combined letters into a letter and diacritic
		.replace(/[\u0300-\u036f]/g, '') // Remove diacritics
		.toLowerCase(); // Convert to lowercase
}

export interface OutOfView {
	top: boolean;
	bottom: boolean;
	left: boolean;
	right: boolean;
	any: boolean;
	all: boolean;
}

/**
 * Returns an object indicating where the element passed is out of the viewport.
 * @param element
 */
export function isOutOfViewport(element: HTMLElement): OutOfView {
	if(!element) {
		return {
			top: false,
			bottom: false,
			left: false,
			right: false,
			any: false,
			all: false,
		};
	}

	// Get element's bounding
	const bounding = element.getBoundingClientRect();

	// Check if it's out of the viewport on each side
	const out: OutOfView = {} as OutOfView;
	out.top = bounding.top < 0;
	out.left = bounding.left < 0;
	out.bottom = bounding.bottom > (window.innerHeight || document.documentElement.clientHeight);
	out.right = bounding.right > (window.innerWidth || document.documentElement.clientWidth);
	out.any = out.top || out.left || out.bottom || out.right;
	out.all = out.top && out.left && out.bottom && out.right;
	return out;
}