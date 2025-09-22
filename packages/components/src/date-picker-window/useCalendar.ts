// More info about this:
// https://medium.com/@nitinpatel_20236/challenge-of-building-a-calendar-with-pure-javascript-a86f1303267d
import { computed, MaybeRef, Ref, ref, toRef } from 'vue';
import { CALENDAR_VIEW_TYPES, CalendarViewType, Day, DisplayedMonth, Item, Month, Year } from './types';

interface useCalendarParams {
	firstDayOfWeek?: MaybeRef<number>; // 0 (Sunday) to 6 (Saturday)
	isRange?: MaybeRef<boolean>; // Whether the date picker is in range mode
	isItemDisabledFn?: MaybeRef<(item: Item) => boolean>; // Function to determine if a day/month/year is disabled
	initialViewType?: MaybeRef<CalendarViewType>; // Initial view type (day, month, year)
}

function isRef<T>(value: MaybeRef<T>): value is Ref<T> {
	return value && typeof value === 'object' && 'value' in value;
}

export function useCalendar({
	firstDayOfWeek = 1,
	isRange = false,
	isItemDisabledFn = () => false,
	initialViewType = CALENDAR_VIEW_TYPES.DAY,
}: useCalendarParams) {
	firstDayOfWeek = toRef(firstDayOfWeek);
	isRange = toRef(isRange);
	isItemDisabledFn = toRef(isItemDisabledFn);
	initialViewType = toRef(initialViewType);

	const now = ref<Date>(new Date());
	const currentYear = ref<number>(now.value.getFullYear());
	const currentMonth = ref<number>(now.value.getMonth());

	interface getDaysForWeekParams {
		firstDay: number,
		nDays: number,
		nWeeks: number,
		year: number,
		month: number,
	}
	function getDaysForWeek({ firstDay, nDays, nWeeks, year, month }: getDaysForWeekParams): Day[][] {
		if(!isRef(isItemDisabledFn)) {
			isItemDisabledFn = ref(isItemDisabledFn);
		}

		const DAYS_IN_WEEK = 7;
		const days: Day[][] = [];

		// First week with previous month days
		const firstWeek: Day[] = [];
		const previousMonthLastDay = new Date(year, month, 0).getDate() + 1;
		for(let i = 0; i < firstDay; i++) {
			const day: Day = {
				number: previousMonthLastDay - firstDay + i,
				month: month === 0 ? 11 : (month - 1),
				year: month === 0 ? (year - 1) : year,
				weekDay: firstWeek.length,
			};
			day.isDisabled = !!isItemDisabledFn.value ? isItemDisabledFn.value(day) : false;
			firstWeek.push(day);
		}
		for(let i = 1; i <= DAYS_IN_WEEK - firstDay; i++) {
			const day: Day = {
				number: i,
				month: month,
				year: year,
				weekDay: firstWeek.length,
			};
			day.isDisabled = !!isItemDisabledFn.value ? isItemDisabledFn.value(day) : false;
			firstWeek.push(day);
		}
		days.push(firstWeek);

		// Month days
		let monthWeek: Day[] = [];
		for(let i = 1; i <= nWeeks - 2; i++) {
			monthWeek = [];
			for(let j = 1; j <= DAYS_IN_WEEK; j++) {
				const day: Day = {
					number: (i - 1) * DAYS_IN_WEEK + j + DAYS_IN_WEEK - firstDay,
					month: month,
					year: year,
					weekDay: monthWeek.length,
				};
				day.isDisabled = !!isItemDisabledFn.value ? isItemDisabledFn.value(day) : false;
				monthWeek.push(day);
			}
			days.push(monthWeek);
		}

		// Last week with next month days
		const lastWeek: Day[] = [];
		for(let i = 1; i <= DAYS_IN_WEEK; i++) {
			const remainingDaysInMonth = (nWeeks - 2) * DAYS_IN_WEEK + DAYS_IN_WEEK - firstDay;
			if(i + remainingDaysInMonth <= nDays) {
				const day: Day = {
					number: i + remainingDaysInMonth,
					month: month,
					year: year,
					weekDay: lastWeek.length,
				};
				day.isDisabled = !!isItemDisabledFn.value ? isItemDisabledFn.value(day) : false;
				lastWeek.push(day);
			} else {
				const day: Day = {
					number: i + remainingDaysInMonth - nDays,
					month: month === 11 ? 0 : (month + 1),
					year: month === 11 ? (year + 1) : year,
					weekDay: lastWeek.length,
				};
				day.isDisabled = !!isItemDisabledFn.value ? isItemDisabledFn.value(day) : false;
				lastWeek.push(day);
			}
		}
		days.push(lastWeek);

		// Extra week
		if(days.length < 6) {
			const extraWeek: Day[] = [];
			let lastDay: Day = days[days.length - 1][days[days.length - 1].length - 1];

			// Check if the last day displayed is the last day of the month. If so,
			// we need to add the first day of the next month to the extra week.
			if (lastDay.number === daysInMonth.value) {
				lastDay = {
					number: 0,
					month: month === 11 ? 0 : (month + 1),
					year: month === 11 ? (year + 1) : year,
					weekDay: 0,
				};
				lastDay.isDisabled = !!isItemDisabledFn.value ? isItemDisabledFn.value(lastDay) : false;
			}

			for (let i = 1; i <= DAYS_IN_WEEK; i++) {
				const day: Day = {
					number: lastDay.number + i,
					month: month === 11 ? 0 : (month + 1),
					year: month === 11 ? (year + 1) : year,
					weekDay: extraWeek.length,
				};
				day.isDisabled = !!isItemDisabledFn.value ? isItemDisabledFn.value(day) : false;
				extraWeek.push(day);
			}
			days.push(extraWeek);
		}

		return days;
	}

	const firstDayOfMonth = computed<number>(() => {
		const day = (new Date(currentYear.value, currentMonth.value).getDay()) - firstDayOfWeek.value;
		return day < 0 ? 6 : day;
	});
	const daysInMonth = computed<number>(() => 32 - (new Date(currentYear.value, currentMonth.value, 32).getDate()));
	const weeksInMonth = computed<number>(() => Math.ceil((firstDayOfMonth.value + daysInMonth.value) / 7));
	const daysInWeeks = computed<Day[][]>(() => {
		return getDaysForWeek({
			firstDay: firstDayOfMonth.value,
			nDays: daysInMonth.value,
			nWeeks: weeksInMonth.value,
			year: currentYear.value,
			month: currentMonth.value,
		});
	});

	const nextYear = computed<number>(() => currentMonth.value === 11 ? currentYear.value + 1 : currentYear.value);
	const nextMonth = computed<number>(() => currentMonth.value === 11 ? 0 : currentMonth.value + 1);
	const nextFirstDayOfMonth = computed<number>(() => {
		const day = (new Date(nextYear.value, nextMonth.value).getDay()) - firstDayOfWeek.value;
		return day < 0 ? 6 : day;
	});
	const nextDaysInMonth = computed<number>(() => 32 - (new Date(nextYear.value, nextMonth.value, 32).getDate()));
	const nextWeeksInMonth = computed<number>(() => Math.ceil((nextFirstDayOfMonth.value + nextDaysInMonth.value) / 7));
	const nextDaysInWeeks = computed<Day[][]>(() => {
		return getDaysForWeek({
			firstDay: nextFirstDayOfMonth.value,
			nDays: nextDaysInMonth.value,
			nWeeks: nextWeeksInMonth.value,
			year: nextYear.value,
			month: nextMonth.value,
		});
	});

	const displayedMonths = computed<DisplayedMonth[]>(() => {
		console.log('displayedMonths!');
		const months: DisplayedMonth[] = [];

		months.push({
			year: currentYear.value,
			month: currentMonth.value,
			firstDayOfMonth: firstDayOfMonth.value,
			daysInMonth: daysInMonth.value,
			weeksInMonth: weeksInMonth.value,
			daysInWeeks: daysInWeeks.value,
		});

		if (isRange.value) {
			months.push({
				year: nextYear.value,
				month: nextMonth.value,
				firstDayOfMonth: nextFirstDayOfMonth.value,
				daysInMonth: nextDaysInMonth.value,
				weeksInMonth: nextWeeksInMonth.value,
				daysInWeeks: nextDaysInWeeks.value,
			});
		}

		return months;
	});

	const displayedYears = computed<Record<number, Month[]>>(() => {
		if(!isRef(isItemDisabledFn)) {
			isItemDisabledFn = ref(isItemDisabledFn);
		}

		const year: Record<number, Month[]> = {};
		let months: Month[] = [];

		for(let i = 0; i < 12; i++) {
			const month: Month = {
				number: i,
				year: currentYear.value,
			};
			month.isDisabled = !!isItemDisabledFn.value ? isItemDisabledFn.value(month) : false;
			months.push(month);
		}
		year[currentYear.value] = months;


		if (isRange.value) {
			months = [];
			for(let i = 0; i < 12; i++) {
				const nextMonth: Month = {
					number: i,
					year: currentYear.value,
				};
				nextMonth.isDisabled = !!isItemDisabledFn.value ? isItemDisabledFn.value(nextMonth) : false;
				months.push({
					number: i,
					year: currentYear.value + 1,
				});
			}
			year[currentYear.value + 1] = months;
		}

		return year;
	});

	const displayedDecades = computed<Record<number, Year[]>>(() => {
		if(!isRef(isItemDisabledFn)) {
			isItemDisabledFn = ref(isItemDisabledFn);
		}

		const decades: Record<number, Year[]> = {};
		let years: Year[] = [];

		const year = currentYear.value;
		const displayedDecade = Math.floor(year / 10) * 10;

		const previousYear: Year = { number: displayedDecade - 1 };
		previousYear.isDisabled = !!isItemDisabledFn.value ? isItemDisabledFn.value(previousYear) : false;
		years.push(previousYear);
		for(let i = 0; i < 10; i++) {
			const year: Year = { number: displayedDecade + i };
			year.isDisabled = !!isItemDisabledFn.value ? isItemDisabledFn.value(year) : false;
			years.push(year);
		}
		const nextYear: Year = { number: displayedDecade + 10 };
		nextYear.isDisabled = !!isItemDisabledFn.value ? isItemDisabledFn.value(nextYear) : false;
		years.push(nextYear);
		decades[displayedDecade] = years;

		if (isRange.value) {
			years = [];
			const nextDecadePreviousYear: Year = { number: displayedDecade + 9 };
			nextDecadePreviousYear.isDisabled = !!isItemDisabledFn.value ? isItemDisabledFn.value(nextDecadePreviousYear) : false;
			years.push(nextDecadePreviousYear);
			for(let i = 0; i < 10; i++) {
				const nextDecadeYear: Year = { number: displayedDecade + 10 + i };
				nextDecadeYear.isDisabled = !!isItemDisabledFn.value ? isItemDisabledFn.value(nextDecadeYear) : false;
				years.push(nextDecadeYear);
			}
			const nextDecadeNextYear: Year = { number: displayedDecade + 20 };
			nextDecadeNextYear.isDisabled = !!isItemDisabledFn.value ? isItemDisabledFn.value(nextDecadeNextYear) : false;
			years.push(nextDecadeNextYear);
			decades[displayedDecade + 10] = years;
		}

		return decades;
	});

	const calendarViewType = ref<CalendarViewType>(initialViewType.value);
	const displayedElements = computed<DisplayedMonth[] | Record<number, Month[]> | Record<number, Year[]>>(() => {
		switch(calendarViewType.value) {
			case CALENDAR_VIEW_TYPES.DAY:
				return displayedMonths.value;
			case CALENDAR_VIEW_TYPES.MONTH:
				return displayedYears.value;
			case CALENDAR_VIEW_TYPES.YEAR:
				return displayedDecades.value;
			default:
				return displayedMonths.value;
		}
	});

	function changeSmall(direction: number) {
		switch(calendarViewType.value) {
			case CALENDAR_VIEW_TYPES.DAY:
				currentMonth.value += direction;
				if(currentMonth.value > 11) {
					currentMonth.value = 0;
					currentYear.value++;
				} else if(currentMonth.value < 0) {
					currentMonth.value = 11;
					currentYear.value--;
				}
				break;
			case CALENDAR_VIEW_TYPES.MONTH:
				currentYear.value += direction;
				break;
			case CALENDAR_VIEW_TYPES.YEAR:
				currentYear.value += direction * 10;
				break;
		}
	}

	function changeBig(direction: number) {
		switch(calendarViewType.value) {
			case CALENDAR_VIEW_TYPES.DAY:
				currentYear.value += direction;
				break;
			case CALENDAR_VIEW_TYPES.MONTH:
				currentYear.value += direction * 10;
				break;
			case CALENDAR_VIEW_TYPES.YEAR:
				currentYear.value += direction * 100;
				break;
		}
	}

	function setToday(): Date {
		currentYear.value = now.value.getFullYear();
		currentMonth.value = now.value.getMonth();
		return new Date(Date.UTC(now.value.getFullYear(), now.value.getMonth(), now.value.getDate()));
	}

	return {
		currentYear,
		currentMonth,
		displayedElements,
		calendarViewType,
		changeSmall,
		changeBig,
		setToday,
	};
}