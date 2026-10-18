import {AbsoluteFill, Img, staticFile} from 'remotion';
import {CHARCOAL, CREAM, display, GOLD, SAND, sans} from '../brand';

/**
 * Cover series for Luciole Reels. Each series shares one layout so the covers read as
 * a set in the profile grid, plus one small graphic per reel lifted from its script.
 *   preopening   "Luciole Pre-Opening Scripts" (8 reels)
 *   softopening  "LUCIOLE Soft Opening Reels Scripts v2" (8 reels)
 *   features     one-off covers (people, menu), photo named by `photo`, no numbering
 *
 * Instagram crops covers to 3:4 (1080x1440, y 240-1680) in the grid, so the logo,
 * headline and graphic stay inside that band; the footer line sits below it.
 *
 * Swap a photo: replace public/reel/cover/<series>/reel-0N.jpg with a 1080x1920 frame
 * from that reel (tone-map iPhone HDR first, see Cover.tsx), then tune `shift`/`zoom`.
 * Headline words wrapped in *asterisks* render in gold.
 */

type Series = 'preopening' | 'softopening' | 'features';

type Motif =
	| {kind: 'progress'}
	| {kind: 'bricks'}
	| {kind: 'firefly'}
	| {kind: 'names'; text: string}
	| {kind: 'chips'; items: string[]}
	| {kind: 'list'; items: string[]}
	| {kind: 'icon'; icon: string; text: string}
	| {kind: 'stopwatch'; text: string}
	| {kind: 'pill'; text: string}
	| {kind: 'cards'; items: [string, string]}
	| {kind: 'info'; rows: [string, string][]}
	| {kind: 'menu'; meals: string[]; styles: string[]}
	| {kind: 'tape'}
	| {kind: 'quote'}
	| {kind: 'none'};

export type ReelCoverProps = {
	series: Series;
	n: number;
	kicker: string;
	headline: string[];
	size: number;
	motif: Motif;
	shift: number; // px the photo is pushed down so faces clear the logo band
	zoom: number;
	originX: number; // 0..1, anchor for the zoom
	originY: number;
	photo?: string; // file in public/reel/cover/<series>/, defaults to reel-0N.jpg
};

const FOOTER: Record<Series, string> = {
	preopening: 'Opening soon in Jounieh souks',
	softopening: 'Now open in Jounieh souks',
	features: 'Luciole café & bistro · Jounieh souks',
};

const frame = {zoom: 1, originX: 0.5, originY: 0.3};

export const PRE_OPENING_COVERS: ReelCoverProps[] = [
	{series: 'preopening', n: 1, kicker: 'Luciole is officially', headline: ['Level', '*unlocked*'], size: 136, motif: {kind: 'progress'}, shift: 150, ...frame},
	{series: 'preopening', n: 2, kicker: 'From four walls to almost ready', headline: ['Watching it', 'become *real*'], size: 118, motif: {kind: 'bricks'}, shift: 300, ...frame},
	{series: 'preopening', n: 3, kicker: 'Named after a firefly', headline: ['What is', '*Luciole*?'], size: 132, motif: {kind: 'firefly'}, shift: 150, ...frame, zoom: 1.08},
	{series: 'preopening', n: 4, kicker: 'Meet the founders', headline: ['Two moms.', 'One *dream*.'], size: 124, motif: {kind: 'names', text: 'Sophanie & Jinane'}, shift: 160, ...frame, zoom: 1.12},
	{series: 'preopening', n: 5, kicker: "Which one's yours?", headline: ['*5* mom problems', '*5* Luciole fixes'], size: 100, motif: {kind: 'none'}, shift: 130, ...frame},
	{series: 'preopening', n: 6, kicker: 'Coffee for you, fun for them', headline: ["What you're", '*actually* getting'], size: 108, motif: {kind: 'chips', items: ['Café', 'Bistro', 'Atelier', 'Birthdays']}, shift: 120, ...frame},
	{series: 'preopening', n: 7, kicker: 'The best crew in Jounieh', headline: ['Our construction', '*crew*'], size: 106, motif: {kind: 'tape'}, shift: 160, zoom: 1.25, originX: 0.5, originY: 0.85},
	{series: 'preopening', n: 8, kicker: 'One question, real answers', headline: ['We asked real', 'moms in *Jounieh*'], size: 104, motif: {kind: 'quote'}, shift: 90, ...frame},
];

