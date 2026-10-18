import {AbsoluteFill, Img, staticFile} from 'remotion';
import {BRONZE, CHARCOAL, CREAM, display, GOLD, SAND, sans} from '../brand';

/**
 * Instagram carousel: kids proud of what they built, from pride to confidence to hope
 * to the future. One 4320x1350 panorama cut into four 1080x1350 (4:5) slides: three
 * full-bleed photos, then a closing slide where the bricks that crossed every cut
 * assemble into the Luciole star.
 *
 * Photos: public/carousel/proud/*.jpg. Render: npm run carousel:proud
 */

const SLIDE_W = 1080;
const SLIDE_H = 1350;
export const PROUD_SLIDES = 4;
const W = SLIDE_W * PROUD_SLIDES;

// The kids' brick colours, a touch softened to sit with the brand palette.
const RED = '#d2483c';
const YELLOW = '#f0c23b';
const GREEN = '#3c8a54';
const BLUE = '#3a62c4';

type Card = {x: number; y: number; w: number; kicker: string; headline: string[]; size: number; sub?: string; header?: boolean};
type PhotoSlide = {photo: string; position: string; card: Card};

const PHOTO_SLIDES: PhotoSlide[] = [
	{
		photo: 'made.jpg',
		position: '50% 0%',
		card: {x: 40, y: 30, w: 1000, header: true, kicker: "L'Atelier · Proud moments", headline: ['Look what *we made*!'], size: 64},
	},
	{
		photo: 'can.jpg',
		position: '50% 40%',
		card: {
			x: 20,
			y: 60,
			w: 320,
			kicker: 'Pride',
			headline: ['Every', 'finished', 'piece says', '*I can do it*.'],
			size: 46,
			sub: 'Confidence is built one small success at a time.',
		},
	},
	{
		photo: 'hope.jpg',
		position: '50% 30%',
		card: {
			x: 40,
			y: 1110,
			w: 1000,
			kicker: 'Hope',
			headline: ['Today a little garden. *Tomorrow, anything.*'],
			size: 48,
			sub: 'The pride they feel here becomes the belief they carry everywhere.',
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
			padding: '24px 30px 26px',
			borderRadius: 24,
			background: 'rgba(237,236,227,0.95)',
			boxShadow: '0 18px 44px rgba(41,41,41,0.28)',
		}}
	>
		{card.header && (
			<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
				<Img src={staticFile('reel/brand/logo-dark.png')} style={{width: 150}} />
				<span style={{...kickerStyle, color: 'rgba(41,41,41,0.55)'}}>
					{String(n).padStart(2, '0')} / {String(PROUD_SLIDES).padStart(2, '0')}
				</span>
			</div>
		)}
		<div style={kickerStyle}>{card.kicker}</div>
		{card.headline.map((line) => (
			<div key={line} style={{marginTop: 6, fontFamily: display, fontSize: card.size, lineHeight: 1.04, color: CHARCOAL, whiteSpace: 'nowrap'}}>
				<Emphasis text={line} />
			</div>
		))}
		{card.sub && <div style={{marginTop: 12, fontFamily: sans, fontWeight: 700, fontSize: 24, lineHeight: 1.4, color: 'rgba(41,41,41,0.7)'}}>{card.sub}</div>}
	</div>
);

const Brick: React.FC<{x: number; y: number; s: number; rot?: number; color: string}> = ({x, y, s, rot = 0, color}) => (
	<g transform={`rotate(${rot} ${x} ${y})`}>
		<rect x={x - s / 2} y={y - s / 2} width={s} height={s} rx={s * 0.14} fill={color} />
		<circle cx={x} cy={y} r={s * 0.24} fill="#fff" opacity={0.28} />
		<circle cx={x} cy={y} r={s * 0.24} fill="none" stroke="#000" strokeOpacity={0.12} strokeWidth={2} />
	</g>
);

