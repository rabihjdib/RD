import {AbsoluteFill, Audio, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {CHARCOAL, CREAM, display, normalizeWord, SAND, WORDS} from './timeline';

/**
 * Event-driven B-roll: when a caption word matches a trigger, a card pops in.
 *
 * Nothing here is timed by hand. Every word in data.ts CAPTIONS is checked against
 * TRIGGERS, so re-timing or re-wording the captions moves the pop-ups with them.
 *
 * To use real stock photos instead of the illustrations: drop the file in
 * public/reel/broll/ and point `asset` at it with `fit: 'cover'`, e.g.
 *   {match: ['coffee'], asset: 'reel/broll/latte.jpg', fit: 'cover', ...}
 */

type Trigger = {
	match: string[]; // normalised spoken words that fire it (any script)
	asset: string; // path under public/
	label?: string;
	fit?: 'contain' | 'cover';
	x: number; // card centre, 0..1 of the frame
	y: number;
	size?: number; // card width in px
	tilt?: number; // resting rotation in degrees
	hold?: number; // frames on screen
	sfx?: 'pop' | 'sparkle';
	once?: boolean; // default true: fire only the first time the word is said
};

const TRIGGERS: Trigger[] = [
	{match: ['firefly'], asset: 'reel/broll/firefly.svg', label: 'Firefly', fit: 'cover', x: 0.5, y: 0.17, size: 360, tilt: -5, hold: 48, sfx: 'sparkle'},
	{match: ['creativity'], asset: 'reel/icons/1f3a8.svg', label: 'Creativity', x: 0.24, y: 0.47, tilt: -7},
	{match: ['friends'], asset: 'reel/icons/1f9d1-200d-1f91d-200d-1f9d1.svg', label: 'Friends', x: 0.76, y: 0.47, tilt: 6, hold: 30},
	{match: ['break'], asset: 'reel/icons/1f6cb.svg', label: 'Break', x: 0.78, y: 0.2, tilt: 6},
	{match: ['بقهوتهم', 'coffee'], asset: 'reel/icons/2615.svg', label: 'Coffee', x: 0.22, y: 0.2, tilt: -6},
	{match: ['yummy'], asset: 'reel/icons/1f9c1.svg', label: 'Yummy', x: 0.22, y: 0.2, tilt: -6, hold: 30},
	{match: ['bites'], asset: 'reel/icons/1f36a.svg', label: 'Bites', x: 0.78, y: 0.2, tilt: 7, hold: 30},
	{match: ['create'], asset: 'reel/icons/1f9e9.svg', label: 'Create', x: 0.24, y: 0.17, tilt: -6, hold: 34},
	{match: ['connect'], asset: 'reel/icons/1f496.svg', label: 'Connect', x: 0.76, y: 0.17, tilt: 6, hold: 34},
];

type Event = Trigger & {start: number};

const EVENTS: Event[] = (() => {
	const fired = new Set<Trigger>();
	const out: Event[] = [];
	for (const w of WORDS) {
		const word = normalizeWord(w.text);
		for (const t of TRIGGERS) {
			if (!t.match.includes(word)) continue;
			if (t.once !== false && fired.has(t)) continue;
			fired.add(t);
			out.push({...t, start: w.start});
		}
	}
	return out;
})();

const Card: React.FC<{event: Event; hold: number}> = ({event, hold}) => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();
	const size = event.size ?? 300;
	const tilt = event.tilt ?? 0;

	const enter = spring({frame, fps, config: {damping: 11, stiffness: 170, mass: 0.7}});
	const exit = interpolate(frame, [hold - 8, hold], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const bob = Math.sin(frame / 7) * 6;
	const scale = enter * (0.6 + 0.4 * exit);
	const rotate = interpolate(enter, [0, 1], [tilt - 18, tilt]);

	const cover = event.fit === 'cover';
	const art = size - 36;

	return (
		<div
			style={{
				position: 'absolute',
				left: event.x * width - size / 2,
				top: event.y * height - size / 2,
				width: size,
				padding: 18,
				paddingBottom: event.label ? 12 : 18,
				borderRadius: 40,
				background: CREAM,
				boxShadow: '0 24px 60px rgba(0,0,0,0.35), 0 6px 14px rgba(0,0,0,0.2)',
				transform: `translateY(${bob}px) scale(${scale}) rotate(${rotate}deg)`,
				opacity: exit,
			}}
		>
			<div
				style={{
					width: art,
					height: art,
					borderRadius: 26,
					overflow: 'hidden',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					background: `linear-gradient(145deg, #F7F5EE, ${SAND})`,
				}}
			>
				<Img
					src={staticFile(event.asset)}
					style={cover ? {width: '100%', height: '100%', objectFit: 'cover'} : {width: art * 0.68, height: art * 0.68, objectFit: 'contain'}}
				/>
			</div>
			{event.label ? (
				<div style={{fontFamily: display, fontSize: size * 0.14, color: CHARCOAL, textAlign: 'center', marginTop: 6, lineHeight: 1.2}}>
					{event.label}
				</div>
			) : null}
		</div>
	);
};

export const BRollOverlays: React.FC = () => (
	<AbsoluteFill style={{pointerEvents: 'none'}}>
		{EVENTS.map((e) => {
			const hold = e.hold ?? 40;
			return (
				<Sequence key={`${e.asset}-${e.start}`} from={e.start} durationInFrames={hold} layout="none">
					<Card event={e} hold={hold} />
					{e.sfx ? <Audio src={staticFile(`reel/sfx/${e.sfx}.wav`)} volume={e.sfx === 'sparkle' ? 0.45 : 0.5} /> : null}
				</Sequence>
			);
		})}
	</AbsoluteFill>
);
