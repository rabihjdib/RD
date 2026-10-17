import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, HEIGHT, WIDTH} from '../theme';
import {BrushStroke} from './BrushStroke';

const STROKE_W = 3400;
const STROKE_H = 560;
const COLORS = [C.charcoal, C.red, C.charcoal, C.red, C.charcoal, C.red];
// Rows overlap by 30% so the ragged edges never leave a gap at the cut.
const ROW = STROKE_H * 0.7;

/**
 * Six tilted brush strokes sweep right to left. Around the midpoint they cover
 * the whole frame, which is where the scene cut sits.
 */
export const BrushWipe: React.FC = () => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	return (
		<AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none'}}>
			<div
				style={{
					position: 'absolute',
					left: WIDTH / 2,
					top: HEIGHT / 2,
					transform: 'rotate(-12deg)',
				}}
			>
				{COLORS.map((color, i) => {
					// Stagger the outer strokes so the leading edge reads as a diagonal swipe.
					const lag = Math.abs(i - 2.5) * 0.4;
					const x = interpolate(frame - lag, [0, durationInFrames - 1], [WIDTH / 2 + STROKE_W / 2 + 200, -WIDTH / 2 - STROKE_W / 2 - 200], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					});
					return (
						<div
							key={i}
							style={{
								position: 'absolute',
								left: x - STROKE_W / 2,
								top: (i - 3) * ROW,
							}}
						>
							<BrushStroke width={STROKE_W} height={STROKE_H} color={color} seed={`wipe-${i}`} />
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

/** Warm red and amber light leak that blooms over a cut between two clips. */
export const LightLeak: React.FC = () => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	const mid = durationInFrames / 2;
	const strength = interpolate(frame, [0, mid, durationInFrames], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const drift = interpolate(frame, [0, durationInFrames], [-200, 260]);
	return (
		<AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen', opacity: strength}}>
			<AbsoluteFill
				style={{
					background: `radial-gradient(circle at ${30 + drift / 20}% 35%, rgba(255,170,90,1) 0%, rgba(255,90,40,0.85) 25%, rgba(227,27,35,0.5) 45%, rgba(0,0,0,0) 70%)`,
				}}
			/>
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse at ${80 - drift / 15}% 70%, rgba(255,240,210,0.95) 0%, rgba(255,120,60,0.6) 30%, rgba(0,0,0,0) 65%)`,
				}}
			/>
			<AbsoluteFill style={{backgroundColor: `rgba(255,236,220,${interpolate(strength, [0.6, 1], [0, 0.9], {extrapolateLeft: 'clamp'})})`}} />
		</AbsoluteFill>
	);
};

/** One-frame-ish white flash used for urgent cuts and impacts. */
export const Flash: React.FC<{at: number; length?: number}> = ({at, length = 6}) => {
	const frame = useCurrentFrame();
	const o = interpolate(frame, [at, at + 1, at + length], [0, 0.85, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return o > 0 ? <AbsoluteFill style={{backgroundColor: C.white, opacity: o, pointerEvents: 'none'}} /> : null;
};
