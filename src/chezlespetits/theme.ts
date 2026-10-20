import {continueRender, delayRender, staticFile} from 'remotion';

// Nunito ships in public/fonts (copied from @fontsource/nunito) so renders never depend
// on reaching a font CDN. Rounded terminals read soft and friendly for a baby brand.
const faces = [
	new FontFace('Nunito', `url(${staticFile('fonts/nunito-latin-600-normal.woff2')}) format('woff2')`, {weight: '600'}),
	new FontFace('Nunito', `url(${staticFile('fonts/nunito-latin-800-normal.woff2')}) format('woff2')`, {weight: '800'}),
	new FontFace('Nunito', `url(${staticFile('fonts/nunito-latin-900-normal.woff2')}) format('woff2')`, {weight: '900'}),
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

export const font = 'Nunito, sans-serif';

export const NAVY = '#1d2a48';
export const CREAM = '#fbf6ee';
export const BLUSH = '#f6ddd3';
export const SAGE = '#dfe8db';
export const BUTTER = '#f7d774';
export const FLAG_RED = '#e0262b';
export const CEDAR = '#00a650';
