import type { ButtonVariant } from '../button';

// #region ToastOptions
export interface ToastOptions {
	variant?: ButtonVariant; /* Color and icon. By default, grayscale */
	duration?: number; /* Milliseconds it stays. By default, 4s, 7s with undo and 9s for danger. Infinity keeps it until it's closed */
	undo?: () => unknown; /* Shows an undo button, also with ⌘Z or Ctrl+Z. It can return a promise */
}
// #endregion ToastOptions

// #region Toast
export interface Toast extends ToastOptions {
	id: number;
	message: string;
	variant: ButtonVariant;
	duration: number;
}
// #endregion Toast
