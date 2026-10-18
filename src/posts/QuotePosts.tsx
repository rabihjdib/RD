import {AbsoluteFill, Img, staticFile} from 'remotion';
import {BRONZE, CHARCOAL, display, GOLD, sans} from '../brand';
import {POST_H, POST_W} from './SparkPost';

/**
 * Instagram feed posts (1080x1350, 4:5): one original quote per portrait, on
 * childhood, happiness, discovery and curiosity. Each photo runs full bleed; the quote
 * sits on a cream wash over whichever side of that photo is quiet, clear of the face.
 *
 * Photos: public/posts/*.jpg. Render: npm run posts:quotes
 * Quote words wrapped in *asterisks* render in bronze, the deeper brand gold, which
 * holds up on the light washes.
 */

const CREAM_RGB = '237,236,227';
const wash = (deg: number, solid: number, fade: number) =>
	`linear-gradient(${deg}deg, rgba(${CREAM_RGB},0.93) 0px, rgba(${CREAM_RGB},0.85) ${solid}px, rgba(${CREAM_RGB},0) ${fade}px)`;

type Quote = {
	photo: string;
	position: string;
	wash: string;
	washDepth?: number; // stop a side wash this far down so it doesn't fog the body below
	block: React.CSSProperties; // where the quote block sits
	align: 'left' | 'right';
	kicker: string;
	lines: string[];
	size: number;
	logo: React.CSSProperties | 'inline'; // a corner of its own, or under the quote
};

export const QUOTES: Quote[] = [
	{
		photo: 'happy.jpg',
		position: '50% 0%',
		wash: wash(180, 250, 345),
		block: {left: 70, top: 60, width: 940},
		align: 'left',
		kicker: 'Happy childhood',
		lines: ['Happiness lives in', '*the smallest discoveries*.'],
		size: 62,
		logo: {left: 70, bottom: 70},
	},
	{
		photo: 'curious.jpg',
		position: '50% 50%',
		wash: wash(270, 300, 520),
		washDepth: 640,
		block: {right: 60, top: 70, width: 390},
		align: 'right',
		kicker: 'Curiosity',
		lines: ['Stay curious.', '*Big ideas*', 'start with', 'a small', 'question.'],
		size: 62,
		logo: 'inline',
	},
	{
		photo: 'discover.jpg',
		position: '50% 30%',
		wash: wash(90, 300, 500),
		washDepth: 640,
		block: {left: 60, top: 70, width: 380},
		align: 'left',
		kicker: 'Discover',
		lines: ['Let them', 'explore.', '*Let them*', '*discover.*'],
		size: 70,
		logo: 'inline',
	},
	{
		photo: 'wonder.jpg',
		position: '50% 50%',
		wash: wash(0, 200, 330),
		block: {left: 70, bottom: 56, width: 940},
		align: 'left',
		kicker: 'Childhood',
		lines: ['Childhood isn’t a race.', 'It’s *a place to wonder*.'],
		size: 62,
		logo: {left: 40, top: 40},
	},
];

const Gold: React.FC<{text: string}> = ({text}) => (
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

const Logo: React.FC = () => <Img src={staticFile('reel/brand/logo-dark.png')} style={{width: 190}} />;

export const QuotePost: React.FC<{index: number}> = ({index}) => {
	const q = QUOTES[index];
	return (
		<AbsoluteFill style={{backgroundColor: `rgb(${CREAM_RGB})`}}>
			<Img src={staticFile(`posts/${q.photo}`)} style={{width: POST_W, height: POST_H, objectFit: 'cover', objectPosition: q.position}} />
			<AbsoluteFill
				style={{
					background: q.wash,
					maskImage: q.washDepth ? `linear-gradient(180deg, #000 ${q.washDepth - 180}px, transparent ${q.washDepth}px)` : undefined,
				}}
			/>

			<div style={{position: 'absolute', ...q.block, display: 'flex', flexDirection: 'column', alignItems: q.align === 'right' ? 'flex-end' : 'flex-start', textAlign: q.align}}>
				<div style={{fontFamily: sans, fontWeight: 700, fontSize: 22, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD}}>{q.kicker}</div>
				<div style={{marginTop: 18, fontFamily: display, fontSize: q.size, lineHeight: 1.06, color: CHARCOAL}}>
					{q.lines.map((line) => (
						<div key={line} style={{whiteSpace: 'nowrap'}}>
							<Gold text={line} />
						</div>
					))}
				</div>
				{q.logo === 'inline' && (
					<div style={{marginTop: 30}}>
						<Logo />
					</div>
				)}
			</div>

			{q.logo !== 'inline' && (
				<div style={{position: 'absolute', ...q.logo, padding: '14px 22px', borderRadius: 18, background: `rgba(${CREAM_RGB},0.9)`}}>
					<Logo />
				</div>
			)}
		</AbsoluteFill>
	);
};
