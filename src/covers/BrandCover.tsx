import {AbsoluteFill, Img, staticFile} from 'remotion';
import {CHARCOAL, CREAM, display, GOLD, SAND, sans} from '../brand';

/**
 * Shared Luciole reel cover (1080x1920 still): a frame from the reel, "<title>" + the dark
 * logo on a cream band with gold brand stars, an optional gold badge and an optional wide
 * plate, and a bottom line. Same family as the Halloween, birthday and atelier covers.
 *
 * The plate also sits over any caption burned into the chosen frame, so the cover never
 * shows half a subtitle. Instagram crops covers to 3:4 (y 240-1680) in the profile grid,
 * so title, badge and plate stay inside that band; the bottom line only shows full screen.
 * Each cover's frame and text live in specs.ts.
 */

type Line = {text: string; small?: boolean; gold?: boolean};

export type CoverSpec = {
	id: string;
	photo: string; // in public/covers/
	shift: number; // px the photo is lowered so the band clears faces
	title: string;
	titleSize?: number;
	badge?: {icon: string; lines: Line[]; top: number; side: 'left' | 'right'};
	plate?: {
		top: number;
		minHeight?: number;
		icon?: string;
		kicker?: string;
		text?: string | string[]; // an array is joined with gold dots
		rows?: {label: string; value: string[]}[];
		footer?: string;
	};
	line: string;
};

const Star: React.FC<{x: number; y: number; size: number; tilt: number}> = ({x, y, size, tilt}) => (
	<Img src={staticFile('reel/brand/star.png')} style={{position: 'absolute', left: x, top: y, width: size, transform: `rotate(${tilt}deg)`}} />
);

const panel: React.CSSProperties = {
	position: 'absolute',
	background: 'rgba(41,41,41,0.9)',
	border: `3px solid ${GOLD}`,
	boxShadow: '0 18px 44px rgba(0,0,0,0.3)',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
};

const smallCaps: React.CSSProperties = {fontFamily: sans, fontWeight: 700, textTransform: 'uppercase'};

// Grown has a tiny middle dot, so parts of a value are joined with a gold one instead.
const Dotted: React.FC<{parts: string[]; size: number}> = ({parts, size}) => (
	<span style={{fontFamily: display, fontSize: size, color: CREAM, lineHeight: 1.15}}>
		{parts.map((p, i) => (
			<span key={p}>
				{i > 0 ? <span style={{color: GOLD, padding: '0 14px'}}>•</span> : null}
				{p}
			</span>
		))}
	</span>
);

export const BrandCover: React.FC<{spec: CoverSpec}> = ({spec}) => {
	const {badge, plate} = spec;
	return (
		<AbsoluteFill style={{backgroundColor: CREAM}}>
			<Img src={staticFile(`covers/${spec.photo}`)} style={{position: 'absolute', left: 0, top: spec.shift, width: 1080, height: 1920, objectFit: 'cover'}} />

			{/* Cream title band */}
			<AbsoluteFill
				style={{background: `linear-gradient(180deg, ${CREAM} 0px, ${CREAM} 380px, rgba(237,236,227,0.7) 430px, rgba(237,236,227,0) 480px)`}}
			/>
			<div style={{position: 'absolute', top: 262, left: 0, right: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 24}}>
				<span style={{fontFamily: display, fontSize: spec.titleSize ?? 84, color: CHARCOAL, lineHeight: 1, paddingBottom: 18}}>{spec.title}</span>
				<Img src={staticFile('reel/brand/logo-dark.png')} style={{width: 330}} />
			</div>
			<Star x={58} y={250} size={60} tilt={-8} />
			<Star x={116} y={326} size={32} tilt={10} />
			<Star x={966} y={258} size={50} tilt={12} />
			<Star x={924} y={336} size={28} tilt={-6} />

			{badge ? (
				<div
					style={{
						...panel,
						top: badge.top,
						[badge.side]: 40,
						width: 270,
						padding: '22px 0 24px',
						borderRadius: 30,
						transform: `rotate(${badge.side === 'right' ? 4 : -4}deg)`,
					}}
				>
					<Img src={staticFile(`covers/icons/${badge.icon}.svg`)} style={{width: 66, height: 66, marginBottom: 8}} />
					{badge.lines.map(({text, small, gold}) =>
						small ? (
							<span key={text} style={{...smallCaps, fontSize: 22, color: SAND, lineHeight: 1.6, letterSpacing: '0.18em'}}>
								{text}
							</span>
						) : (
							<span key={text} style={{fontFamily: display, fontSize: 56, color: gold ? GOLD : CREAM, lineHeight: 1.06}}>
								{text}
							</span>
						),
					)}
				</div>
			) : null}

			{plate ? (
				<div style={{...panel, background: CHARCOAL, top: plate.top, left: 90, right: 90, minHeight: plate.minHeight, padding: '28px 36px 30px', borderRadius: 34, gap: 6}}>
					{plate.icon ? <Img src={staticFile(`covers/icons/${plate.icon}.svg`)} style={{width: 70, height: 70, marginBottom: 6}} /> : null}
					{plate.kicker ? <span style={{...smallCaps, fontSize: 24, color: GOLD, letterSpacing: '0.2em', textAlign: 'center'}}>{plate.kicker}</span> : null}
					{typeof plate.text === 'string' ? <span style={{fontFamily: display, fontSize: 60, color: CREAM, lineHeight: 1.1, textAlign: 'center'}}>{plate.text}</span> : null}
					{Array.isArray(plate.text) ? <Dotted parts={plate.text} size={58} /> : null}
					{plate.rows?.map((r) => (
						<div key={r.value.join()} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: r.label ? 14 : 0}}>
							{r.label ? <span style={{...smallCaps, fontSize: 22, color: SAND, letterSpacing: '0.2em'}}>{r.label}</span> : null}
							<Dotted parts={r.value} size={46} />
						</div>
					))}
					{plate.footer ? <span style={{...smallCaps, marginTop: 16, fontSize: 22, color: GOLD, letterSpacing: '0.2em'}}>{plate.footer}</span> : null}
				</div>
			) : null}

			{/* Bottom line: below the grid crop, seen when the reel opens full screen */}
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(41,41,41,0) 1600px, rgba(41,41,41,0.85) 1730px, rgba(41,41,41,0.95) 1920px)'}} />
			<AbsoluteFill style={{top: 1752, alignItems: 'center'}}>
				<span style={{fontFamily: display, fontSize: 52, color: CREAM}}>{spec.line}</span>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
