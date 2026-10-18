import {AbsoluteFill, Img, staticFile} from 'remotion';
import {BRONZE, CHARCOAL, display, GOLD, sans} from '../brand';

/**
 * Instagram carousel: the wood workshop with Wood Wizard. Kids work with real tools
 * under expert guidance; parents can join in or drop them off, and every child takes
 * their piece home. One 6480x1350 panorama cut into six 1080x1350 (4:5) slides.
 *
 * Same full-bleed approach as the other carousels, with the copy on cream cards over
 * the quiet parts of each photo. A carpenter's tape measure straddles every cut and
 * keeps counting up from slide to slide.
 *
 * Photos: public/carousel/wood/*.jpg. Render: npm run carousel:wood
 */

const SLIDE_W = 1080;
const SLIDE_H = 1350;
export const WOOD_SLIDES = 6;
const W = SLIDE_W * WOOD_SLIDES;

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
		photo: 'crew.jpg',
		position: '50% 0%',
		card: {x: 40, y: 30, w: 1000, header: true, kicker: 'The wood workshop · with Wood Wizard', headline: ['Little carpenters', '*at work*.'], size: 68},
	},
	{
		photo: 'tools.jpg',
		position: '50% 0%',
		card: {
			x: 40,
			y: 60,
			w: 1000,
			kicker: 'Hands on',
			headline: ['Real tools. *Real skills.*'],
			size: 64,
			sub: 'Hammers, nails, files and sandpaper, safely guided step by step.',
		},
	},
	{
		photo: 'guide.jpg',
		position: '50% 0%',
		card: {x: 40, y: 30, w: 840, kicker: 'Expert guidance', headline: ['Expert hands *guide theirs*.'], size: 54, sub: 'Our wood masters show them how, then let them try.'},
	},
	{
		photo: 'together.jpg',
		position: '50% 0%',
		card: {x: 480, y: 30, w: 570, kicker: 'Option 1', headline: ['Parents, *join in*.'], size: 56, sub: 'Build it together and discover a new craft side by side.'},
	},
	{
		photo: 'watch.jpg',
		position: '50% 0%',
		card: {
			x: 40,
			y: 30,
			w: 860,
			kicker: 'Option 2',
			headline: ['Or let them *fly solo*.'],
			size: 56,
			sub: 'Drop them off, enjoy a coffee at our café, and come back to a proud little carpenter.',
		},
	},
	{
		photo: 'home.jpg',
		position: '50% 50%',
		card: {
			x: 40,
			y: 1030,
			w: 1000,
			kicker: 'Take it home',
			headline: ['Made by them. *Taken home.*'],
			size: 54,
			sub: 'Every child leaves with a piece they built with their own hands.',
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
					{String(n).padStart(2, '0')} / {String(WOOD_SLIDES).padStart(2, '0')}
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
				<span style={kickerStyle}>The atelier · Ages 3 to 12 · WhatsApp 81 540 282</span>
				<Img src={staticFile('reel/brand/logo-dark.png')} style={{width: 130}} />
			</div>
		)}
	</div>
);

/** A strip of carpenter's tape: yellow blade, cm ticks, half-cm ticks and numbers. */
const Tape: React.FC<{x: number; y: number; rot: number; from: number}> = ({x, y, rot, from}) => {
	const L = 330;
	const H = 50;
	const CM = 40;
	const ticks = Math.floor(L / (CM / 2));
	return (
		<g transform={`translate(${x} ${y}) rotate(${rot})`}>
			<rect x={-L / 2} y={-H / 2} width={L} height={H} rx={4} fill="#f2c230" stroke="#c99a10" strokeWidth={2} />
			{Array.from({length: ticks + 1}, (_, i) => {
				const tx = -L / 2 + 6 + i * (CM / 2);
				const whole = i % 2 === 0;
				return <line key={i} x1={tx} x2={tx} y1={-H / 2} y2={-H / 2 + (whole ? 18 : 10)} stroke={CHARCOAL} strokeWidth={whole ? 3 : 2} />;
			})}
			{Array.from({length: Math.floor(ticks / 2) + 1}, (_, i) => (
				<text key={i} x={-L / 2 + 6 + i * CM} y={H / 2 - 7} textAnchor="middle" fontFamily="Manrope" fontWeight={700} fontSize={17} fill={from + i === from + 2 ? '#c0322a' : CHARCOAL}>
					{from + i}
				</text>
			))}
		</g>
	);
};

// [x, y, rotation, first number]: one strip per cut (1080 ... 5400), off faces and cards.
const TAPES: [number, number, number, number][] = [
	[1080, 520, -8, 10],
	[2160, 430, 6, 20],
	[3240, 720, -5, 30],
	[4320, 420, 8, 40],
	[5400, 250, -6, 50],
];

export const WoodPanorama: React.FC = () => (
	<AbsoluteFill style={{width: W, height: SLIDE_H, backgroundColor: '#edece3'}}>
		{SLIDE_COPY.map((slide, i) => (
			<div key={i} style={{position: 'absolute', left: i * SLIDE_W, top: 0, width: SLIDE_W, height: SLIDE_H, overflow: 'hidden'}}>
				<Img src={staticFile(`carousel/wood/${slide.photo}`)} style={{width: SLIDE_W, height: SLIDE_H, objectFit: 'cover', objectPosition: slide.position}} />
				<CardView card={slide.card} n={i + 1} />
			</div>
		))}

		<svg width={W} height={SLIDE_H} style={{position: 'absolute', inset: 0}}>
			<g style={{filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.3))'}}>
				{TAPES.map(([x, y, rot, from], i) => (
					<Tape key={i} x={x} y={y} rot={rot} from={from} />
				))}
			</g>
		</svg>
	</AbsoluteFill>
);

/** One 1080x1350 slide: the panorama shifted so slide `index` fills the frame. */
export const WoodSlide: React.FC<{index: number}> = ({index}) => (
	<AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#edece3'}}>
		<div style={{position: 'absolute', left: -index * SLIDE_W, top: 0, width: W, height: SLIDE_H}}>
			<WoodPanorama />
		</div>
	</AbsoluteFill>
);
