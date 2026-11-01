import { Day, Item, Month } from './types';
import { MaybeRef, toValue } from 'vue';

function isDay(item: Item): item is Day {
	return 'weekDay' in item;
}

function isMonth(item: Item): item is Month {
	return !isDay(item) && 'year' in item;
}

/**
 * Compares an item with a date at the item's granularity (day, month or year).
 * Selected dates are emitted at 00:00 UTC, so they are read in UTC to show the same day in every timezone.
 * @returns A negative number if the item is before the date, 0 if it is the same, a positive number if it is after
 */
function compare(item: Item, date: Date): number {
	const year = date.getUTCFullYear();
	const month = date.getUTCMonth();

	if(isDay(item)) {
		return (item.year - year) || (item.month - month) || (item.number - date.getUTCDate());
	}
	if(isMonth(item)) {
		return (item.year - year) || (item.number - month);
	}
	return item.number - year;
}

export function isToday(item: Item): boolean {
	const now = new Date();
	// "Today" is the viewer's local day
	return compare(item, new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))) === 0;
}

export function isSelected(item: Item, selection?: MaybeRef<Date | undefined>): boolean {
	const date = toValue(selection);
	return !!date && compare(item, date) === 0;
}

export function isStart(item: Item, start?: MaybeRef<Date | undefined>): boolean {
	return isSelected(item, start);
}

export function isEnd(item: Item, end?: MaybeRef<Date | undefined>): boolean {
	return isSelected(item, end);
}

export function isAfterStart(item: Item, isRange?: boolean, start?: MaybeRef<Date | undefined>): boolean {
	const date = toValue(start);
	return !!isRange && !!date && compare(item, date) > 0;
}

export function isBeforeEnd(item: Item, isRange?: boolean, end?: MaybeRef<Date | undefined>): boolean {
	const date = toValue(end);
	return !!isRange && !!date && compare(item, date) < 0;
}
