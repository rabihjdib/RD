import {continueRender, delayRender, staticFile} from 'remotion';

// Fonts ship in public/fonts (copied from @fontsource) so renders never depend on a CDN.
//   Fredoka            rounded headlines and buttons, matching the soft cloud identity
//   Plus Jakarta Sans  eyebrows, body copy and trust lines
const faces = [
	new FontFace('Fredoka', `url(${staticFile('fonts/fredoka-latin-600-normal.woff2')}) format('woff2')`, {weight: '600'}),
	new FontFace('Plus Jakarta Sans', `url(${staticFile('fonts/plus-jakarta-sans-latin-500-normal.woff2')}) format('woff2')`, {weight: '500'}),
	new FontFace('Plus Jakarta Sans', `url(${staticFile('fonts/plus-jakarta-sans-latin-700-normal.woff2')}) format('woff2')`, {weight: '700'}),
	new FontFace('Plus Jakarta Sans', `url(${staticFile('fonts/plus-jakarta-sans-latin-800-normal.woff2')}) format('woff2')`, {weight: '800'}),
];
const handle = delayRender('Loading Chez Les Petits fonts');
Promise.all(faces.map((f) => f.load()))
	.then((loaded) => {
		loaded.forEach((f) => document.fonts.add(f));
		continueRender(handle);
	})
	.catch((err) => {
		console.error(err);
		continueRender(handle);
	});

export const display = 'Fredoka, sans-serif';
export const body = '"Plus Jakarta Sans", sans-serif';

export const INK = '#1d1d22';
export const GREY = '#4b4f58';
export const CTA = '#14a3e8';

// One pastel world per category family; `accent` colours the eyebrow, icons and brand names.
export const PALETTES = {
	blue: {bg: '#dcefff', tint: '#b8dcf7', accent: '#1a8fd6', icon: '#1a8fd6'},
	pink: {bg: '#ffe3e8', tint: '#f9c7d1', accent: '#e0496b', icon: '#e0496b'},
	lime: {bg: '#eef5d8', tint: '#dfee9c', accent: '#6b8f00', icon: '#8db31d'},
};
export type PaletteName = keyof typeof PALETTES;
