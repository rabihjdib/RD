import {continueRender, delayRender, staticFile} from 'remotion';

// Fonts ship in public/fonts so renders never depend on reaching Google Fonts.
const faces = [
	new FontFace('Anton', `url(${staticFile('fonts/Anton-400.woff2')}) format('woff2')`, {weight: '400'}),
	new FontFace('JetBrains Mono', `url(${staticFile('fonts/JetBrainsMono-500.woff2')}) format('woff2')`, {weight: '500'}),
	new FontFace('JetBrains Mono', `url(${staticFile('fonts/JetBrainsMono-700.woff2')}) format('woff2')`, {weight: '700'}),
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
export const mono = '"JetBrains Mono", monospace';

export const C = {
	blue: '#1E8BFF',
	blueHot: '#4FB8FF',
	magenta: '#FF2BD6',
	gunmetal: '#2A2F36',
	ink: '#05070B',
	white: '#F2F6FF',
};
