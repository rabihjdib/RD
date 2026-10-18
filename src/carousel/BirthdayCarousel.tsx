import {AbsoluteFill, Img, staticFile} from 'remotion';
import {BRONZE, CHARCOAL, display, GOLD, sans} from '../brand';

/**
 * Instagram carousel: birthdays at Luciole, where we take care of everything (theme,
 * decoration, entertainment, activities, food) so parents enjoy the day too. One
 * 8640x1350 panorama cut into eight 1080x1350 (4:5) slides.
 *
 * Same full-bleed approach as the other carousels, with the copy on cream cards over
 * the quiet parts of each photo. Party balloons in the olive, black and silver of the
 * decor straddle every cut so each swipe carries on from the last.
 *
 * Photos: public/carousel/birthday/*.jpg. Render: npm run carousel:birthday
 */

const SLIDE_W = 1080;
const SLIDE_H = 1350;
export const BIRTHDAY_SLIDES = 8;
const W = SLIDE_W * BIRTHDAY_SLIDES;

// The party's balloon colours.
const OLIVE_B = '#9aa65a';
const SAGE_B = '#b9b98e';
const BLACK_B = '#2b2b2b';
const SILVER_B = '#d9dbd8';

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
		photo: 'decor.jpg',
		position: '50% 50%',
		card: {
			x: 40,
			y: 30,
			w: 1000,
			header: true,
			kicker: 'Birthdays at Luciole',
			headline: ['We take care of *everything*.'],
			size: 64,
			sub: 'Food, decoration, entertainment and your theme. You just enjoy the day.',
		},
	},
	{
		photo: 'theme.jpg',
		position: '50% 30%',
		card: {
			x: 40,
			y: 1060,
			w: 1000,
			kicker: 'Your theme',
			headline: ['Their dream party, *their theme*.'],
			size: 56,
			sub: 'Little scientist, artist or astronaut: we bring their idea to life.',
		},
	},
	{
		photo: 'table.jpg',
		position: '50% 100%',
		card: {
			x: 40,
			y: 30,
			w: 1000,
			kicker: 'Decoration',
			headline: ['Styled down to *the last napkin*.'],
			size: 56,
			sub: 'Backdrops, balloons, placemats and table settings, all matched to the theme.',
		},
	},
	{
		photo: 'show.jpg',
		position: '50% 50%',
		card: {x: 560, y: 30, w: 430, kicker: 'Entertainment', headline: ['Shows that', 'make them', '*scream with joy*.'], size: 50, sub: 'Live experiments, foam, games and animation.'},
	},
	{
		photo: 'hands-on.jpg',
		position: '50% 40%',
		card: {
			x: 40,
			y: 1080,
			w: 1000,
			kicker: 'Activities',
			headline: ['They don’t just watch. *They do it.*'],
			size: 52,
			sub: 'Hands-on workshops at our atelier, part of the party.',
		},
	},
	{
		photo: 'food.jpg',
		position: '50% 60%',
		card: {x: 40, y: 30, w: 1000, kicker: 'Food', headline: ['A menu they love, *served for them*.'], size: 52, sub: 'Kids menu, fresh juice and a buffet for the parents.'},
	},
	{
		photo: 'cake.jpg',
		position: '50% 30%',
		card: {x: 40, y: 30, w: 520, kicker: 'And you?', headline: ['You just', '*enjoy the*', '*moment*.'], size: 56, sub: 'No running around. This time, you celebrate too.'},
	},
	{
		photo: 'group.jpg',
		position: '50% 60%',
		card: {
			x: 40,
			y: 30,
			w: 1000,
			kicker: 'Book their birthday',
			headline: ['Let’s make it *unforgettable*.'],
			size: 58,
			sub: 'Packages from $20 per child. Book 3 weeks ahead and leave the rest to us.',
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
					{String(n).padStart(2, '0')} / {String(BIRTHDAY_SLIDES).padStart(2, '0')}
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

/** A latex balloon on a curly string: body, knot, highlight and a white rim for contrast. */
const Balloon: React.FC<{x: number; y: number; r: number; color: string; tilt: number}> = ({x, y, r, color, tilt}) => {
	const knotY = y + r * 1.18;
	const dark = color === BLACK_B;
	return (
		<g transform={`rotate(${tilt} ${x} ${y})`}>
			<path
				d={`M ${x} ${knotY + 10} c ${-r * 0.35} ${r * 0.5}, ${r * 0.35} ${r * 0.8}, 0 ${r * 1.3} s ${r * 0.3} ${r * 0.8}, 0 ${r * 1.2}`}
				stroke={dark ? '#555' : '#8a8a8a'}
				strokeWidth={3}
				fill="none"
			/>
			<ellipse cx={x} cy={y} rx={r} ry={r * 1.16} fill={color} stroke="#fff" strokeWidth={4} />
			<path d={`M ${x - r * 0.16} ${knotY + 12} L ${x + r * 0.16} ${knotY + 12} L ${x} ${knotY - 4} Z`} fill={color} />
			<ellipse cx={x - r * 0.36} cy={y - r * 0.42} rx={r * 0.2} ry={r * 0.32} fill="#fff" opacity={dark ? 0.35 : 0.55} transform={`rotate(-28 ${x - r * 0.36} ${y - r * 0.42})`} />
		</g>
	);
};

// [x, y, radius, colour, tilt]: a cluster of two or three on each cut (1080 ... 7560),
// kept off faces and cards.
const BALLOONS: [number, number, number, string, number][] = [
	[1040, 640, 54, OLIVE_B, -8],
	[1120, 720, 44, BLACK_B, 10],
	[2120, 330, 50, SILVER_B, -6],
	[2200, 400, 42, OLIVE_B, 12],
	[3200, 820, 52, BLACK_B, -10],
	[3280, 900, 40, SAGE_B, 8],
	[4290, 470, 40, OLIVE_B, 6],
	[4360, 540, 34, SILVER_B, -12],
	[5360, 380, 52, SAGE_B, -6],
	[5440, 460, 42, BLACK_B, 10],
	[6450, 330, 46, OLIVE_B, -8],
	[6520, 400, 38, SILVER_B, 12],
	[7520, 520, 52, BLACK_B, 6],
	[7600, 600, 42, OLIVE_B, -10],
];

export const BirthdayPanorama: React.FC = () => (
	<AbsoluteFill style={{width: W, height: SLIDE_H, backgroundColor: '#edece3'}}>
		{SLIDE_COPY.map((slide, i) => (
			<div key={i} style={{position: 'absolute', left: i * SLIDE_W, top: 0, width: SLIDE_W, height: SLIDE_H, overflow: 'hidden'}}>
				<Img src={staticFile(`carousel/birthday/${slide.photo}`)} style={{width: SLIDE_W, height: SLIDE_H, objectFit: 'cover', objectPosition: slide.position}} />
				<CardView card={slide.card} n={i + 1} />
			</div>
		))}

		<svg width={W} height={SLIDE_H} style={{position: 'absolute', inset: 0}}>
			<g style={{filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.25))'}}>
				{BALLOONS.map(([x, y, r, color, tilt], i) => (
					<Balloon key={i} x={x} y={y} r={r} color={color} tilt={tilt} />
				))}
			</g>
		</svg>
	</AbsoluteFill>
);

/** One 1080x1350 slide: the panorama shifted so slide `index` fills the frame. */
export const BirthdaySlide: React.FC<{index: number}> = ({index}) => (
	<AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#edece3'}}>
		<div style={{position: 'absolute', left: -index * SLIDE_W, top: 0, width: W, height: SLIDE_H}}>
			<BirthdayPanorama />
		</div>
	</AbsoluteFill>
);
