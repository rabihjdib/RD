import React from 'react';
import {Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, WIDTH, body, display} from '../theme';
import {BrushStroke} from './BrushStroke';

// logo-white.png is 1400x665, rendered from the client's logo_yammine_gray.ai.
const LOGO_RATIO = 665 / 1400;

/** Yammine Market logo with a spring pop and an optional light sweep across it. */
export const Logo: React.FC<{width: number; delay?: number; shine?: boolean}> = ({width, delay = 0, shine = false}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = spring({frame, fps, delay, config: {damping: 10, stiffness: 150, mass: 0.8}});
	const sweep = interpolate(frame, [delay + 14, delay + 34], [-40, 140], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const height = width * LOGO_RATIO;
	const src = staticFile('brand/logo-white.png');
	return (
		<div
			style={{
				position: 'relative',
				width,
				height,
				transform: `scale(${interpolate(s, [0, 1], [0.4, 1])}) rotate(${(1 - s) * -8}deg)`,
				opacity: Math.min(1, s * 1.6),
				filter: 'drop-shadow(0 10px 22px rgba(0,0,0,0.55))',
			}}
		>
			<Img src={src} style={{width, height}} />
			{shine ? (
				<div
					style={{
						position: 'absolute',
						inset: 0,
						WebkitMaskImage: `url(${src})`,
						WebkitMaskSize: '100% 100%',
						background: `linear-gradient(110deg, transparent ${sweep - 12}%, rgba(227,27,35,0.95) ${sweep}%, transparent ${sweep + 12}%)`,
					}}
				/>
			) : null}
		</div>
	);
};

/** Small red chip naming the variant's focus, e.g. "COFFEE · TEA · HOT DRINKS". */
export const CategoryChip: React.FC<{text: string; delay?: number}> = ({text, delay = 0}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = spring({frame, fps, delay, config: {damping: 14, stiffness: 170}});
	return (
		<div
			style={{
				display: 'inline-block',
				padding: '12px 28px',
				backgroundColor: C.red,
				color: C.white,
				fontFamily: body,
				fontWeight: 900,
				fontSize: 34,
				letterSpacing: 3,
				transform: `skewX(-10deg) scaleX(${s})`,
				boxShadow: '0 8px 0 rgba(0,0,0,0.4)',
			}}
		>
			<span style={{display: 'inline-block', transform: 'skewX(10deg)', opacity: s}}>{text}</span>
		</div>
	);
};

/** Diagonal scrolling caution-style tape for the urgent variant. */
export const Ticker: React.FC<{text: string; y: number; rotate?: number; reverse?: boolean; dark?: boolean}> = ({
	text,
	y,
	rotate = -6,
	reverse = false,
	dark = false,
}) => {
	const frame = useCurrentFrame();
	// The text is repeated far wider than a scene can scroll, so it never needs to wrap.
	const offset = reverse ? -2400 + frame * 14 : -frame * 14;
	return (
		<div
			style={{
				position: 'absolute',
				left: -200,
				top: y,
				width: WIDTH + 400,
				height: 92,
				overflow: 'hidden',
				backgroundColor: dark ? C.charcoal : C.red,
				transform: `rotate(${rotate}deg)`,
				boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
				borderTop: `5px solid ${dark ? C.red : C.white}`,
				borderBottom: `5px solid ${dark ? C.red : C.white}`,
			}}
		>
			<div
				style={{
					position: 'absolute',
					left: offset,
					top: 6,
					whiteSpace: 'pre',
					fontFamily: display,
					fontSize: 64,
					lineHeight: '74px',
					color: C.white,
				}}
			>
				{text.repeat(8)}
			</div>
		</div>
	);
};

/** Red brush banner that paints itself in and carries a line of text. */
export const BrushBanner: React.FC<{
	width: number;
	height: number;
	seed: string;
	delay?: number;
	color?: string;
	fromRight?: boolean;
	children: React.ReactNode;
}> = ({width, height, seed, delay = 0, color = C.red, fromRight = false, children}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const paint = spring({frame, fps, delay, config: {damping: 22, stiffness: 160}});
	const land = spring({frame, fps, delay, config: {damping: 9, stiffness: 200, mass: 0.6}});
	return (
		<div style={{transform: `rotate(-3deg) scale(${interpolate(land, [0, 1], [1.15, 1])})`, filter: 'drop-shadow(0 16px 24px rgba(0,0,0,0.5))'}}>
			<BrushStroke width={width} height={height} seed={seed} color={color} progress={paint} fromRight={fromRight}>
				{children}
			</BrushStroke>
		</div>
	);
};
