import type {PaletteName} from './theme';

// Chez Les Petits ad set: lifestyle photos in, Google and Meta visuals out.
// Photos live in public/chez-les-petits/photos. Brand photos often carry baked-in banners,
// so each one declares the usable region (`crop`, in source pixels) and where the subject
// sits inside it (`focus`, 0..1), and every format crops around that.

export type Photo = {
	file: string;
	width: number;
	height: number;
	crop?: {x: number; y: number; w: number; h: number};
	focus?: {x: number; y: number};
};

export const PHOTOS = {
	boosterInstall: {
		file: 'chez-les-petits/photos/upload-01.jpg',
		width: 768,
		height: 768,
		// The bottom 175px is a Chicco "Grab & Go" banner.
		crop: {x: 0, y: 0, w: 768, h: 590},
		focus: {x: 0.55, y: 0.6},
	},
} satisfies Record<string, Photo>;

export type PhotoId = keyof typeof PHOTOS;

export type Format = {id: string; width: number; height: number; label: string};

export const FORMATS = {
	googleLandscape: {id: 'g-1x91', width: 1200, height: 628, label: 'Google 1.91:1'},
	googleSquare: {id: 'g-1x1', width: 1200, height: 1200, label: 'Google / Meta 1:1'},
	googlePortrait: {id: 'g-4x5', width: 960, height: 1200, label: 'Google 4:5'},
	metaPortrait: {id: 'm-3x4', width: 1080, height: 1440, label: 'Meta 3:4'},
	metaFeed: {id: 'm-4x5', width: 1080, height: 1350, label: 'Meta 4:5'},
} satisfies Record<string, Format>;

/** A white product card laid over the cloud: product cutout plus the brand name. */
export type Card = {file: string; brand: string};

export type Ad = {
	id: string;
	photo: PhotoId;
	palette: PaletteName;
	eyebrow: string;
	headline: string;
	sub: string;
	cta: string;
	cards?: Card[];
	// Per-format focus overrides when the default framing cuts the subject.
	focus?: Partial<Record<keyof typeof FORMATS, {x: number; y: number}>>;
};

export const ADS: Ad[] = [
	{
		id: 'S3-toddler-car-seats',
		photo: 'boosterInstall',
		palette: 'pink',
		eyebrow: 'Car seats',
		headline: 'Built to grow with them',
		sub: 'Original car seats from 9 months up to booster age, with official warranty.',
		cta: 'Shop car seats',
	},
];

export type Trust = 'original' | 'cod' | 'delivery';
export const TRUST: Record<Trust, string> = {
	original: '100% original brands',
	cod: 'Cash on delivery',
	delivery: 'Delivery in 3 days, all Lebanon',
};
