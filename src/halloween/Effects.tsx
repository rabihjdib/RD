import {AbsoluteFill, Audio, Easing, Img, interpolate, OffthreadVideo, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ICON_POPS} from './data';
import {BADGE_EVENTS, BROLL_EVENTS, CHARCOAL, CREAM, display, GOLD, normalizeWord, SAND, segmentAt, SEGMENTS, WORDS} from './timeline';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// ---------------------------------------------------------------------------
// Camera: slow push, zoom step on jump cuts, settle-in on new clips, punch-ins on key words
// ---------------------------------------------------------------------------

/** Spoken words that get a punch-in (first time each is said). */
const PUNCH_ON = ['halloween', 'three', 'costume', 'creating', 'character', 'wizard', 'whatsapp'];
const PUNCHES = PUNCH_ON.flatMap((k) => {
	const w = WORDS.find((x) => normalizeWord(x.text) === k);
	return w ? [w] : [];
});

export const useCamera = (): React.CSSProperties => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const seg = segmentAt(frame);
	const local = frame - seg.start;
	const push = interpolate(local, [0, seg.duration], [0, 0.03], clamp);
	const jump = seg.newClip ? 0 : 0.1;
	const settle = seg.newClip && seg.index > 0 ? (1 - spring({frame: local, fps, config: {damping: 15, stiffness: 140}})) * 0.12 : 0;
	let punch = 0;
	for (const w of PUNCHES) {
		if (frame < w.start - 3 || frame > w.end + 28) continue;
		const zin = spring({frame: frame - (w.start - 3), fps, config: {damping: 18, stiffness: 210}});
		const out = interpolate(frame, [w.end + 10, w.end + 28], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
		punch = Math.max(punch, 0.08 * zin * (1 - out));
	}
	return {transform: `scale(${1 + push + jump + settle + punch})`, transformOrigin: `${seg.focus[0] * 100}% ${seg.focus[1] * 100}%`};
};

// ---------------------------------------------------------------------------
// Transitions between clips: soft cream flash + whoosh
// ---------------------------------------------------------------------------

const Flash: React.FC = () => {
	const frame = useCurrentFrame();
	return <AbsoluteFill style={{background: CREAM, opacity: interpolate(frame, [0, 5], [0.5, 0], clamp)}} />;
};

export const CutTransitions: React.FC = () => (
	<>
		{SEGMENTS.filter((s) => s.newClip && s.index > 0).map((s) => (
			<Sequence key={s.index} from={s.start} durationInFrames={6} layout="none">
				<Flash />
			</Sequence>
		))}
		{SEGMENTS.filter((s) => s.newClip && s.index > 0).map((s) => (
			<Sequence key={`w${s.index}`} from={s.start - 6} durationInFrames={14}>
				<Audio src={staticFile('reel/sfx/whoosh.wav')} volume={0.3} />
			</Sequence>
		))}
	</>
);

// ---------------------------------------------------------------------------
// B-roll cutaways (picture only; the host keeps talking underneath)
// ---------------------------------------------------------------------------

const Cutaway: React.FC<{src: string; trimBefore: number; frames: number}> = ({src, trimBefore, frames}) => {
	const frame = useCurrentFrame();
	const scale = interpolate(frame, [0, frames], [1.06, 1.0], clamp);
	return (
		<AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#000'}}>
			<AbsoluteFill style={{transform: `scale(${scale})`}}>
				<OffthreadVideo src={staticFile(`halloween/${src}.mp4`)} trimBefore={trimBefore} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

export const BRollCutaways: React.FC = () => (
	<>
		{BROLL_EVENTS.map((b) => (
			<Sequence key={`${b.src}-${b.start}`} from={b.start} durationInFrames={b.frames}>
				<Cutaway src={b.src} trimBefore={b.trimBefore} frames={b.frames} />
			</Sequence>
		))}
	</>
);

// ---------------------------------------------------------------------------
// Badges (top of frame): cream pill, Grown text, Twemoji icon, pop sound
// ---------------------------------------------------------------------------

const BadgePill: React.FC<{icon: string; text: string; hold: number}> = ({icon, text, hold}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const enter = spring({frame, fps, config: {damping: 12, stiffness: 200, mass: 0.6}});
	const exit = interpolate(frame, [hold - 6, hold], [1, 0], clamp);
	return (
		<AbsoluteFill style={{top: 232, paddingLeft: 70, paddingRight: 130, alignItems: 'center'}}>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 16,
					padding: '12px 34px 12px 16px',
					borderRadius: 999,
					background: CREAM,
					border: `2px solid ${GOLD}`,
					boxShadow: '0 18px 44px rgba(0,0,0,0.3)',
					transform: `translateY(${(1 - enter) * -50}px) scale(${(0.5 + 0.5 * enter) * (0.85 + 0.15 * exit)})`,
					opacity: exit,
				}}
			>
				<Img src={staticFile(`halloween/icons/${icon}.svg`)} style={{width: 66, height: 66}} />
				<span style={{fontFamily: display, fontSize: 54, color: CHARCOAL, whiteSpace: 'nowrap', lineHeight: 1.25}}>{text}</span>
			</div>
		</AbsoluteFill>
	);
};

