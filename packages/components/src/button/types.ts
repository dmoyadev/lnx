export const ButtonVariants = {
	PRIMARY: 'primary',
	GRAYSCALE: 'grayscale',
	DANGER: 'danger',
} as const;
export type TButtonVariant = typeof ButtonVariants[keyof typeof ButtonVariants];

export const ButtonModes = {
	SOLID: 'solid',
	OUTLINE: 'outline',
	CLEAR: 'clear',
	LINK: 'link',
} as const;
export type TButtonMode = typeof ButtonModes[keyof typeof ButtonModes];

export const ButtonSizes = {
	SMALL: 'small',
	MEDIUM: 'medium',
	LARGE: 'large',
} as const;
export type TButtonSize = typeof ButtonSizes[keyof typeof ButtonSizes];

export const ButtonShapes = {
	NORMAL: 'normal',
	ICON: 'icon',
} as const;
export type TButtonShape = typeof ButtonShapes[keyof typeof ButtonShapes];