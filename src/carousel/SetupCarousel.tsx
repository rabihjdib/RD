import {AbsoluteFill, Img, staticFile} from 'remotion';
import {BRONZE, CHARCOAL, display, GOLD, sans} from '../brand';

/**
 * Instagram carousel: the party set-up for birthdays and kids' gatherings, from the
 * table set by the window to the games wall and the kids gathered round it. One
 * 5400x1350 panorama cut into five 1080x1350 (4:5) slides.
 *
 * Same full-bleed approach as the other carousels, with the copy on cream cards over
 * the quiet parts of each photo. The party's green folded napkins and the doodle stars
 * from its placemats straddle every cut so each swipe carries on from the last.
 *
 * Photos: public/carousel/setup/*.jpg. Render: npm run carousel:setup
 */

const SLIDE_W = 1080;
const SLIDE_H = 1350;
export const SETUP_SLIDES = 5;
const W = SLIDE_W * SETUP_SLIDES;

const NAPKIN = '#3f6b45';
const NAPKIN_LIGHT = '#5b8a5e';

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
		photo: 'table.jpg',
		position: '50% 100%',
		card: {
			x: 40,
			y: 30,
			w: 1000,
			header: true,
			kicker: 'Birthdays & kids gatherings',
			headline: ['A beautiful set-up, *ready for them*.'],
			size: 54,
			sub: 'Table, seats and decoration styled before the first guest arrives.',
		},
	},
	{
		photo: 'games.jpg',
		position: '50% 50%',
		card: {x: 40, y: 40, w: 1000, kicker: 'Games room', headline: ['Fun at *every corner*.'], size: 60, sub: 'Giant wall games, puzzles and toys between every activity.'},
	},
	{
		photo: 'seats.jpg',
		position: '50% 40%',
		card: {x: 580, y: 30, w: 470, kicker: 'Made for kids', headline: ['A table that', 'feels *like theirs*.'], size: 50, sub: 'Kid-height tables, soft poufs and room for every friend.'},
	},
	{
		photo: 'served.jpg',
		position: '50% 40%',
		card: {x: 40, y: 1100, w: 1000, kicker: 'Served with care', headline: ['Served at their table, *with a smile*.'], size: 50, sub: 'Our team looks after every plate, so parents can sit back.'},
	},
	{
		photo: 'gathering.jpg',
		position: '50% 50%',
		card: {
			x: 40,
			y: 1030,
			w: 1000,
			kicker: 'Your celebration',
			headline: ['Gather them all. *We set the scene.*'],
			size: 52,
			sub: 'Birthdays, playdates and class gatherings, styled to your theme.',
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
			padding: '24px 32px 26px',
			borderRadius: 24,
			background: 'rgba(237,236,227,0.95)',
			boxShadow: '0 18px 44px rgba(41,41,41,0.28)',
		}}
	>
		{card.header && (
			<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
				<Img src={staticFile('reel/brand/logo-dark.png')} style={{width: 150}} />
				<span style={{...kickerStyle, color: 'rgba(41,41,41,0.55)'}}>
					{String(n).padStart(2, '0')} / {String(SETUP_SLIDES).padStart(2, '0')}
				</span>
			</div>
		)}
		<div style={kickerStyle}>{card.kicker}</div>
		{card.headline.map((line) => (
			<div key={line} style={{marginTop: 6, fontFamily: display, fontSize: card.size, lineHeight: 1.04, color: CHARCOAL, whiteSpace: 'nowrap'}}>
				<Emphasis text={line} />
			</div>
		))}
		{card.sub && <div style={{marginTop: 12, fontFamily: sans, fontWeight: 700, fontSize: 25, lineHeight: 1.4, color: 'rgba(41,41,41,0.7)'}}>{card.sub}</div>}
		{card.cta && (
			<div style={{marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(41,41,41,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
				<span style={{...kickerStyle, fontSize: 19, letterSpacing: '0.14em'}}>luciolelebanon.com/birthdays · WhatsApp 81 540 282</span>
				<Img src={staticFile('reel/brand/logo-dark.png')} style={{width: 130}} />
			</div>
		)}
	</div>
);

/** A folded paper napkin: a triangle with a lighter fold line and a white rim. */
const Napkin: React.FC<{x: number; y: number; s: number; rot: number}> = ({x, y, s, rot}) => {
	const h = s / 2;
	return (
		<g transform={`translate(${x} ${y}) rotate(${rot})`}>
			<path d={`M ${-h} ${-h * 0.55} L ${h} ${-h * 0.55} L 0 ${h * 0.75} Z`} fill={NAPKIN} stroke="#fff" strokeWidth={4} strokeLinejoin="round" />
			<path d={`M ${-h * 0.62} ${-h * 0.55} L 0 ${h * 0.75}`} stroke={NAPKIN_LIGHT} strokeWidth={3} />
		</g>
	);
};

const star = (x: number, y: number, r: number) =>
	Array.from({length: 10}, (_, i) => {
		const a = (Math.PI / 5) * i - Math.PI / 2;
		const rr = i % 2 ? r * 0.45 : r;
		return `${x + rr * Math.cos(a)},${y + rr * Math.sin(a)}`;
	}).join(' ');

// [x, y, size, rotation] on each cut (1080 ... 4320), off faces and cards.
const NAPKINS: [number, number, number, number][] = [
	[1060, 760, 120, -14],
	[2170, 930, 120, 12],
	[3230, 600, 120, -10],
	[4320, 950, 100, 14],
];

// Doodle stars beside each napkin, as on the placemats.
const STARS: [number, number, number][] = [
	[1140, 690, 16],
	[990, 850, 11],
	[2090, 870, 15],
	[2250, 1010, 11],
	[3310, 540, 15],
	[3160, 690, 11],
	[4255, 875, 15],
	[4265, 1005, 11],
];

export const SetupPanorama: React.FC = () => (
	<AbsoluteFill style={{width: W, height: SLIDE_H, backgroundColor: '#edece3'}}>
		{SLIDE_COPY.map((slide, i) => (
			<div key={i} style={{position: 'absolute', left: i * SLIDE_W, top: 0, width: SLIDE_W, height: SLIDE_H, overflow: 'hidden'}}>
				<Img src={staticFile(`carousel/setup/${slide.photo}`)} style={{width: SLIDE_W, height: SLIDE_H, objectFit: 'cover', objectPosition: slide.position}} />
				<CardView card={slide.card} n={i + 1} />
			</div>
		))}

		<svg width={W} height={SLIDE_H} style={{position: 'absolute', inset: 0}}>
			<g style={{filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.28))'}}>
				{NAPKINS.map(([x, y, s, rot], i) => (
					<Napkin key={i} x={x} y={y} s={s} rot={rot} />
				))}
				{STARS.map(([x, y, r], i) => (
					<polygon key={i} points={star(x, y, r)} fill="#fff" stroke={CHARCOAL} strokeWidth={2.5} strokeLinejoin="round" />
				))}
			</g>
		</svg>
	</AbsoluteFill>
);

/** One 1080x1350 slide: the panorama shifted so slide `index` fills the frame. */
export const SetupSlide: React.FC<{index: number}> = ({index}) => (
	<AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#edece3'}}>
		<div style={{position: 'absolute', left: -index * SLIDE_W, top: 0, width: W, height: SLIDE_H}}>
			<SetupPanorama />
		</div>
	</AbsoluteFill>
);
