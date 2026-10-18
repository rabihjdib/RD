import {AbsoluteFill, Audio, Freeze, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {TitleCard} from '../atelier/Main';
import {Outro} from '../reel/Branding';
import {FireflyField} from '../reel/Effects';
import {BEAT, FPS, MUSIC, MUSIC_LEVELS, OUTRO, OUTRO_NOTE, SHOTS, TITLES} from './data';

/**
 * Brunch & salad bar reel, 1080x1920 @ 30fps: shots cut on the beat with a gentle push on
 * each, brand titles telling the morning (gym, coffee, brunch, salad bar, kids at L'Atelier,
 * events), then the logo outro. Same look as the L'Atelier tour; original colours (Dolby
 * Vision conversion, no grading). Edit the shot list and titles in data.ts.
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
const BODY_END = last.start + last.duration;
const OUTRO_FRAMES = Math.round(OUTRO * FPS);
export const BRUNCH_DURATION = BODY_END + OUTRO_FRAMES;

const Shot: React.FC<{seg: (typeof SEGMENTS)[number]}> = ({seg}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const settle = seg.index > 0 ? (1 - spring({frame, fps, config: {damping: 16, stiffness: 140}})) * 0.06 : 0;
	const push = interpolate(frame, [0, seg.duration], [0, 0.05], clamp);
	const [fx, fy] = seg.focus ?? [0.5, 0.5];
	return (
		<AbsoluteFill style={{transform: `scale(${1 + settle + push})`, transformOrigin: `${fx * 100}% ${fy * 100}%`}}>
			<OffthreadVideo src={staticFile(`${seg.clip}.mp4`)} trimBefore={seg.trimBefore} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
		</AbsoluteFill>
	);
};

export const BrunchReel: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: '#000'}}>
		{SEGMENTS.map((s) => (
			<Sequence key={s.index} from={s.start} durationInFrames={s.duration}>
				<Shot seg={s} />
				{s.sparkle ? <FireflyField duration={s.duration} count={24} seed={`brunch-${s.index}`} /> : null}
			</Sequence>
		))}
		{/* Frozen last frame under the outro */}
		<Sequence from={BODY_END} durationInFrames={OUTRO_FRAMES}>
			<Freeze frame={0}>
				<OffthreadVideo src={staticFile(`${last.clip}.mp4`)} trimBefore={last.trimBefore + last.duration - 1} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
			</Freeze>
		</Sequence>
		{/* Whoosh into L'Atelier */}
		<Sequence from={SEGMENTS[11].start - 6} durationInFrames={14}>
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
		<Sequence from={BODY_END} durationInFrames={OUTRO_FRAMES} layout="none">
			<Outro duration={OUTRO_FRAMES} note={OUTRO_NOTE} />
			<Audio src={staticFile('reel/sfx/sparkle.wav')} volume={0.5} />
		</Sequence>
		<Audio
			src={staticFile(MUSIC)}
			volume={(f) => MUSIC_LEVELS.body + (MUSIC_LEVELS.outro - MUSIC_LEVELS.body) * interpolate(f, [BODY_END, BODY_END + 12], [0, 1], clamp)}
		/>
	</AbsoluteFill>
);
