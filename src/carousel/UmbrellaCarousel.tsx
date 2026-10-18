import {AbsoluteFill, Img, staticFile} from 'remotion';
import {CHARCOAL, CREAM, display, GOLD, sans} from '../brand';

/**
 * Instagram carousel: the umbrella workshop, where kids design, paint and take home
 * their own umbrella. Built as one 4320x1350 panorama cut into 1080x1350 (4:5) slides.
 *
 * Unlike the brick carousel the photos run full bleed (only ~6% of each 3:4 photo is
 * cropped), with the copy on compact cream cards placed over the quiet parts of each
 * picture. Painted raindrops and stars fall across the whole panorama and sit on the
 * cuts, so each swipe carries on from the last.
 *
 * Photos: public/carousel/umbrella/*.jpg. Render: npm run carousel:umbrella
 */

const SLIDE_W = 1080;
const SLIDE_H = 1350;
export const UMBRELLA_SLIDES = 4;
const W = SLIDE_W * UMBRELLA_SLIDES;

// The paint on the kids' palettes.
const BLUE = '#2f6fd6';
const PINK = '#f2a3b6';
const YELLOW = '#f0b72a';
const PURPLE = '#8a6fc9';
const RED = '#d6453c';

type Card = {
	x: number;
	y: number;
	w: number;
	kicker?: string;
	headline?: string[];
	size?: number;
	sub?: string;
	logo?: boolean;
};

type Slide = {photo: string; position: string; cards: Card[]};

const SLIDE_COPY: Slide[] = [
	{
		photo: 'group.jpg',
		position: '50% 50%',
		cards: [
			{
				x: 50,
				y: 50,
				w: 720,
				logo: true,
				kicker: "L'Atelier · Umbrella workshop",
				headline: ['A plain umbrella.', '*Their* design.'],
				size: 76,
			},
		],
	},
	{
		photo: 'design.jpg',
		position: '50% 50%',
		cards: [
			{
				x: 50,
				y: 1090,
				w: 980,
				kicker: 'Step 1 · Design',
				headline: ['First the idea, *then the paint*'],
				size: 56,
				sub: 'Their name, stars, hearts: every umbrella starts as a sketch on paper.',
			},
		],
	},
	{
		photo: 'customize.jpg',
		position: '50% 40%',
		cards: [
			{
				x: 50,
				y: 1090,
				w: 980,
				kicker: 'Step 2 · Customize',
				headline: ['Every stroke, *their choice*'],
				size: 56,
				sub: 'Paint, gems and gold details. No two umbrellas leave the same.',
			},
		],
	},
	{
		photo: 'home.jpg',
		position: '50% 0%',
		cards: [
			{x: 50, y: 50, w: 560, kicker: 'Step 3 · Take it home', headline: ['Made at Luciole,', '*used every day*'], size: 56},
			{
				x: 50,
				y: 1170,
				w: 980,
				sub: 'Ready for school on the next rainy day.',
				kicker: 'The atelier · Ages 3 to 12 · WhatsApp 81 540 282',
				logo: true,
			},
		],
	},
];

const Gold: React.FC<{text: string}> = ({text}) => (
	<>
		{text.split(/(\*[^*]+\*)/).map((part, i) =>
			part.startsWith('*') ? (
				<span key={i} style={{color: GOLD}}>
					{part.slice(1, -1)}
				</span>
			) : (
				part
			),
		)}
	</>
);

const kickerStyle: React.CSSProperties = {fontFamily: sans, fontWeight: 700, fontSize: 21, letterSpacing: '0.24em', textTransform: 'uppercase', color: GOLD};

const CardView: React.FC<{card: Card; n: number}> = ({card, n}) => (
	<div
		style={{
			position: 'absolute',
			left: card.x,
			top: card.y,
			width: card.w,
			padding: '26px 34px 28px',
			borderRadius: 26,
			background: 'rgba(237,236,227,0.94)',
			boxShadow: '0 18px 44px rgba(41,41,41,0.28)',
		}}
	>
		{card.logo && card.headline && (
			<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
				<Img src={staticFile('reel/brand/logo-dark.png')} style={{width: 170}} />
				<span style={{...kickerStyle, color: 'rgba(41,41,41,0.55)'}}>
					{String(n).padStart(2, '0')} / {String(UMBRELLA_SLIDES).padStart(2, '0')}
				</span>
			</div>
		)}
		{card.sub && !card.headline ? (
			// Closing card: line, then the contact row with the logo.
			<>
				<div style={{fontFamily: display, fontSize: 40, lineHeight: 1.15, color: CHARCOAL}}>{card.sub}</div>
				<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14}}>
					<span style={kickerStyle}>{card.kicker}</span>
					{card.logo && <Img src={staticFile('reel/brand/logo-dark.png')} style={{width: 130}} />}
				</div>
			</>
		) : (
			<>
				{card.kicker && <div style={kickerStyle}>{card.kicker}</div>}
				{card.headline?.map((line) => (
					<div key={line} style={{marginTop: 8, fontFamily: display, fontSize: card.size, lineHeight: 1.04, color: CHARCOAL, whiteSpace: 'nowrap'}}>
						<Gold text={line} />
					</div>
				))}
				{card.sub && <div style={{marginTop: 12, fontFamily: sans, fontWeight: 700, fontSize: 26, lineHeight: 1.4, color: 'rgba(41,41,41,0.7)'}}>{card.sub}</div>}
			</>
		)}
	</div>
);

