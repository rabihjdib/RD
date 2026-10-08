import {AbsoluteFill, Audio, Freeze, interpolate, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {BRollOverlays} from './BRollOverlays';
import {Outro} from './Branding';
import {MUSIC, MUSIC_LEVELS} from './data';
import {CutTransitions, FireflyField, HighlightBadges, useCamera} from './Effects';
import {Subtitles} from './Subtitles';
import {BODY_END, END_CARD_AT, END_HOLD_FRAMES, normalizeWord, REEL_DURATION, SEGMENTS, WORDS} from './timeline';

/**
 * Luciole bilingual talking-head reel, 1080x1920 @ 30fps.
 *
 * Layer order, bottom to top:
 *   1. Footage: the cut list from data.ts played back to back, under the camera moves
 *   2. Cut transitions (flash + whoosh between rushes)
 *   3. Firefly specks on "spark light"
 *   4. Keyword B-roll cards           (BRollOverlays.tsx)
 *   5. Highlight badges               (Effects.tsx)
 *   6. Captions, word by word         (Subtitles.tsx)
 *   7. Logo outro with WhatsApp + location (Branding.tsx)
 *   8. Kids music bed, ducked under every spoken word
 *
 * To re-edit: change CUTS / CAPTIONS / BADGES in data.ts. The duration, transitions,
 * caption timing and keyword pop-ups all follow from there.
 */

const Footage: React.FC = () => {
	const camera = useCamera();
	const last = SEGMENTS[SEGMENTS.length - 1];

	return (
		<AbsoluteFill style={{...camera, backgroundColor: '#000'}}>
			{SEGMENTS.map((s) => (
				<Sequence key={s.index} from={s.start} durationInFrames={s.duration}>
					{/* OffthreadVideo is Remotion's frame-exact <Video> for rendering; same props. */}
					<OffthreadVideo src={staticFile(s.src)} trimBefore={s.trimBefore} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
				</Sequence>
			))}
			{/* Hold the last frame (muted) under the logo outro. */}
			<Sequence from={BODY_END} durationInFrames={END_HOLD_FRAMES}>
				<Freeze frame={0}>
					<OffthreadVideo src={staticFile(last.src)} trimBefore={last.trimBefore + last.duration - 1} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
				</Freeze>
			</Sequence>
		</AbsoluteFill>
	);
};

const SPARK = WORDS.find((w) => normalizeWord(w.text) === 'spark');

// Music ducking: a per-frame level that dips under every caption word (so re-timing the
// captions moves the ducking too), lifts between phrases and swells under the outro.
const MUSIC_CURVE: number[] = (() => {
	const speaking = new Array(REEL_DURATION).fill(0);
	for (const w of WORDS) {
		for (let f = Math.max(0, w.start - 4); f <= Math.min(REEL_DURATION - 1, w.end + 6); f++) speaking[f] = 1;
	}
	// Fast duck (about 3 frames), slow release (about 10 frames) so the music breathes.
	const curve: number[] = [];
	let duck = speaking[0];
	for (let f = 0; f < REEL_DURATION; f++) {
		duck += (speaking[f] - duck) * (speaking[f] > duck ? 0.45 : 0.12);
		const body = MUSIC_LEVELS.gaps + (MUSIC_LEVELS.speech - MUSIC_LEVELS.gaps) * duck;
		const swell = interpolate(f, [END_CARD_AT, END_CARD_AT + 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
		curve.push(body + (MUSIC_LEVELS.outro - body) * swell);
	}
	return curve;
})();

export const LucioleReel: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: '#000'}}>
		<Footage />
		<CutTransitions />
		{SPARK ? (
			<Sequence from={SPARK.start - 4} durationInFrames={60} layout="none">
				<FireflyField duration={60} count={22} seed="spark" />
				<Audio src={staticFile('reel/sfx/sparkle.wav')} volume={0.4} />
			</Sequence>
		) : null}
		<BRollOverlays />
		<HighlightBadges />
		<Subtitles />
		<Sequence from={END_CARD_AT} durationInFrames={REEL_DURATION - END_CARD_AT} layout="none">
			<Outro />
			<Audio src={staticFile('reel/sfx/sparkle.wav')} volume={0.5} />
		</Sequence>
		{MUSIC ? <Audio src={staticFile(MUSIC)} volume={(f) => MUSIC_CURVE[Math.min(f, REEL_DURATION - 1)]} /> : null}
	</AbsoluteFill>
);

export {REEL_DURATION};
