import {AbsoluteFill, Img, staticFile} from 'remotion';
import {BRONZE, CHARCOAL, display, GOLD, sans} from '../brand';
import {Heart} from '../posts/HeartPost';

/**
 * Instagram Stories (1080x1920, 9:16) made from the feed posts, with each photo
 * running full bleed. Every 3:4 photo fills the frame at full height, so the
 * horizontal crop (`x`, as an objectPosition percentage) picks which part stays in.
 * The copy sits on cream cards between the profile bar (top 220) and the reply bar
 * (bottom 270). Cards that covered a child's name or another family's branding in
 * the posts still cover them here; `flush` cards run to the bottom edge for that.
 *
 * Photos: public/posts/*.jpg. Render: npm run stories:posts
 */

export const STORY_W = 1080;
export const STORY_H = 1920;
const SAFE_BOTTOM = 270;

type Card = {
	left?: number;
	right?: number;
	top?: number;
	bottom?: number;
	w: number;
	align?: 'left' | 'center';
	flush?: boolean; // runs to the bottom edge, text kept above the reply bar
};

type Story = {
	id: string;
	file: string;
	photo: string;
	x: number;
	card: Card;
	kicker: string;
	lines: string[];
	size: number;
	sub?: string[];
	heart?: boolean; // "And we ♥ Luciole"
};

