import {AbsoluteFill, Img, staticFile} from 'remotion';
import {BRONZE, CHARCOAL, display, GOLD, sans} from '../brand';

/**
 * Instagram carousel: endless fun, endless knowledge and endless discovery at the
 * atelier, from the spiral ball run to glitter tattoos and free building, closing on
 * the team T-shirt line "They create, you pause & connect". One 4320x1350 panorama
 * cut into four 1080x1350 (4:5) slides.
 *
 * Same full-bleed approach as the other carousels, with the copy on cream cards over
 * the quiet parts of each photo. Clusters of face-paint dots (as on the team member's
 * arm) and glitter sparkles straddle every cut so each swipe carries on from the last.
 *
 * Photos: public/carousel/discover/*.jpg. Render: npm run carousel:discover
 */

const SLIDE_W = 1080;
const SLIDE_H = 1350;
export const DISCOVER_SLIDES = 4;
const W = SLIDE_W * DISCOVER_SLIDES;

type Card = {
	x: number;
	y: number;
	w: number;
	kicker: string;
	headline?: string[];
	size?: number;
	sub?: string;
	header?: boolean; // logo and slide count above the kicker
};

type Slide = {photo: string; position: string; cards: Card[]};

const SLIDE_COPY: Slide[] = [
	{
		photo: 'spiral.jpg',
		position: '50% 50%',
		cards: [
			{
				x: 30,
				y: 30,
				w: 580,
				header: true,
				kicker: "Life at L'Atelier",
				headline: ['Endless fun.', 'Endless knowledge.', '*Endless discovery.*'],
				size: 50,
				sub: 'Even a spinning ball teaches them speed and gravity.',
			},
		],
	},
	{
		photo: 'paint.jpg',
		position: '50% 50%',
		cards: [{x: 590, y: 30, w: 460, kicker: 'Endless fun', headline: ['A little glitter,', '*a lot of fun*.'], size: 48}],
	},
	{
		photo: 'bricks.jpg',
		position: '50% 50%',
		cards: [{x: 600, y: 30, w: 450, kicker: 'Endless discovery', headline: ['Brick by brick,', '*a new world*.'], size: 50, sub: 'Free building time where their imagination leads.'}],
	},
	{
		photo: 'connect.jpg',
		position: '50% 50%',
		cards: [
			{x: 600, y: 30, w: 450, kicker: 'For parents', headline: ['They create.', '*You pause*', '*& connect.*'], size: 50, sub: 'Enjoy a coffee at our café while they play and learn.'},
			{x: 40, y: 1236, w: 1000, kicker: "L'Atelier · Ages 2 to 12 · WhatsApp 81 540 282"},
		],
	},
];

