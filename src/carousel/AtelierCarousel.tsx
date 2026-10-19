import {AbsoluteFill, Img, staticFile} from 'remotion';
import {CHARCOAL, CREAM, display, GOLD, OLIVE, SAND, sans} from '../brand';

/**
 * Instagram carousel: four slides on the atelier's pixel-brick workshop, designed as
 * one 4320x1350 panorama and cut into 1080x1350 (4:5) slides. A gold thread and a
 * trail of bricks run behind the photos and straddle each cut, so every swipe
 * visibly carries on from the last.
 *
 * Photos: public/carousel/atelier/*.jpg (swap any of them; `position` picks the crop).
 * Render: npm run carousel:atelier
 */

export const SLIDE_W = 1080;
export const SLIDE_H = 1350;
export const SLIDES = 4;
const W = SLIDE_W * SLIDES;

// The kids' brick colours, a touch softened so they sit with the brand palette.
const RED = '#d2483c';
const YELLOW = '#f0c23b';
const GREEN = '#3c8a54';
const BLUE = '#3a62c4';

type Slide = {
	headline: string[];
	sub?: string;
	photo: string;
	position: string; // object-position for the arch crop
	archX: number; // left edge of the arch inside the slide
};

const ARCH_W = 720;
const ARCH_TOP = 540;
const ARCH_H = 740;

