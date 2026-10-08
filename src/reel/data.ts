/**
 * Everything you swap per edit lives in this file: the cut list, the captions and the
 * highlight badges. Components read from here and never hard-code times.
 *
 * TIME CONVENTION: every time below is in SECONDS INSIDE THE RUSH FILE it belongs to
 * (exactly what Whisper / your NLE shows for that file). The timeline maps them onto
 * the edit for you, so trimming or reordering clips never means re-timing captions.
 */

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// ---------------------------------------------------------------------------
// 1. CUT LIST
// ---------------------------------------------------------------------------
// One entry per kept piece of a rush, in playback order. To drop dead air inside a
// rush, list it twice with the pause left out (see rush 2 and rush 4).
//
// To use your own footage: drop files in public/reel/ (any name), point `src` at them
// and set from/to. Phone .mov files (HEVC, rotated) play badly in Chromium, so
// transcode first, e.g.
//   ffmpeg -i IMG_1234.mov -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30" \
//     -c:v libx264 -crf 20 -af loudnorm=I=-14:TP=-1.5 -c:a aac public/reel/rush1.mp4
//
// `focus` is where the speaker's face sits (0..1 of the frame) so punch-ins zoom
// towards it instead of the frame centre.

export type Cut = {
	rush: number;
	src: string;
	from: number;
	to: number;
	focus: [number, number];
};

export const CUTS: Cut[] = [
	{rush: 1, src: 'reel/rush1.mp4', from: 0.0, to: 4.7, focus: [0.5, 0.2]}, // corridor walk: hook
	{rush: 2, src: 'reel/rush2.mp4', from: 0.0, to: 4.3, focus: [0.5, 0.3]}, // both hosts, Luciole sign
	{rush: 2, src: 'reel/rush2.mp4', from: 4.85, to: 7.6, focus: [0.72, 0.3]}, // jump cut over a 0.5s pause
	{rush: 3, src: 'reel/rush3.mp4', from: 0.0, to: 4.85, focus: [0.5, 0.3]}, // tablet walk-in
	{rush: 4, src: 'reel/rush4.mp4', from: 0.4, to: 4.25, focus: [0.5, 0.33]}, // coffee table
	{rush: 4, src: 'reel/rush4.mp4', from: 4.65, to: 6.45, focus: [0.5, 0.33]}, // jump cut over a pause
	{rush: 5, src: 'reel/rush5.mp4', from: 0.55, to: 4.1, focus: [0.5, 0.3]}, // door reveal
	{rush: 6, src: 'reel/rush6.mp4', from: 0.6, to: 4.55, focus: [0.5, 0.3]}, // duo outro
];

/** Seconds the last frame is held (frozen, muted) under the end card. */
export const END_HOLD = 1.5;

// ---------------------------------------------------------------------------
// 2. CAPTIONS
// ---------------------------------------------------------------------------
// One Phrase = one caption "page" on screen. Keep pages to 2-5 words.
//   dir:          'rtl' for Arabic-led lines (English words inside are handled),
//                 'ltr' for English-led lines.
//   words:        [text, start, end, flags?]   flags: 'h' = highlight colour,
//                                              'z' = punch-in zoom on this word.
//   translation:  the second-language line under the caption (English under
//                 Arabic speech, Arabic under English speech).
//
// To swap in real timings: run Whisper with word timestamps on each rush (e.g.
// @remotion/install-whisper-cpp with tokenLevelTimestamps, or faster-whisper with
// word_timestamps=True) and paste each word's start/end here. Times below were
// aligned from a Whisper large-v3-turbo transcript plus the audio envelope; the
// lines marked "check" were hard to hear, so confirm them with the speakers.

export type WordTuple = [text: string, start: number, end: number, flags?: string];

export type Phrase = {
	rush: number;
	dir: 'rtl' | 'ltr';
	words: WordTuple[];
	translation: string;
};

