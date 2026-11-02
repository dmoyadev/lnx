/* WCAG relative luminance of an opaque [r, g, b] color (0-255) */
function getLuminance(rgb: number[]) {
	const [r, g, b] = rgb.map(channel => {
		const c = channel / 255;
		return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
	});
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/* WCAG contrast ratio, from 1 to 21. Body text needs 4.5 or more to pass AA */
export function getContrast(a: number[], b: number[]) {
	const [lighter, darker] = [getLuminance(a), getLuminance(b)].sort((x, y) => y - x);
	return (lighter + 0.05) / (darker + 0.05);
}