export const STORY_POSTS: Story[] = [
	{
		id: 'Spark',
		file: 'spark-of-the-future',
		photo: 'spark-girl.jpg',
		x: 50,
		card: {left: 40, top: 250, w: 480},
		kicker: 'The child of the future',
		lines: ['Every child', 'carries a', '*spark*', 'of the future.'],
		size: 64,
		sub: ['Our job is to give it', 'room to shine.'],
	},
	{
		id: 'Quote1',
		file: 'quote-1',
		photo: 'happy.jpg',
		x: 50,
		card: {left: 40, top: 240, w: 1000},
		kicker: 'Happy childhood',
		lines: ['Happiness lives in', '*the smallest discoveries*.'],
		size: 54,
	},
	{
		id: 'Quote2',
		file: 'quote-2',
		photo: 'curious.jpg',
		x: 0,
		card: {left: 40, bottom: SAFE_BOTTOM + 20, w: 1000},
		kicker: 'Curiosity',
		lines: ['Stay curious. *Big ideas* start', 'with a small question.'],
		size: 52,
	},
	{
		id: 'Quote3',
		file: 'quote-3',
		photo: 'discover.jpg',
		x: 0,
		card: {left: 40, top: 700, w: 430},
		kicker: 'Discover',
		lines: ['Let them', 'explore.', '*Let them*', '*discover.*'],
		size: 66,
	},
	{
		id: 'Quote4',
		file: 'quote-4',
		photo: 'wonder.jpg',
		x: 50,
		card: {left: 40, bottom: SAFE_BOTTOM + 20, w: 1000},
		kicker: 'Childhood',
		lines: ['Childhood isn’t a race.', 'It’s *a place to wonder*.'],
		size: 56,
	},
	{
		id: 'Love',
		file: 'your-kids-are-our-kids',
		photo: 'love.jpg',
		x: 0,
		card: {left: 40, top: 240, w: 1000, align: 'center'},
		kicker: 'Built by moms, for moms',
		lines: ['Your kids are *our kids*.'],
		size: 70,
		sub: ['A place full of love and care.'],
	},
	{
		id: 'Heart',
		file: 'and-we-love-luciole',
		photo: 'heart.jpg',
		x: 60,
		card: {left: 0, w: 1080, align: 'center', flush: true},
		kicker: 'Spotted at the atelier',
		lines: ['And we'],
		size: 92,
		heart: true,
		sub: ['Ages 2 to 12 · Jounieh Souks'],
	},
	{
		id: 'Pretend',
		file: 'no-need-to-pretend',
		photo: 'pretend.jpg',
		x: 50,
		card: {left: 40, top: 520, w: 400},
		kicker: "L'Atelier",
		lines: ['Just', 'pretending?', '*No need.*'],
		size: 58,
		sub: ['At Luciole, we show', 'you what to do, and', 'how to do it.'],
	},
	{
		id: 'MomDiscover',
		file: 'moms-love-to-discover',
		photo: 'mom-discover.jpg',
		x: 50,
		card: {left: 40, top: 250, w: 560},
		kicker: 'Not just for kids',
		lines: ['Even moms', '*love to discover.*'],
		size: 58,
		sub: ['Paints, canvases and new ideas.', 'There’s a little artist in you too.'],
	},
	{
		id: 'Smile',
		file: 'priceless-smile',
		photo: 'smile.jpg',
		x: 85,
		card: {left: 30, top: 240, w: 400},
		kicker: 'After the workshop',
		lines: ['Happy result.', '*Priceless smile.*'],
		size: 48,
		sub: ['Built with his own', 'hands at our wood', 'workshop.'],
	},
	{
		id: 'Watch',
		file: 'eyes-on-them',
		photo: 'watch.jpg',
		x: 50,
		card: {right: 0, w: 600, flush: true},
		kicker: 'Our team',
		lines: ['Eyes on them,', '*every moment.*'],
		size: 58,
		sub: ['Our trained team watches over', 'your kids from drop-off to pick-up.'],
	},
	{
		id: 'Princess',
		file: 'strong-little-princess',
		photo: 'princess.jpg',
		x: 30,
		card: {left: 24, top: 640, w: 340},
		kicker: 'Little builders',
		lines: ['Strong', 'little', '*princess.*'],
		size: 60,
		sub: ['Here, princesses', 'build their own', 'castles, brick', 'by brick.'],
	},
	{
		id: 'Creator',
		file: 'happy-creator',
		photo: 'creator.jpg',
		x: 100,
		card: {right: 30, top: 250, w: 420},
		kicker: 'Wood workshop',
		lines: ['Happy', '*creator.*'],
		size: 64,
		sub: ['A is for amazing.', 'Hammered, strung', 'and made with love.'],
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

export const PostStory: React.FC<{post: number}> = ({post}) => {
	const s = STORY_POSTS[post];
	const {card} = s;
	const center = card.align === 'center';
	return (
		<AbsoluteFill style={{backgroundColor: '#edece3'}}>
			<Img src={staticFile(`posts/${s.photo}`)} style={{width: STORY_W, height: STORY_H, objectFit: 'cover', objectPosition: `${s.x}% 50%`}} />

			<div
				style={{
					position: 'absolute',
					left: card.left,
					right: card.right,
					top: card.top,
					bottom: card.flush ? 0 : card.bottom,
					width: card.w,
					padding: card.flush ? `40px 48px ${SAFE_BOTTOM}px` : '28px 34px 30px',
					borderRadius: card.flush ? (card.w === STORY_W ? '40px 40px 0 0' : '32px 0 0 0') : 28,
					background: card.flush ? '#edece3' : 'rgba(237,236,227,0.96)', // flush cards hide names and branding, so solid
					boxShadow: '0 18px 50px rgba(41,41,41,0.3)',
					display: 'flex',
					flexDirection: 'column',
					alignItems: center ? 'center' : 'flex-start',
					textAlign: center ? 'center' : 'left',
				}}
			>
				<div style={{fontFamily: sans, fontWeight: 700, fontSize: 22, letterSpacing: '0.26em', textTransform: 'uppercase', color: GOLD}}>{s.kicker}</div>
				<div style={{marginTop: 10, fontFamily: display, fontSize: s.size, lineHeight: 1.05, color: CHARCOAL}}>
					{s.lines.map((line) => (
						<div key={line} style={{whiteSpace: 'nowrap'}}>
							<Emphasis text={line} />
							{s.heart && (
								<>
									<Heart size={s.size * 0.85} />
									Luciole
								</>
							)}
						</div>
					))}
				</div>
				{s.sub && (
					<div style={{marginTop: 14, fontFamily: sans, fontWeight: 700, fontSize: 25, lineHeight: 1.4, color: 'rgba(41,41,41,0.7)'}}>
						{s.sub.map((line) => (
							<div key={line}>{line}</div>
						))}
					</div>
				)}
				<div
					style={{
						marginTop: 18,
						paddingTop: 14,
						alignSelf: 'stretch',
						borderTop: '1px solid rgba(41,41,41,0.15)',
						display: 'flex',
						// Narrow cards stack the logo over the number.
						flexDirection: card.w < 520 ? 'column' : 'row',
						justifyContent: center ? 'center' : 'space-between',
						alignItems: card.w < 520 ? 'flex-start' : 'center',
						gap: card.w < 520 ? 10 : 24,
					}}
				>
					<Img src={staticFile('reel/brand/logo-dark.png')} style={{width: 130}} />
					<span style={{fontFamily: sans, fontWeight: 700, fontSize: 19, letterSpacing: '0.12em', textTransform: 'uppercase', color: GOLD}}>WhatsApp 81 540 282</span>
				</div>
			</div>
		</AbsoluteFill>
	);
};
