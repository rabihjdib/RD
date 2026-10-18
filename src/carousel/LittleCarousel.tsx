import {AbsoluteFill, Img, staticFile} from 'remotion';
import {BRONZE, CHARCOAL, display, GOLD, sans} from '../brand';

/**
 * Instagram carousel: L'Atelier welcomes little ones from 2 years and up, with a
 * toddler shaping clay beside a parent and the same toddler in a Luciole apron. One
 * 2160x1350 panorama cut into two 1080x1350 (4:5) slides.
 *
 * Same full-bleed approach as the other carousels, with the copy on cream cards over
 * the quiet parts of each photo. Balls of white and pink modelling clay (as on the
 * table) and the gold Luciole star straddle the cut so the swipe carries on.
 *
 * Photos: public/carousel/little/*.jpg. Render: npm run carousel:little
 */

const SLIDE_W = 1080;
const SLIDE_H = 1350;
export const LITTLE_SLIDES = 2;
const W = SLIDE_W * LITTLE_SLIDES;

const CLAY = '#f6f3ec';
const CLAY_PINK = '#f2a7bf';

type Card = {
	x: number;
	y: number;
	w: number;
	kicker: string;
	headline: string[];
	size: number;
	sub?: string;
	header?: boolean; // logo and slide count above the kicker
	cta?: boolean; // booking row under the copy
};

type Slide = {photo: string; position: string; card: Card};

const SLIDE_COPY: Slide[] = [
	{
		photo: 'clay.jpg',
		position: '50% 50%',
		card: {
			x: 24,
			y: 24,
			w: 540,
			header: true,
			kicker: "L'Atelier · Ages 2+",
			headline: ['From 2 years', '*and up*.'],
			size: 56,
		},
	},
	{
		photo: 'apron.jpg',
		position: '50% 50%',
		card: {
			x: 24,
			y: 860,
			w: 410,
			kicker: 'Little explorers',
			headline: ['Tiny hands,', '*big discoveries*.'],
			size: 44,
			sub: 'Clay, colours and first creations, at their own pace.',
			cta: true,
		},
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
			padding: '22px 30px 24px',
			borderRadius: 24,
			background: 'rgba(237,236,227,0.95)',
			boxShadow: '0 18px 44px rgba(41,41,41,0.28)',
		}}
	>
		{card.header && (
			<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
				<Img src={staticFile('reel/brand/logo-dark.png')} style={{width: 150}} />
				<span style={{...kickerStyle, color: 'rgba(41,41,41,0.55)'}}>
					{String(n).padStart(2, '0')} / {String(LITTLE_SLIDES).padStart(2, '0')}
				</span>
			</div>
		)}
		<div style={kickerStyle}>{card.kicker}</div>
		{card.headline.map((line) => (
			<div key={line} style={{marginTop: 6, fontFamily: display, fontSize: card.size, lineHeight: 1.06, color: CHARCOAL, whiteSpace: 'nowrap'}}>
				<Emphasis text={line} />
			</div>
		))}
		{card.sub && <div style={{marginTop: 12, fontFamily: sans, fontWeight: 700, fontSize: 25, lineHeight: 1.4, color: 'rgba(41,41,41,0.7)'}}>{card.sub}</div>}
		{card.cta && (
			<div style={{marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(41,41,41,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
				<span style={{...kickerStyle, fontSize: 19, letterSpacing: '0.14em'}}>WhatsApp 81 540 282</span>
			</div>
		)}
	</div>
);

/** A soft ball of modelling clay with a white rim and a little highlight. */
const Clay: React.FC<{x: number; y: number; r: number; fill: string}> = ({x, y, r, fill}) => (
	<g>
		<ellipse cx={x} cy={y} rx={r} ry={r * 0.9} fill={fill} stroke="#fff" strokeWidth={4} />
		<ellipse cx={x - r * 0.35} cy={y - r * 0.35} rx={r * 0.22} ry={r * 0.14} fill="#fff" opacity={0.8} />
	</g>
);

/** The eight-point Luciole star, as embroidered on the aprons. */
const Star: React.FC<{x: number; y: number; r: number}> = ({x, y, r}) => {
	const pts = Array.from({length: 16}, (_, i) => {
		const a = (Math.PI / 8) * i - Math.PI / 2;
		const rr = i % 2 ? r * 0.18 : i % 4 ? r * 0.62 : r;
		return `${x + rr * Math.cos(a)},${y + rr * Math.sin(a)}`;
	}).join(' ');
	return <polygon points={pts} fill={GOLD} stroke="#fff" strokeWidth={3} strokeLinejoin="round" />;
};

// [x, y, radius, pink] clay balls and the star on the cut at 1080, above the card on slide 2.
const CLAY_BALLS: [number, number, number, boolean][] = [
	[1050, 740, 46, false],
	[1120, 700, 30, true],
	[1105, 805, 36, false],
	[1015, 820, 22, true],
];

export const LittlePanorama: React.FC = () => (
	<AbsoluteFill style={{width: W, height: SLIDE_H, backgroundColor: '#edece3'}}>
		{SLIDE_COPY.map((slide, i) => (
			<div key={i} style={{position: 'absolute', left: i * SLIDE_W, top: 0, width: SLIDE_W, height: SLIDE_H, overflow: 'hidden'}}>
				<Img src={staticFile(`carousel/little/${slide.photo}`)} style={{width: SLIDE_W, height: SLIDE_H, objectFit: 'cover', objectPosition: slide.position}} />
				<CardView card={slide.card} n={i + 1} />
			</div>
		))}

		<svg width={W} height={SLIDE_H} style={{position: 'absolute', inset: 0}}>
			<g style={{filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.3))'}}>
				{CLAY_BALLS.map(([x, y, r, pink], i) => (
					<Clay key={i} x={x} y={y} r={r} fill={pink ? CLAY_PINK : CLAY} />
				))}
				<Star x={1080} y={625} r={34} />
			</g>
		</svg>
	</AbsoluteFill>
);

/** One 1080x1350 slide: the panorama shifted so slide `index` fills the frame. */
export const LittleSlide: React.FC<{index: number}> = ({index}) => (
	<AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#edece3'}}>
		<div style={{position: 'absolute', left: -index * SLIDE_W, top: 0, width: W, height: SLIDE_H}}>
			<LittlePanorama />
		</div>
	</AbsoluteFill>
);
