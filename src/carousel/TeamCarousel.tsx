import {AbsoluteFill, Img, staticFile} from 'remotion';
import {BRONZE, CHARCOAL, display, GOLD, sans} from '../brand';

/**
 * Instagram carousel: the Luciole team (professional, gentle, young and passionate
 * about kids), told through the face-gem moments. One 5400x1350 panorama cut into
 * five 1080x1350 (4:5) slides.
 *
 * Same full-bleed approach as the umbrella and build carousels, with the copy on cream
 * cards over the quiet parts of each photo. Face gems and twinkles straddle every cut
 * so each swipe carries on from the last.
 *
 * Photos: public/carousel/team/*.jpg. Render: npm run carousel:team
 */

const SLIDE_W = 1080;
const SLIDE_H = 1350;
export const TEAM_SLIDES = 5;
const W = SLIDE_W * TEAM_SLIDES;

// The gem sheet colours.
const PINK = '#f27fae';
const AQUA = '#4cc7d6';
const GEM_GOLD = '#e9b949';
const LILAC = '#a98be0';
const ROSE = '#e8506b';

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
		photo: 'smiles.jpg',
		position: '50% 40%',
		cards: [{x: 560, y: 40, w: 480, header: true, kicker: 'Our team', headline: ['Meet the team', 'behind', '*the smiles*.'], size: 60}],
	},
	{
		photo: 'level.jpg',
		position: '50% 50%',
		cards: [
			{
				x: 600,
				y: 40,
				w: 440,
				kicker: 'Professional',
				headline: ['They kneel to', '*their level*.'],
				size: 54,
				sub: 'Trained to guide, patient by nature, always at eye level with your child.',
			},
		],
	},
	{
		photo: 'care.jpg',
		position: '50% 40%',
		cards: [
			{
				x: 40,
				y: 1100,
				w: 1000,
				kicker: 'Gentle',
				headline: ['Every little detail, *done with care*.'],
				size: 54,
				sub: 'A gem on a cheek or a first painting: nothing is too small for them.',
			},
		],
	},
	{
		photo: 'fun.jpg',
		position: '50% 30%',
		cards: [
			{
				x: 40,
				y: 30,
				w: 1000,
				kicker: 'Young & passionate',
				headline: ['Young, passionate and *genuinely fun*.'],
				size: 50,
				sub: 'They don’t just watch the kids. They play, create and laugh with them.',
			},
		],
	},
	{
		photo: 'hands.jpg',
		position: '50% 40%',
		cards: [
			{x: 680, y: 40, w: 360, kicker: 'Peace of mind', headline: ['Your child,', '*in the best*', '*hands*.'], size: 54, sub: 'So you can truly pause & connect.'},
			{x: 40, y: 1236, w: 1000, kicker: 'The atelier · Ages 3 to 12 · WhatsApp 81 540 282'},
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
			padding: card.headline ? '24px 32px 26px' : '20px 32px',
			borderRadius: 24,
			background: 'rgba(237,236,227,0.95)',
			boxShadow: '0 18px 44px rgba(41,41,41,0.28)',
		}}
	>
		{card.header && (
			<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14}}>
				<Img src={staticFile('reel/brand/logo-dark.png')} style={{width: 160}} />
				<span style={{...kickerStyle, color: 'rgba(41,41,41,0.55)'}}>
					{String(n).padStart(2, '0')} / {String(TEAM_SLIDES).padStart(2, '0')}
				</span>
			</div>
		)}
		{card.headline ? (
			<>
				<div style={kickerStyle}>{card.kicker}</div>
				{card.headline.map((line) => (
					<div key={line} style={{marginTop: 6, fontFamily: display, fontSize: card.size, lineHeight: 1.04, color: CHARCOAL, whiteSpace: 'nowrap'}}>
						<Emphasis text={line} />
					</div>
				))}
				{card.sub && <div style={{marginTop: 12, fontFamily: sans, fontWeight: 700, fontSize: 25, lineHeight: 1.4, color: 'rgba(41,41,41,0.7)'}}>{card.sub}</div>}
			</>
		) : (
			// Contact bar: details on the left, logo on the right.
			<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
				<span style={kickerStyle}>{card.kicker}</span>
				<Img src={staticFile('reel/brand/logo-dark.png')} style={{width: 140}} />
			</div>
		)}
	</div>
);

