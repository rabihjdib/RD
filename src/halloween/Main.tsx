import {AbsoluteFill, Audio, Freeze, interpolate, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {Outro} from '../reel/Branding';
import {MUSIC, MUSIC_LEVELS, OUTRO_NOTE} from './data';
import {Badges, Bats, BRollCutaways, CutTransitions, IconPops, useCamera} from './Effects';
import {Subtitles} from './Subtitles';
import {BODY_END, END_CARD_AT, END_HOLD_FRAMES, QUESTION_SPANS, REEL_DURATION, SEGMENTS, WORDS} from './timeline';

/**
 * Luciole Halloween reel, 1080x1920 @ 30fps. Original colours (Dolby Vision conversion, no grading).
 *
 * Layer order, bottom to top:
 *   1. Talking cuts (picture + cleaned voice) under the camera moves
 *   2. B-roll cutaways (picture only, the host keeps talking)
 *   3. Clip transitions (cream flash + whoosh)
 *   4. Bats on the hook, badges, icon pops
 *   5. English subtitles (answers word by word, questions in a "Q" pill)
 *   6. Logo outro with the event dates, WhatsApp and location
 *   7. Halloween music bed, ducked under every spoken word
 *
 * Re-edit by changing data.ts; durations, ducking and overlays follow from there.
 */

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Per-clip voice level: dips the off-camera question where data.ts sets questionGain. */
const voiceVolume = (seg: (typeof SEGMENTS)[number]) => (f: number) => {
	if (!seg.questionGain) return 1;
	const frame = seg.start + f;
	for (const q of QUESTION_SPANS) {
		if (q.clip !== seg.clip) continue;
		const inQ = interpolate(frame, [q.start - 4, q.start, q.end, q.end + 4], [0, 1, 1, 0], clamp);
		if (inQ > 0) return 1 - (1 - seg.questionGain) * inQ;
	}
	return 1;
};

const Footage: React.FC = () => {
	const camera = useCamera();
	const last = SEGMENTS[SEGMENTS.length - 1];
	return (
		<AbsoluteFill style={{...camera, backgroundColor: '#000'}}>
			{SEGMENTS.map((s) => (
				<Sequence key={s.index} from={s.start} durationInFrames={s.duration}>
					<OffthreadVideo src={staticFile(`halloween/${s.clip}.mp4`)} trimBefore={s.trimBefore} volume={voiceVolume(s)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
				</Sequence>
			))}
			<Sequence from={BODY_END} durationInFrames={END_HOLD_FRAMES}>
				<Freeze frame={0}>
					<OffthreadVideo src={staticFile(`halloween/${last.clip}.mp4`)} trimBefore={last.trimBefore + last.duration - 1} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
				</Freeze>
			</Sequence>
		</AbsoluteFill>
	);
};

// Music ducking: dips under every subtitle word, lifts between lines, swells for the outro.
const MUSIC_CURVE: number[] = (() => {
	const speaking = new Array(REEL_DURATION).fill(0);
	for (const w of WORDS) {
		for (let f = Math.max(0, w.start - 4); f <= Math.min(REEL_DURATION - 1, w.end + 6); f++) speaking[f] = 1;
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

const OUTRO_FRAMES = REEL_DURATION - END_CARD_AT;

export const HalloweenReel: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: '#000'}}>
		<Footage />
		<BRollCutaways />
		<CutTransitions />
		<Sequence from={0} durationInFrames={80} layout="none">
			<Bats duration={80} count={4} seed="hook" />
		</Sequence>
		<Badges />
		<IconPops />
		<Subtitles />
		<Sequence from={END_CARD_AT} durationInFrames={OUTRO_FRAMES} layout="none">
			<Outro duration={OUTRO_FRAMES} note={OUTRO_NOTE} />
			<Bats duration={OUTRO_FRAMES} count={3} seed="outro" />
			<Audio src={staticFile('reel/sfx/sparkle.wav')} volume={0.5} />
		</Sequence>
		{MUSIC ? <Audio src={staticFile(MUSIC)} volume={(f) => MUSIC_CURVE[Math.min(f, REEL_DURATION - 1)]} /> : null}
	</AbsoluteFill>
);

export {REEL_DURATION};
