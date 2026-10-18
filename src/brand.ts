import {continueRender, delayRender, staticFile} from 'remotion';

// Brand fonts (LUCIOLE brand guidelines) ship in public/fonts so renders never depend
// on reaching a font CDN:
//   Grown          display / headings
//   Manrope Bold   Latin captions and body
//   Arabic: the guidelines specify 29LT Azer (commercial, not in the repo). Cairo Bold
//   stands in; to switch, drop the Azer file in public/fonts and point ARABIC_FONT at it.
const ARABIC = 'U+0600-06FF, U+0750-077F, U+0870-088E, U+0890-0891, U+0898-08E1, U+08E3-08FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE70-FE74, U+FE76-FEFC';
const ARABIC_FONT = 'fonts/Cairo-Arabic-700.woff2';
const faces = [
	new FontFace('Grown', `url(${staticFile('fonts/Grown-Regular.ttf')}) format('truetype')`, {weight: '400'}),
	// Grown's comma and apostrophe are tiny dots that read as full stops at headline size,
	// so those two characters come from Manrope instead.
	new FontFace('Grown', `url(${staticFile('fonts/Manrope-Bold.ttf')}) format('truetype')`, {weight: '400', unicodeRange: 'U+002C, U+2019'}),
	new FontFace('Manrope', `url(${staticFile('fonts/Manrope-Bold.ttf')}) format('truetype')`, {weight: '700'}),
	new FontFace('LucioleArabic', `url(${staticFile(ARABIC_FONT)})`, {weight: '700', unicodeRange: ARABIC}),
];
const handle = delayRender('Loading brand fonts');
Promise.all(faces.map((f) => f.load()))
	.then((loaded) => {
		loaded.forEach((f) => document.fonts.add(f));
		continueRender(handle);
	})
	.catch((err) => {
		console.error(err);
		continueRender(handle);
	});

/** Manrope for Latin, falling through to the Arabic face, so mixed lines need one stack. */
export const sans = 'Manrope, LucioleArabic, sans-serif';
export const display = 'Grown, Georgia, serif';

// Brand palette (LUCIOLE brand guidelines, page 07)
export const GOLD = '#b7905d';
export const BRONZE = '#9a6b3a';
export const OLIVE = '#8f7d60';
export const SAND = '#cbc3a8';
export const CREAM = '#edece3';
export const CHARCOAL = '#292929';
