import {AbsoluteFill, Img, staticFile} from 'remotion';
import {BRONZE, CHARCOAL, display, GOLD, OLIVE, sans} from '../brand';

/**
 * Instagram carousel: science at the atelier, kids in lab coats making dry-ice fog.
 * One 5400x1350 panorama cut into five 1080x1350 (4:5) slides.
 *
 * Same full-bleed approach as the other carousels, with the copy on cream cards over
 * the quiet parts of each photo. Puffs of lab fog with atom symbols (as on the party
 * decor) straddle every cut so each swipe carries on from the last.
 *
 * Photos: public/carousel/science/*.jpg. Render: npm run carousel:science
 */

const SLIDE_W = 1080;
const SLIDE_H = 1350;
export const SCIENCE_SLIDES = 5;
const W = SLIDE_W * SCIENCE_SLIDES;

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
		photo: 'wow.jpg',
		position: '50% 50%',
		cards: [
			{
				x: 40,
				y: 1050,
				w: 1000,
				header: true,
				kicker: "L'Atelier · Science fun",
				headline: ['Let them discover science. *And have fun.*'],
				size: 48,
			},
		],
	},
	{
		photo: 'lab.jpg',
		position: '50% 50%',
		cards: [{x: 40, y: 1100, w: 1000, kicker: 'Step into the lab', headline: ['Real experiments, *real wow*.'], size: 56, sub: 'Lab coats on, goggles down, and the fog starts rolling.'}],
	},
	{
		photo: 'cloud.jpg',
		position: '50% 45%',
		cards: [{x: 40, y: 1100, w: 1000, kicker: 'Hands on', headline: ['They don’t just watch. *They make the clouds.*'], size: 46, sub: 'Every child gets a turn to run the experiment.'}],
	},
	{
		photo: 'curious.jpg',
		position: '50% 50%',
		cards: [{x: 620, y: 30, w: 420, kicker: 'Curiosity', headline: ['Every “why?”', 'gets *an answer*.'], size: 46}],
	},
	{
		photo: 'fun.jpg',
		position: '50% 50%',
		cards: [
			{x: 40, y: 30, w: 470, kicker: 'Learning through play', headline: ['Science they', 'will *never forget*.'], size: 46},
			{x: 40, y: 1236, w: 1000, kicker: 'Science parties · Ages 3 to 12 · WhatsApp 81 540 282'},
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
					{String(n).padStart(2, '0')} / {String(SCIENCE_SLIDES).padStart(2, '0')}
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

/** A puff of lab fog: overlapping soft white circles with a faint outline so it reads on white walls. */
const Puff: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => {
	const blobs: [number, number, number][] = [
		[-0.55, 0.15, 0.42],
		[-0.15, -0.2, 0.55],
		[0.35, -0.05, 0.48],
		[0.7, 0.2, 0.34],
		[0.1, 0.3, 0.45],
	];
	return (
		<g>
			{blobs.map(([dx, dy, r], i) => (
				<circle key={`o${i}`} cx={x + dx * s} cy={y + dy * s} r={r * s + 3} fill="rgba(120,130,140,0.35)" />
			))}
			{blobs.map(([dx, dy, r], i) => (
				<circle key={i} cx={x + dx * s} cy={y + dy * s} r={r * s} fill="#fbfbf9" />
			))}
		</g>
	);
};

/** The atom from the party decor: three orbits round a nucleus, on a cream disc. */
const Atom: React.FC<{x: number; y: number; r: number}> = ({x, y, r}) => (
	<g>
		<circle cx={x} cy={y} r={r * 1.18} fill="#edece3" stroke="#fff" strokeWidth={4} />
		{[0, 60, 120].map((a) => (
			<ellipse key={a} cx={x} cy={y} rx={r * 0.95} ry={r * 0.36} fill="none" stroke={OLIVE} strokeWidth={r * 0.09} transform={`rotate(${a} ${x} ${y})`} />
		))}
		<circle cx={x} cy={y} r={r * 0.17} fill={BRONZE} />
	</g>
);

// [x, y, size] puffs and [x, y, radius] atoms on each cut (1080 ... 4320), off faces and cards.
const PUFFS: [number, number, number][] = [
	[1080, 820, 90],
	[2160, 930, 90],
	[3240, 900, 90],
	[4320, 860, 90],
];
const ATOMS: [number, number, number][] = [
	[1010, 660, 40],
	[2215, 1010, 38],
	[3290, 800, 40],
	[4380, 990, 38],
];

export const SciencePanorama: React.FC = () => (
	<AbsoluteFill style={{width: W, height: SLIDE_H, backgroundColor: '#edece3'}}>
		{SLIDE_COPY.map((slide, i) => (
			<div key={i} style={{position: 'absolute', left: i * SLIDE_W, top: 0, width: SLIDE_W, height: SLIDE_H, overflow: 'hidden'}}>
				<Img src={staticFile(`carousel/science/${slide.photo}`)} style={{width: SLIDE_W, height: SLIDE_H, objectFit: 'cover', objectPosition: slide.position}} />
				{slide.cards.map((card, k) => (
					<CardView key={k} card={card} n={i + 1} />
				))}
			</div>
		))}

		<svg width={W} height={SLIDE_H} style={{position: 'absolute', inset: 0}}>
			<g style={{filter: 'drop-shadow(0 8px 14px rgba(0,0,0,0.25))'}}>
				{PUFFS.map(([x, y, s], i) => (
					<Puff key={i} x={x} y={y} s={s} />
				))}
				{ATOMS.map(([x, y, r], i) => (
					<Atom key={i} x={x} y={y} r={r} />
				))}
			</g>
		</svg>
	</AbsoluteFill>
);

/** One 1080x1350 slide: the panorama shifted so slide `index` fills the frame. */
export const ScienceSlide: React.FC<{index: number}> = ({index}) => (
	<AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#edece3'}}>
		<div style={{position: 'absolute', left: -index * SLIDE_W, top: 0, width: W, height: SLIDE_H}}>
			<SciencePanorama />
		</div>
	</AbsoluteFill>
);
