import {continueRender, delayRender, staticFile} from 'remotion';

// Fonts ship in public/fonts so renders never depend on reaching Google Fonts.
const faces = [
	new FontFace('Anton', `url(${staticFile('fonts/Anton-Regular.ttf')}) format('truetype')`, {weight: '400'}),
	new FontFace('Montserrat', `url(${staticFile('fonts/Montserrat-Variable.ttf')}) format('truetype')`, {weight: '100 900'}),
];
const handle = delayRender('Loading fonts');
Promise.all(faces.map((f) => f.load()))
	.then((loaded) => {
		loaded.forEach((f) => document.fonts.add(f));
		continueRender(handle);
	})
	.catch((err) => {
		console.error(err);
		continueRender(handle);
	});

export const display = 'Anton, Impact, sans-serif';
export const body = 'Montserrat, Arial, sans-serif';

export const C = {
	red: '#E31B23',
	redDeep: '#A50F15',
	charcoal: '#121212',
	white: '#FFFFFF',
};

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// Scene boundaries in frames. The music runs at 120 BPM (a beat every 15
// frames), so every cut lands on a downbeat.
export const BEAT = 15;
export const SCENES = {
	intro: {from: 0, duration: 90},
	offer: {from: 90, duration: 150},
	feature: {from: 240, duration: 120},
	outro: {from: 360, duration: 90},
};
export const DURATION = 450;

/** Frames each brush wipe takes; the cut happens at its midpoint, when the screen is covered. */
export const WIPE = 18;
