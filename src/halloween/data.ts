/**
 * Luciole Halloween reel: everything you swap per edit lives here.
 *
 * TIME CONVENTION: every time is in SECONDS INSIDE THE CLIP it names (what a player
 * shows for that file). timeline.ts maps them onto the edit, so trims and reorders
 * never mean re-timing captions, B-roll or badges.
 *
 * Clips in public/halloween/ are converted with scripts/dv_convert.sh, which applies each
 * clip's own Dolby Vision metadata the way an iPhone displays it (no grading). Talking
 * clips carry the cleaned voice from scripts/isolate_voice.sh:
 *   h1 IMG_4767  Halloween this year? / three days, Oct 30 to Nov 1
 *   h2 IMG_4769  costume? / the outfit is on us
 *   h3 IMG_4771  how? / kids create their own outfit
 *   h4 IMG_4776  Wood Wizard collab
 *   h5 IMG_4781  how to book / WhatsApp
 *   b1 IMG_4756  B-roll: kids in the space (silent)
 *   b2 IMG_4755  B-roll: kids at the shelves (silent)
 *   w1 IMG_4820  B-roll: Wood Wizard workshop, wide (silent)
 *   w2 IMG_4826  B-roll: Wood Wizard workshop, hammering close-up (silent)
 */

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// ---------------------------------------------------------------------------
// 1. TALKING CUTS (picture + sound, in playback order)
// ---------------------------------------------------------------------------
// focus: where her face sits (0..1) so punch-ins zoom towards it.
// questionGain: level for the off-camera question in this clip (1 = as recorded).
export type Cut = {clip: string; from: number; to: number; focus: [number, number]; questionGain?: number};

export const CUTS: Cut[] = [
	{clip: 'h1', from: 0.0, to: 6.15, focus: [0.5, 0.3]}, // hook question + first half of answer
	{clip: 'h1', from: 6.5, to: 9.5, focus: [0.5, 0.32]}, // jump cut over a breath: the dates
	{clip: 'h2', from: 0.0, to: 4.0, focus: [0.5, 0.3]},
	{clip: 'h3', from: 0.0, to: 5.15, focus: [0.5, 0.3]},
	{clip: 'h4', from: 1.72, to: 6.1, focus: [0.5, 0.3]}, // trims a stray off-camera comment
	{clip: 'h5', from: 0.1, to: 5.95, focus: [0.5, 0.3], questionGain: 0.6}, // question was 5 dB hot; runs past the last digit (5.6s)
];

/** Seconds the last frame is held (frozen, muted) under the logo outro. */
export const END_HOLD = 3.0;

// ---------------------------------------------------------------------------
// 2. B-ROLL CUTAWAYS (picture only, laid over the talking audio)
// ---------------------------------------------------------------------------
// at: the moment in a talking clip where the cutaway starts; from: start inside the
// B-roll file; duration in seconds.
export type BRoll = {src: string; from: number; duration: number; at: {clip: string; sec: number}};

export const BROLL: BRoll[] = [
	{src: 'b1', from: 0.0, duration: 1.5, at: {clip: 'h1', sec: 4.65}}, // "three wonderful days"
	{src: 'b2', from: 0.3, duration: 2.6, at: {clip: 'h3', sec: 2.45}}, // "their own outfit..."
	// Wood Wizard workshop footage over "We're teaming up with Wood Wizard, a wood workshop for the kids"
	{src: 'w1', from: 0.3, duration: 1.45, at: {clip: 'h4', sec: 2.5}}, // instructor with the kids at the benches
	{src: 'w2', from: 0.1, duration: 1.1, at: {clip: 'h4', sec: 3.95}}, // close-up: hammering
	{src: 'w1', from: 6.6, duration: 1.0, at: {clip: 'h4', sec: 5.05}}, // rows of kids building, into the next cut
];

// ---------------------------------------------------------------------------
// 3. SUBTITLES (English)
// ---------------------------------------------------------------------------
// speaker 'q' = off-camera question (shown as a pill), 'a' = the host.
// Words are revealed across [start, end]; mark words with * to highlight them in gold.
// Times come from lip movement plus the audio envelope; the speech is Lebanese Arabic
// with English mixed in, so the subtitles are translations, timed per phrase.
export type Phrase = {clip: string; speaker: 'q' | 'a'; start: number; end: number; text: string};

