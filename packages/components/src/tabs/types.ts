// #region Tab
export interface Tab<T = string> {
	value: T; /* Identifies the tab, and names the slot of its panel */
	label: string; /* Text of the tab */
	icon?: string; /* Iconify icon before the label */
	badge?: string | number; /* A count or a short text after the label */
	to?: string | object; /* A route: the tab is a link, and it's active while the route matches */
	disabled?: boolean; /* Can't be selected */
}
// #endregion Tab
