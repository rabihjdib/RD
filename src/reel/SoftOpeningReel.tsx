import {AbsoluteFill, Audio, Easing, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRONZE, CHARCOAL, CREAM, display, GOLD, sans} from '../brand';
import {SOFT_OPENING_DATE} from '../posts/SoftOpeningPost';

/**
 * Reel (1080x1920, 30 fps, 12 s): the soft opening Story brought to life. Fireflies
 * drift in and twinkle, the copy rises in line by line, the gold arch draws itself
 * and "4 PM" lands inside it, then everything holds so the details can be read.
 * The layout sits higher than the Story so the Reels caption and buttons at the
 * bottom never cover the address or the number.
 *
 * Render: npm run reel:soft-opening
 *
 * Timing (frames):
 *   0-30    glow and fireflies fade in
 *   12-40   logo
 *   36-60   "Soft opening"
 *   48-90   "Tomorrow," then "we light up." (whoosh)
 *   96-150  arch draws (sparkle at 140)
 *   140-200 "Doors open at", "4" (pop at 156), "PM", date
 *   200-240 "L'Atelier · Café · Bistro", then address and WhatsApp
 *   240-360 hold, with a soft pulse on the arch
 */

export const SOFT_OPENING_REEL_DURATION = 360;

const EASE = Easing.bezier(0.16, 1, 0.3, 1);

// [x, y, core size] for each firefly.
const FIREFLIES: [number, number, number][] = [
	[150, 540, 18],
	[940, 470, 14],
	[880, 1150, 22],
	[200, 1230, 16],
	[95, 880, 11],
	[985, 850, 12],
	[310, 1560, 10],
	[790, 1600, 14],
	[560, 230, 9],
	[700, 330, 8],
];

/** Fade and rise in from `start` over `dur` frames. */
const useRise = (start: number, dur = 24, dist = 40) => {
	const frame = useCurrentFrame();
	const t = interpolate(frame, [start, start + dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE});
	return {opacity: t, transform: `translateY(${(1 - t) * dist}px)`};
};