/** A painted raindrop, point up, outlined in white like a sticker. */
const Drop: React.FC<{x: number; y: number; s: number; rot: number; color: string}> = ({x, y, s, rot, color}) => (
	<path
		d={`M 0 ${-s} C ${s * 0.55} ${-s * 0.25}, ${s * 0.62} ${s * 0.3}, 0 ${s * 0.6} C ${-s * 0.62} ${s * 0.3}, ${-s * 0.55} ${-s * 0.25}, 0 ${-s} Z`}
		transform={`translate(${x} ${y}) rotate(${rot})`}
		fill={color}
		stroke="#fff"
		strokeWidth={5}
		strokeLinejoin="round"
	/>
);

const star = (x: number, y: number, r: number) => {
	const pts = Array.from({length: 10}, (_, i) => {
		const a = (Math.PI / 5) * i - Math.PI / 2;
		const rr = i % 2 ? r * 0.45 : r;
		return `${x + rr * Math.cos(a)},${y + rr * Math.sin(a)}`;
	});
	return pts.join(' ');
};

// [x, y, size, rotation, colour]: falling at a slight slant, clustered on the cuts
// (1080, 2160, 3240) and kept off faces and cards.
const DROPS: [number, number, number, number, string][] = [
	[960, 470, 30, 18, BLUE],
	[1040, 560, 38, 18, PINK],
	[1112, 650, 34, 18, YELLOW],
	[1180, 520, 24, 18, PURPLE],
	[2050, 200, 28, 18, RED],
	[2140, 300, 40, 18, BLUE],
	[2205, 410, 30, 18, PINK],
	[2270, 250, 22, 18, YELLOW],
	[3150, 380, 26, 18, PURPLE],
	[3225, 480, 40, 18, YELLOW],
	[3292, 590, 32, 18, BLUE],
	[3350, 430, 22, 18, RED],
	[4210, 1080, 30, 18, PINK],
];

const STARS: [number, number, number][] = [
	[1010, 700, 22],
	[2300, 470, 20],
	[3185, 650, 24],
	[4240, 560, 22],
];

export const UmbrellaPanorama: React.FC = () => (
	<AbsoluteFill style={{width: W, height: SLIDE_H, backgroundColor: CREAM}}>
		{SLIDE_COPY.map((slide, i) => (
			<div key={i} style={{position: 'absolute', left: i * SLIDE_W, top: 0, width: SLIDE_W, height: SLIDE_H, overflow: 'hidden'}}>
				<Img src={staticFile(`carousel/umbrella/${slide.photo}`)} style={{width: SLIDE_W, height: SLIDE_H, objectFit: 'cover', objectPosition: slide.position}} />
				{slide.cards.map((card, k) => (
					<CardView key={k} card={card} n={i + 1} />
				))}
			</div>
		))}

		<svg width={W} height={SLIDE_H} style={{position: 'absolute', inset: 0}}>
			<g style={{filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.25))'}}>
				{DROPS.map(([x, y, s, rot, color], i) => (
					<Drop key={i} x={x} y={y} s={s} rot={rot} color={color} />
				))}
				{STARS.map(([x, y, r], i) => (
					<polygon key={i} points={star(x, y, r)} fill={YELLOW} stroke="#fff" strokeWidth={4} strokeLinejoin="round" />
				))}
			</g>
		</svg>
	</AbsoluteFill>
);

/** One 1080x1350 slide: the panorama shifted so slide `index` fills the frame. */
export const UmbrellaSlide: React.FC<{index: number}> = ({index}) => (
	<AbsoluteFill style={{overflow: 'hidden', backgroundColor: CREAM}}>
		<div style={{position: 'absolute', left: -index * SLIDE_W, top: 0, width: W, height: SLIDE_H}}>
			<UmbrellaPanorama />
		</div>
	</AbsoluteFill>
);