const SLIDE_COPY: Slide[] = [
	{headline: ['Every creation', 'starts with', '*one small piece*'], photo: 'flower.jpg', position: '50% 75%', archX: 280},
	{
		headline: ['Tiny pieces,', '*big focus*'],
		sub: 'Picking colours and following a pattern builds fine motor skills and concentration, and to them it is just play.',
		photo: 'focus.jpg',
		position: '50% 42%',
		archX: 80,
	},
	{
		headline: ['Colours become', '*their own ideas*'],
		sub: 'Patterns, puzzles and pixel art. No screens, just their imagination doing the work.',
		photo: 'colours.jpg',
		position: '50% 62%',
		archX: 280,
	},
	{
		headline: ['They create.', 'You *pause & connect*.'],
		sub: 'While they build, you get a real coffee and a real conversation at our café.',
		photo: 'smile.jpg',
		position: '50% 52%',
		archX: 80,
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

/** The gold thread: one smooth wave across the whole panorama, behind the photos. */
const thread = (() => {
	const pts = [
		[-40, 980],
		[540, 860],
		[1080, 1010],
		[1620, 900],
		[2160, 1040],
		[2700, 880],
		[3240, 1000],
		[3780, 900],
		[4360, 960],
	];
	let d = `M ${pts[0][0]} ${pts[0][1]}`;
	for (let i = 1; i < pts.length; i++) {
		const [x0, y0] = pts[i - 1];
		const [x1, y1] = pts[i];
		const mx = (x0 + x1) / 2;
		d += ` C ${mx} ${y0}, ${mx} ${y1}, ${x1} ${y1}`;
	}
	return d;
})();

// Bricks along the thread: [x, y, size, rotation, colour]. The ones near 1080, 2160 and
// 3240 sit across the cuts on purpose.
const BRICKS: [number, number, number, number, string][] = [
	[960, 330, 34, -12, YELLOW],
	[1050, 1000, 56, 14, RED],
	[1112, 1060, 40, -8, YELLOW],
	[1990, 470, 30, 18, GREEN],
	[2135, 1030, 52, -16, GREEN],
	[2196, 970, 38, 10, BLUE],
	[2230, 1110, 30, 28, RED],
	[3130, 330, 30, -20, BLUE],
	[3215, 990, 54, 8, YELLOW],
	[3270, 1060, 40, -14, RED],
	[4235, 640, 32, 16, GREEN],
	[4200, 1180, 44, -10, BLUE],
];

const Brick: React.FC<{x: number; y: number; s: number; rot: number; color: string}> = ({x, y, s, rot, color}) => (
	<g transform={`rotate(${rot} ${x} ${y})`}>
		<rect x={x - s / 2} y={y - s / 2} width={s} height={s} rx={s * 0.14} fill={color} />
		<circle cx={x} cy={y} r={s * 0.24} fill="#fff" opacity={0.28} />
		<circle cx={x} cy={y} r={s * 0.24} fill="none" stroke="#000" strokeOpacity={0.12} strokeWidth={2} />
	</g>
);

const ArchPhoto: React.FC<{x: number; src: string; position: string}> = ({x, src, position}) => (
	<>
		{/* Offset gold outline, like a frame hung slightly behind the photo */}
		<div style={{position: 'absolute', left: x + 22, top: ARCH_TOP - 22, width: ARCH_W, height: ARCH_H, borderRadius: `${ARCH_W / 2}px ${ARCH_W / 2}px 28px 28px`, border: `3px solid ${GOLD}`}} />
		<Img
			src={staticFile(`carousel/atelier/${src}`)}
			style={{position: 'absolute', left: x, top: ARCH_TOP, width: ARCH_W, height: ARCH_H, objectFit: 'cover', objectPosition: position, borderRadius: `${ARCH_W / 2}px ${ARCH_W / 2}px 28px 28px`, boxShadow: '0 24px 60px rgba(41,41,41,0.22)'}}
		/>
	</>
);

const Header: React.FC<{i: number}> = ({i}) => (
	<div style={{position: 'absolute', left: 90, right: 90, top: 70, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
		<Img src={staticFile('reel/brand/logo-dark.png')} style={{width: 190}} />
		<span style={{fontFamily: sans, fontWeight: 700, fontSize: 22, letterSpacing: '0.28em', color: OLIVE}}>
			L'ATELIER <span style={{color: GOLD}}>· {String(i + 1).padStart(2, '0')} / {String(SLIDES).padStart(2, '0')}</span>
		</span>
	</div>
);

const Copy: React.FC<{slide: Slide}> = ({slide}) => (
	<div style={{position: 'absolute', left: 90, right: 90, top: 190}}>
		{slide.headline.map((line) => (
			<div key={line} style={{fontFamily: display, fontSize: slide.headline.length > 2 ? 92 : 100, lineHeight: 1.02, color: CHARCOAL, whiteSpace: 'nowrap'}}>
				<Gold text={line} />
			</div>
		))}
		{slide.sub && <div style={{marginTop: 22, maxWidth: 860, fontFamily: sans, fontWeight: 700, fontSize: 29, lineHeight: 1.4, color: 'rgba(41,41,41,0.68)'}}>{slide.sub}</div>}
	</div>
);

/** Closing card on the last slide, over the bottom of the photo. */
const Cta: React.FC = () => (
	<div
		style={{
			position: 'absolute',
			left: 150,
			right: 150,
			top: 1090,
			background: CHARCOAL,
			borderRadius: 24,
			padding: '30px 40px',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			gap: 10,
			boxShadow: '0 20px 50px rgba(41,41,41,0.35)',
		}}
	>
		<span style={{fontFamily: sans, fontWeight: 700, fontSize: 24, letterSpacing: '0.26em', textTransform: 'uppercase', color: GOLD}}>The atelier · Ages 2 to 12</span>
		<span style={{fontFamily: display, fontSize: 44, color: CREAM}}>Jounieh Souks</span>
		<span style={{fontFamily: sans, fontWeight: 700, fontSize: 28, color: SAND}}>Book on WhatsApp · 81 540 282</span>
	</div>
);

/** The whole panorama, 4320x1350. */
export const AtelierPanorama: React.FC = () => (
	<AbsoluteFill style={{width: W, height: SLIDE_H, background: `linear-gradient(90deg, ${CREAM}, #f3efe4 50%, ${CREAM})`}}>
		<svg width={W} height={SLIDE_H} style={{position: 'absolute', inset: 0}}>
			<path d={thread} stroke={GOLD} strokeWidth={4} fill="none" strokeLinecap="round" />
			<path d={thread} stroke={GOLD} strokeWidth={2} fill="none" strokeDasharray="2 16" strokeLinecap="round" transform="translate(0 26)" opacity={0.6} />
		</svg>

		{SLIDE_COPY.map((slide, i) => (
			<div key={i} style={{position: 'absolute', left: i * SLIDE_W, top: 0, width: SLIDE_W, height: SLIDE_H}}>
				<Header i={i} />
				<Copy slide={slide} />
				<ArchPhoto x={slide.archX} src={slide.photo} position={slide.position} />
				{i === SLIDES - 1 && <Cta />}
			</div>
		))}

		{/* Bricks go on top so the ones crossing a cut read clearly on both slides */}
		<svg width={W} height={SLIDE_H} style={{position: 'absolute', inset: 0}}>
			{BRICKS.map(([x, y, s, rot, color], i) => (
				<Brick key={i} x={x} y={y} s={s} rot={rot} color={color} />
			))}
		</svg>
	</AbsoluteFill>
);

/** One 1080x1350 slide: the panorama shifted so slide `index` fills the frame. */
export const AtelierSlide: React.FC<{index: number}> = ({index}) => (
	<AbsoluteFill style={{overflow: 'hidden', backgroundColor: CREAM}}>
		<div style={{position: 'absolute', left: -index * SLIDE_W, top: 0, width: W, height: SLIDE_H}}>
			<AtelierPanorama />
		</div>
	</AbsoluteFill>
);
