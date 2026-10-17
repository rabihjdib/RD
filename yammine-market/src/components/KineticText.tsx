import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, display} from '../theme';

const punchy = {damping: 11, stiffness: 180, mass: 0.7};

/** Letters drop in one after another with a scale bounce. */
export const PopLetters: React.FC<{
	text: string;
	size: number;
	delay?: number;
	stagger?: number;
	color?: string;
	shadow?: boolean;
}> = ({text, size, delay = 0, stagger = 2, color = C.white, shadow = true}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return (
		<div style={{display: 'flex', fontFamily: display, fontSize: size, lineHeight: 1, color, whiteSpace: 'pre'}}>
			{text.split('').map((ch, i) => {
				const s = spring({frame, fps, delay: delay + i * stagger, config: punchy});
				return (
					<span
						key={i}
						style={{
							display: 'inline-block',
							transform: `translateY(${(1 - s) * size * 0.6}px) scale(${interpolate(s, [0, 1], [0.3, 1])}) rotate(${(1 - s) * (i % 2 ? 12 : -12)}deg)`,
							opacity: Math.min(1, s * 2),
							textShadow: shadow ? '0 8px 0 rgba(0,0,0,0.35)' : undefined,
						}}
					>
						{ch}
					</span>
				);
			})}
		</div>
	);
};

/** A whole line that slams in from one side with a slight skew, then settles. */
export const SlideLine: React.FC<{
	text: string;
	size: number;
	delay?: number;
	from?: 'left' | 'right';
	color?: string;
	outline?: boolean;
	speed?: number;
}> = ({text, size, delay = 0, from = 'left', color = C.white, outline = false, speed = 1}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = spring({frame: frame * speed, fps, delay, config: {damping: 13, stiffness: 160, mass: 0.8}});
	const dir = from === 'left' ? -1 : 1;
	return (
		<div
			style={{
				fontFamily: display,
				fontSize: size,
				lineHeight: 0.98,
				color,
				whiteSpace: 'nowrap',
				transform: `translateX(${(1 - s) * dir * 1100}px) skewX(${(1 - s) * dir * 18}deg)`,
				textShadow: '0 10px 0 rgba(0,0,0,0.45), 0 0 40px rgba(0,0,0,0.35)',
				WebkitTextStroke: outline ? `6px ${C.charcoal}` : undefined,
				paintOrder: 'stroke fill',
			}}
		>
			{text}
		</div>
	);
};