const Firefly: React.FC<{x: number; y: number; s: number; i: number}> = ({x, y, s, i}) => {
	const frame = useCurrentFrame();
	const appear = interpolate(frame, [i * 5, i * 5 + 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const twinkle = 0.65 + 0.35 * Math.sin(frame / 11 + i * 2.1);
	const dx = Math.sin(frame / 38 + i) * 14;
	const dy = Math.cos(frame / 47 + i * 1.3) * 18;
	return (
		<div
			style={{
				position: 'absolute',
				left: x - s / 2 + dx,
				top: y - s / 2 + dy,
				width: s,
				height: s,
				borderRadius: s,
				opacity: appear * twinkle,
				background: '#f6ebd6',
				boxShadow: `0 0 ${s}px ${s * 0.5}px rgba(214,178,122,0.9), 0 0 ${s * 4}px ${s * 1.8}px rgba(183,144,93,0.4)`,
			}}
		/>
	);
};

const ARCH_W = 600;
const ARCH_H = 540;
const archPath = (inset: number) => {
	const w = ARCH_W - inset * 2;
	const h = ARCH_H - inset * 2;
	const r = w / 2;
	const c = Math.max(30 - inset, 12);
	return `M ${inset} ${inset + h - c} L ${inset} ${inset + r} A ${r} ${r} 0 0 1 ${inset + w} ${inset + r} L ${inset + w} ${inset + h - c} Q ${inset + w} ${inset + h} ${inset + w - c} ${inset + h} L ${inset + c} ${inset + h} Q ${inset} ${inset + h} ${inset} ${inset + h - c} Z`;
};

const Arch: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const draw = interpolate(frame, [96, 146], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
	const drawInner = interpolate(frame, [112, 156], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
	const fill = interpolate(frame, [130, 160], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	// A slow breathing glow once everything is in.
	const pulse = frame > 240 ? 0.5 + 0.5 * Math.sin((frame - 240) / 14) : 0;

	const kicker = useRise(144, 20, 20);
	const four = spring({frame: frame - 156, fps, config: {damping: 11, mass: 0.6, stiffness: 120}});
	const pm = useRise(168, 18, 24);
	const date = useRise(180, 20, 20);

	return (
		<div style={{position: 'relative', width: ARCH_W, height: ARCH_H}}>
			<svg width={ARCH_W} height={ARCH_H} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				<path d={archPath(2)} fill={`rgba(255,255,255,${0.45 * fill})`} stroke="none" />
				<path
					d={archPath(2)}
					fill="none"
					stroke={GOLD}
					strokeWidth={4}
					pathLength={1}
					strokeDasharray={1}
					strokeDashoffset={1 - draw}
					style={{filter: `drop-shadow(0 0 ${6 + pulse * 14}px rgba(214,178,122,${0.35 + pulse * 0.4}))`}}
				/>
				<path d={archPath(18)} fill="none" stroke="rgba(183,144,93,0.55)" strokeWidth={1.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - drawInner} />
			</svg>

			<div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: ARCH_W * 0.18}}>
				<div style={{...kicker, fontFamily: sans, fontWeight: 700, fontSize: 24, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(41,41,41,0.6)'}}>Doors open at</div>
				<div style={{marginTop: 4, fontFamily: display, fontSize: 210, lineHeight: 1, color: CHARCOAL, display: 'flex', alignItems: 'baseline'}}>
					<span style={{display: 'inline-block', opacity: Math.min(four * 1.5, 1), transform: `scale(${0.6 + 0.4 * four})`}}>4</span>
					<span style={{...pm, display: 'inline-block', fontSize: 110, color: GOLD, marginLeft: 22}}>PM</span>
				</div>
				<div style={{...date, marginTop: 14, fontFamily: sans, fontWeight: 700, fontSize: 30, color: 'rgba(41,41,41,0.75)'}}>{SOFT_OPENING_DATE}</div>
			</div>
		</div>
	);
};

/** "SOFT OPENING" tracks in from wide letter spacing. */
const Kicker: React.FC = () => {
	const frame = useCurrentFrame();
	const t = interpolate(frame, [36, 66], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE});
	return (
		<div style={{opacity: t, fontFamily: sans, fontWeight: 700, fontSize: 26, letterSpacing: `${0.6 - 0.26 * t}em`, textTransform: 'uppercase', color: GOLD}}>Soft opening</div>
	);
};

export const SoftOpeningReel: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const glow = interpolate(frame, [0, 40], [0, 1], {extrapolateRight: 'clamp'});
	const logo = spring({frame: frame - 12, fps, config: {damping: 16, mass: 0.7}});
	const line1 = useRise(48, 26, 50);
	const line2 = useRise(64, 26, 50);
	const tagline = useRise(204, 22, 24);
	const contact = useRise(220, 22, 20);
	// The music fades in over the first second and out over the last.
	const music = (f: number) => 0.55 * interpolate(f, [0, 30, SOFT_OPENING_REEL_DURATION - 45, SOFT_OPENING_REEL_DURATION], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill style={{backgroundColor: CREAM}}>
			<AbsoluteFill style={{opacity: glow, background: 'radial-gradient(circle at 50% 40%, rgba(214,178,122,0.34) 0%, rgba(214,178,122,0) 55%)'}} />
			{FIREFLIES.map(([x, y, s], i) => (
				<Firefly key={i} x={x} y={y} s={s} i={i} />
			))}

			{/* Content sits in the Reels safe area: below the top bar, above the caption. */}
			<div style={{position: 'absolute', left: 0, right: 0, top: 250, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
				<Img src={staticFile('reel/brand/logo-dark.png')} style={{width: 260, opacity: Math.min(logo * 1.4, 1), transform: `scale(${0.85 + 0.15 * logo})`}} />
				<div style={{marginTop: 48}}>
					<Kicker />
				</div>
				<div style={{marginTop: 14, fontFamily: display, fontSize: 100, lineHeight: 1.02, color: CHARCOAL, whiteSpace: 'nowrap'}}>
					<div style={line1}>Tomorrow,</div>
					<div style={{...line2, color: BRONZE}}>we light up.</div>
				</div>
				<div style={{marginTop: 50}}>
					<Arch />
				</div>
				<div style={{...tagline, marginTop: 44, fontFamily: display, fontSize: 42, color: CHARCOAL}}>L&rsquo;Atelier · Café · Bistro</div>
				<div style={{...contact, marginTop: 18, fontFamily: sans, fontWeight: 700, fontSize: 25, letterSpacing: '0.26em', textTransform: 'uppercase', color: GOLD}}>
					Jounieh Souks · WhatsApp 81 540 282
				</div>
			</div>

			<Audio src={staticFile('reel/music/luciole-kids-bed.mp3')} volume={music} />
			<Sequence from={50}>
				<Audio src={staticFile('reel/sfx/whoosh.wav')} volume={0.3} />
			</Sequence>
			<Sequence from={140}>
				<Audio src={staticFile('reel/sfx/sparkle.wav')} volume={0.45} />
			</Sequence>
			<Sequence from={156}>
				<Audio src={staticFile('reel/sfx/pop.wav')} volume={0.45} />
			</Sequence>
		</AbsoluteFill>
	);
};
