import {CAPTIONS, CUTS, END_HOLD, FPS, type Cut} from './data';

export {BRONZE, CHARCOAL, CREAM, display, GOLD, OLIVE, SAND, sans} from '../brand';

const isArabic = /[؀-ۿ]/;
export const scriptOf = (text: string): 'ar' | 'latin' => (isArabic.test(text) ? 'ar' : 'latin');

// ---------------------------------------------------------------------------
// Cut list -> frames on the edit timeline
// ---------------------------------------------------------------------------

export type Segment = Cut & {
	index: number;
	start: number; // first frame on the timeline
	duration: number; // frames
	trimBefore: number; // first frame inside the rush
	newRush: boolean; // true when this segment starts a different rush (gets a transition)
};

export const SEGMENTS: Segment[] = (() => {
	let start = 0;
	return CUTS.map((cut, index) => {
		const trimBefore = Math.round(cut.from * FPS);
		const duration = Math.round(cut.to * FPS) - trimBefore;
		const seg = {...cut, index, start, duration, trimBefore, newRush: index === 0 || CUTS[index - 1].rush !== cut.rush};
		start += duration;
		return seg;
	});
})();

const last = SEGMENTS[SEGMENTS.length - 1];
export const BODY_END = last.start + last.duration;
export const END_HOLD_FRAMES = Math.round(END_HOLD * FPS);
export const REEL_DURATION = BODY_END + END_HOLD_FRAMES;

/** Segment playing at a timeline frame (the hold counts as the last segment). */
export const segmentAt = (frame: number): Segment =>
	SEGMENTS.find((s) => frame >= s.start && frame < s.start + s.duration) ?? last;

/**
 * Timeline frame for a moment inside a rush, or null when that moment was cut out.
 * `edge` lets an end time that lands in a cut snap to the end of its segment.
 */
export const rushToFrame = (rush: number, sec: number, edge = false): number | null => {
	const f = Math.round(sec * FPS);
	for (const s of SEGMENTS) {
		if (s.rush !== rush) continue;
		if (f >= s.trimBefore && f < s.trimBefore + s.duration) return s.start + (f - s.trimBefore);
		if (edge && f >= s.trimBefore + s.duration && f < s.trimBefore + s.duration + FPS) return s.start + s.duration;
	}
	return null;
};

// ---------------------------------------------------------------------------
// Captions -> timed words on the edit timeline (shared by subtitles, B-roll, zooms)
// ---------------------------------------------------------------------------

export type TimedWord = {
	text: string;
	start: number;
	end: number;
	highlight: boolean;
	zoom: boolean;
	script: 'ar' | 'latin';
};

export type TimedPhrase = {
	dir: 'rtl' | 'ltr';
	words: TimedWord[];
	translation: string;
	start: number;
	end: number;
};

export const PHRASES: TimedPhrase[] = (() => {
	const out: TimedPhrase[] = [];
	for (const p of CAPTIONS) {
		const words: TimedWord[] = [];
		for (const [text, s, e, flags = ''] of p.words) {
			const start = rushToFrame(p.rush, s);
			if (start === null) continue; // word sits in a trimmed pause
			const end = Math.max(start + 2, rushToFrame(p.rush, e, true) ?? start + Math.round((e - s) * FPS));
			words.push({text, start, end, highlight: flags.includes('h'), zoom: flags.includes('z'), script: scriptOf(text)});
		}
		if (words.length === 0) continue;
		out.push({dir: p.dir, words, translation: p.translation, start: words[0].start, end: words[words.length - 1].end});
	}
	return out;
})();

export const WORDS: TimedWord[] = PHRASES.flatMap((p) => p.words);

/** Lower-case and strip punctuation, Arabic diacritics and tatweel, for keyword matching. */
export const normalizeWord = (text: string) =>
	text
		.toLowerCase()
		.replace(/[ً-ْـ]/g, '')
		.replace(/[.,!?؟،:;"'“”]/g, '')
		.trim();

/** The logo outro comes up just after the last spoken word and runs through the hold. */
export const END_CARD_AT = Math.min(PHRASES[PHRASES.length - 1].end + 8, BODY_END);
