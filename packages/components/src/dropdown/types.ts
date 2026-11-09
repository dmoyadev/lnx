import { ValueOf } from '../helpers';

// #region DropdownWidth
export const DROPDOWN_WIDTHS = {
	ANCHOR: 'anchor', // As wide as the element that opens it
	MIN_ANCHOR: 'min-anchor', // At least as wide as that element, wider if the content needs it
	CONTENT: 'content', // The natural width of its content
} as const;
export type DropdownWidth = ValueOf<typeof DROPDOWN_WIDTHS>;
// #endregion DropdownWidth
