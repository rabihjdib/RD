import type {BeatCard, BeatReelConfig, BeatShot, BeatTitle} from '../beat/BeatReel';

/**
 * "We're officially open" reel: a fast montage of the whole place (sign, café, brunch,
 * L'Atelier with the kids), then the opening hours as centred cards, then the logo outro
 * with WhatsApp and the location.
 *
 * Hours are the ones in the client's Hours & Booking reel (Reel07): closed Mondays; Café &
 * Bistro Tue to Sun 8am to 10pm; Kids Atelier Tue to Fri 3pm to 10pm, Sat & Sun 10am to 10pm.
 *
 * Every shot lasts a whole number of beats (0.55 s, the bed from scripts/make_reel_music.py,
 * 13 bars before the outro). Clips are reused from the other reels, already converted with
 * scripts/dv_convert.sh (no grading); `clip` is the path under public/ without .mp4.
 */

const SHOTS: BeatShot[] = [
	{clip: 'atelier/a_sign', from: 1.0, beats: 4, sparkle: true}, // the Luciole sign
	{clip: 'halloween/b1', from: 0.0, beats: 4}, // a boy cheering in L'Atelier
	{clip: 'cafe/c_barista', from: 1.2, beats: 4},
	{clip: 'brunch/b_wide', from: 1.0, beats: 4},
	{clip: 'brunch/b_room', from: 0.5, beats: 4}, // the buffet with a full room
	{clip: 'halloween/b2', from: 1.2, beats: 4}, // kids at the shelves
	{clip: 'birthday/p_craft', from: 1.0, beats: 4}, // craft table
	{clip: 'halloween/w1', from: 3.0, beats: 4}, // wood workshop
	{clip: 'cafe/c_lamps', from: 1.5, beats: 4}, // behind "Monday"
	{clip: 'cafe/c_chandelier', from: 0.5, beats: 8}, // behind "Tuesday to Friday"
	{clip: 'atelier/a_wall', from: 1.0, beats: 8, sparkle: true}, // behind "Saturday & Sunday"
];

const TITLES: BeatTitle[] = [
	{shot: 0, beats: 8, kicker: 'It’s official · Luciole', text: 'We’re open!'},
	{shot: 2, beats: 12, kicker: 'Café & Bistro', text: 'Coffee, brunch & more'},
	{shot: 5, beats: 12, kicker: 'L’Atelier', text: 'Where kids create'},
];

const CARDS: BeatCard[] = [
	{shot: 8, beats: 4, kicker: 'Opening hours', heading: 'Monday', rows: [{value: ['Closed'], gold: true}]},
	{
		shot: 9,
		beats: 8,
		kicker: 'Opening hours',
		heading: 'Tuesday to Friday',
		rows: [
			{label: 'Café & Bistro', value: ['8am to 10pm']},
			{label: 'Kids Atelier', value: ['3pm to 10pm']},
		],
	},
	{
		shot: 10,
		beats: 8,
		kicker: 'Opening hours',
		heading: 'Saturday & Sunday',
		rows: [
			{label: 'Café & Bistro', value: ['8am to 10pm']},
			{label: 'Kids Atelier', value: ['10am to 10pm']},
		],
	},
];

export const OPENING: BeatReelConfig = {
	id: 'opening',
	fps: 30,
	beat: 0.55,
	shots: SHOTS,
	titles: TITLES,
	cards: CARDS,
	whooshAt: [2, 5, 8],
	sfx: [{shot: 0, offset: 0.1, src: 'reel/sfx/sparkle.wav', volume: 0.5}],
	titleSfx: {src: 'cafe/sfx/chime.wav', volume: 0.3},
	outro: 4.0, // a little longer, so the WhatsApp number and location can be read
	outroNote: 'Chiha Building · 1st floor · Jounieh Souks',
	music: 'opening/music/opening-bed.mp3',
	musicLevels: {body: 0.75, outro: 0.85},
};
