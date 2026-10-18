import {AbsoluteFill, Img, staticFile} from 'remotion';
import {BRONZE, CHARCOAL, display, GOLD, sans} from '../brand';

/**
 * Instagram carousel: the Luciole buffet and salad bar, and every occasion it serves
 * (breakfast and brunch, lunch gatherings, private ladies' and business events,
 * birthdays). One 7560x1350 panorama cut into seven 1080x1350 (4:5) slides.
 *
 * Same full-bleed approach as the other carousels, with the copy on cream cards over
 * the quiet parts of each photo. Gold wheat sprigs (the bakery) and fresh green leaves
 * (the salad bar) straddle every cut so each swipe carries on from the last.
 *
 * Photos: public/carousel/buffet/*.jpg. Render: npm run carousel:buffet
 */

const SLIDE_W = 1080;
const SLIDE_H = 1350;
export const BUFFET_SLIDES = 7;
const W = SLIDE_W * BUFFET_SLIDES;

const LEAF = '#6f9a3e';
const LEAF_DARK = '#4f7a2a';

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
		photo: 'counter.jpg',
		position: '50% 50%',
		card: {
			x: 40,
			y: 30,
			w: 1000,
			header: true,
			kicker: 'Luciole café & bistro',
			headline: ['Our buffet & salad bar, *crafted for you*.'],
			size: 50,
			sub: 'By Chef Mazen, for events, daily brunch, lunch gatherings and birthdays.',
		},
	},
	{
		photo: 'croissants.jpg',
		position: '50% 50%',
		card: {
			x: 40,
			y: 1110,
			w: 1000,
			kicker: 'Breakfast & brunch',
			headline: ['Fresh from the oven, *every morning*.'],
			size: 52,
			sub: 'Croissants, pain au chocolat and artisan breads.',
		},
	},
	{
		photo: 'salad.jpg',
		position: '50% 50%',
		card: {x: 580, y: 30, w: 470, kicker: 'Salad bar', headline: ['Fresh, light', 'and *made*', '*your way*.'], size: 52},
	},
	{
		photo: 'rolls.jpg',
		position: '50% 50%',
		card: {x: 460, y: 30, w: 590, kicker: 'Lunch gatherings', headline: ['Bites made', '*to share*.'], size: 58, sub: 'Platters for ladies’ lunches and business meetings.'},
	},
	{
		photo: 'sandwiches.jpg',
		position: '50% 40%',
		card: {x: 40, y: 1150, w: 1000, kicker: 'Private events', headline: ['Your guests, *our table*.'], size: 56},
	},
	{
		photo: 'guests.jpg',
		position: '50% 40%',
		card: {
			x: 40,
			y: 30,
			w: 1000,
			kicker: 'Events & celebrations',
			headline: ['Ladies’ gatherings, business', 'lunches *and birthdays*.'],
			size: 48,
		},
	},
	{
		photo: 'book.jpg',
		position: '50% 40%',
		card: {
			x: 40,
			y: 30,
			w: 1000,
			kicker: 'Book your event',
			headline: ['Tell us the occasion. *We set the buffet.*'],
			size: 48,
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
					{String(n).padStart(2, '0')} / {String(BUFFET_SLIDES).padStart(2, '0')}
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
				<span style={{...kickerStyle, fontSize: 19, letterSpacing: '0.14em'}}>luciolelebanon.com · WhatsApp 81 540 282</span>
				<Img src={staticFile('reel/brand/logo-dark.png')} style={{width: 130}} />
			</div>
		)}
	</div>
);

/** A wheat sprig: a gold stem with paired grains up to a tip, outlined in white. */
const Wheat: React.FC<{x: number; y: number; len: number; rot: number}> = ({x, y, len, rot}) => {
	const grains = 6;
	return (
		<g transform={`translate(${x} ${y}) rotate(${rot})`} stroke="#fff" strokeWidth={3}>
			<line x1={0} y1={len * 0.5} x2={0} y2={-len * 0.5} stroke={BRONZE} strokeWidth={5} strokeLinecap="round" />
			{Array.from({length: grains}, (_, i) => {
				const gy = -len * 0.45 + i * (len * 0.55) / grains;
				return (
					<g key={i}>
						<ellipse cx={-11} cy={gy} rx={8} ry={16} fill={GOLD} transform={`rotate(-28 -11 ${gy})`} />
						<ellipse cx={11} cy={gy} rx={8} ry={16} fill={GOLD} transform={`rotate(28 11 ${gy})`} />
					</g>
				);
			})}
			<ellipse cx={0} cy={-len * 0.5} rx={8} ry={16} fill={GOLD} />
		</g>
	);
};

/** A fresh leaf with a midrib, outlined in white. */
const Leaf: React.FC<{x: number; y: number; s: number; rot: number}> = ({x, y, s, rot}) => (
	<g transform={`translate(${x} ${y}) rotate(${rot})`}>
		<path d={`M 0 ${-s} C ${s * 0.7} ${-s * 0.5}, ${s * 0.6} ${s * 0.5}, 0 ${s} C ${-s * 0.6} ${s * 0.5}, ${-s * 0.7} ${-s * 0.5}, 0 ${-s} Z`} fill={LEAF} stroke="#fff" strokeWidth={4} />
		<path d={`M 0 ${-s * 0.85} L 0 ${s * 0.9}`} stroke={LEAF_DARK} strokeWidth={3} />
	</g>
);

// One sprig and one leaf on each cut (1080 ... 6480), off faces and cards.
const WHEAT: [number, number, number, number][] = [
	[1060, 760, 170, -18],
	[2160, 640, 170, 16],
	[3250, 820, 170, -14],
	[4320, 520, 170, 18],
	[5400, 1010, 170, -16],
	[6480, 720, 170, 14],
];
const LEAVES: [number, number, number, number][] = [
	[1120, 860, 42, 40],
	[2100, 740, 42, -35],
	[3190, 910, 42, 30],
	[4380, 620, 42, -40],
	[5340, 1080, 42, 35],
	[6420, 820, 42, -30],
];

export const BuffetPanorama: React.FC = () => (
	<AbsoluteFill style={{width: W, height: SLIDE_H, backgroundColor: '#edece3'}}>
		{SLIDE_COPY.map((slide, i) => (
			<div key={i} style={{position: 'absolute', left: i * SLIDE_W, top: 0, width: SLIDE_W, height: SLIDE_H, overflow: 'hidden'}}>
				<Img src={staticFile(`carousel/buffet/${slide.photo}`)} style={{width: SLIDE_W, height: SLIDE_H, objectFit: 'cover', objectPosition: slide.position}} />
				<CardView card={slide.card} n={i + 1} />
			</div>
		))}

		<svg width={W} height={SLIDE_H} style={{position: 'absolute', inset: 0}}>
			<g style={{filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.3))'}}>
				{WHEAT.map(([x, y, len, rot], i) => (
					<Wheat key={i} x={x} y={y} len={len} rot={rot} />
				))}
				{LEAVES.map(([x, y, s, rot], i) => (
					<Leaf key={i} x={x} y={y} s={s} rot={rot} />
				))}
			</g>
		</svg>
	</AbsoluteFill>
);

/** One 1080x1350 slide: the panorama shifted so slide `index` fills the frame. */
export const BuffetSlide: React.FC<{index: number}> = ({index}) => (
	<AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#edece3'}}>
		<div style={{position: 'absolute', left: -index * SLIDE_W, top: 0, width: W, height: SLIDE_H}}>
			<BuffetPanorama />
		</div>
	</AbsoluteFill>
);