export const CAPTIONS: Phrase[] = [
	// rush 1: hook
	{rush: 1, dir: 'rtl', words: [['ما', 0.0, 0.18], ['حبّينا', 0.18, 0.58], ['نعمل', 0.58, 0.92]], translation: "We didn't want to build"},
	{
		rush: 1,
		dir: 'rtl',
		words: [['الـ', 0.92, 1.02], ['usual', 1.02, 1.45, 'hz'], ['play', 1.45, 1.78], ['area', 1.78, 2.25]],
		translation: 'the usual play area',
	},
	{rush: 1, dir: 'rtl', words: [['حبّينا', 2.5, 2.95], ['نعمل', 2.95, 3.35]], translation: 'We wanted to create'},
	{
		rush: 1,
		dir: 'rtl',
		words: [['الـ', 3.35, 3.5], ['brand', 3.5, 3.8, 'h'], ['new', 3.8, 4.02, 'h'], ['concept', 4.02, 4.6, 'hz']],
		translation: 'a brand new concept',
	},

	// rush 2: name meaning
	{rush: 2, dir: 'rtl', words: [['Luciole', 0.0, 0.62, 'h'], ['كلمة', 0.62, 1.0], ['بالفرنسي', 1.0, 1.62]], translation: 'Luciole is a French word'},
	{rush: 2, dir: 'rtl', words: [['معناها', 1.65, 2.2], ['firefly', 2.25, 2.95, 'hz']], translation: 'that means "firefly"'},
	{rush: 2, dir: 'rtl', words: [['وهيدا', 3.3, 3.6], ['هوّي', 3.6, 3.8], ['الـ', 3.8, 3.9], ['concept', 3.9, 4.25, 'h']], translation: "And that's the concept:"},
	{rush: 2, dir: 'rtl', words: [['يكون', 4.88, 5.2], ['spark', 5.2, 5.5, 'hz'], ['light', 5.5, 5.82, 'h']], translation: 'to be a spark of light'},
	{
		rush: 2,
		dir: 'rtl',
		words: [['لكل', 5.85, 6.15], ['الولاد', 6.15, 6.6, 'h'], ['اللي', 6.6, 6.78], ['بيجوا', 6.78, 7.05], ['لعنّا', 7.05, 7.5]],
		translation: 'for every kid who comes to us',
	},

	// rush 3: what kids get (check: opening words "هيدا هوّي")
	{rush: 3, dir: 'rtl', words: [['هيدا', 0.3, 0.7], ['هوّي', 0.7, 1.0], ['الـ', 1.0, 1.15], ['space', 1.15, 1.85, 'h']], translation: 'This is the space'},
	{
		rush: 3,
		dir: 'rtl',
		words: [['لكل', 1.95, 2.2], ['ولد', 2.2, 2.45], ['ينمّي', 2.45, 2.78], ['الـ', 2.78, 2.86], ['creativity', 2.86, 3.35, 'hz'], ['تبعو', 3.35, 3.6]],
		translation: 'for every kid to grow their creativity',
	},
	{rush: 3, dir: 'rtl', words: [['يعمل', 3.6, 3.85], ['new', 3.85, 4.0], ['friends', 4.0, 4.3, 'h']], translation: 'make new friends'},
	{rush: 3, dir: 'rtl', words: [['بعيد', 4.3, 4.45], ['عن', 4.45, 4.55], ['الـ', 4.55, 4.6], ['screen', 4.6, 4.85, 'hz']], translation: 'away from screens'},

	// rush 4: parents (check: "يتهنّوا بقهوتهم" and "أصحابن")
	{rush: 4, dir: 'rtl', words: [['بنفس', 0.45, 0.8], ['الوقت', 0.8, 1.2]], translation: 'Meanwhile,'},
	{rush: 4, dir: 'rtl', words: [['الأهل', 1.2, 1.6, 'h'], ['بياخدوا', 1.6, 2.05], ['break', 2.05, 2.5, 'hz']], translation: 'parents take a break'},
	{
		rush: 4,
		dir: 'rtl',
		words: [['حتى', 2.85, 3.05], ['يقدروا', 3.05, 3.4], ['يتهنّوا', 3.4, 3.75], ['بقهوتهم', 3.75, 4.2, 'h']],
		translation: 'to enjoy their coffee',
	},
	{
		rush: 4,
		dir: 'rtl',
		words: [['وعندن', 4.7, 5.0], ['yummy', 5.0, 5.3, 'h'], ['bites', 5.3, 5.7, 'h'], ['مع', 5.75, 5.9], ['أصحابن', 5.9, 6.35]],
		translation: 'and yummy bites with friends',
	},

	// rush 5: me time
	{rush: 5, dir: 'rtl', words: [['وعنجد', 0.6, 1.1], ['في', 1.1, 1.25], ['بيت', 1.25, 1.55]], translation: "Honestly, it's a place"},
	{rush: 5, dir: 'rtl', words: [['بريّح', 1.55, 1.95, 'h'], ['الأهل', 1.95, 2.45]], translation: 'that lets parents relax'},
	{
		rush: 5,
		dir: 'ltr',
		words: [['to', 2.5, 2.62], ['find', 2.62, 2.95], ['their', 2.95, 3.15], ['me', 3.15, 3.45, 'hz'], ['time', 3.45, 4.0, 'h']],
		translation: 'ويلاقوا وقت لإلهن',
	},

	// rush 6: tagline
	{rush: 6, dir: 'rtl', words: [['هيدي', 0.68, 1.05], ['Luciole', 1.1, 1.7, 'hz']], translation: 'This is Luciole'},
	{rush: 6, dir: 'ltr', words: [['they', 1.72, 1.9], ['create,', 1.9, 2.3, 'h']], translation: 'هنّي بيبدعوا'},
	{
		rush: 6,
		dir: 'ltr',
		words: [['you', 2.35, 2.5], ['pause', 2.5, 2.8, 'h'], ['&', 2.8, 2.95], ['connect', 2.95, 3.4, 'hz']],
		translation: 'وإنتو بترتاحوا وبتتواصلوا',
	},
];

