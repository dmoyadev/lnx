import { ValueOf } from '../helpers';
import { getLnxConfig } from '../config';

// #region DateFormats
export const DATE_FORMATS = {
	HOURS: 'hh:MM:ss',
	HOURS_WITHOUT_SECONDS: 'hh:MM',
	SHORT_NUMERIC: 'dd-mm-yyyy',
	LONG_NUMERIC: 'dd-mm-yyyy hh:MM:ss',
	LONG_NUMERIC_WITHOUT_SECONDS: 'dd-mm-yyyy hh:MM',
	SHORT: 'd mmm, yyyy',
	LONG: 'd mmm, yyyy hh:MM:ss',
	LONG_WITHOUT_SECONDS: 'd mmm, yyyy hh:MM',
	MONTH_YEAR: 'mmm yyyy',
	WEEKDAY: 'dddd, d mmm, yyyy',
	WEEKDAY_LONG: 'dddd, d mmmm, yyyy hh:MM:ss',
	WEEKDAY_LONG_WITHOUT_SECONDS: 'dddd, d mmmm, yyyy hh:MM',
	API: 'yyyy-mm-dd',
};
export type DateFormat = ValueOf<typeof DATE_FORMATS>;
// #endregion DateFormats

/**
 * Formats a date read in UTC, since the date picker emits dates at 00:00 UTC
 * @param date
 * @param format
 * @param monthNames An array for the months names, by default the short names of the `createLnx` locale
 * @param weekdayNames An array for weekday names, by default the long names of the `createLnx` locale
 *
 * @returns The date in the format DD/MM/YYYY
 */
export function formatDate(date: Date | string, format: DateFormat = DATE_FORMATS.SHORT_NUMERIC, monthNames?: string[], weekdayNames?: string[]) {
	if(!date) return '';

	if (typeof date === 'string') {
		date = new Date(date);
	}

	const months = monthNames || getLnxConfig().monthsShortNames;
	const weekdays = weekdayNames || getLnxConfig().weekDaysLongNames;

	const hours = String(date.getUTCHours()).padStart(2, '0');
	const minutes = String(date.getUTCMinutes()).padStart(2, '0');
	const seconds = String(date.getUTCSeconds()).padStart(2, '0');
	const weekday = weekdays[date.getUTCDay()];
	const dayShort = date.getUTCDate();
	const day = String(date.getUTCDate()).padStart(2, '0');
	const monthNumeric = String(date.getUTCMonth() + 1).padStart(2, '0');
	const month = months[date.getUTCMonth()];
	const year = date.getUTCFullYear();

	switch(format) {
		case DATE_FORMATS.HOURS:
			return `${hours}:${minutes}:${seconds}`;

		case DATE_FORMATS.HOURS_WITHOUT_SECONDS:
			return `${hours}:${minutes}`;

		case DATE_FORMATS.SHORT_NUMERIC:
			return `${day}-${monthNumeric}-${year}`;

		case DATE_FORMATS.LONG_NUMERIC:
			return `${day}-${monthNumeric}-${year} ${hours}:${minutes}:${seconds}`;

		case DATE_FORMATS.LONG_NUMERIC_WITHOUT_SECONDS:
			return `${day}-${monthNumeric}-${year} ${hours}:${minutes}`;

		case DATE_FORMATS.SHORT:
			return `${dayShort} ${month}, ${year}`;

		case DATE_FORMATS.LONG:
			return `${dayShort} ${month}, ${year} ${hours}:${minutes}:${seconds}`;

		case DATE_FORMATS.LONG_WITHOUT_SECONDS:
			return `${dayShort} ${month}, ${year} ${hours}:${minutes}`;

		case DATE_FORMATS.MONTH_YEAR:
			return `${month} ${year}`;

		case DATE_FORMATS.WEEKDAY:
			return `${weekday}, ${dayShort} ${month}, ${year}`;

		case DATE_FORMATS.WEEKDAY_LONG:
			return `${weekday}, ${dayShort} ${month}, ${year} ${hours}:${minutes}:${seconds}`;

		case DATE_FORMATS.WEEKDAY_LONG_WITHOUT_SECONDS:
			return `${weekday}, ${dayShort} ${month}, ${year} ${hours}:${minutes}`;

		case DATE_FORMATS.API:
			return `${year}-${monthNumeric}-${day}`;
	}

	return date.toISOString();
}
