import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {CHARCOAL, CREAM, END_CARD_AT, GOLD, PHRASES, sans, type TimedPhrase, type TimedWord} from './timeline';

/**
 * Bilingual, word-by-word captions.
 *
 * Main line: the words as spoken, each one popping in on its own timestamp, the
 * current word in the logo gold. Colours and fonts follow the LUCIOLE brand guidelines. Under it, a smaller translation line in the other language.
 * Caption data lives in data.ts (CAPTIONS); nothing here needs editing to re-time.
 *
 * Bidirectional text: each word is its own element, so the browser's bidi algorithm
 * cannot order them for us (inline-blocks count as neutral characters). Instead each
 * page is split into same-script runs. Runs in the line's own direction are laid out
 * word by word (and may wrap); runs in the other script are kept together as one
 * group with their own direction, so "brand new concept" inside an Arabic line still
 * reads left to right and sits where it was spoken.
 */

// Safe area: Instagram's like/comment rail covers the right ~130px and the caption
// and username block the bottom ~380px, so captions sit above that and lean left.
const TOP = 1150;
const PAD_LEFT = 70;
const PAD_RIGHT = 130;
const LINGER = 15; // frames a page stays up after its last word if nothing follows

const sizeFor = (p: TimedPhrase) => {
	const chars = p.words.reduce((n, w) => n + w.text.length, 0);
	if (chars <= 14) return 100;
	if (chars <= 22) return 88;
	return 74;
};

type Run = {script: TimedWord['script']; words: TimedWord[]};

const toRuns = (words: TimedWord[]): Run[] =>
	words.reduce<Run[]>((runs, w) => {
		const prev = runs[runs.length - 1];
		if (prev && prev.script === w.script) prev.words.push(w);
		else runs.push({script: w.script, words: [w]});
		return runs;
	}, []);

const Word: React.FC<{word: TimedWord; size: number}> = ({word, size}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const local = frame - word.start;
	if (local < -1) {
		// Not spoken yet: keep its space so the line never reflows.
		return <span style={{...wordStyle(word, size), opacity: 0}}>{word.text}</span>;
	}
	const pop = spring({frame: local, fps, config: {damping: 13, stiffness: 240, mass: 0.6}});
	const active = frame >= word.start && frame < word.end;
	const lit = active || word.highlight;
	const scale = 0.72 + 0.28 * pop + (active ? 0.08 : 0);
	const tilt = word.zoom ? interpolate(pop, [0, 1], [-6, 0]) : 0;

	return (
		<span
			style={{
				...wordStyle(word, size),
				color: lit ? GOLD : CREAM,
				transform: `translateY(${(1 - pop) * 26}px) scale(${scale}) rotate(${tilt}deg)`,
				transformOrigin: '50% 80%',
				opacity: Math.min(1, pop * 1.6),
			}}
		>
			{word.text}
		</span>
	);
};

const wordStyle = (word: TimedWord, size: number): React.CSSProperties => ({
	display: 'inline-block',
	fontFamily: sans,
	fontWeight: 700,
	// Arabic glyphs read smaller than Latin caps at the same size.
	fontSize: word.script === 'ar' ? size * 1.04 : size * 0.9,
	lineHeight: 1.3,
	textTransform: word.script === 'latin' ? 'uppercase' : undefined,
	letterSpacing: word.script === 'latin' ? '0.01em' : undefined, // never space Arabic: it breaks the joins
	WebkitTextStroke: `${Math.round(size * 0.15)}px ${CHARCOAL}`,
	paintOrder: 'stroke fill',
	textShadow: `0 ${size * 0.08}px 0 rgba(0,0,0,0.35), 0 ${size * 0.12}px ${size * 0.3}px rgba(0,0,0,0.45)`,
	whiteSpace: 'nowrap',
});

const Page: React.FC<{phrase: TimedPhrase; until: number; fade: boolean}> = ({phrase, until, fade}) => {
	const frame = useCurrentFrame();
	const size = sizeFor(phrase);
	const gap = size * 0.34; // room for the active word's scale-up and the outline
	const out = fade ? interpolate(frame, [until - 4, until], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
	const sub = interpolate(frame, [phrase.start + 2, phrase.start + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const lineScript = phrase.dir === 'rtl' ? 'ar' : 'latin';
	const subRtl = phrase.dir === 'ltr';

	return (
		<AbsoluteFill style={{top: TOP, paddingLeft: PAD_LEFT, paddingRight: PAD_RIGHT, alignItems: 'center', opacity: out}}>
			<div
				lang={phrase.dir === 'rtl' ? 'ar' : 'en'}
				style={{direction: phrase.dir, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'baseline', columnGap: gap}}
			>
				{toRuns(phrase.words).map((run, i) =>
					run.script === lineScript ? (
						run.words.map((w) => <Word key={`${i}-${w.start}`} word={w} size={size} />)
					) : (
						<span key={i} style={{direction: run.script === 'ar' ? 'rtl' : 'ltr', display: 'inline-flex', columnGap: gap}}>
							{run.words.map((w) => (
								<Word key={w.start} word={w} size={size} />
							))}
						</span>
					),
				)}
			</div>
			<div
				lang={subRtl ? 'ar' : 'en'}
				style={{
					direction: subRtl ? 'rtl' : 'ltr',
					marginTop: 14,
					padding: '6px 26px 8px',
					borderRadius: 22,
					background: 'rgba(41,41,41,0.78)',
					color: CREAM,
					fontFamily: sans,
					fontWeight: 700,
					fontSize: 42,
					lineHeight: 1.35,
					textAlign: 'center',
					opacity: sub,
					transform: `translateY(${(1 - sub) * 12}px)`,
				}}
			>
				{phrase.translation}
			</div>
		</AbsoluteFill>
	);
};

export const Subtitles: React.FC = () => {
	const frame = useCurrentFrame();
	if (frame >= END_CARD_AT) return null;

	for (let i = 0; i < PHRASES.length; i++) {
		const phrase = PHRASES[i];
		const next = PHRASES[i + 1];
		// A page hands straight over to the next one; only a page followed by a gap fades.
		const handover = next !== undefined && next.start - 1 <= phrase.end + LINGER;
		const until = Math.min(handover ? next.start - 1 : phrase.end + LINGER, END_CARD_AT);
		if (frame >= phrase.start - 1 && frame < until) {
			// Keyed by page so each page's words start their animation fresh.
			return <Page key={phrase.start} phrase={phrase} until={until} fade={!handover} />;
		}
	}
	return null;
};
