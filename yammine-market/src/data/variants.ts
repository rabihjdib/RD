import type {VariantProps} from '../types';

// The four campaign variants. Each is only data: swap clips, copy or badges here
// and the compositions pick it up. Clip slices must fit inside the source:
//   frozen-aisle 10.2 s · dairy-fridge 10.9 s · tea-aisle 8.5 s · milk-aisle 12.1 s
// Scene lengths: intro 3 s, offer 5 s (split across its clips), feature 4 s, outro 3 s.

const shared = {
	intro: {kicker: "DON'T MISS", subline: 'THIS WEEK AT YAMMINE MARKET'},
	headline: [
		{text: 'OUR WEEKLY', color: 'white'},
		{text: 'DEALS', color: 'red', scale: 1.55},
		{text: 'IN-STORE', color: 'white'},
	],
	feature: {highlight: 'PLENTY OF DEALS', highlightSub: 'AVAILABLE NOW!', pulseLabel: '%', pulseSublabel: 'OFF'},
	outro: {cta: 'VISIT US IN-STORE TODAY!', location: 'YAMMINE MARKET · MANSOURIEH'},
} satisfies Pick<VariantProps, 'intro' | 'headline' | 'feature' | 'outro'>;

/** Variant 1: overall supermarket shopping, shoppers pushing trolleys down the aisles. */
export const general: VariantProps = {
	...shared,
	name: 'General',
	energy: 'standard',
	category: 'ALL AISLES · ALL WEEK',
	badges: [
		{kind: 'tag', label: '%', sublabel: 'OFF', x: 70, y: 470, size: 250, delay: 20, rotate: -14},
		{kind: 'burst', label: 'HOT', sublabel: 'DEALS', x: 740, y: 430, size: 280, delay: 30, rotate: 10},
		{kind: 'bag', label: '%', x: 800, y: 760, size: 190, delay: 40, rotate: 8},
	],
	clips: {
		intro: {src: 'footage/frozen-aisle.mp4', start: 0, focus: '45% 50%', zoom: 'in'},
		offer: [
			{src: 'footage/dairy-fridge.mp4', start: 3, focus: '60% 50%', zoom: 'in'},
			{src: 'footage/frozen-aisle.mp4', start: 6.6, focus: '50% 50%', zoom: 'out'},
		],
		feature: {src: 'footage/milk-aisle.mp4', start: 0.5, focus: '40% 50%', zoom: 'in'},
		outro: {src: 'footage/tea-aisle.mp4', start: 0, zoom: 'out'},
	},
	music: 'audio/upbeat.wav',
};

/** Variant 2: the tea and hot drinks aisle, plus plant-based and packaged drinks. */
export const beverages: VariantProps = {
	...shared,
	name: 'Beverages',
	energy: 'standard',
	category: 'COFFEE · TEA · HOT DRINKS',
	intro: {...shared.intro, subline: 'YOUR FAVOURITE DRINKS FOR LESS'},
	badges: [
		{kind: 'burst', label: '%', sublabel: 'OFF', x: 60, y: 440, size: 270, delay: 20, rotate: -10},
		{kind: 'tag', label: 'SAVE', sublabel: 'MORE', x: 770, y: 480, size: 240, delay: 30, rotate: 14},
		{kind: 'bag', label: '%', x: 90, y: 780, size: 180, delay: 40, rotate: -8},
	],
	feature: {...shared.feature, highlightSub: 'ON EVERY CUP!'},
	clips: {
		intro: {src: 'footage/tea-aisle.mp4', start: 0, focus: '55% 50%', zoom: 'in'},
		offer: [
			{src: 'footage/tea-aisle.mp4', start: 3.4, focus: '60% 50%', zoom: 'out'},
			{src: 'footage/milk-aisle.mp4', start: 1, focus: '35% 50%', zoom: 'in'},
		],
		feature: {src: 'footage/milk-aisle.mp4', start: 6.2, focus: '50% 50%', zoom: 'in'},
		outro: {src: 'footage/tea-aisle.mp4', start: 5, zoom: 'out'},
	},
	music: 'audio/upbeat.wav',
};

