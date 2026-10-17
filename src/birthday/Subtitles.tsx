import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {CHARCOAL, CREAM, END_CARD_AT, GOLD, PHRASES, sans, type TimedPhrase, type TimedWord} from './timeline';

/**
 * English subtitles in the Luciole style: words pop in one by one (cream, charcoal outline,
 * the current word in the logo gold). Text and timing live in data.ts CAPTIONS.
 */

// Clear of Instagram's right-hand buttons and bottom caption block.
const TOP = 1150;
const PAD_LEFT = 70;
const PAD_RIGHT = 130;
const LINGER = 15;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const sizeFor = (p: TimedPhrase) => {
	const chars = p.words.reduce((n, w) => n + w.text.length + 1, 0);
	if (chars <= 14) return 92;
	if (chars <= 24) return 80;
	return 68;
};

const AnswerWord: React.FC<{word: TimedWord; size: number}> = ({word, size}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const local = frame - word.start;
	const base: React.CSSProperties = {
		display: 'inline-block',
		fontFamily: sans,
		fontWeight: 700,
		fontSize: size,
		lineHeight: 1.22,
		textTransform: 'uppercase',
		WebkitTextStroke: `${Math.round(size * 0.15)}px ${CHARCOAL}`,
		paintOrder: 'stroke fill',
		textShadow: `0 ${size * 0.08}px 0 rgba(0,0,0,0.35), 0 ${size * 0.12}px ${size * 0.3}px rgba(0,0,0,0.45)`,
		whiteSpace: 'nowrap',
		transformOrigin: '50% 80%',
	};
	if (local < -1) return <span style={{...base, opacity: 0}}>{word.text}</span>;
	const pop = spring({frame: local, fps, config: {damping: 13, stiffness: 240, mass: 0.6}});
	const active = frame >= word.start && frame < word.end;
	return (
		<span
			style={{
				...base,
				color: active || word.highlight ? GOLD : CREAM,
				transform: `translateY(${(1 - pop) * 24}px) scale(${0.74 + 0.26 * pop + (active ? 0.07 : 0)})`,
				opacity: Math.min(1, pop * 1.6),
			}}
		>
			{word.text}
		</span>
	);
};

const Answer: React.FC<{phrase: TimedPhrase}> = ({phrase}) => {
	const size = sizeFor(phrase);
	return (
		<div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'baseline', columnGap: size * 0.3}}>
			{phrase.words.map((w) => (
				<AnswerWord key={w.start} word={w} size={size} />
			))}
		</div>
	);
};

export const Subtitles: React.FC = () => {
	const frame = useCurrentFrame();
	if (frame >= END_CARD_AT) return null;
	for (let i = 0; i < PHRASES.length; i++) {
		const phrase = PHRASES[i];
		const next = PHRASES[i + 1];
		const handover = next !== undefined && next.start - 1 <= phrase.end + LINGER;
		const until = Math.min(handover ? next.start - 1 : phrase.end + LINGER, END_CARD_AT);
		if (frame >= phrase.start - 1 && frame < until) {
			const fade = handover ? 1 : interpolate(frame, [until - 4, until], [1, 0], clamp);
			return (
				<AbsoluteFill key={phrase.start} style={{top: TOP, paddingLeft: PAD_LEFT, paddingRight: PAD_RIGHT, alignItems: 'center', opacity: fade}}>
					<Answer phrase={phrase} />
				</AbsoluteFill>
			);
		}
	}
	return null;
};
