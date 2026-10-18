/**
 * Brunch & salad bar reel: a music-driven walk along Luciole's buffet, cut on the beat,
 * with titles carrying the message (after the gym, coffee then brunch with friends, the
 * salad bar every day, the full brunch bar, kids at L'Atelier, special events).
 *
 * Every shot lasts a whole number of beats so cuts land on the music. BEAT matches the bed
 * from scripts/make_reel_music.py (16 bars at 109.1 BPM before the outro).
 *
 * Clips are converted with scripts/dv_convert.sh (each clip's own Dolby Vision metadata, no
 * grading) and play silent. `clip` is the path under public/ without .mp4:
 *   brunch/b_wide IMG_4863   brunch/b_pan IMG_4864     brunch/b_cups IMG_4865
 *   brunch/b_wraps IMG_4867  brunch/b_drinks IMG_4868  brunch/b_pastry IMG_4871
 *   brunch/b_sand IMG_4872   brunch/b_room IMG_4912    brunch/b_salad1 IMG_5049
 *   brunch/b_salad2 IMG_5050 brunch/b_guests IMG_5051  brunch/b_chefs IMG_5056
 *   brunch/b_salad3 IMG_5063 atelier/* from the L'Atelier tour
 */

export const FPS = 30;

/** Seconds per beat (about 109 BPM). */
export const BEAT = 0.55;

export type Shot = {clip: string; from: number; beats: number; focus?: [number, number]; sparkle?: boolean};

export const SHOTS: Shot[] = [
	{clip: 'brunch/b_wide', from: 1.0, beats: 4, sparkle: true}, // pastry tiers into the buffet
	{clip: 'brunch/b_pastry', from: 2.5, beats: 4},
	{clip: 'brunch/b_drinks', from: 2.0, beats: 4},
	{clip: 'brunch/b_guests', from: 1.0, beats: 6}, // guests and kids filling plates
	{clip: 'brunch/b_salad1', from: 1.0, beats: 4},
	{clip: 'brunch/b_salad3', from: 2.6, beats: 4},
	{clip: 'brunch/b_salad2', from: 0.5, beats: 2},
	{clip: 'brunch/b_pan', from: 2.0, beats: 6}, // along the whole brunch bar
	{clip: 'brunch/b_wraps', from: 1.0, beats: 4},
	{clip: 'brunch/b_sand', from: 2.0, beats: 4},
	{clip: 'brunch/b_cups', from: 1.5, beats: 4},
	{clip: 'atelier/a_room', from: 6.0, beats: 4},
	{clip: 'atelier/a_paint', from: 1.0, beats: 4},
	{clip: 'brunch/b_chefs', from: 0.5, beats: 4},
	{clip: 'brunch/b_room', from: 0.5, beats: 6, sparkle: true}, // the buffet with the full room behind
];

// Titles, placed by shot index and lasting `beats` (they may span several shots).
export type Title = {shot: number; beats: number; text: string; kicker?: string};

export const TITLES: Title[] = [
	{shot: 0, beats: 4, kicker: 'Luciole Café & Bistro', text: 'Brunch is served'},
	{shot: 1, beats: 8, kicker: 'After your gym', text: 'Morning coffee & breakfast'},
	{shot: 3, beats: 6, text: 'Brunch with your friends'},
	{shot: 4, beats: 10, kicker: 'Every day', text: 'Our salad bar'},
	{shot: 7, beats: 6, kicker: 'Now at Luciole', text: 'A full brunch bar'},
	{shot: 11, beats: 8, kicker: 'Meanwhile', text: 'The kids create at L’Atelier'},
	{shot: 13, beats: 10, kicker: 'Birthdays, gatherings & more', text: 'For your special events too'},
];

/** Seconds of logo outro after the last shot (last frame frozen underneath). */
export const OUTRO = 3.0;
export const OUTRO_NOTE = 'Salad bar daily · Brunch at Luciole';

export const MUSIC = 'brunch/music/brunch-bed.mp3';
export const MUSIC_LEVELS = {body: 0.8, outro: 0.85};
