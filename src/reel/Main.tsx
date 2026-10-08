import {AbsoluteFill, Audio, Freeze, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {BRollOverlays} from './BRollOverlays';
import {Outro} from './Branding';
import {MUSIC, MUSIC_VOLUME} from './data';
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
		{MUSIC ? <Audio src={staticFile(MUSIC)} volume={MUSIC_VOLUME} /> : null}
	</AbsoluteFill>
);

export {REEL_DURATION};
