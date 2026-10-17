import {AbsoluteFill, Audio, Freeze, interpolate, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {Outro} from '../reel/Branding';
import {FireflyField} from '../reel/Effects';
import {MUSIC, MUSIC_LEVELS, OUTRO_NOTE} from './data';
import {Badges, BRollCutaways, CutTransitions, IconPops, useCamera} from './Effects';
import {Subtitles} from './Subtitles';
import {BODY_END, END_CARD_AT, END_HOLD_FRAMES, REEL_DURATION, SEGMENTS, WORDS} from './timeline';

/**
 * Luciole birthday-party reel, 1080x1920 @ 30fps. Original colours (Dolby Vision
 * conversion, no grading).
 *
 * Layer order, bottom to top:
 *   1. Main cuts: host lines (cleaned voice) and the party montage (natural sound)
 *   2. B-roll cutaways over the host's voice
 *   3. Transitions (cream flash + whoosh around the host; hard cuts in the montage)
 *   4. Gold sparkles while everyone sings, badges, icon pops
 *   5. English subtitles, word by word
 *   6. Logo outro with WhatsApp and location
 *   7. Kids music bed, ducked under the host, the countdown and the singing
 *
 * Re-edit by changing data.ts; durations, ducking and overlays follow from there.
 */

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Footage: React.FC = () => {
	const camera = useCamera();
	const last = SEGMENTS[SEGMENTS.length - 1];
	return (
		<AbsoluteFill style={{...camera, backgroundColor: '#000'}}>
			{SEGMENTS.map((s) => (
				<Sequence key={s.index} from={s.start} durationInFrames={s.duration}>
					<OffthreadVideo src={staticFile(`birthday/${s.clip}.mp4`)} trimBefore={s.trimBefore} volume={s.volume ?? 1} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
				</Sequence>
			))}
			<Sequence from={BODY_END} durationInFrames={END_HOLD_FRAMES}>
				<Freeze frame={0}>
					<OffthreadVideo src={staticFile(`birthday/${last.clip}.mp4`)} trimBefore={last.trimBefore + last.duration - 1} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
				</Freeze>
			</Sequence>
		</AbsoluteFill>
	);
};

// Music ducking: dips under every subtitle word and under montage clips flagged
// duckMusic (countdown, singing), lifts in between, swells for the outro.
const MUSIC_CURVE: number[] = (() => {
	const speaking = new Array(REEL_DURATION).fill(0);
	for (const w of WORDS) {
		for (let f = Math.max(0, w.start - 4); f <= Math.min(REEL_DURATION - 1, w.end + 6); f++) speaking[f] = 1;
	}
	for (const s of SEGMENTS.filter((x) => x.duckMusic)) {
		for (let f = Math.max(0, s.start - 3); f < Math.min(REEL_DURATION, s.start + s.duration); f++) speaking[f] = 1;
	}
	const curve: number[] = [];
	let duck = speaking[0];
	for (let f = 0; f < REEL_DURATION; f++) {
		duck += (speaking[f] - duck) * (speaking[f] > duck ? 0.45 : 0.12);
		const body = MUSIC_LEVELS.gaps + (MUSIC_LEVELS.speech - MUSIC_LEVELS.gaps) * duck;
		const swell = interpolate(f, [END_CARD_AT, END_CARD_AT + 12], [0, 1], clamp);
		curve.push(body + (MUSIC_LEVELS.outro - body) * swell);
	}
	return curve;
})();

const SING = SEGMENTS.find((s) => s.clip === 'p_sing');
const OUTRO_FRAMES = REEL_DURATION - END_CARD_AT;

export const BirthdayReel: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: '#000'}}>
		<Footage />
		<BRollCutaways />
		<CutTransitions />
		{SING ? (
			<Sequence from={SING.start} durationInFrames={SING.duration} layout="none">
				<FireflyField duration={SING.duration} count={26} seed="birthday" />
			</Sequence>
		) : null}
		<Badges />
		<IconPops />
		<Subtitles />
		<Sequence from={END_CARD_AT} durationInFrames={OUTRO_FRAMES} layout="none">
			<Outro duration={OUTRO_FRAMES} note={OUTRO_NOTE} />
			<Audio src={staticFile('reel/sfx/sparkle.wav')} volume={0.5} />
		</Sequence>
		{MUSIC ? <Audio src={staticFile(MUSIC)} volume={(f) => MUSIC_CURVE[Math.min(f, REEL_DURATION - 1)]} /> : null}
	</AbsoluteFill>
);

export {REEL_DURATION};
