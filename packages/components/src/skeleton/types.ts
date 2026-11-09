import { ValueOf } from '../helpers';

// #region SkeletonVariant
export const SKELETON_VARIANTS = {
	TEXT: 'text', // A line of body text
	TITLE: 'title', // A line of a title
	SMALL: 'small', // A line of small text
	CIRCLE: 'circle', // An avatar or an icon
	RECT: 'rect', // An image, a card or a chart
} as const;
export type SkeletonVariant = ValueOf<typeof SKELETON_VARIANTS>;
// #endregion SkeletonVariant
