/**
 * L'Atelier tour: a music-driven walk through Luciole's workshop room, cut on the beat.
 *
 * Every shot lasts a whole number of beats, so cuts land on the music. BEAT matches the
 * bed from scripts/make_reel_music.py (it fits whole bars to the body length).
 *
 * Clips in public/atelier/ are converted with scripts/dv_convert.sh (each clip's own Dolby
 * Vision metadata, no grading). They play silent: the rushes only carry room chatter.
 *   a_sign IMG_4536 (rotated upright)  a_room IMG_4527   a_paint IMG_4516   a_tubes IMG_4523
 *   a_aprons IMG_4519   a_figs IMG_4525   a_pencils IMG_4532   a_boards IMG_4518
 *   a_lego IMG_4529   a_minifig IMG_4550   a_puzzle IMG_4530   a_games IMG_4552   a_wall IMG_4535
 */

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

/** Seconds per beat (about 109 BPM). */
export const BEAT = 0.55;

// focus: where the interesting detail sits (0..1), so the slow push heads towards it.
// sparkle: gold firefly specks over the shot (brand motif).
export type Shot = {clip: string; from: number; beats: number; focus?: [number, number]; sparkle?: boolean};

export const SHOTS: Shot[] = [
	{clip: 'a_sign', from: 1.0, beats: 4, focus: [0.5, 0.45], sparkle: true},
	{clip: 'a_room', from: 4.0, beats: 8, focus: [0.5, 0.5]},
	{clip: 'a_paint', from: 1.0, beats: 4},
	{clip: 'a_tubes', from: 4.2, beats: 4},
	{clip: 'a_aprons', from: 0.3, beats: 4},
	{clip: 'a_figs', from: 0.0, beats: 4},
	{clip: 'a_pencils', from: 0.8, beats: 2},
	{clip: 'a_boards', from: 1.0, beats: 2},
	{clip: 'a_lego', from: 0.5, beats: 4},
	{clip: 'a_minifig', from: 0.4, beats: 4},
	{clip: 'a_puzzle', from: 3.5, beats: 4},
	{clip: 'a_games', from: 0.5, beats: 4},
	{clip: 'a_wall', from: 1.0, beats: 8, sparkle: true},
];

// Titles, placed by shot index and lasting `beats` (they may span several shots).
export type Title = {shot: number; beats: number; text: string; kicker?: string};

export const TITLES: Title[] = [
	{shot: 1, beats: 8, kicker: 'Welcome to', text: 'L’Atelier'},
	{shot: 2, beats: 4, text: 'Paint in every colour'},
	{shot: 3, beats: 4, text: 'Brushes, tubes & more'},
	{shot: 4, beats: 4, text: 'An apron for every little artist'},
	{shot: 5, beats: 4, text: 'Figurines waiting for colour'},
	{shot: 6, beats: 4, text: 'Draw, doodle, sketch'},
	{shot: 8, beats: 8, text: 'Build anything'},
	{shot: 10, beats: 4, text: 'Puzzles & brain games'},
	{shot: 11, beats: 4, text: 'Games for every age'},
	{shot: 12, beats: 8, kicker: 'Chaque enfant est une étincelle', text: 'Every child is a spark'},
];

/** Seconds of logo outro after the last shot (last frame frozen underneath). */
export const OUTRO = 3.0;
export const OUTRO_NOTE = 'L’Atelier at Luciole';

export const MUSIC = 'atelier/music/atelier-bed.mp3';
export const MUSIC_LEVELS = {body: 0.8, outro: 0.85};
