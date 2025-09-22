import { ValueOf } from '../helpers';

// #region Item
export type Item = Day | Month | Year;
// #endregion Item

// #region Day
export interface Day {
	number: number;
	weekDay: number;
	month: number;
	year: number;
	isDisabled?: boolean;
}
// #endregion Day

// #region Month
export interface Month {
	number: number;
	year: number;
	isDisabled?: boolean;
}
// #endregion Month

// #region Year
export interface Year {
	number: number;
	isDisabled?: boolean;
}
// #endregion Year

// #region DisplayedMonth
export interface DisplayedMonth {
	year: number;
	month: number;
	firstDayOfMonth: number;
	daysInMonth: number;
	weeksInMonth: number;
	daysInWeeks: Day[][];
}
// #endregion DisplayedMonth

// #region CalendarViewTypes
export const CALENDAR_VIEW_TYPES = {
	DAY: 'day',
	MONTH: 'month',
	YEAR: 'year',
};
export type CalendarViewType = ValueOf<typeof CALENDAR_VIEW_TYPES>;
// #endregion CalendarViewTypes
