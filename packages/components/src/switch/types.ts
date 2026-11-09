import { ValueOf } from '../helpers';

// #region SwitchLabelPosition
export const SWITCH_LABEL_POSITIONS = {
	START: 'start',
	END: 'end',
} as const;
export type SwitchLabelPosition = ValueOf<typeof SWITCH_LABEL_POSITIONS>;
// #endregion SwitchLabelPosition
