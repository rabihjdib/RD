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
	nextToMe: {file: 'chez-les-petits/photos/drive/p16.jpg', width: 547, height: 365, focus: {x: 0.5, y: 0.5}},
	carSeats: {file: 'chez-les-petits/photos/drive/p13.jpg', width: 600, height: 600, focus: {x: 0.35, y: 0.5}},
	travelSystem: {file: 'chez-les-petits/photos/drive/p43.jpg', width: 554, height: 554, focus: {x: 0.5, y: 0.6}},
	strollerCafe: {file: 'chez-les-petits/photos/drive/p12.jpg', width: 541, height: 369, focus: {x: 0.65, y: 0.5}},
	carrier: {file: 'chez-les-petits/photos/drive/p22.jpg', width: 554, height: 554, focus: {x: 0.45, y: 0.35}},
	// Right half of a two-panel shot; the white bands above and below are cut away.
	carrierDad: {file: 'chez-les-petits/photos/drive/p15.jpg', width: 1200, height: 1200, crop: {x: 580, y: 227, w: 620, h: 745}, focus: {x: 0.5, y: 0.45}},
	showerBath: {file: 'chez-les-petits/photos/drive/p17.jpg', width: 900, height: 1200, focus: {x: 0.55, y: 0.5}},
	newbornFeed: {file: 'chez-les-petits/photos/drive/p25.jpg', width: 554, height: 554, crop: {x: 27, y: 26, w: 500, h: 502}, focus: {x: 0.5, y: 0.55}},
	antiColic: {file: 'chez-les-petits/photos/drive/p28.jpg', width: 1000, height: 1000, crop: {x: 167, y: 0, w: 666, h: 1000}, focus: {x: 0.5, y: 0.5}},
	drBrownsBottle: {file: 'chez-les-petits/photos/drive/p41.jpg', width: 1445, height: 963, crop: {x: 12, y: 0, w: 1433, h: 963}, focus: {x: 0.55, y: 0.45}},
	sterilizerHome: {file: 'chez-les-petits/photos/drive/p01.jpg', width: 960, height: 640, focus: {x: 0.55, y: 0.55}},
	// A purple feature icon sits in the bottom-left corner.
	sterilizerDad: {file: 'chez-les-petits/photos/drive/p37.jpg', width: 1026, height: 577, crop: {x: 270, y: 0, w: 756, h: 577}, focus: {x: 0.4, y: 0.4}},
	sterilizerDryer: {file: 'chez-les-petits/photos/drive/p45.jpg', width: 1000, height: 1000, focus: {x: 0.5, y: 0.5}},
	bottleWarmer: {file: 'chez-les-petits/photos/drive/p27.jpg', width: 1500, height: 1500, focus: {x: 0.6, y: 0.45}},
	nightFeed: {file: 'chez-les-petits/photos/drive/p56.jpg', width: 554, height: 554, focus: {x: 0.5, y: 0.45}},
	breastPump: {file: 'chez-les-petits/photos/drive/p02.jpg', width: 555, height: 555, crop: {x: 0, y: 97, w: 555, h: 355}, focus: {x: 0.45, y: 0.4}},
	foodMaker: {file: 'chez-les-petits/photos/drive/p59.jpg', width: 1500, height: 1500, focus: {x: 0.55, y: 0.5}},
	thermometer: {file: 'chez-les-petits/photos/drive/p19.jpg', width: 894, height: 898, crop: {x: 0, y: 0, w: 894, h: 894}, focus: {x: 0.5, y: 0.5}},
	swing: {file: 'chez-les-petits/photos/drive/p58.jpg', width: 500, height: 500, focus: {x: 0.5, y: 0.55}},
	toddlerArmchair: {file: 'chez-les-petits/photos/drive/p48.jpg', width: 1000, height: 1000, crop: {x: 163, y: 0, w: 674, h: 1000}, focus: {x: 0.5, y: 0.4}},
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

export type Glyph = Trust | 'pin' | 'list';

/** Big brand statement shown in a white cloud when an ad has no photo. */
export type Statement = {big: string; caption: string; icon: Glyph; chips?: string[]};