const Emphasis: React.FC<{text: string}> = ({text}) => (
	<>
		{text.split(/(\*[^*]+\*)/).map((part, i) =>
			part.startsWith('*') ? (
				<span key={i} style={{color: BRONZE}}>
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
			padding: card.headline ? '22px 30px 24px' : '20px 30px',
			borderRadius: 24,
			background: 'rgba(237,236,227,0.95)',
			boxShadow: '0 18px 44px rgba(41,41,41,0.28)',
		}}
	>
		{card.header && (
			<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
				<Img src={staticFile('reel/brand/logo-dark.png')} style={{width: 150}} />
				<span style={{...kickerStyle, color: 'rgba(41,41,41,0.55)'}}>
					{String(n).padStart(2, '0')} / {String(DISCOVER_SLIDES).padStart(2, '0')}
				</span>
			</div>
		)}
		{card.headline ? (
			<>
				<div style={kickerStyle}>{card.kicker}</div>
				{card.headline.map((line) => (
					<div key={line} style={{marginTop: 6, fontFamily: display, fontSize: card.size, lineHeight: 1.06, color: CHARCOAL, whiteSpace: 'nowrap'}}>
						<Emphasis text={line} />
					</div>
				))}
				{card.sub && <div style={{marginTop: 12, fontFamily: sans, fontWeight: 700, fontSize: 25, lineHeight: 1.4, color: 'rgba(41,41,41,0.7)'}}>{card.sub}</div>}
			</>
		) : (
			// Contact bar: details on the left, logo on the right.
			<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
				<span style={{...kickerStyle, fontSize: 19, letterSpacing: '0.14em'}}>{card.kicker}</span>
				<Img src={staticFile('reel/brand/logo-dark.png')} style={{width: 130}} />
			</div>
		)}
	</div>
);

const PAINT = ['#e6488f', '#4b6fb5', '#f08a5d', '#9b5fc0', '#d9367a'];

/** A cluster of face-paint dots, like the colour tests on the team member's arm. */
const Dots: React.FC<{x: number; y: number; s: number; seed: number}> = ({x, y, s, seed}) => {
	const blobs: [number, number, number][] = [
		[-0.9, -0.3, 0.42],
		[-0.2, -0.7, 0.36],
		[0.15, 0.05, 0.48],
		[0.85, -0.25, 0.38],
		[-0.55, 0.6, 0.34],
		[0.6, 0.75, 0.4],
	];
	return (
		<g>
			{blobs.map(([dx, dy, r], i) => (
				<ellipse
					key={i}
					cx={x + dx * s}
					cy={y + dy * s}
					rx={r * s}
					ry={r * s * 0.86}
					fill={PAINT[(i + seed) % PAINT.length]}
					stroke="#fff"
					strokeWidth={4}
					transform={`rotate(${(i * 37 + seed * 11) % 60 - 30} ${x + dx * s} ${y + dy * s})`}
				/>
			))}
		</g>
	);
};

/** A four-point glitter sparkle, white with a gold rim. */
const Sparkle: React.FC<{x: number; y: number; r: number}> = ({x, y, r}) => {
	const k = r * 0.22;
	return <path d={`M ${x} ${y - r} Q ${x + k} ${y - k} ${x + r} ${y} Q ${x + k} ${y + k} ${x} ${y + r} Q ${x - k} ${y + k} ${x - r} ${y} Q ${x - k} ${y - k} ${x} ${y - r} Z`} fill="#fff" stroke={GOLD} strokeWidth={3} strokeLinejoin="round" />;
};

// [x, y, size, colour seed] dot clusters and [x, y, radius] sparkles on each cut (1080 ... 3240), off faces and cards.
const DOTS: [number, number, number, number][] = [
	[1080, 610, 70, 0],
	[2160, 640, 70, 2],
	[3240, 470, 70, 4],
];
const SPARKLES: [number, number, number][] = [
	[1000, 490, 26],
	[1150, 730, 18],
	[2230, 540, 24],
	[2100, 760, 17],
	[3170, 370, 24],
	[3305, 580, 18],
];

export const DiscoverPanorama: React.FC = () => (
	<AbsoluteFill style={{width: W, height: SLIDE_H, backgroundColor: '#edece3'}}>
		{SLIDE_COPY.map((slide, i) => (
			<div key={i} style={{position: 'absolute', left: i * SLIDE_W, top: 0, width: SLIDE_W, height: SLIDE_H, overflow: 'hidden'}}>
				<Img src={staticFile(`carousel/discover/${slide.photo}`)} style={{width: SLIDE_W, height: SLIDE_H, objectFit: 'cover', objectPosition: slide.position}} />
				{slide.cards.map((card, k) => (
					<CardView key={k} card={card} n={i + 1} />
				))}
			</div>
		))}

		<svg width={W} height={SLIDE_H} style={{position: 'absolute', inset: 0}}>
			<g style={{filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.3))'}}>
				{DOTS.map(([x, y, s, seed], i) => (
					<Dots key={i} x={x} y={y} s={s} seed={seed} />
				))}
				{SPARKLES.map(([x, y, r], i) => (
					<Sparkle key={i} x={x} y={y} r={r} />
				))}
			</g>
		</svg>
	</AbsoluteFill>
);

/** One 1080x1350 slide: the panorama shifted so slide `index` fills the frame. */
export const DiscoverSlide: React.FC<{index: number}> = ({index}) => (
	<AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#edece3'}}>
		<div style={{position: 'absolute', left: -index * SLIDE_W, top: 0, width: W, height: SLIDE_H}}>
			<DiscoverPanorama />
		</div>
	</AbsoluteFill>
);