// ---------------------------------------------------------------------------
// 3. HIGHLIGHT BADGES (Effects.tsx)
// ---------------------------------------------------------------------------
// Pop-up badges for the key points. `icon` is a file in public/reel/icons (Twemoji
// SVGs, named by codepoint). `strike` draws a line through the text after it lands.

export type Badge = {
	rush: number;
	at: number;
	duration: number;
	icon: string;
	text: string;
	strike?: boolean;
};

export const BADGES: Badge[] = [
	{rush: 1, at: 1.0, duration: 1.4, icon: '274c', text: 'The usual play area', strike: true},
	{rush: 1, at: 3.45, duration: 1.25, icon: '2705', text: 'Brand new concept'},
	{rush: 2, at: 1.0, duration: 1.2, icon: '1f1eb-1f1f7', text: 'Luciole = Firefly'}, // clears before the firefly card
	{rush: 3, at: 4.3, duration: 1.2, icon: '1f4f5', text: 'Screen-free fun'},
	{rush: 5, at: 2.55, duration: 1.5, icon: '1f60c', text: "Parents' me time"},
];

// ---------------------------------------------------------------------------
// 4. BRAND (Branding.tsx)
// ---------------------------------------------------------------------------
// TODO before publishing: confirm the real Instagram handle.
export const BRAND = {
	name: 'Luciole',
	handle: '@luciole',
	tagline: 'They create. You pause & connect.',
	taglineAr: 'هنّي بيبدعوا، وإنتو بترتاحوا',
};

/** Optional music bed, e.g. 'reel/music.mp3'. Kept low under the voices. */
export const MUSIC: string | null = null;
export const MUSIC_VOLUME = 0.12;
