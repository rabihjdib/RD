import {random} from 'remotion';

/** Decaying camera shake that starts at `at`. Returns an [x, y] offset in px. */
export const shake = (frame: number, at: number, amount: number, length = 10): [number, number] => {
	const t = frame - at;
	if (t < 0 || t > length) {
		return [0, 0];
	}
	const k = amount * (1 - t / length) ** 2;
	return [(random(`sx-${at}-${t}`) - 0.5) * 2 * k, (random(`sy-${at}-${t}`) - 0.5) * 2 * k];
};
