import { Day, Item, Month, Year } from './types';
import { MaybeRef, toValue } from 'vue';

function isDay(item: Item): item is Day {
	return 'weekDay' in item;
}

function isMonth(item: Item): item is Month {
	return !('weekday' in item) && 'year' in item;
}

function isYear(item: Item): item is Year {
	return !('weekday' in item) && !('year' in item) && 'number' in item;
}

export function isToday(item: Item): boolean {
	const now = new Date();

	switch(true) {
		case isDay(item): {
			const day = item as Day;
			return day.year === now.getFullYear() && day.month === now.getMonth() && day.number === now.getDate();
		}
		case isMonth(item): {
			const month = item as Month;
			return month.year === now.getFullYear() && month.number === now.getMonth();
		}
		case isYear(item): {
			const year = item as Year;
			return year.number === now.getFullYear();
		}
		default:
			return false;
	}
}

export function isSelected(item: Item, selection?: MaybeRef<Date>): boolean {
	selection = toValue(selection);
	if(!selection) { return false; }

	switch(true) {
		case isDay(item): {
			const day = item as Day;
			return day.year === selection.getFullYear() && day.month === selection.getMonth() && day.number === selection.getDate();
		}
		case isMonth(item): {
			const month = item as Month;
			return month.year === selection.getFullYear() && month.number === selection.getMonth();
		}
		case isYear(item): {
			const year = item as Year;
			return year.number === selection.getFullYear();
		}
		default:
			return false;
	}
}

export function isStart(item: Item, start?: MaybeRef<Date>): boolean {
	start = toValue(start);
	if(!start) { return false; }

	switch(true) {
		case isDay(item): {
			const day = item as Day;
			return day.year === start.getFullYear() && day.month === start.getMonth() && day.number === start.getDate();
		}
		case isMonth(item): {
			const month = item as Month;
			return month.year === start.getFullYear() && month.number === start.getMonth();
		}
		case isYear(item): {
			const year = item as Year;
			return year.number === start.getFullYear();
		}
		default:
			return false;
	}
}

export function isEnd(item: Item, end?: MaybeRef<Date>): boolean {
	end = toValue(end);
	if(!end) { return false; }

	switch(true) {
		case isDay(item): {
			const day: Day = item as Day;
			return day.year === end.getFullYear() && day.month === end.getMonth() && day.number === end.getDate();
		}
		case isMonth(item): {
			const month: Month = item as Month;
			return month.year === end.getFullYear() && month.number === end.getMonth();
		}
		case isYear(item): {
			const year = item as Year;
			return year.number === end.getFullYear();
		}
		default:
			return false;
	}
}

export function isAfterStart(item: Item, isRange?: boolean, start?: MaybeRef<Date>): boolean {
	start = toValue(start);
	if(!isRange || !start) { return false; }

	switch(true) {
		case isDay(item): {
			const day: Day = item as Day;
			return (day.number > start.getDate()
					&& day.month >= start.getMonth()
					&& day.year >= start.getFullYear())
				|| (day.month > start.getMonth()
					&& day.year >= start.getFullYear())
				|| (day.year > start.getFullYear());
		}
		case isMonth(item): {
			const month: Month = item as Month;
			return (month.number > start.getMonth()
					&& month.year >= start.getFullYear())
				|| (month.year > start.getFullYear());
		}
		case isYear(item): {
			const year = item as Year;
			return year.number > start.getFullYear();
		}
		default:
			return false;
	}
}

export function isBeforeEnd(item: Item, isRange?: boolean, end?: MaybeRef<Date>): boolean {
	end = toValue(end);
	if(!isRange || !end) { return false; }

	switch(true) {
		case isDay(item): {
			const day: Day = item as Day;
			return (day.number < end.getDate()
					&& day.month <= end.getMonth()
					&& day.year <= end.getFullYear())
				|| (day.month < end.getMonth()
					&& day.year <= end.getFullYear())
				|| (day.year < end.getFullYear());
		}
		case isMonth(item): {
			const month: Month = item as Month;
			return (month.number < end.getMonth()
					&& month.year <= end.getFullYear())
				|| (month.year < end.getFullYear());
		}
		case isYear(item): {
			const year = item as Year;
			return year.number < end.getFullYear();
		}
		default:
			return false;
	}
}