// Loose bricks: [x, y, size, rotation, colour], clustered on the cuts (1080, 2160, 3240)
// and drifting into the closing slide, where they lead into the star.
const LOOSE: [number, number, number, number, string][] = [
	[1010, 640, 40, -14, YELLOW],
	[1080, 700, 54, 12, RED],
	[1150, 650, 36, -8, BLUE],
	[2100, 760, 38, 16, GREEN],
	[2160, 840, 54, -12, YELLOW],
	[2225, 780, 34, 20, RED],
	[3180, 470, 38, -18, BLUE],
	[3240, 540, 54, 10, GREEN],
	[3310, 470, 36, -6, YELLOW],
	[3420, 470, 32, 14, RED],
	[3520, 430, 30, -10, BLUE],
];

// The Luciole star in bricks: a long cross with short diagonals, gold on the arms.
const STAR = [
	'.....g.....',
	'.....g.....',
	'.....g.....',
	'..b..g..b..',
	'...b.g.b...',
	'ggggg*ggggg',
	'...b.g.b...',
	'..b..g..b..',
	'.....g.....',
	'.....g.....',
	'.....g.....',
];
const STAR_COLOURS: Record<string, string> = {g: GOLD, b: BRONZE, '*': SAND};
const CELL = 46;
const STAR_X = 3 * SLIDE_W + 540; // centre of the closing slide
const STAR_Y = 450;

const StarBricks: React.FC = () => (
	<>
		{STAR.flatMap((row, r) =>
			row.split('').map((c, k) =>
				c === '.' ? null : (
					<Brick key={`${r}-${k}`} x={STAR_X + (k - 5) * CELL} y={STAR_Y + (r - 5) * CELL} s={CELL - 5} color={STAR_COLOURS[c]} />
				),
			),
		)}
	</>
);

/** Closing slide copy, under the star. */
const Closing: React.FC = () => (
	<div style={{position: 'absolute', left: 3 * SLIDE_W, top: 750, width: SLIDE_W, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
		<div style={kickerStyle}>The future</div>
		<div style={{marginTop: 14, fontFamily: display, fontSize: 74, lineHeight: 1.06, color: CHARCOAL}}>
			Small hands today.
			<br />
			<Emphasis text="*Big futures tomorrow.*" />
		</div>
		<div style={{marginTop: 22, fontFamily: display, fontSize: 34, color: 'rgba(41,41,41,0.75)'}}>They create. You pause &amp; connect.</div>
		<div
			style={{
				marginTop: 56,
				width: 1000,
				padding: '20px 32px',
				borderRadius: 24,
				background: CHARCOAL,
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
			}}
		>
			<span style={kickerStyle}>The atelier · Ages 3 to 12 · WhatsApp 81 540 282</span>
			<Img src={staticFile('reel/brand/logo-white.png')} style={{width: 140}} />
		</div>
	</div>
);

export const ProudPanorama: React.FC = () => (
	<AbsoluteFill style={{width: W, height: SLIDE_H, backgroundColor: CREAM}}>
		{PHOTO_SLIDES.map((slide, i) => (
			<div key={i} style={{position: 'absolute', left: i * SLIDE_W, top: 0, width: SLIDE_W, height: SLIDE_H, overflow: 'hidden'}}>
				<Img src={staticFile(`carousel/proud/${slide.photo}`)} style={{width: SLIDE_W, height: SLIDE_H, objectFit: 'cover', objectPosition: slide.position}} />
				<CardView card={slide.card} n={i + 1} />
			</div>
		))}

		<Closing />

		<svg width={W} height={SLIDE_H} style={{position: 'absolute', inset: 0}}>
			<g style={{filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.25))'}}>
				{LOOSE.map(([x, y, s, rot, color], i) => (
					<Brick key={i} x={x} y={y} s={s} rot={rot} color={color} />
				))}
				<StarBricks />
			</g>
		</svg>
	</AbsoluteFill>
);

/** One 1080x1350 slide: the panorama shifted so slide `index` fills the frame. */
export const ProudSlide: React.FC<{index: number}> = ({index}) => (
	<AbsoluteFill style={{overflow: 'hidden', backgroundColor: CREAM}}>
		<div style={{position: 'absolute', left: -index * SLIDE_W, top: 0, width: W, height: SLIDE_H}}>
			<ProudPanorama />
		</div>
	</AbsoluteFill>
);
