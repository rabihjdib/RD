import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, body, display} from '../theme';
import type {Badge} from '../types';

const starPoints = (cx: number, cy: number, outer: number, inner: number, n: number) =>
	Array.from({length: n * 2}, (_, i) => {
		const r = i % 2 ? inner : outer;
		const a = (Math.PI * i) / n - Math.PI / 2;
		return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
	}).join(' ');

const Label: React.FC<{label: string; sublabel?: string; size: number; color?: string; offsetY?: number}> = ({
	label,
	sublabel,
	size,
	color = C.white,
	offsetY = 0,
}) => {
	const long = label.length > 3;
	return (
		<div
			style={{
				position: 'absolute',
				inset: 0,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				color,
				transform: `translateY(${offsetY}px)`,
			}}
		>
			<div style={{fontFamily: display, fontSize: size * (long ? 0.2 : 0.36), lineHeight: 1}}>{label}</div>
			{sublabel ? (
				<div style={{fontFamily: body, fontWeight: 900, fontSize: size * 0.13, letterSpacing: size * 0.01, lineHeight: 1.1}}>{sublabel}</div>
			) : null}
		</div>
	);
};

/** Price tag with an eyelet and string, filled red with a white inner outline. */
export const PercentTag: React.FC<{size: number; label: string; sublabel?: string}> = ({size, label, sublabel}) => (
	<div style={{position: 'relative', width: size, height: size}}>
		<svg width={size} height={size} viewBox="0 0 100 100">
			<path d="M50 4 C44 4 40 10 42 16" stroke={C.white} strokeWidth="2.5" fill="none" />
			<path d="M38 18 L62 18 L80 36 L80 92 Q80 96 76 96 L24 96 Q20 96 20 92 L20 36 Z" fill={C.red} stroke={C.charcoal} strokeWidth="2" />
			<path d="M40 22 L60 22 L76 38 L76 90 L24 90 L24 38 Z" fill="none" stroke={C.white} strokeWidth="1.4" strokeDasharray="3 2" />
			<circle cx="50" cy="30" r="4.5" fill={C.charcoal} stroke={C.white} strokeWidth="1.5" />
		</svg>
		<Label label={label} sublabel={sublabel} size={size * 0.85} offsetY={size * 0.13} />
	</div>
);

/** Starburst sticker, like the poster's "% DISCOUNT" seal. */
export const StarBurst: React.FC<{size: number; label: string; sublabel?: string; spin?: number}> = ({size, label, sublabel, spin = 0}) => (
	<div style={{position: 'relative', width: size, height: size}}>
		<svg width={size} height={size} viewBox="0 0 100 100" style={{transform: `rotate(${spin}deg)`}}>
			<polygon points={starPoints(50, 50, 49, 41, 16)} fill={C.red} stroke={C.charcoal} strokeWidth="1.5" />
			<circle cx="50" cy="50" r="35" fill="none" stroke={C.white} strokeWidth="1.4" strokeDasharray="2.5 2" />
		</svg>
		<Label label={label} sublabel={sublabel} size={size} />
	</div>
);

/** Shopping bag with a percent sign, from the poster's corner icons. */
export const DealBag: React.FC<{size: number; label: string}> = ({size, label}) => (
	<div style={{position: 'relative', width: size, height: size}}>
		<svg width={size} height={size} viewBox="0 0 100 100">
			<path d="M36 34 V26 a14 14 0 0 1 28 0 V34" stroke={C.white} strokeWidth="5" fill="none" strokeLinecap="round" />
			<path d="M16 32 H84 L90 94 H10 Z" fill={C.red} stroke={C.charcoal} strokeWidth="2" strokeLinejoin="round" />
		</svg>
		<Label label={label} size={size * 0.95} offsetY={size * 0.13} />
	</div>
);

/** Pops a badge in on its delay, then keeps it bobbing so the frame never sits still. */
export const FloatingBadge: React.FC<{badge: Badge; urgent?: boolean}> = ({badge, urgent}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = spring({frame, fps, delay: badge.delay, config: {damping: 9, stiffness: urgent ? 260 : 200, mass: 0.6}});
	const t = Math.max(0, frame - badge.delay);
	const bob = Math.sin(t / (urgent ? 5 : 9) + badge.x) * (urgent ? 10 : 14);
	const sway = Math.sin(t / 13 + badge.y) * 4;
	const rot = (badge.rotate ?? 0) + sway + interpolate(s, [0, 1], [-90, 0]);
	const inner =
		badge.kind === 'tag' ? (
			<PercentTag size={badge.size} label={badge.label} sublabel={badge.sublabel} />
		) : badge.kind === 'burst' ? (
			<StarBurst size={badge.size} label={badge.label} sublabel={badge.sublabel} spin={t * (urgent ? 2 : 0.8)} />
		) : (
			<DealBag size={badge.size} label={badge.label} />
		);
	return (
		<div
			style={{
				position: 'absolute',
				left: badge.x,
				top: badge.y,
				transform: `translateY(${bob}px) scale(${s}) rotate(${rot}deg)`,
				filter: 'drop-shadow(0 14px 18px rgba(0,0,0,0.45))',
			}}
		>
			{inner}
		</div>
	);
};
