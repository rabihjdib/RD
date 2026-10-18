import type {BeatReelConfig, BeatShot, BeatTitle} from '../beat/BeatReel';

/**
 * Café tour reel: a music-driven walk around Luciole's café, cut on the beat, with titles for
 * the message (full coffee & tea menu, high-end coffee grains, the best barista).
 *
 * Every shot lasts a whole number of beats so cuts land on the music; the bed from
 * scripts/make_reel_music.py has 12 bars at 109.1 BPM before the outro (0.55 s per beat).
 *
 * Clips are converted with scripts/dv_convert.sh (each clip's own Dolby Vision metadata, no
 * grading), lighting shots then through scripts/deflicker.sh, and play silent.
 * `clip` is the path under public/ without .mp4:
 *   cafe/c_wall IMG_4534 ("Créer des souvenirs, une tasse à la fois")   cafe/c_chandelier IMG_4538
 *   cafe/c_sconces IMG_4539   cafe/c_lamps IMG_4540   cafe/c_machine IMG_4541   cafe/c_teashelf IMG_4542
 *   cafe/c_teas1 IMG_4543 (grinder and beans)   cafe/c_teas2 IMG_4544 (tea domes)
 *   cafe/c_artwall IMG_4547 (unused)   cafe/c_barista IMG_4909
 */

const SHOTS: BeatShot[] = [
	{clip: 'cafe/c_wall', from: 0.0, beats: 4, sparkle: true}, // the café's own motto on the wall
	{clip: 'cafe/c_machine', from: 0.5, beats: 8}, // along the espresso machine to the grinders
	{clip: 'cafe/c_teas1', from: 0.0, beats: 2}, // grinder full of beans (before the pan to the tea domes)
	{clip: 'cafe/c_barista', from: 0.9, beats: 10}, // barista at the machine
	{clip: 'cafe/c_teashelf', from: 0.0, beats: 4}, // teapots and tea tins
	{clip: 'cafe/c_teas2', from: 1.5, beats: 6}, // tea domes
	{clip: 'cafe/c_chandelier', from: 0.5, beats: 4},
	{clip: 'cafe/c_sconces', from: 1.0, beats: 2},
	{clip: 'cafe/c_lamps', from: 1.5, beats: 2},
	{clip: 'cafe/c_wall', from: 4.5, beats: 6, sparkle: true}, // hearts and coffee cups drawn on the wall
];

// Titles, placed by shot index and lasting `beats` (they may span several shots).
const TITLES: BeatTitle[] = [
	{shot: 0, beats: 4, kicker: 'Luciole Café', text: 'Making memories, one cup at a time'},
	{shot: 1, beats: 8, kicker: 'For coffee & tea fans', text: 'A full menu'},
	{shot: 2, beats: 2, kicker: 'Only the finest', text: 'High-end coffee grains'},
	{shot: 3, beats: 10, kicker: 'Every cup crafted by', text: 'The best barista'},
	{shot: 4, beats: 10, kicker: 'For tea lovers', text: 'Our tea selection'},
	{shot: 6, beats: 8, kicker: 'Welcome to', text: 'Luciole Café'},
	{shot: 9, beats: 6, kicker: 'Coffee, tea & a moment for you', text: 'Your pause starts here'},
];

export const CAFE: BeatReelConfig = {
	id: 'cafe',
	fps: 30,
	beat: 0.55,
	shots: SHOTS,
	titles: TITLES,
	whooshAt: 6, // into the room
	outro: 3.0,
	outroNote: 'Luciole Café · Coffee & tea',
	music: 'cafe/music/cafe-bed.mp3',
	musicLevels: {body: 0.8, outro: 0.85},
};
