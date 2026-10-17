import {AbsoluteFill, Img, staticFile} from 'remotion';
import {CHARCOAL, CREAM, display, GOLD, SAND, sans} from '../brand';

/**
 * Covers for the eight pre-opening Reels (scripts: "Luciole Pre-Opening Scripts").
 * One shared layout so they read as a series in the profile grid, plus one small
 * graphic per reel lifted from its script.
 *
 * Instagram crops covers to 3:4 (1080x1440, y 240-1680) in the grid, so the logo,
 * headline and graphic stay inside that band; the footer line sits below it.
 *
 * Swap a photo: replace public/reel/cover/preopening/reel-0N.jpg with a 1080x1920 frame
 * from that reel (tone-map iPhone HDR first, see Cover.tsx), then tune `shift`/`zoom`.
 * Headline words wrapped in *asterisks* render in gold.
 */

type Motif = 'progress' | 'bricks' | 'firefly' | 'names' | 'chips' | 'tape' | 'quote' | 'none';

export type PreOpeningCoverProps = {
	n: number;
	kicker: string;
	headline: string[];
	size: number;
	motif: Motif;
	shift: number; // px the photo is pushed down so faces clear the logo band
	zoom: number;
	originX: number; // 0..1, anchor for the zoom
	originY: number;
};

export const PRE_OPENING_COVERS: PreOpeningCoverProps[] = [
	{n: 1, kicker: 'Luciole is officially', headline: ['Level', '*unlocked*'], size: 136, motif: 'progress', shift: 150, zoom: 1, originX: 0.5, originY: 0.3},
	{n: 2, kicker: 'From four walls to almost ready', headline: ['Watching it', 'become *real*'], size: 118, motif: 'bricks', shift: 300, zoom: 1, originX: 0.5, originY: 0.3},
	{n: 3, kicker: 'Named after a firefly', headline: ['What is', '*Luciole*?'], size: 132, motif: 'firefly', shift: 150, zoom: 1.08, originX: 0.5, originY: 0.3},
	{n: 4, kicker: 'Meet the founders', headline: ['Two moms.', 'One *dream*.'], size: 124, motif: 'names', shift: 160, zoom: 1.12, originX: 0.5, originY: 0.3},
	{n: 5, kicker: "Which one's yours?", headline: ['*5* mom problems', '*5* Luciole fixes'], size: 100, motif: 'none', shift: 130, zoom: 1, originX: 0.5, originY: 0.3},
	{n: 6, kicker: 'Coffee for you, fun for them', headline: ["What you're", '*actually* getting'], size: 108, motif: 'chips', shift: 120, zoom: 1, originX: 0.5, originY: 0.3},
	{n: 7, kicker: 'The best crew in Jounieh', headline: ['Our construction', '*crew*'], size: 106, motif: 'tape', shift: 160, zoom: 1.25, originX: 0.5, originY: 0.85},
	{n: 8, kicker: 'One question, real answers', headline: ['We asked real', 'moms in *Jounieh*'], size: 104, motif: 'quote', shift: 90, zoom: 1, originX: 0.5, originY: 0.3},
];

const TOTAL = PRE_OPENING_COVERS.length;
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

/** Reel 01: the "loading a new level" bar from the hook, full. */
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

/** Reel 02: "brick by brick", the last bricks still going in. */
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

/** Reel 03: Luciole = firefly, a glowing dot standing in for the bug. */
const Firefly: React.FC = () => (
	<div style={{marginTop: 34, display: 'flex', alignItems: 'center', gap: 22}}>
		<div style={{width: 26, height: 26, borderRadius: 13, background: '#f6ebd6', boxShadow: `0 0 18px 8px rgba(214,178,122,0.85), 0 0 60px 26px rgba(183,144,93,0.45)`}} />
		<span style={{fontFamily: display, fontSize: 50, color: SAND}}>
			Luciole <span style={{color: GOLD}}>=</span> firefly
		</span>
	</div>
);

const Names: React.FC = () => (
	<div style={{marginTop: 30, display: 'flex', alignItems: 'center', gap: 22}}>
		<div style={{width: 60, height: 2, background: GOLD}} />
		<span style={{fontFamily: display, fontSize: 52, color: SAND}}>Sophanie &amp; Jinane</span>
		<div style={{width: 60, height: 2, background: GOLD}} />
	</div>
);

const Chips: React.FC = () => (
	<div style={{marginTop: 34, display: 'flex', gap: 14}}>
		{['Café', 'Bistro', 'Atelier', 'Birthdays'].map((c) => (
			<span key={c} style={{fontFamily: sans, fontWeight: 700, fontSize: 30, color: CREAM, border: `2px solid ${GOLD}`, borderRadius: 40, padding: '10px 26px'}}>
				{c}
			</span>
		))}
	</div>
);

// Grown has no curly quotes, so the mark comes from the serif fallback.
const Quote: React.FC = () => (
	<div style={{fontFamily: 'Georgia, serif', fontSize: 340, lineHeight: 1, height: 150, color: GOLD, marginBottom: 6}}>“</div>
);

/** Reel 07: gold and charcoal site tape across the photo. */
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

export const PreOpeningCover: React.FC<PreOpeningCoverProps> = ({n, kicker, headline, size, motif, shift, zoom, originX, originY}) => (
	<AbsoluteFill style={{backgroundColor: CREAM, overflow: 'hidden'}}>
		<Img
			src={staticFile(`reel/cover/preopening/reel-${pad(n)}.jpg`)}
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

		{motif === 'tape' && <Tape />}

		{/* Charcoal fade for the headline */}
		<AbsoluteFill
			style={{
				background: 'linear-gradient(180deg, rgba(41,41,41,0) 980px, rgba(41,41,41,0.86) 1190px, rgba(41,41,41,0.95) 1480px, rgba(41,41,41,0.98) 1920px)',
			}}
		/>

		<AbsoluteFill style={{top: motif === 'quote' ? 1110 : 1200, alignItems: 'center'}}>
			{motif === 'quote' && <Quote />}
			<div style={{display: 'flex', alignItems: 'center', gap: 22}}>
				<div style={{width: 56, height: 2, background: GOLD}} />
				<span style={{...label, color: GOLD}}>{kicker}</span>
				<div style={{width: 56, height: 2, background: GOLD}} />
			</div>

			<div style={{position: 'relative', marginTop: 16, textAlign: 'center'}}>
				<Headline lines={headline} size={size} />
			</div>

			{motif === 'progress' && <Progress />}
			{motif === 'bricks' && <Bricks />}
			{motif === 'firefly' && <Firefly />}
			{motif === 'names' && <Names />}
			{motif === 'chips' && <Chips />}
		</AbsoluteFill>

		{/* Below the grid crop: only seen when the reel opens full screen. */}
		<AbsoluteFill style={{top: 1752, alignItems: 'center'}}>
			<div style={{display: 'flex', alignItems: 'center', gap: 18, fontFamily: sans, fontWeight: 700, fontSize: 24, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(237,236,227,0.7)'}}>
				<span style={{color: GOLD}}>
					{pad(n)} / {pad(TOTAL)}
				</span>
				<Img src={staticFile('reel/brand/star.png')} style={{width: 26}} />
				<span>Opening soon in Jounieh souks</span>
			</div>
		</AbsoluteFill>
	</AbsoluteFill>
);