export const SOFT_OPENING_COVERS: ReelCoverProps[] = [
	{series: 'softopening', n: 1, kicker: 'Come see every corner', headline: ["We're", '*open*.'], size: 150, motif: {kind: 'chips', items: ['Café', 'Bistro', 'Atelier', 'Birthdays']}, shift: 120, ...frame},
	{series: 'softopening', n: 2, kicker: 'The kids atelier · Ages 3 to 12', headline: ['No tablets.', 'Just *imagination*.'], size: 106, motif: {kind: 'list', items: ['Paint', 'Clay', 'Collage', 'Beads', 'Lego']}, shift: 110, ...frame},
	{series: 'softopening', n: 3, kicker: 'With a view of the souks', headline: ['Your *pause*', 'starts here'], size: 128, motif: {kind: 'icon', icon: 'reel/icons/2615.svg', text: 'Café & Bistro'}, shift: 140, ...frame},
	{series: 'softopening', n: 4, kicker: 'Save it for your first visit', headline: ['Finding Luciole', 'in *30 seconds*'], size: 106, motif: {kind: 'stopwatch', text: 'Chiha building · 1st floor'}, shift: 130, ...frame},
	{series: 'softopening', n: 5, kicker: 'Birthday packages', headline: ['Birthdays without', 'the *stress*'], size: 108, motif: {kind: 'pill', text: 'From $20 per child'}, shift: 120, ...frame},
	{series: 'softopening', n: 6, kicker: 'Which one is yours?', headline: ['Every child', 'has a *spark*'], size: 124, motif: {kind: 'cards', items: ['Explorer', 'Innovator']}, shift: 60, ...frame},
	{series: 'softopening', n: 7, kicker: 'Hours · Booking · Website', headline: ['Save this', 'before you *visit*'], size: 112, motif: {kind: 'info', rows: [['Café & Bistro', 'Tue to Sun · 8am to 10pm'], ['Atelier', 'Tue to Fri 3pm · Weekends 10am'], ['WhatsApp', '+961 81 540 282']]}, shift: 150, ...frame},
	{series: 'softopening', n: 8, kicker: 'Safety at Luciole', headline: ['What we do so you', 'can truly *relax*'], size: 96, motif: {kind: 'list', items: ['CCTV', 'Safe sockets', 'Corner guards', 'Window locks']}, shift: 110, ...frame},
];

export const FEATURE_COVERS: ReelCoverProps[] = [
	{
		series: 'features',
		n: 1,
		photo: 'chef-mazen.jpg',
		kicker: 'The chef behind our menu',
		headline: ['Meet Chef', '*Mazen*'],
		size: 128,
		motif: {kind: 'menu', meals: ['Breakfast', 'Lunch', 'Dinner'], styles: ['Healthy menu', 'Salad bar', 'French bistro']},
		shift: 10,
		...frame,
	},
];

const COUNT: Record<Series, number> = {preopening: PRE_OPENING_COVERS.length, softopening: SOFT_OPENING_COVERS.length, features: 0};

export const COVER_SERIES = [
	{prefix: 'LucioleCover', covers: PRE_OPENING_COVERS},
	{prefix: 'LucioleSoftCover', covers: SOFT_OPENING_COVERS},
	{prefix: 'LucioleFeatureCover', covers: FEATURE_COVERS},
];

const pad = (n: number) => String(n).padStart(2, '0');

