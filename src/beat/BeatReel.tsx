import {AbsoluteFill, Audio, Freeze, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {TitleCard} from '../atelier/Main';
import {Outro} from '../reel/Branding';
import {FireflyField} from '../reel/Effects';
import {InfoCard, type InfoRow} from './InfoCard';

/**
 * Music-driven montage, 1080x1920 @ 30fps, shared by the brunch and café reels: shots cut on
 * the beat with a gentle push on each, brand titles placed by shot, gold sparkles on chosen
 * shots, a frozen last frame under the logo outro. Original colours (clips are converted
 * with scripts/dv_convert.sh, no grading). Each reel's data.ts holds a BeatReelConfig.
 */

export type BeatShot = {clip: string; from: number; beats: number; focus?: [number, number]; sparkle?: boolean};
export type BeatTitle = {shot: number; beats: number; text: string; kicker?: string};
export type BeatCard = {shot: number; beats: number; heading: string; kicker?: string; rows: InfoRow[]};
export type BeatReelConfig = {
	id: string; // seeds the sparkles
	fps: number;
	beat: number; // seconds per beat, matching the music bed
	shots: BeatShot[]; // `clip` is the path under public/ without .mp4
	titles: BeatTitle[];
	cards?: BeatCard[]; // centred info panels (e.g. opening hours), placed like titles
	whooshAt?: number[]; // shot indexes that get a whoosh on their cut
	sfx?: {shot: number; offset: number; src: string; volume: number}[]; // offset in seconds into the shot
	titleSfx?: {src: string; volume: number}; // plays as each title or card appears
	outro: number; // seconds of logo outro after the last shot
	outroNote: string;
	music: string;
	musicLevels: {body: number; outro: number};
};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Cut points come from cumulative beats so rounding never drifts off the music.
const timeline = (c: BeatReelConfig) => {
	const beatFrame = (beats: number) => Math.round(beats * c.beat * c.fps);
	let beats = 0;
	const segments = c.shots.map((s, index) => {
		const start = beatFrame(beats);
		beats += s.beats;
		return {...s, index, start, duration: beatFrame(beats) - start, trimBefore: Math.round(s.from * c.fps)};
	});
	const last = segments[segments.length - 1];
	const bodyEnd = last.start + last.duration;
	const outroFrames = Math.round(c.outro * c.fps);
	return {beatFrame, segments, last, bodyEnd, outroFrames, duration: bodyEnd + outroFrames};
};

export const beatReelDuration = (c: BeatReelConfig) => timeline(c).duration;

type Segment = ReturnType<typeof timeline>['segments'][number];

const Shot: React.FC<{seg: Segment}> = ({seg}) => {
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

export const BeatReel: React.FC<{config: BeatReelConfig}> = ({config}) => {
	const {beatFrame, segments, last, bodyEnd, outroFrames} = timeline(config);
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			{segments.map((s) => (
				<Sequence key={s.index} from={s.start} durationInFrames={s.duration}>
					<Shot seg={s} />
					{s.sparkle ? <FireflyField duration={s.duration} count={24} seed={`${config.id}-${s.index}`} /> : null}
				</Sequence>
			))}
			{/* Frozen last frame under the outro */}
			<Sequence from={bodyEnd} durationInFrames={outroFrames}>
				<Freeze frame={0}>
					<OffthreadVideo src={staticFile(`${last.clip}.mp4`)} trimBefore={last.trimBefore + last.duration - 1} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
				</Freeze>
			</Sequence>
			{config.whooshAt?.map((i) => (
				<Sequence key={`whoosh-${i}`} from={segments[i].start - 6} durationInFrames={14}>
					<Audio src={staticFile('reel/sfx/whoosh.wav')} volume={0.3} />
				</Sequence>
			))}
			{config.sfx?.map((e) => (
				<Sequence key={`${e.src}-${e.shot}-${e.offset}`} from={segments[e.shot].start + Math.round(e.offset * config.fps)}>
					<Audio src={staticFile(e.src)} volume={e.volume} />
				</Sequence>
			))}
			{config.titles.map((t) => {
				const frames = beatFrame(t.beats);
				return (
					<Sequence key={t.text} from={segments[t.shot].start} durationInFrames={frames} layout="none">
						<TitleCard text={t.text} kicker={t.kicker} frames={frames} />
						{config.titleSfx ? (
							<Sequence from={2} layout="none">
								<Audio src={staticFile(config.titleSfx.src)} volume={config.titleSfx.volume} />
							</Sequence>
						) : null}
					</Sequence>
				);
			})}
			{config.cards?.map((c) => {
				const frames = beatFrame(c.beats);
				return (
					<Sequence key={c.heading} from={segments[c.shot].start} durationInFrames={frames} layout="none">
						<InfoCard kicker={c.kicker} heading={c.heading} rows={c.rows} frames={frames} />
						{config.titleSfx ? <Audio src={staticFile(config.titleSfx.src)} volume={config.titleSfx.volume} /> : null}
					</Sequence>
				);
			})}
			<Sequence from={bodyEnd} durationInFrames={outroFrames} layout="none">
				<Outro duration={outroFrames} note={config.outroNote} />
				<Audio src={staticFile('reel/sfx/sparkle.wav')} volume={0.5} />
			</Sequence>
			<Audio
				src={staticFile(config.music)}
				volume={(f) =>
					config.musicLevels.body + (config.musicLevels.outro - config.musicLevels.body) * interpolate(f, [bodyEnd, bodyEnd + 12], [0, 1], clamp)
				}
			/>
		</AbsoluteFill>
	);
};
