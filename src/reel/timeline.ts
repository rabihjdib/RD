import {continueRender, delayRender, staticFile} from 'remotion';
import {CAPTIONS, CUTS, END_HOLD, FPS, type Cut} from './data';

// Fonts ship in public/fonts so renders never depend on reaching Google Fonts. Cairo
// covers both scripts; unicodeRange lets one family name pick the right subset file.
const ARABIC = 'U+0600-06FF, U+0750-077F, U+0870-088E, U+0890-0891, U+0898-08E1, U+08E3-08FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE70-FE74, U+FE76-FEFC';
const LATIN = 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';
const faces = [
	new FontFace('Cairo', `url(${staticFile('fonts/Cairo-Arabic-900.woff2')}) format('woff2')`, {weight: '900', unicodeRange: ARABIC}),
	new FontFace('Cairo', `url(${staticFile('fonts/Cairo-Latin-900.woff2')}) format('woff2')`, {weight: '900', unicodeRange: LATIN}),
	new FontFace('Cairo', `url(${staticFile('fonts/Cairo-Arabic-700.woff2')}) format('woff2')`, {weight: '700', unicodeRange: ARABIC}),
	new FontFace('Cairo', `url(${staticFile('fonts/Cairo-Latin-700.woff2')}) format('woff2')`, {weight: '700', unicodeRange: LATIN}),
	new FontFace('Playfair Display', `url(${staticFile('fonts/PlayfairDisplay-700i.woff2')}) format('woff2')`, {weight: '700', style: 'italic'}),
];
const handle = delayRender('Loading reel fonts');
Promise.all(faces.map((f) => f.load()))
	.then((loaded) => {
		loaded.forEach((f) => document.fonts.add(f));
		continueRender(handle);
	})
	.catch((err) => {
		console.error(err);
		continueRender(handle);
	});

export const sans = 'Cairo, "Noto Sans Arabic", sans-serif';
export const serif = '"Playfair Display", Georgia, serif';
export const YELLOW = '#FFD60A';
export const INK = '#0B0B10';

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

/** The end card comes up just after the last spoken word and runs through the hold. */
export const END_CARD_AT = Math.min(PHRASES[PHRASES.length - 1].end + 8, BODY_END);
