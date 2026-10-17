import {AbsoluteFill, Audio, Easing, Freeze, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {CHARCOAL, CREAM, display, GOLD, sans} from '../brand';
import {Outro} from '../reel/Branding';
import {FireflyField} from '../reel/Effects';
import {BEAT, FPS, MUSIC, MUSIC_LEVELS, OUTRO, OUTRO_NOTE, SHOTS, TITLES} from './data';

/**
 * L'Atelier tour, 1080x1920 @ 30fps: shots cut on the beat with a gentle push on each,
 * brand titles naming each corner of the room, gold sparkles on the sign and the
 * "every child is a spark" wall, then the logo outro. Original colours (Dolby Vision
 * conversion, no grading). Edit the shot list and titles in data.ts.
 */

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Cut points come from cumulative beats so rounding never drifts off the music.
const beatFrame = (beats: number) => Math.round(beats * BEAT * FPS);
const SEGMENTS = (() => {
	let beats = 0;
	return SHOTS.map((s, index) => {
		const start = beatFrame(beats);
		beats += s.beats;
		return {...s, index, start, duration: beatFrame(beats) - start, trimBefore: Math.round(s.from * FPS)};
	});
})();
const last = SEGMENTS[SEGMENTS.length - 1];
export const BODY_END = last.start + last.duration;
const OUTRO_FRAMES = Math.round(OUTRO * FPS);
export const ATELIER_DURATION = BODY_END + OUTRO_FRAMES;

const Shot: React.FC<{seg: (typeof SEGMENTS)[number]}> = ({seg}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const settle = seg.index > 0 ? (1 - spring({frame, fps, config: {damping: 16, stiffness: 140}})) * 0.06 : 0;
	const push = interpolate(frame, [0, seg.duration], [0, 0.05], clamp);
	const [fx, fy] = seg.focus ?? [0.5, 0.5];
	return (
		<AbsoluteFill style={{transform: `scale(${1 + settle + push})`, transformOrigin: `${fx * 100}% ${fy * 100}%`}}>
			<OffthreadVideo src={staticFile(`atelier/${seg.clip}.mp4`)} trimBefore={seg.trimBefore} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
		</AbsoluteFill>
	);
};

const TitleCard: React.FC<{text: string; kicker?: string; frames: number}> = ({text, kicker, frames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const enter = spring({frame: frame - 2, fps, config: {damping: 18, stiffness: 150}});
	const rule = interpolate(frame, [4, 16], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const exit = interpolate(frame, [frames - 7, frames], [1, 0], clamp);
	const big = text.length <= 16;
	return (
		<AbsoluteFill>
			{/* soft charcoal floor so cream text reads on bright shelves */}
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(41,41,41,0) 52%, rgba(41,41,41,0.55) 68%, rgba(41,41,41,0.7) 80%, rgba(41,41,41,0) 96%)', opacity: exit * Math.min(1, enter * 1.4)}} />
			<AbsoluteFill style={{top: 1230, paddingLeft: 80, paddingRight: 140, alignItems: 'center', opacity: exit}}>
				{kicker ? (
					<div style={{fontFamily: sans, fontWeight: 700, fontSize: 30, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, opacity: enter, marginBottom: 10, textAlign: 'center', textShadow: `0 2px 14px ${CHARCOAL}, 0 0 4px ${CHARCOAL}`}}>
						{kicker}
					</div>
				) : null}
				<div
					style={{
						fontFamily: display,
						fontSize: big ? 104 : 76,
						lineHeight: 1.08,
						color: CREAM,
						textAlign: 'center',
						textShadow: `0 4px 24px ${CHARCOAL}`,
						transform: `translateY(${(1 - enter) * 34}px)`,
						opacity: enter,
					}}
				>
					{text}
				</div>
				<div style={{marginTop: 22, width: 220 * rule, height: 3, borderRadius: 2, background: GOLD}} />
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

const OUTRO_START = BODY_END;

export const AtelierTour: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: '#000'}}>
		{SEGMENTS.map((s) => (
			<Sequence key={s.index} from={s.start} durationInFrames={s.duration}>
				<Shot seg={s} />
				{s.sparkle ? <FireflyField duration={s.duration} count={24} seed={`atelier-${s.index}`} /> : null}
			</Sequence>
		))}
		{/* Frozen last frame under the outro */}
		<Sequence from={BODY_END} durationInFrames={OUTRO_FRAMES}>
			<Freeze frame={0}>
				<OffthreadVideo src={staticFile(`atelier/${last.clip}.mp4`)} trimBefore={last.trimBefore + last.duration - 1} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
			</Freeze>
		</Sequence>
		{/* Whoosh into the room reveal */}
		<Sequence from={SEGMENTS[1].start - 6} durationInFrames={14}>
			<Audio src={staticFile('reel/sfx/whoosh.wav')} volume={0.3} />
		</Sequence>
		{TITLES.map((t) => {
			const seg = SEGMENTS[t.shot];
			const frames = beatFrame(t.beats);
			return (
				<Sequence key={t.text} from={seg.start} durationInFrames={frames} layout="none">
					<TitleCard text={t.text} kicker={t.kicker} frames={frames} />
				</Sequence>
			);
		})}
		<Sequence from={OUTRO_START} durationInFrames={OUTRO_FRAMES} layout="none">
			<Outro duration={OUTRO_FRAMES} note={OUTRO_NOTE} />
			<Audio src={staticFile('reel/sfx/sparkle.wav')} volume={0.5} />
		</Sequence>
		<Audio
			src={staticFile(MUSIC)}
			volume={(f) => MUSIC_LEVELS.body + (MUSIC_LEVELS.outro - MUSIC_LEVELS.body) * interpolate(f, [OUTRO_START, OUTRO_START + 12], [0, 1], clamp)}
		/>
	</AbsoluteFill>
);