const Headline: React.FC<{lines: string[]; size: number}> = ({lines, size}) => (
	<>
		{lines.map((line) => (
			<div key={line} style={{fontFamily: display, fontSize: size, lineHeight: 1.04, color: CREAM, whiteSpace: 'nowrap'}}>
				{line.split(/(\*[^*]+\*)/).map((part, i) =>
					part.startsWith('*') ? (
						<span key={i} style={{color: GOLD}}>
							{part.slice(1, -1)}
						</span>
					) : (
						part
					),
				)}
			</div>
		))}
	</>
);

const label: React.CSSProperties = {fontFamily: sans, fontWeight: 700, fontSize: 26, letterSpacing: '0.28em', textTransform: 'uppercase'};
const Rule: React.FC = () => <div style={{width: 56, height: 2, background: GOLD}} />;

/** Pre-opening 01: the "loading a new level" bar from the hook, full. */
const Progress: React.FC = () => (
	<div style={{width: 640, marginTop: 34}}>
		<div style={{...label, display: 'flex', justifyContent: 'space-between', color: SAND, fontSize: 22}}>
			<span>Loading new level</span>
			<span style={{color: GOLD}}>100%</span>
		</div>
		<div style={{marginTop: 12, height: 22, borderRadius: 11, border: `2px solid ${GOLD}`, padding: 3}}>
			<div style={{height: '100%', borderRadius: 8, background: `linear-gradient(90deg, ${GOLD}, #e2c48f)`}} />
		</div>
	</div>
);

