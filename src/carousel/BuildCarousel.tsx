import {AbsoluteFill, Img, staticFile} from 'remotion';
import {CHARCOAL, display, GOLD, sans} from '../brand';

/**
 * Instagram carousel: building, construction and engineering at the atelier (magnetic
 * tiles, LEGO, the cube puzzle). One 4320x1350 panorama cut into 1080x1350 (4:5) slides.
 *
 * Same full-bleed approach as the umbrella carousel (~94% of each photo shown), with
 * the copy on cards printed on blueprint grid paper, and translucent magnetic-tile
 * shapes straddling every cut so each swipe carries on from the last.
 *
 * Photos: public/carousel/build/*.jpg. Render: npm run carousel:build
 */

const SLIDE_W = 1080;
const SLIDE_H = 1350;
export const BUILD_SLIDES = 4;
const W = SLIDE_W * BUILD_SLIDES;

// Magnetic tile colours, as in the photos.
const TEAL = '#33b5c9';
const PINK = '#f06aa0';
const GREEN = '#2fa35a';
const YELLOW = '#f2c23a';
const PURPLE = '#8c5fd6';

type Card = {
	x: number;
	y: number;
	w: number;
	kicker: string;
	headline?: string[];
	size?: number;
	sub?: string;
	logo?: boolean;
};

type Slide = {photo: string; position: string; cards: Card[]};

const SLIDE_COPY: Slide[] = [
	{
		photo: 'engineers.jpg',
		position: '50% 50%',
		cards: [{x: 40, y: 40, w: 460, logo: true, kicker: "L'Atelier · Build", headline: ["Tomorrow's", 'engineers', 'start *here*.'], size: 66}],
	},
	{
		photo: 'imagine.jpg',
		position: '50% 30%',
		cards: [
			{
				x: 40,
				y: 40,
				w: 1000,
				kicker: 'Step 1 · Imagine',
				headline: ['Every build starts with *a big idea*'],
				size: 52,
				sub: 'Tiles, shapes and colours. They decide what it becomes.',
			},
		],
	},
	{
		photo: 'build.jpg',
		position: '50% 50%',
		cards: [{x: 700, y: 40, w: 345, kicker: 'Step 2 · Build', headline: ['Piece by', 'piece, *their*', '*own city*'], size: 50, sub: 'Cars, cranes and boats.'}],
	},
	{
		photo: 'solve.jpg',
		position: '50% 20%',
		cards: [
			{x: 40, y: 30, w: 1000, kicker: 'Step 3 · Solve', headline: ['Test, fix, try again. *That’s engineering.*'], size: 50},
			{x: 40, y: 1190, w: 1000, kicker: 'The atelier · Ages 2 to 12 · WhatsApp 81 540 282', sub: 'Problem solving, patience and teamwork.', logo: true},
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

// Blueprint paper: a fine grid with a heavier line every fifth square.
const GRID = [
	'linear-gradient(rgba(58,98,196,0.10) 1px, transparent 1px)',
	'linear-gradient(90deg, rgba(58,98,196,0.10) 1px, transparent 1px)',
	'linear-gradient(rgba(58,98,196,0.16) 1px, transparent 1px)',
	'linear-gradient(90deg, rgba(58,98,196,0.16) 1px, transparent 1px)',
].join(', ');

const CardView: React.FC<{card: Card; n: number}> = ({card, n}) => (
	<div
		style={{
			position: 'absolute',
			left: card.x,
			top: card.y,
			width: card.w,
			padding: '24px 32px 26px',
			borderRadius: 22,
			backgroundColor: 'rgba(237,236,227,0.95)',
			backgroundImage: GRID,
			backgroundSize: '18px 18px, 18px 18px, 90px 90px, 90px 90px',
			boxShadow: '0 18px 44px rgba(41,41,41,0.3)',
		}}
	>
		{card.headline ? (
			<>
				{card.logo && (
					<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14}}>
						<Img src={staticFile('reel/brand/logo-dark.png')} style={{width: 160}} />
						<span style={{...kickerStyle, color: 'rgba(41,41,41,0.55)'}}>
							{String(n).padStart(2, '0')} / {String(BUILD_SLIDES).padStart(2, '0')}
						</span>
					</div>
				)}
				<div style={kickerStyle}>{card.kicker}</div>
				{card.headline.map((line) => (
					<div key={line} style={{marginTop: 6, fontFamily: display, fontSize: card.size, lineHeight: 1.04, color: CHARCOAL, whiteSpace: 'nowrap'}}>
						<Gold text={line} />
					</div>
				))}
				{card.sub && <div style={{marginTop: 12, fontFamily: sans, fontWeight: 700, fontSize: 25, lineHeight: 1.4, color: 'rgba(41,41,41,0.7)'}}>{card.sub}</div>}
			</>
		) : (
			// Closing card: line, then the contact row with the logo.
			<>
				<div style={{fontFamily: display, fontSize: 40, lineHeight: 1.15, color: CHARCOAL}}>{card.sub}</div>
				<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12}}>
					<span style={kickerStyle}>{card.kicker}</span>
					{card.logo && <Img src={staticFile('reel/brand/logo-dark.png')} style={{width: 130}} />}
				</div>
			</>
		)}
	</div>
);

