import { ValueOf } from '../helpers';

// #region ButtonVariant
export const BUTTON_VARIANTS = {
	PRIMARY: 'primary',
	GRAYSCALE: 'grayscale',
	DANGER: 'danger',
	SUCCESS: 'success',
	INFO: 'info',
	WARNING: 'warning',
} as const;
export type ButtonVariant = ValueOf<typeof BUTTON_VARIANTS>;
// #endregion ButtonVariant

// #region ButtonMode
export const BUTTON_MODES = {
	SOLID: 'solid',
	OUTLINE: 'outline',
	CLEAR: 'clear',
	LINK: 'link',
} as const;
export type ButtonMode = ValueOf<typeof BUTTON_MODES>;
// #endregion ButtonMode

// #region ButtonSize
export const BUTTON_SIZES = {
	SMALL: 'small',
	MEDIUM: 'medium',
	LARGE: 'large',
} as const;
export type ButtonSize = ValueOf<typeof BUTTON_SIZES>;
// #endregion ButtonSize

// #region ButtonShape
export const BUTTON_SHAPES = {
	NORMAL: 'normal',
	ICON: 'icon',
	CIRCLE: 'circle',
} as const;
export type ButtonShape = ValueOf<typeof BUTTON_SHAPES>;
// #endregion ButtonShape