/** Pre-opening 02: "brick by brick", the last bricks still going in. */
const Bricks: React.FC = () => {
	const rows = [7, 6];
	return (
		<div style={{marginTop: 34, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
			{rows.map((count, r) => (
				<div key={r} style={{display: 'flex', gap: 8}}>
					{Array.from({length: count}, (_, i) => {
						const filled = r === 0 || i < 4;
						return (
							<div
								key={i}
								style={{width: 74, height: 30, borderRadius: 4, background: filled ? GOLD : 'transparent', border: `2px ${filled ? 'solid' : 'dashed'} ${GOLD}`, opacity: filled ? 1 : 0.6}}
							/>
						);
					})}
				</div>
			))}
			<span style={{...label, color: SAND, fontSize: 22, marginTop: 10}}>Brick by brick</span>
		</div>
	);
};

/** Pre-opening 03: Luciole = firefly, a glowing dot standing in for the bug. */
const Firefly: React.FC = () => (
	<div style={{marginTop: 34, display: 'flex', alignItems: 'center', gap: 22}}>
		<div style={{width: 26, height: 26, borderRadius: 13, background: '#f6ebd6', boxShadow: `0 0 18px 8px rgba(214,178,122,0.85), 0 0 60px 26px rgba(183,144,93,0.45)`}} />
		<span style={{fontFamily: display, fontSize: 50, color: SAND}}>
			Luciole <span style={{color: GOLD}}>=</span> firefly
		</span>
	</div>
);

const Names: React.FC<{text: string}> = ({text}) => (
	<div style={{marginTop: 30, display: 'flex', alignItems: 'center', gap: 22}}>
		<Rule />
		<span style={{fontFamily: display, fontSize: 52, color: SAND}}>{text}</span>
		<Rule />
	</div>
);

const Chips: React.FC<{items: string[]}> = ({items}) => (
	<div style={{marginTop: 34, display: 'flex', gap: 14}}>
		{items.map((c) => (
			<span key={c} style={{fontFamily: sans, fontWeight: 700, fontSize: 30, color: CREAM, border: `2px solid ${GOLD}`, borderRadius: 40, padding: '10px 26px'}}>
				{c}
			</span>
		))}
	</div>
);

/** A single line of items split by gold stars. */
const List: React.FC<{items: string[]}> = ({items}) => (
	<div style={{marginTop: 34, display: 'flex', alignItems: 'center', gap: 18, fontFamily: sans, fontWeight: 700, fontSize: 30, color: SAND}}>
		{items.map((item, i) => (
			<span key={item} style={{display: 'flex', alignItems: 'center', gap: 18}}>
				{i > 0 && <span style={{color: GOLD, fontSize: 22}}>✦</span>}
				{item}
			</span>
		))}
	</div>
);

const Icon: React.FC<{icon: string; text: string}> = ({icon, text}) => (
	<div style={{marginTop: 30, display: 'flex', alignItems: 'center', gap: 22}}>
		<Rule />
		<Img src={staticFile(icon)} style={{width: 54, height: 54}} />
		<span style={{fontFamily: display, fontSize: 52, color: SAND}}>{text}</span>
		<Rule />
	</div>
);

/** Soft opening 04: the on-screen stopwatch from the route reel, stopped at 0:30. */
const Stopwatch: React.FC<{text: string}> = ({text}) => (
	<div style={{marginTop: 34, display: 'flex', alignItems: 'center', gap: 26}}>
		<div style={{position: 'relative', width: 96, height: 96}}>
			<div style={{position: 'absolute', left: 38, top: -12, width: 20, height: 12, borderRadius: 3, background: GOLD}} />
			<div style={{position: 'absolute', inset: 0, borderRadius: 48, border: `4px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				<span style={{fontFamily: sans, fontWeight: 700, fontSize: 28, color: CREAM}}>0:30</span>
			</div>
		</div>
		<span style={{fontFamily: display, fontSize: 46, color: SAND}}>{text}</span>
	</div>
);

const Pill: React.FC<{text: string}> = ({text}) => (
	<div style={{marginTop: 34, fontFamily: sans, fontWeight: 700, fontSize: 36, color: CHARCOAL, background: GOLD, borderRadius: 50, padding: '14px 40px'}}>{text}</div>
);

/** Soft opening 06: the two membership cards, side by side and slightly fanned. */
const Cards: React.FC<{items: [string, string]}> = ({items}) => (
	<div style={{marginTop: 38, display: 'flex', gap: 26}}>
		{items.map((name, i) => (
			<div
				key={name}
				style={{
					width: 270,
					height: 160,
					borderRadius: 18,
					transform: `rotate(${i === 0 ? -4 : 4}deg)`,
					background: i === 0 ? GOLD : CREAM,
					color: CHARCOAL,
					padding: '18px 24px',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
				}}
			>
				<span style={{...label, fontSize: 18, letterSpacing: '0.2em', opacity: 0.75}}>Membership</span>
				<span style={{fontFamily: display, fontSize: 50}}>{name}</span>
			</div>
		))}
	</div>
);

/** Soft opening 07: the details people screenshot. */
const Info: React.FC<{rows: [string, string][]}> = ({rows}) => (
	<div style={{marginTop: 30, width: 800, display: 'flex', flexDirection: 'column'}}>
		{rows.map(([k, v], i) => (
			<div key={k} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 24, padding: '12px 0', borderTop: i ? '1px solid rgba(203,195,168,0.3)' : 'none'}}>
				<span style={{...label, fontSize: 22, color: GOLD, whiteSpace: 'nowrap'}}>{k}</span>
				<span style={{fontFamily: sans, fontWeight: 700, fontSize: 28, color: CREAM, whiteSpace: 'nowrap'}}>{v}</span>
			</div>
		))}
	</div>
);

// Grown has no curly quotes, so the mark comes from the serif fallback.
const Quote: React.FC = () => (
	<div style={{fontFamily: 'Georgia, serif', fontSize: 340, lineHeight: 1, height: 150, color: GOLD, marginBottom: 6}}>“</div>
);

/** Pre-opening 07: gold and charcoal site tape across the photo. */
const Tape: React.FC = () => (
	<div
		style={{
			position: 'absolute',
			left: -80,
			top: 930,
			width: 1240,
			height: 92,
			transform: 'rotate(-7deg)',
			background: `repeating-linear-gradient(135deg, ${GOLD} 0 46px, ${CHARCOAL} 46px 92px)`,
			boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		}}
	>
		<span style={{...label, fontSize: 30, color: CREAM, background: CHARCOAL, padding: '10px 26px'}}>Crew at work ✦ Crew at work</span>
	</div>
);

const MotifBelow: React.FC<{motif: Motif}> = ({motif}) => {
	switch (motif.kind) {
		case 'progress':
			return <Progress />;
		case 'bricks':
			return <Bricks />;
		case 'firefly':
			return <Firefly />;
		case 'names':
			return <Names text={motif.text} />;
		case 'chips':
			return <Chips items={motif.items} />;
		case 'list':
			return <List items={motif.items} />;
		case 'icon':
			return <Icon icon={motif.icon} text={motif.text} />;
		case 'stopwatch':
			return <Stopwatch text={motif.text} />;
		case 'pill':
			return <Pill text={motif.text} />;
		case 'cards':
			return <Cards items={motif.items} />;
		case 'info':
			return <Info rows={motif.rows} />;
		case 'menu':
			return (
				<>
					<List items={motif.meals} />
					<Chips items={motif.styles} />
				</>
			);
		default:
			return null;
	}
};

// Taller graphics start the text block higher so it all stays inside the grid crop.
const TEXT_TOP: Partial<Record<Motif['kind'], number>> = {quote: 1110, cards: 1130, info: 1130, menu: 1150};

export const ReelCover: React.FC<ReelCoverProps> = ({series, n, kicker, headline, size, motif, shift, zoom, originX, originY, photo}) => (
	<AbsoluteFill style={{backgroundColor: CREAM, overflow: 'hidden'}}>
		<Img
			src={staticFile(`reel/cover/${series}/${photo ?? `reel-${pad(n)}.jpg`}`)}
			style={{
				position: 'absolute',
				left: 0,
				top: shift,
				width: 1080,
				height: 1920,
				objectFit: 'cover',
				transform: `scale(${zoom})`,
				transformOrigin: `${originX * 100}% ${originY * 100}%`,
			}}
		/>

		{/* Cream band with the dark logo */}
		<AbsoluteFill
			style={{
				background: `linear-gradient(180deg, ${CREAM} 0px, ${CREAM} 300px, rgba(237,236,227,0.75) 410px, rgba(237,236,227,0) 540px)`,
			}}
		/>
		<Img src={staticFile('reel/brand/logo-dark.png')} style={{position: 'absolute', left: (1080 - 460) / 2, top: 250, width: 460}} />

		{motif.kind === 'tape' && <Tape />}

		{/* Charcoal fade for the headline */}
		<AbsoluteFill
			style={{
				background: 'linear-gradient(180deg, rgba(41,41,41,0) 980px, rgba(41,41,41,0.86) 1190px, rgba(41,41,41,0.95) 1480px, rgba(41,41,41,0.98) 1920px)',
			}}
		/>

		<AbsoluteFill style={{top: TEXT_TOP[motif.kind] ?? 1200, alignItems: 'center'}}>
			{motif.kind === 'quote' && <Quote />}
			<div style={{display: 'flex', alignItems: 'center', gap: 22}}>
				<Rule />
				<span style={{...label, color: GOLD}}>{kicker}</span>
				<Rule />
			</div>

			<div style={{marginTop: 16, textAlign: 'center'}}>
				<Headline lines={headline} size={size} />
			</div>

			<MotifBelow motif={motif} />
		</AbsoluteFill>

		{/* Below the grid crop: only seen when the reel opens full screen. */}
		<AbsoluteFill style={{top: 1752, alignItems: 'center'}}>
			<div style={{display: 'flex', alignItems: 'center', gap: 18, fontFamily: sans, fontWeight: 700, fontSize: 24, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(237,236,227,0.7)'}}>
				{COUNT[series] > 0 && (
					<>
						<span style={{color: GOLD}}>
							{pad(n)} / {pad(COUNT[series])}
						</span>
						<Img src={staticFile('reel/brand/star.png')} style={{width: 26}} />
					</>
				)}
				<span>{FOOTER[series]}</span>
			</div>
		</AbsoluteFill>
	</AbsoluteFill>
);