export const CAPTIONS: Phrase[] = [
	{clip: 'h1', speaker: 'q', start: 0.15, end: 2.55, text: 'Are you doing anything for *Halloween this year?'},
	{clip: 'h1', speaker: 'a', start: 2.6, end: 3.2, text: 'Of course!'},
	{clip: 'h1', speaker: 'a', start: 3.2, end: 4.6, text: 'At *Luciole, we’ll have'},
	{clip: 'h1', speaker: 'a', start: 4.6, end: 6.15, text: '*three wonderful days in a row,'},
	{clip: 'h1', speaker: 'a', start: 6.55, end: 9.45, text: 'from *October *30 to *November *1!'},

	{clip: 'h2', speaker: 'q', start: 0.1, end: 1.9, text: 'Do the kids need to come in *costume?'},
	{clip: 'h2', speaker: 'a', start: 2.0, end: 3.85, text: 'Of course not, the *outfit’s *on *us!'},

	{clip: 'h3', speaker: 'q', start: 0.05, end: 0.6, text: 'How so?'},
	{clip: 'h3', speaker: 'a', start: 0.95, end: 2.4, text: 'The kids will be *creating'},
	{clip: 'h3', speaker: 'a', start: 2.4, end: 3.4, text: 'their very own *outfit,'},
	{clip: 'h3', speaker: 'a', start: 3.4, end: 5.1, text: 'based on the *character they love.'},

	{clip: 'h4', speaker: 'a', start: 1.8, end: 3.9, text: 'We’re teaming up with *Wood *Wizard,'},
	{clip: 'h4', speaker: 'a', start: 3.9, end: 6.0, text: 'a *wood *workshop for the kids!'},

	{clip: 'h5', speaker: 'q', start: 0.2, end: 1.0, text: 'How do we book?'},
	{clip: 'h5', speaker: 'a', start: 1.4, end: 3.6, text: 'You can book on *WhatsApp'},
	{clip: 'h5', speaker: 'a', start: 3.95, end: 5.65, text: '*81 *540 *282'},
];

// ---------------------------------------------------------------------------
// 4. BADGES (top of frame) and ICON POPS
// ---------------------------------------------------------------------------
// icon: file in public/halloween/icons (Twemoji, named by codepoint).
export type Badge = {clip: string; at: number; duration: number; icon: string; text: string};

export const BADGES: Badge[] = [
	{clip: 'h1', at: 0.1, duration: 2.5, icon: '1f383', text: 'Halloween at Luciole'},
	{clip: 'h1', at: 6.6, duration: 2.85, icon: '1f5d3', text: 'Oct 30 to Nov 1'},
	{clip: 'h2', at: 2.4, duration: 1.6, icon: '1f3ad', text: 'Outfits are on us'},
	{clip: 'h4', at: 2.0, duration: 1.9, icon: '1fab5', text: 'Wood Wizard workshop'},
	{clip: 'h5', at: 3.95, duration: 1.5, icon: '1f4ac', text: 'WhatsApp 81 540 282'},
];

// A spoken (subtitle) word that pops a small icon card beside her.
export type IconPop = {word: string; icon: string; x: number; y: number; tilt: number};

export const ICON_POPS: IconPop[] = [
	{word: 'costume', icon: '1f47b', x: 0.8, y: 0.42, tilt: 7},
	{word: 'character', icon: '1f9b8', x: 0.22, y: 0.24, tilt: -7},
	{word: 'love', icon: '1f383', x: 0.78, y: 0.24, tilt: 6},
];

// ---------------------------------------------------------------------------
// 5. OUTRO + MUSIC
// ---------------------------------------------------------------------------
export const OUTRO_NOTE = 'Halloween at Luciole · Oct 30 to Nov 1';

// Original Halloween bed from scripts/make_halloween_music.py (license-free).
export const MUSIC: string | null = 'halloween/music/halloween-bed.mp3';
export const MUSIC_LEVELS = {speech: 0.13, gaps: 0.4, outro: 0.85};
