import {AbsoluteFill, Audio, Easing, Img, interpolate, OffthreadVideo, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ICON_POPS} from './data';
import {BADGE_EVENTS, BROLL_EVENTS, CHARCOAL, CREAM, display, GOLD, normalizeWord, SAND, segmentAt, SEGMENTS, WORDS} from './timeline';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// ---------------------------------------------------------------------------
// Camera: slow push, settle-in on every cut, punch-ins on key words
// ---------------------------------------------------------------------------

/** Spoken words that get a punch-in (first time each is said). */
const PUNCH_ON = ['birthday', 'relax', 'whole', 'decoration', 'weeks'];
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
	const settle = seg.index > 0 ? (1 - spring({frame: local, fps, config: {damping: 15, stiffness: 140}})) * (seg.host ? 0.12 : 0.08) : 0;
	let punch = 0;
	for (const w of PUNCHES) {
		if (frame < w.start - 3 || frame > w.end + 28) continue;
		const zin = spring({frame: frame - (w.start - 3), fps, config: {damping: 18, stiffness: 210}});
		const out = interpolate(frame, [w.end + 10, w.end + 28], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
		punch = Math.max(punch, 0.08 * zin * (1 - out));
	}
	return {transform: `scale(${1 + push + settle + punch})`, transformOrigin: `${seg.focus[0] * 100}% ${seg.focus[1] * 100}%`};
};

// ---------------------------------------------------------------------------
// Transitions: soft cream flash + whoosh wherever the host is involved; the party
// montage itself runs on hard cuts so it stays fast
// ---------------------------------------------------------------------------

const Flash: React.FC = () => {
	const frame = useCurrentFrame();
	return <AbsoluteFill style={{background: CREAM, opacity: interpolate(frame, [0, 5], [0.5, 0], clamp)}} />;
};

const FLASH_AT = SEGMENTS.filter((s, i) => i > 0 && (s.host || SEGMENTS[i - 1].host));

export const CutTransitions: React.FC = () => (
	<>
		{FLASH_AT.map((s) => (
			<Sequence key={s.index} from={s.start} durationInFrames={6} layout="none">
				<Flash />
			</Sequence>
		))}
		{FLASH_AT.map((s) => (
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
				<OffthreadVideo src={staticFile(`birthday/${src}.mp4`)} trimBefore={trimBefore} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
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
				<Img src={staticFile(`birthday/icons/${icon}.svg`)} style={{width: 66, height: 66}} />
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
			<Img src={staticFile(`birthday/icons/${icon}.svg`)} style={{width: size * 0.62, height: size * 0.62}} />
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
