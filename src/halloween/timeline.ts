import {BADGES, BROLL, CAPTIONS, CUTS, END_HOLD, FPS, type Cut} from './data';

export {CHARCOAL, CREAM, display, GOLD, OLIVE, SAND, sans} from '../brand';

// ---------------------------------------------------------------------------
// Talking cuts -> frames on the edit timeline
// ---------------------------------------------------------------------------

export type Segment = Cut & {
	index: number;
	start: number; // first frame on the timeline
	duration: number; // frames
	trimBefore: number; // first frame inside the clip
	newClip: boolean; // a different clip from the previous segment (gets a transition)
};

export const SEGMENTS: Segment[] = (() => {
	let start = 0;
	return CUTS.map((cut, index) => {
		const trimBefore = Math.round(cut.from * FPS);
		const duration = Math.round(cut.to * FPS) - trimBefore;
		const seg = {...cut, index, start, duration, trimBefore, newClip: index === 0 || CUTS[index - 1].clip !== cut.clip};
		start += duration;
		return seg;
	});
})();

const last = SEGMENTS[SEGMENTS.length - 1];
export const BODY_END = last.start + last.duration;
export const END_HOLD_FRAMES = Math.round(END_HOLD * FPS);
export const REEL_DURATION = BODY_END + END_HOLD_FRAMES;

export const segmentAt = (frame: number): Segment => SEGMENTS.find((s) => frame >= s.start && frame < s.start + s.duration) ?? last;

/** Timeline frame for a moment inside a clip, or null if that moment was cut. `edge` snaps an end time to its segment end. */
export const clipToFrame = (clip: string, sec: number, edge = false): number | null => {
	const f = Math.round(sec * FPS);
	for (const s of SEGMENTS) {
		if (s.clip !== clip) continue;
		if (f >= s.trimBefore && f < s.trimBefore + s.duration) return s.start + (f - s.trimBefore);
		if (edge && f >= s.trimBefore + s.duration && f < s.trimBefore + s.duration + FPS) return s.start + s.duration;
	}
	return null;
};

// ---------------------------------------------------------------------------
// Subtitles -> timed words. Each phrase's words share its span, weighted by length.
// ---------------------------------------------------------------------------

export type TimedWord = {text: string; start: number; end: number; highlight: boolean};
export type TimedPhrase = {speaker: 'q' | 'a'; clip: string; words: TimedWord[]; start: number; end: number};

export const PHRASES: TimedPhrase[] = CAPTIONS.flatMap((p) => {
	const start = clipToFrame(p.clip, p.start);
	const end = clipToFrame(p.clip, p.end, true);
	if (start === null || end === null) return [];
	const tokens = p.text.split(/\s+/).filter(Boolean);
	const weights = tokens.map((t) => t.replace('*', '').length + 3);
	const total = weights.reduce((a, b) => a + b, 0);
	let acc = 0;
	const words = tokens.map((t, i) => {
		const s = start + Math.round(((end - start) * acc) / total);
		acc += weights[i];
		const e = start + Math.round(((end - start) * acc) / total);
		return {text: t.replace('*', ''), start: s, end: Math.max(e, s + 2), highlight: t.startsWith('*')};
	});
	return [{speaker: p.speaker, clip: p.clip, words, start, end}];
});

export const WORDS: TimedWord[] = PHRASES.flatMap((p) => p.words);

/** Frames where the off-camera question is speaking, per segment clip (for its gain). */
export const QUESTION_SPANS = PHRASES.filter((p) => p.speaker === 'q').map((p) => ({clip: p.clip, start: p.start, end: p.end}));

/** The logo outro comes up just after the last spoken word and runs through the hold. */
export const END_CARD_AT = Math.min(PHRASES[PHRASES.length - 1].end + 8, BODY_END);

// ---------------------------------------------------------------------------
// B-roll and badges on the timeline
// ---------------------------------------------------------------------------

export const BROLL_EVENTS = BROLL.flatMap((b) => {
	const start = clipToFrame(b.at.clip, b.at.sec);
	return start === null ? [] : [{...b, start, frames: Math.round(b.duration * FPS), trimBefore: Math.round(b.from * FPS)}];
});

export const BADGE_EVENTS = BADGES.flatMap((b) => {
	const start = clipToFrame(b.clip, b.at);
	return start === null ? [] : [{...b, start, frames: Math.round(b.duration * FPS)}];
});

export const normalizeWord = (text: string) => text.toLowerCase().replace(/[.,!?;:"'’“”]/g, '');
