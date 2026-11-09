import { App, AppContext, getCurrentInstance, inject, InjectionKey } from 'vue';

// #region LnxTexts
export interface LnxTexts {
	search: string; /* Placeholder of the search box in a select */
	notFound: string; /* Shown in a select when the search matches no option */
	today: string; /* Button of the date picker that selects today */
	close: string; /* Accessible label of close buttons */
	confirm: string; /* Default confirm button of a confirmation */
	cancel: string; /* Default cancel button of a confirmation */
	undo: string; /* Undo button of a toast */
	undone: string; /* Toast shown after undoing */
	undoFailed: string; /* Toast shown when undoing fails */
	loading: string; /* Accessible label of loading states */
	shortcuts: string; /* Title of the keyboard shortcuts sheet */
	undoLast: string; /* Description of the shortcut that undoes the last action */
}
// #endregion LnxTexts

// #region LnxOptions
export interface LnxOptions {
	locale?: string; /* Used by Intl for month and weekday names, the first day of the week and the date format */
	texts?: Partial<LnxTexts>; /* Texts that Intl can't give */
	onUndoError?: (error: unknown) => void; /* Called when the undo action of a toast throws */
}
// #endregion LnxOptions

export const DEFAULT_TEXTS: LnxTexts = {
	search: 'Search...',
	notFound: 'Not found',
	today: 'Today',
	close: 'Close',
	confirm: 'Confirm',
	cancel: 'Cancel',
	undo: 'Undo',
	undone: 'Undone',
	undoFailed: 'Could not undo',
	loading: 'Loading',
	shortcuts: 'Keyboard shortcuts',
	undoLast: 'Undo the last action',
};

const EN_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const EN_MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const EN_WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const EN_WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const LNX_CONFIG_KEY: InjectionKey<LnxOptions> = Symbol('lnx-config');

/* The installed config, for code that runs outside a component, like `toast()` */
let globalOptions: LnxOptions = {};
let globalAppContext: AppContext | null = null;

/**
 * Sets the language and texts of every component in the app
 * @example app.use(createLnx({ locale: 'es', texts: { search: 'Buscar...' } }))
 */
export function createLnx(options: LnxOptions = {}) {
	return {
		install(app: App) {
			globalOptions = options;
			globalAppContext = app._context;
			app.provide(LNX_CONFIG_KEY, options);
		},
	};
}

/* The app context of the app that installed `createLnx`, to mount hosts like the toaster on demand */
export function getLnxAppContext() {
	return globalAppContext;
}

function capitalize(text: string, locale: string) {
	return text.charAt(0).toLocaleUpperCase(locale) + text.slice(1);
}

function names(locale: string, count: number, toDate: (i: number) => Date, options: Intl.DateTimeFormatOptions) {
	const format = new Intl.DateTimeFormat(locale, { ...options, timeZone: 'UTC' });
	return Array.from({ length: count }, (_, i) => capitalize(format.format(toDate(i)), locale));
}

function firstDayOf(locale: string) {
	try {
		const intlLocale = new Intl.Locale(locale) as Intl.Locale & { getWeekInfo?: () => { firstDay: number }; weekInfo?: { firstDay: number } };
		const firstDay = intlLocale.getWeekInfo?.().firstDay ?? intlLocale.weekInfo?.firstDay;
		// Intl counts from 1 (Monday) to 7 (Sunday), the calendar from 0 (Sunday)
		return firstDay === undefined ? 1 : firstDay % 7;
	} catch {
		return 1;
	}
}

export type LnxConfig = ReturnType<typeof resolve>;

const cache = new WeakMap<LnxOptions, LnxConfig>();
function resolve(options: LnxOptions) {
	const { locale } = options;
	const month = (i: number) => new Date(Date.UTC(2021, i, 1));
	// 3 January 2021 was a Sunday
	const weekday = (i: number) => new Date(Date.UTC(2021, 0, 3 + i));

	return {
		locale,
		texts: { ...DEFAULT_TEXTS, ...options.texts } as LnxTexts,
		onUndoError: options.onUndoError,
		monthsNames: locale ? names(locale, 12, month, { month: 'long' }) : EN_MONTHS,
		monthsShortNames: locale ? names(locale, 12, month, { month: 'short' }) : EN_MONTHS_SHORT,
		weekDaysNames: locale ? names(locale, 7, weekday, { weekday: 'short' }) : EN_WEEKDAYS_SHORT,
		weekDaysLongNames: locale ? names(locale, 7, weekday, { weekday: 'long' }) : EN_WEEKDAYS,
		firstDayOfWeek: locale ? firstDayOf(locale) : 1,
		/* How a date is shown in a field, or undefined to keep the library format */
		showFormat: locale ? (date: Date) => date.toLocaleDateString(locale, { timeZone: 'UTC' }) : undefined,
	};
}

/* The global config merged with the defaults, outside components */
export function getLnxConfig(options: LnxOptions = globalOptions): LnxConfig {
	if(!cache.has(options)) { cache.set(options, resolve(options)); }
	return cache.get(options)!;
}

/* The config of the app, merged with the defaults */
export function useLnxConfig(): LnxConfig {
	const options = getCurrentInstance() ? inject(LNX_CONFIG_KEY, null) : null;
	return getLnxConfig(options ?? globalOptions);
}
