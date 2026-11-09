import { ButtonVariant } from '../button';

// #region ConfirmOptions
export interface ConfirmOptions {
	title: string; /* The question, like "Delete «Minutes 2026»?" */
	message?: string; /* More details, like "It can't be undone." */
	confirmText?: string; /* Text of the confirm button. By default, the `confirm` text of `createLnx` */
	cancelText?: string; /* Text of the cancel button. By default, the `cancel` text of `createLnx` */
	variant?: ButtonVariant; /* Variant of the confirm button. With `danger`, the focus starts on cancel */
}
// #endregion ConfirmOptions
