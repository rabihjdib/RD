/**
 * Luciole birthday-party reel: everything you swap per edit lives here.
 *
 * TIME CONVENTION: every time is in SECONDS INSIDE THE CLIP it names. timeline.ts maps
 * them onto the edit, so trims and reorders never mean re-timing captions or overlays.
 *
 * Clips in public/birthday/ are converted with scripts/dv_convert.sh (each clip's own
 * Dolby Vision metadata, the way an iPhone displays it, no grading). Host clips carry the
 * cleaned voice from scripts/isolate_voice.sh; party clips keep their natural sound.
 *   t1 IMG_4669  "Your kid's birthday, all in one place"
 *   t2 IMG_4672  "No running around, you get to celebrate and relax too"
 *   t3 IMG_4679  "The whole place is booked just for you"
 *   t4 IMG_4681  "We take care of all the decoration and setup"
 *   t5 IMG_4684  "Book 3 weeks ahead, and leave the rest to us"
 *   p_room  IMG_4859  party room, balloon arch     p_show  IMG_4963  science show
 *   p_watch IMG_4962  kids watching                p_craft IMG_4943  workshop
 *   p_cake  IMG_5018  cake and the hug              p_space IMG_4912  buffet and full room
 *   buffet-photo.jpg  the buffet spread (still photo)
 *   p_sing  IMG_5019  everyone singing             p_food  IMG_5051  buffet
 */

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// ---------------------------------------------------------------------------
// 1. MAIN CUTS (picture + sound, in playback order)
// ---------------------------------------------------------------------------
// volume: level of this clip's own sound (host voice 1, party ambience lower).
// duckMusic: the music dips under this clip's sound (a countdown, the singing).
export type Cut = {clip: string; from: number; to: number; focus: [number, number]; volume?: number; duckMusic?: boolean};

export const CUTS: Cut[] = [
	{clip: 't1', from: 0.25, to: 2.32, focus: [0.5, 0.25]}, // hook
	{clip: 't2', from: 1.42, to: 4.17, focus: [0.5, 0.25]},
	{clip: 't3', from: 0.0, to: 3.6, focus: [0.45, 0.3]}, // runs into her pause so the workshop and buffet shots breathe
	{clip: 't4', from: 1.2, to: 4.25, focus: [0.5, 0.3]},
	// party montage
	{clip: 'p_show', from: 6.9, to: 8.9, focus: [0.5, 0.4], volume: 1, duckMusic: true}, // "one, two, three!"
	{clip: 'p_watch', from: 1.0, to: 3.0, focus: [0.5, 0.5], volume: 0.35},
	{clip: 'p_cake', from: 3.0, to: 5.8, focus: [0.5, 0.35], volume: 0.4}, // the hug
	{clip: 'p_sing', from: 0.4, to: 5.1, focus: [0.5, 0.4], volume: 1, duckMusic: true}, // "Happy birthday to you"
	{clip: 't5', from: 0.0, to: 3.15, focus: [0.5, 0.3]},
];

/** Seconds the last frame is held (frozen, muted) under the logo outro. */
export const END_HOLD = 3.0;

// ---------------------------------------------------------------------------
// 2. B-ROLL CUTAWAYS (picture only, laid over the host's voice)
// ---------------------------------------------------------------------------
// src: a clip name, or an image file in public/birthday/ (e.g. 'buffet-photo.jpg').
export type BRoll = {src: string; from: number; duration: number; at: {clip: string; sec: number}};

export const BROLL: BRoll[] = [
	{src: 'p_food', from: 2.0, duration: 1.5, at: {clip: 't2', sec: 2.6}}, // parents relaxing at the buffet
	// "The whole place is booked just for you": the workshop, then the buffet
	{src: 'p_craft', from: 3.5, duration: 0.7, at: {clip: 't3', sec: 0.9}}, // kids at the craft table
	{src: 'p_space', from: 1.85, duration: 1.25, at: {clip: 't3', sec: 1.6}}, // moving along the buffet, the full room behind
	{src: 'buffet-photo.jpg', from: 0, duration: 0.75, at: {clip: 't3', sec: 2.85}}, // the whole buffet spread (photo, slow push-in)
	{src: 'p_room', from: 5.0, duration: 1.5, at: {clip: 't4', sec: 2.7}}, // balloon arch and science table
];

// ---------------------------------------------------------------------------
// 3. SUBTITLES (English). Mark words with * to highlight them in gold.
// ---------------------------------------------------------------------------
export type Phrase = {clip: string; start: number; end: number; text: string};

export const CAPTIONS: Phrase[] = [
	{clip: 't1', start: 0.32, end: 2.25, text: 'Your kid’s *birthday, all in *one *place!'},
	{clip: 't2', start: 1.52, end: 2.45, text: 'No running around,'},
	{clip: 't2', start: 2.45, end: 4.1, text: 'you get to *celebrate and *relax too!'},
	{clip: 't3', start: 0.05, end: 1.0, text: 'The *whole *place'},
	{clip: 't3', start: 1.0, end: 2.5, text: 'is booked just for *you!'},
	{clip: 't4', start: 1.27, end: 2.6, text: 'And of course, we take care'},
	{clip: 't4', start: 2.6, end: 4.18, text: 'of all the *decoration and *setup!'},
	{clip: 'p_show', start: 7.05, end: 8.6, text: '*One, *two, *three!'},
	{clip: 'p_sing', start: 0.5, end: 4.9, text: '*Happy *birthday to you!'},
	{clip: 't5', start: 0.0, end: 1.7, text: 'Don’t forget to book *3 *weeks ahead,'},
	{clip: 't5', start: 1.7, end: 3.0, text: 'and leave the *rest *to *us!'},
];

// ---------------------------------------------------------------------------
// 4. BADGES (top of frame) and ICON POPS
// ---------------------------------------------------------------------------
export type Badge = {clip: string; at: number; duration: number; icon: string; text: string};

export const BADGES: Badge[] = [
	{clip: 't1', at: 0.3, duration: 2.0, icon: '1f382', text: 'Birthdays at Luciole'},
	{clip: 't4', at: 1.4, duration: 1.3, icon: '1f388', text: 'Decor & setup included'},
	{clip: 't5', at: 0.1, duration: 3.0, icon: '1f5d3', text: 'Book 3 weeks ahead'},
];

export type IconPop = {word: string; icon: string; x: number; y: number; tilt: number};

export const ICON_POPS: IconPop[] = [
	{word: 'relax', icon: '1f60c', x: 0.78, y: 0.24, tilt: 7},
	{word: 'three', icon: '1f9ea', x: 0.22, y: 0.24, tilt: -7},
	{word: 'happy', icon: '1f389', x: 0.78, y: 0.22, tilt: 6},
];

// ---------------------------------------------------------------------------
// 5. OUTRO + MUSIC
// ---------------------------------------------------------------------------
export const OUTRO_NOTE = 'Birthdays at Luciole · Book 3 weeks ahead';

// Upbeat kids bed from scripts/make_reel_music.py (original, license-free).
export const MUSIC: string | null = 'birthday/music/birthday-bed.mp3';
export const MUSIC_LEVELS = {speech: 0.13, gaps: 0.42, outro: 0.55};