export const Badges: React.FC = () => (
	<>
		{BADGE_EVENTS.map((b) => (
			<Sequence key={`${b.clip}-${b.at}`} from={b.start} durationInFrames={b.frames} layout="none">
				<BadgePill icon={b.icon} text={b.text} hold={b.frames} />
				<Audio src={staticFile('reel/sfx/pop.wav')} volume={0.45} />
			</Sequence>
		))}
	</>
);

// ---------------------------------------------------------------------------
// Icon pops beside her when a key word is said (data.ts ICON_POPS)
// ---------------------------------------------------------------------------

// Each pop holds 36 frames but never crosses into the next clip.
const POPS = ICON_POPS.flatMap((p) => {
	const w = WORDS.find((x) => normalizeWord(x.text) === p.word);
	if (!w) return [];
	const seg = segmentAt(w.start);
	return [{...p, start: w.start, hold: Math.max(12, Math.min(36, seg.start + seg.duration - w.start))}];
});

const IconCard: React.FC<{icon: string; x: number; y: number; tilt: number; hold: number}> = ({icon, x, y, tilt, hold}) => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();
	const enter = spring({frame, fps, config: {damping: 11, stiffness: 170, mass: 0.7}});
	const exit = interpolate(frame, [hold - 8, hold], [1, 0], clamp);
	const size = 230;
	return (
		<div
			style={{
				position: 'absolute',
				left: x * width - size / 2,
				top: y * height - size / 2,
				width: size,
				height: size,
				borderRadius: 40,
				background: `linear-gradient(145deg, #F7F5EE, ${SAND})`,
				border: `6px solid ${CREAM}`,
				boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				transform: `translateY(${Math.sin(frame / 7) * 6}px) scale(${enter * (0.6 + 0.4 * exit)}) rotate(${interpolate(enter, [0, 1], [tilt - 18, tilt])}deg)`,
				opacity: exit,
			}}
		>
			<Img src={staticFile(`halloween/icons/${icon}.svg`)} style={{width: size * 0.62, height: size * 0.62}} />
		</div>
	);
};

export const IconPops: React.FC = () => (
	<>
		{POPS.map((p) => (
			<Sequence key={p.word} from={p.start} durationInFrames={p.hold} layout="none">
				<IconCard icon={p.icon} x={p.x} y={p.y} tilt={p.tilt} hold={p.hold} />
			</Sequence>
		))}
	</>
);

// ---------------------------------------------------------------------------
// Bats: a few charcoal bats with gold edges fluttering across (hook and outro)
// ---------------------------------------------------------------------------

const BAT =
	'M50 26 C46 16 36 12 22 14 C28 19 30 25 28 31 C22 27 12 27 3 33 C13 35 19 41 21 49 C29 43 39 43 45 49 L50 41 L55 49 C61 43 71 43 79 49 C81 41 87 35 97 33 C88 27 78 27 72 31 C70 25 72 19 78 14 C64 12 54 16 50 26 Z';

export const Bats: React.FC<{duration: number; count?: number; seed?: string}> = ({duration, count = 4, seed = 'bats'}) => {
	const frame = useCurrentFrame();
	const {width} = useVideoConfig();
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			{new Array(count).fill(0).map((_, i) => {
				const r = (k: string) => random(`${seed}-${i}-${k}`);
				const dir = r('d') > 0.5 ? 1 : -1;
				const delay = r('t') * duration * 0.35;
				const t = interpolate(frame, [delay, delay + duration * 0.75], [0, 1], clamp);
				if (t <= 0 || t >= 1) return null;
				const x = dir > 0 ? -140 + t * (width + 280) : width + 140 - t * (width + 280);
				const y = 120 + r('y') * 360 + Math.sin(t * Math.PI * 3 + r('p') * 6) * 40;
				const size = 70 + r('s') * 60;
				const flap = 0.45 + 0.55 * Math.abs(Math.sin(frame / (2.2 + r('f'))));
				return (
					<svg
						key={i}
						viewBox="0 0 100 60"
						width={size}
						height={size * 0.6}
						style={{position: 'absolute', left: x - size / 2, top: y, transform: `scaleY(${flap}) scaleX(${dir})`, opacity: interpolate(t, [0, 0.08, 0.9, 1], [0, 0.95, 0.95, 0])}}
					>
						<path d={BAT} fill={CHARCOAL} stroke={GOLD} strokeWidth={1.6} strokeLinejoin="round" />
					</svg>
				);
			})}
		</AbsoluteFill>
	);
};
