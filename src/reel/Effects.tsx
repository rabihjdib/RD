import {AbsoluteFill, Audio, Easing, Img, interpolate, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BADGES, type Badge} from './data';
import {BRONZE, CHARCOAL, CREAM, display, OLIVE, rushToFrame, segmentAt, SEGMENTS, WORDS} from './timeline';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// ---------------------------------------------------------------------------
// Camera: slow push, jump-cut punch, whip-in on new rushes, punch-ins on key words
// ---------------------------------------------------------------------------

const PUNCH = 0.09; // extra zoom on words flagged 'z' in data.ts
const JUMP = 0.1; // zoom step that hides a jump cut inside the same rush
const WHIP = 0.14; // overshoot the incoming rush settles out of
const ZOOM_WORDS = WORDS.filter((w) => w.zoom);

/** CSS transform for the footage layer at the current frame. */
export const useCamera = (): React.CSSProperties => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const seg = segmentAt(frame);
	const local = frame - seg.start;

	const push = interpolate(local, [0, seg.duration], [0, 0.035], clamp);
	const jump = seg.newRush ? 0 : JUMP;
	const whip = seg.newRush && seg.index > 0 ? (1 - spring({frame: local, fps, config: {damping: 15, stiffness: 140}})) * WHIP : 0;

	let punch = 0;
	for (const w of ZOOM_WORDS) {
		if (frame < w.start - 3 || frame > w.end + 26) continue;
		const zoomIn = spring({frame: frame - (w.start - 3), fps, config: {damping: 18, stiffness: 210}});
		const release = interpolate(frame, [w.end + 8, w.end + 26], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
		punch = Math.max(punch, PUNCH * zoomIn * (1 - release));
	}

	return {
		transform: `scale(${1 + push + jump + whip + punch})`,
		transformOrigin: `${seg.focus[0] * 100}% ${seg.focus[1] * 100}%`,
	};
};

// ---------------------------------------------------------------------------
// Cut transitions between rushes: flash + whoosh
// ---------------------------------------------------------------------------

const Flash: React.FC = () => {
	const frame = useCurrentFrame();
	return <AbsoluteFill style={{background: CREAM, opacity: interpolate(frame, [0, 5], [0.55, 0], clamp)}} />;
};

export const CutTransitions: React.FC = () => (
	<>
		{SEGMENTS.filter((s) => s.newRush && s.index > 0).map((s) => (
			<Sequence key={s.index} from={s.start} durationInFrames={6} layout="none">
				<Flash />
			</Sequence>
		))}
		{/* The whoosh peaks mid-file, so it starts a few frames before the cut. */}
		{SEGMENTS.filter((s) => s.newRush && s.index > 0).map((s) => (
			<Sequence key={`sfx-${s.index}`} from={s.start - 6} durationInFrames={14}>
				<Audio src={staticFile('reel/sfx/whoosh.wav')} volume={0.35} />
			</Sequence>
		))}
	</>
);

// ---------------------------------------------------------------------------
// Highlight badges for the key points (data.ts BADGES)
// ---------------------------------------------------------------------------

const BADGE_TOP = 232; // just under Instagram's top bar

const BadgePill: React.FC<{badge: Badge; hold: number}> = ({badge, hold}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const enter = spring({frame, fps, config: {damping: 12, stiffness: 200, mass: 0.6}});
	const exit = interpolate(frame, [hold - 6, hold], [1, 0], clamp);
	const strike = badge.strike ? interpolate(frame, [10, 18], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)}) : 0;

	return (
		<AbsoluteFill style={{top: BADGE_TOP, paddingLeft: 70, paddingRight: 130, alignItems: 'center'}}>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 16,
					padding: '12px 34px 12px 16px',
					borderRadius: 999,
					background: CREAM,
					boxShadow: '0 18px 44px rgba(0,0,0,0.3)',
					transform: `translateY(${(1 - enter) * -50}px) scale(${(0.5 + 0.5 * enter) * (0.85 + 0.15 * exit)})`,
					opacity: exit,
				}}
			>
				<Img src={staticFile(`reel/icons/${badge.icon}.svg`)} style={{width: 66, height: 66}} />
				<div style={{position: 'relative'}}>
					<span
						style={{
							fontFamily: display,
							fontSize: 52,
							color: strike > 0.5 ? OLIVE : CHARCOAL,
							whiteSpace: 'nowrap',
							lineHeight: 1.25,
						}}
					>
						{badge.text}
					</span>
					{badge.strike ? (
						<div
							style={{
								position: 'absolute',
								left: -6,
								top: '52%',
								height: 8,
								width: `calc(${strike * 100}% + 12px)`,
								borderRadius: 4,
								background: BRONZE,
								transform: 'rotate(-3deg)',
							}}
						/>
					) : null}
				</div>
			</div>
		</AbsoluteFill>
	);
};

export const HighlightBadges: React.FC = () => {
	const {fps} = useVideoConfig();
	return (
		<>
			{BADGES.map((b) => {
				const from = rushToFrame(b.rush, b.at);
				if (from === null) return null;
				const hold = Math.round(b.duration * fps);
				return (
					<Sequence key={`${b.rush}-${b.at}`} from={from} durationInFrames={hold} layout="none">
						<BadgePill badge={b} hold={hold} />
						<Audio src={staticFile('reel/sfx/pop.wav')} volume={0.5} />
					</Sequence>
				);
			})}
		</>
	);
};

// ---------------------------------------------------------------------------
// Firefly field: warm gold specks drifting up (brand motif, used on "spark" and the outro)
// ---------------------------------------------------------------------------

export const FireflyField: React.FC<{count?: number; duration: number; seed?: string}> = ({count = 26, duration, seed = 'luciole'}) => {
	const frame = useCurrentFrame();
	const {width, height} = useVideoConfig();
	const fade = interpolate(frame, [0, 8, duration - 10, duration], [0, 1, 1, 0], clamp);

	return (
		<AbsoluteFill style={{opacity: fade, pointerEvents: 'none'}}>
			{new Array(count).fill(0).map((_, i) => {
				const r = (k: string) => random(`${seed}-${i}-${k}`);
				const x = r('x') * width + Math.sin(frame / (14 + r('w') * 10) + r('p') * 6) * 40;
				const y = height * (0.15 + r('y') * 0.75) - frame * (1.2 + r('v') * 2.2);
				const size = 8 + r('s') * 16;
				const blink = 0.45 + 0.55 * Math.abs(Math.sin(frame / (6 + r('b') * 8) + r('o') * 10));
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: x - size / 2,
							top: y - size / 2,
							width: size,
							height: size,
							borderRadius: '50%',
							background: CREAM,
							opacity: blink,
							boxShadow: `0 0 ${size * 1.2}px ${size * 0.6}px rgba(214,178,122,0.8), 0 0 ${size * 3}px ${size}px rgba(183,144,93,0.4)`,
						}}
					/>
				);
			})}
		</AbsoluteFill>
	);
};
