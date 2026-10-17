import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {CHARCOAL, CREAM, END_CARD_AT, GOLD, PHRASES, sans, type TimedPhrase, type TimedWord} from './timeline';

/**
 * English subtitles in the Luciole style. The host's answers pop in word by word (cream,
 * charcoal outline, the current word in the logo gold); the off-camera questions sit in
 * a charcoal pill with a gold "Q" so viewers can tell the two voices apart.
 * Text and timing live in data.ts CAPTIONS.
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

const Question: React.FC<{phrase: TimedPhrase}> = ({phrase}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const enter = spring({frame: frame - phrase.start + 2, fps, config: {damping: 16, stiffness: 180}});
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 22,
				padding: '18px 34px 18px 18px',
				borderRadius: 40,
				background: 'rgba(41,41,41,0.86)',
				border: `2px solid rgba(183,144,93,0.55)`,
				boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
				transform: `translateY(${(1 - enter) * 30}px) scale(${0.92 + 0.08 * enter})`,
				opacity: enter,
				maxWidth: 860,
			}}
		>
			<div
				style={{
					width: 64,
					height: 64,
					borderRadius: '50%',
					flexShrink: 0,
					background: GOLD,
					color: CHARCOAL,
					fontFamily: sans,
					fontWeight: 700,
					fontSize: 36,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				Q
			</div>
			<div style={{fontFamily: sans, fontWeight: 700, fontSize: 50, lineHeight: 1.25, color: CREAM}}>
				{phrase.words.map((w, i) => {
					const on = interpolate(frame, [w.start - 1, w.start + 3], [0.25, 1], clamp);
					return (
						<span key={i} style={{opacity: on, color: w.highlight && frame >= w.start ? GOLD : CREAM}}>
							{w.text}
							{i < phrase.words.length - 1 ? ' ' : ''}
						</span>
					);
				})}
			</div>
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
					{phrase.speaker === 'q' ? <Question phrase={phrase} /> : <Answer phrase={phrase} />}
				</AbsoluteFill>
			);
		}
	}
	return null;
};