/** A translucent magnetic tile: coloured glass with a lighter rim and a grid face. */
const Tile: React.FC<{x: number; y: number; s: number; rot: number; color: string; shape: 'tri' | 'sq'}> = ({x, y, s, rot, color, shape}) => {
	const h = s / 2;
	const outline = shape === 'tri' ? `M 0 ${-h} L ${h} ${h * 0.75} L ${-h} ${h * 0.75} Z` : `M ${-h} ${-h} H ${h} V ${h} H ${-h} Z`;
	const lines = [-0.5, 0, 0.5].map((k) => k * h);
	return (
		<g transform={`translate(${x} ${y}) rotate(${rot})`}>
			<clipPath id={`tile-${x}-${y}`}>
				<path d={outline} />
			</clipPath>
			<path d={outline} fill={color} fillOpacity={0.62} />
			<g clipPath={`url(#tile-${x}-${y})`} stroke="#fff" strokeOpacity={0.35} strokeWidth={2}>
				{lines.map((l) => (
					<line key={`h${l}`} x1={-h} x2={h} y1={l} y2={l} />
				))}
				{lines.map((l) => (
					<line key={`v${l}`} y1={-h} y2={h} x1={l} x2={l} />
				))}
			</g>
			<path d={outline} fill="none" stroke="#fff" strokeOpacity={0.9} strokeWidth={5} strokeLinejoin="round" />
		</g>
	);
};

// [x, y, size, rotation, colour, shape]: clustered on the cuts (1080, 2160, 3240) and
// kept off faces and cards.
const TILES: [number, number, number, number, string, 'tri' | 'sq'][] = [
	[1000, 760, 70, -12, GREEN, 'tri'],
	[1080, 680, 88, 14, TEAL, 'sq'],
	[1150, 790, 60, 8, PINK, 'tri'],
	[2095, 620, 64, -18, YELLOW, 'sq'],
	[2160, 540, 92, 10, PINK, 'tri'],
	[2232, 650, 70, -6, TEAL, 'sq'],
	[3170, 560, 66, 16, PURPLE, 'sq'],
	[3240, 470, 90, -10, GREEN, 'tri'],
	[3300, 590, 58, 22, YELLOW, 'tri'],
];

export const BuildPanorama: React.FC = () => (
	<AbsoluteFill style={{width: W, height: SLIDE_H, backgroundColor: '#edece3'}}>
		{SLIDE_COPY.map((slide, i) => (
			<div key={i} style={{position: 'absolute', left: i * SLIDE_W, top: 0, width: SLIDE_W, height: SLIDE_H, overflow: 'hidden'}}>
				<Img src={staticFile(`carousel/build/${slide.photo}`)} style={{width: SLIDE_W, height: SLIDE_H, objectFit: 'cover', objectPosition: slide.position}} />
				{slide.cards.map((card, k) => (
					<CardView key={k} card={card} n={i + 1} />
				))}
			</div>
		))}

		<svg width={W} height={SLIDE_H} style={{position: 'absolute', inset: 0}}>
			<g style={{filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.28))'}}>
				{TILES.map(([x, y, s, rot, color, shape], i) => (
					<Tile key={i} x={x} y={y} s={s} rot={rot} color={color} shape={shape} />
				))}
			</g>
		</svg>
	</AbsoluteFill>
);

/** One 1080x1350 slide: the panorama shifted so slide `index` fills the frame. */
export const BuildSlide: React.FC<{index: number}> = ({index}) => (
	<AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#edece3'}}>
		<div style={{position: 'absolute', left: -index * SLIDE_W, top: 0, width: W, height: SLIDE_H}}>
			<BuildPanorama />
		</div>
	</AbsoluteFill>
);