/** Variant 3: chilled and fresh dairy, plus the everyday staples aisles. */
export const fresh: VariantProps = {
	...shared,
	name: 'Fresh',
	energy: 'standard',
	category: 'FRESH · CHILLED · EVERYDAY',
	intro: {...shared.intro, subline: 'FRESH PICKS, BETTER PRICES'},
	badges: [
		{kind: 'tag', label: '%', sublabel: 'OFF', x: 760, y: 440, size: 250, delay: 20, rotate: 12},
		{kind: 'burst', label: 'FRESH', sublabel: 'DEALS', x: 50, y: 470, size: 280, delay: 30, rotate: -8},
		{kind: 'bag', label: '%', x: 820, y: 790, size: 170, delay: 40, rotate: 10},
	],
	feature: {...shared.feature, highlightSub: 'ON YOUR ESSENTIALS!'},
	clips: {
		intro: {src: 'footage/dairy-fridge.mp4', start: 0, focus: '55% 50%', zoom: 'in'},
		offer: [
			{src: 'footage/dairy-fridge.mp4', start: 6, focus: '50% 50%', zoom: 'out'},
			{src: 'footage/milk-aisle.mp4', start: 8.4, focus: '50% 50%', zoom: 'in'},
		],
		feature: {src: 'footage/frozen-aisle.mp4', start: 6, focus: '50% 50%', zoom: 'in'},
		outro: {src: 'footage/dairy-fridge.mp4', start: 0, zoom: 'out'},
	},
	music: 'audio/upbeat.wav',
};

/** Variant 4: weekend flash sale. Faster cuts, harder music, scrolling tape and shake. */
export const flashSale: VariantProps = {
	...shared,
	name: 'FlashSale',
	energy: 'urgent',
	category: 'THIS WEEKEND ONLY',
	intro: {...shared.intro, subline: 'WEEKEND FLASH SALE'},
	headline: [
		{text: 'WEEKEND', color: 'white'},
		{text: 'FLASH SALE', color: 'red', scale: 1.3},
		{text: 'IN-STORE', color: 'white'},
	],
	badges: [
		{kind: 'burst', label: '%', sublabel: 'OFF', x: 60, y: 420, size: 290, delay: 10, rotate: -12},
		{kind: 'burst', label: 'LIMITED', sublabel: 'TIME', x: 740, y: 450, size: 270, delay: 18, rotate: 12},
		{kind: 'tag', label: 'HURRY', x: 760, y: 780, size: 210, delay: 26, rotate: 16},
	],
	feature: {highlight: 'PLENTY OF DEALS', highlightSub: 'ENDS SUNDAY!', pulseLabel: '%', pulseSublabel: 'OFF'},
	ticker: 'WEEKEND FLASH SALE  •  LIMITED TIME ONLY  •  IN-STORE NOW  •  ',
	clips: {
		intro: {src: 'footage/frozen-aisle.mp4', start: 3, focus: '60% 50%', zoom: 'in'},
		offer: [
			{src: 'footage/milk-aisle.mp4', start: 0, focus: '40% 50%', zoom: 'in'},
			{src: 'footage/dairy-fridge.mp4', start: 3.4, focus: '55% 50%', zoom: 'out'},
			{src: 'footage/tea-aisle.mp4', start: 1.5, focus: '45% 50%', zoom: 'in'},
		],
		feature: {src: 'footage/frozen-aisle.mp4', start: 6, focus: '50% 50%', zoom: 'in'},
		outro: {src: 'footage/milk-aisle.mp4', start: 4, zoom: 'out'},
	},
	music: 'audio/flash.wav',
};

export const variants = [
	{id: 'WeeklyDeals-General', props: general},
	{id: 'WeeklyDeals-Beverages', props: beverages},
	{id: 'WeeklyDeals-Fresh', props: fresh},
	{id: 'WeeklyDeals-FlashSale', props: flashSale},
];
