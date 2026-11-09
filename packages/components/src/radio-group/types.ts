import { ValueOf } from '../helpers';

// #region RadioGroupMode
export const RADIO_GROUP_MODES = {
	CHIPS: 'chips',
	SEGMENTED: 'segmented',
	LIST: 'list',
} as const;
export type RadioGroupMode = ValueOf<typeof RADIO_GROUP_MODES>;
// #endregion RadioGroupMode

// #region RadioGroupOption
export interface RadioGroupOption<T> {
	value: T; /* Any value, also an object */
	label: string; /* Text of the option */
	icon?: string; /* Iconify icon before the label */
	disabled?: boolean; /* Can't be picked */
}
// #endregion RadioGroupOption