export type Ad = {
	id: string;
	// An ad shows either a cloud-masked photo or a statement cloud.
	photo?: PhotoId;
	statement?: Statement;
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
		id: 'B1-cash-on-delivery',
		palette: 'blue',
		eyebrow: 'Cash on delivery',
		headline: 'Pay at your door, all over Lebanon',
		sub: 'Order online or on WhatsApp and pay cash when it arrives. Delivered within 3 days.',
		cta: 'Shop now',
		statement: {big: '3 days', caption: 'Doorstep delivery anywhere in Lebanon', icon: 'delivery'},
	},
	{
		id: 'B2-original-brands',
		palette: 'pink',
		eyebrow: 'Original brands',
		headline: 'Never risk a copy with your baby',
		sub: '100% genuine brands from a trusted supplier, with official warranty.',
		cta: 'Shop original brands',
		statement: {
			big: '100%',
			caption: 'Original, with official warranty',
			icon: 'original',
			chips: ['Chicco', 'Peg Perego', 'Philips Avent', "Dr. Brown's", 'Joie', 'Red Castle'],
		},
	},
	{
		id: 'B3-expert-must-have-list',
		palette: 'lime',
		eyebrow: 'Free must-have list',
		headline: 'Everything baby, from A to Z',
		sub: 'Ask our experts for your must-have list before delivery and after.',
		cta: 'Message our experts',
		statement: {big: 'A to Z', caption: 'Your newborn checklist, free from our experts', icon: 'list'},
	},
	{
		id: 'B4-showrooms',
		palette: 'blue',
		eyebrow: 'Visit our showrooms',
		headline: 'Try it before you buy it',
		sub: 'Push the stroller, click the car seat, feel the fabric. Then order online or in store.',
		cta: 'Get directions',
		statement: {big: '2 showrooms', caption: 'Sin El Fil • Maameltein, Jounieh', icon: 'pin'},
	},
	{
		id: 'B5-since-1912',
		palette: 'pink',
		eyebrow: 'Since 1912',
		headline: 'Growing with Lebanese families',
		sub: 'Part of Gebran Geahchan & Sons. A century of trust for your little ones.',
		cta: 'Shop now',
		statement: {big: '1912', caption: 'Original brands. Official guarantee.', icon: 'original'},
	},
	{
		id: 'L01-bedside-cribs',
		photo: 'nextToMe',
		palette: 'blue',
		eyebrow: 'Bedside cribs',
		headline: 'Ready for hospital to home',
		sub: 'Chicco Next2Me keeps your newborn close and safe from the very first night.',
		cta: 'Shop bedside cribs',
	},
	{
		id: 'L02-car-seats',
		photo: 'carSeats',
		palette: 'pink',
		eyebrow: 'Car seats',
		headline: 'Built to grow with them',
		sub: 'Original car seats from newborn to booster age, with official warranty.',
		cta: 'Shop car seats',
	},
	{
		id: 'L03-travel-systems',
		photo: 'travelSystem',
		palette: 'blue',
		eyebrow: 'Travel systems',
		headline: 'Out and about in 2 seconds',
		sub: 'Fold the stroller with one hand, click the infant seat in, and go.',
		cta: 'Shop travel systems',
	},
	{
		id: 'L04-strollers',
		photo: 'strollerCafe',
		palette: 'blue',
		eyebrow: 'Strollers',
		headline: 'Strollers from the brands you trust',
		sub: 'Chicco, Peg Perego, Joie and Lionelo. 100% original, with guarantee.',
		cta: 'Shop strollers',
	},
	{
		id: 'L05-baby-carriers',
		photo: 'carrier',
		palette: 'lime',
		eyebrow: 'Baby carriers',
		headline: 'Keep baby close, keep hands free',
		sub: 'Ergonomic carriers from 0 months, comfortable for you and baby.',
		cta: 'Shop carriers',
	},
	{
		id: 'L06-carriers-for-dads',
		photo: 'carrierDad',
		palette: 'lime',
		eyebrow: 'Baby carriers',
		headline: 'Hands free, heart full',
		sub: 'Carriers that fit mom and dad, from newborn to toddler.',
		cta: 'Shop carriers',
	},
	{
		id: 'L07-bath-time',
		photo: 'showerBath',
		palette: 'pink',
		eyebrow: 'Bath time',
		headline: 'Zero back pain bath times',
		sub: 'Chicco bath seats that stand at your height, right in the shower.',
		cta: 'Shop bath',
	},
	{
		id: 'L08-newborn-feeding',
		photo: 'newbornFeed',
		palette: 'lime',
		eyebrow: 'Newborn feeding',
		headline: 'Ready from day one',
		sub: 'Philips Avent bottles and starter sets, original from a trusted supplier.',
		cta: 'Shop feeding',
	},
	{
		id: 'L09-anti-colic-bottles',
		photo: 'antiColic',
		palette: 'lime',
		eyebrow: 'Bottles',
		headline: 'Less fuss, more cuddles',
		sub: 'Philips Avent Anti-colic bottles with the AirFree vent.',
		cta: 'Shop bottles',
	},
	{
		id: 'L10-dr-browns-bottles',
		photo: 'drBrownsBottle',
		palette: 'lime',
		eyebrow: 'Bottles',
		headline: 'Dr. Brown\'s, 100% original',
		sub: 'Options+ bottles in every size, delivered in 3 days.',
		cta: 'Shop bottles',
	},
	{
		id: 'L11-sterilisers',
		photo: 'sterilizerHome',
		palette: 'lime',
		eyebrow: 'Sterilizing',
		headline: 'Hospital bag: checked',
		sub: 'Philips Avent steam sterilisers. Clean, sterile and ready from day one.',
		cta: 'Shop sterilisers',
	},
	{
		id: 'L12-sterilise-in-minutes',
		photo: 'sterilizerDad',
		palette: 'lime',
		eyebrow: 'Sterilizing',
		headline: 'Every bottle, clean and ready',
		sub: 'Load, press, done. Sterile bottles and pacifiers in minutes.',
		cta: 'Shop sterilisers',
	},
	{
		id: 'L13-steriliser-dryer',
		photo: 'sterilizerDryer',
		palette: 'lime',
		eyebrow: 'Sterilizing',
		headline: 'Steam, dry, done',
		sub: 'Dr. Brown\'s steriliser and dryer, from a trusted official supplier.',
		cta: 'Shop sterilisers',
	},
	{
		id: 'L14-bottle-warmers',
		photo: 'bottleWarmer',
		palette: 'lime',
		eyebrow: 'Bottle warmers',
		headline: 'Warm milk, one hand free',
		sub: 'Tommee Tippee bottle and food warmer, ready when baby is.',
		cta: 'Shop warmers',
	},
	{
		id: 'L15-bottle-warmers-avent',
		photo: 'nightFeed',
		palette: 'blue',
		eyebrow: 'Bottle warmers',
		headline: 'Happy baby, warm bottle',
		sub: 'Philips Avent fast bottle warmers. Gentle, even warming in minutes.',
		cta: 'Shop warmers',
	},
	{
		id: 'L16-breast-pumps',
		photo: 'breastPump',
		palette: 'pink',
		eyebrow: 'Maternity',
		headline: 'Comfort for mom, peace for baby',
		sub: 'Philips Avent electric breast pumps, original with official warranty.',
		cta: 'Shop breast pumps',
	},
	{
		id: 'L17-first-foods',
		photo: 'foodMaker',
		palette: 'lime',
		eyebrow: 'First foods',
		headline: 'First foods, made easy',
		sub: 'The Chicco Cuocipappa steams and blends in one, for fresh baby meals.',
		cta: 'Shop feeding',
	},
	{
		id: 'L18-thermometers',
		photo: 'thermometer',
		palette: 'blue',
		eyebrow: 'Baby care',
		headline: 'Check without waking',
		sub: 'Tommee Tippee no-touch thermometer. Gentle care for delicate skin.',
		cta: 'Shop baby care',
	},
	{
		id: 'L19-baby-swings',
		photo: 'swing',
		palette: 'pink',
		eyebrow: 'Soothing',
		headline: 'Less crying. Deeper sleep.',
		sub: 'Chicco baby swings with gentle motion and soft melodies.',
		cta: 'Shop swings',
	},
	{
		id: 'L20-toddler-armchair',
		photo: 'toddlerArmchair',
		palette: 'pink',
		eyebrow: 'Growing up',
		headline: 'A seat of their very own',
		sub: 'The Chicco Twist armchair, soft and safe for curious toddlers.',
		cta: 'Shop toddler',
	},
];

export type Trust = 'original' | 'cod' | 'delivery';
export const TRUST: Record<Trust, string> = {
	original: '100% original brands',
	cod: 'Cash on delivery',
	delivery: 'Delivery in 3 days, all Lebanon',
};