/** A round face gem: coloured stone, a lighter table facet, a white glint and a white rim. */
const Gem: React.FC<{x: number; y: number; r: number; color: string}> = ({x, y, r, color}) => (
	<g>
		<circle cx={x} cy={y} r={r} fill={color} stroke="#fff" strokeWidth={4} />
		<polygon
			points={Array.from({length: 8}, (_, i) => {
				const a = (Math.PI / 4) * i + Math.PI / 8;
				return `${x + r * 0.55 * Math.cos(a)},${y + r * 0.55 * Math.sin(a)}`;
			}).join(' ')}
			fill="#fff"
			fillOpacity={0.35}
		/>
		<ellipse cx={x - r * 0.35} cy={y - r * 0.4} rx={r * 0.22} ry={r * 0.14} fill="#fff" opacity={0.9} transform={`rotate(-35 ${x - r * 0.35} ${y - r * 0.4})`} />
	</g>
);

/** A four-point twinkle. */
const twinkle = (x: number, y: number, r: number) =>
	`M ${x} ${y - r} Q ${x + r * 0.16} ${y - r * 0.16} ${x + r} ${y} Q ${x + r * 0.16} ${y + r * 0.16} ${x} ${y + r} Q ${x - r * 0.16} ${y + r * 0.16} ${x - r} ${y} Q ${x - r * 0.16} ${y - r * 0.16} ${x} ${y - r} Z`;

// [x, y, radius, colour]: clustered on the cuts (1080, 2160, 3240, 4320), off faces and cards.
const GEMS: [number, number, number, string][] = [
	[1030, 1110, 22, PINK],
	[1084, 1170, 30, AQUA],
	[1140, 1110, 16, GEM_GOLD],
	[2110, 450, 18, LILAC],
	[2160, 500, 28, ROSE],
	[2214, 440, 20, AQUA],
	[3196, 220, 20, GEM_GOLD],
	[3242, 160, 30, PINK],
	[3292, 240, 16, LILAC],
	[4272, 560, 20, AQUA],
	[4322, 500, 30, GEM_GOLD],
	[4370, 590, 18, PINK],
];

const TWINKLES: [number, number, number][] = [
	[1000, 1205, 18],
	[2250, 525, 16],
	[3170, 140, 18],
	[4405, 470, 16],
];

export const TeamPanorama: React.FC = () => (
	<AbsoluteFill style={{width: W, height: SLIDE_H, backgroundColor: '#edece3'}}>
		{SLIDE_COPY.map((slide, i) => (
			<div key={i} style={{position: 'absolute', left: i * SLIDE_W, top: 0, width: SLIDE_W, height: SLIDE_H, overflow: 'hidden'}}>
				<Img src={staticFile(`carousel/team/${slide.photo}`)} style={{width: SLIDE_W, height: SLIDE_H, objectFit: 'cover', objectPosition: slide.position}} />
				{slide.cards.map((card, k) => (
					<CardView key={k} card={card} n={i + 1} />
				))}
			</div>
		))}

		<svg width={W} height={SLIDE_H} style={{position: 'absolute', inset: 0}}>
			<g style={{filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.28))'}}>
				{GEMS.map(([x, y, r, color], i) => (
					<Gem key={i} x={x} y={y} r={r} color={color} />
				))}
				{TWINKLES.map(([x, y, r], i) => (
					<path key={i} d={twinkle(x, y, r)} fill="#fff" />
				))}
			</g>
		</svg>
	</AbsoluteFill>
);

/** One 1080x1350 slide: the panorama shifted so slide `index` fills the frame. */
export const TeamSlide: React.FC<{index: number}> = ({index}) => (
	<AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#edece3'}}>
		<div style={{position: 'absolute', left: -index * SLIDE_W, top: 0, width: W, height: SLIDE_H}}>
			<TeamPanorama />
		</div>
	</AbsoluteFill>
);
