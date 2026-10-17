import React, {useMemo} from 'react';
import {random} from 'remotion';
import {C} from '../theme';

type Props = {
	width: number;
	height: number;
	color?: string;
	/** Changes the shape of the ragged edges; same seed, same stroke on every frame. */
	seed?: string;
	/** 0..1 how much of the stroke is painted, left to right. */
	progress?: number;
	/** Paint from the right edge instead of the left. */
	fromRight?: boolean;
	style?: React.CSSProperties;
	children?: React.ReactNode;
};

// Builds a dry-brush silhouette: a body with wavy top/bottom edges, ragged ends,
// and loose bristle streaks running past both ends, like the poster's banners.
const buildStroke = (w: number, h: number, seed: string) => {
	const r = (i: number) => random(`${seed}-${i}`);
	const end = w * 0.07;
	const steps = 18;
	const top: string[] = [];
	const bottom: string[] = [];
	for (let i = 0; i <= steps; i++) {
		const x = end + ((w - 2 * end) * i) / steps;
		top.push(`${x},${h * 0.06 + r(i) * h * 0.08}`);
		bottom.push(`${x},${h * 0.94 - r(i + 100) * h * 0.08}`);
	}
	const rightEnd: string[] = [];
	const leftEnd: string[] = [];
	for (let i = 0; i <= 10; i++) {
		const y = h * 0.1 + (h * 0.8 * i) / 10;
		rightEnd.push(`${w - end + r(i + 200) * end * 0.9},${y}`);
		leftEnd.push(`${end - r(i + 300) * end * 0.9},${h - y}`);
	}
	const body = [...top, ...rightEnd, ...bottom.reverse(), ...leftEnd].join(' ');

	const streaks = Array.from({length: 16}, (_, i) => {
		const y = h * 0.08 + (h * 0.84 * i) / 15;
		const t = 2 + r(i + 400) * h * 0.035;
		const left = r(i + 500) * end * 1.4;
		const right = w - r(i + 600) * end * 1.4;
		return {y, t, left, right, gap: r(i + 700) > 0.7 ? w * (0.2 + r(i + 800) * 0.5) : null};
	});
	return {body, streaks};
};

export const BrushStroke: React.FC<Props> = ({
	width,
	height,
	color = C.red,
	seed = 'brush',
	progress = 1,
	fromRight = false,
	style,
	children,
}) => {
	const {body, streaks} = useMemo(() => buildStroke(width, height, seed), [width, height, seed]);
	const clipId = `clip-${seed}`;
	const reveal = Math.max(0, Math.min(1, progress)) * width;
	return (
		<div style={{position: 'relative', width, height, ...style}}>
			<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				<defs>
					<clipPath id={clipId}>
						<rect x={fromRight ? width - reveal : 0} y={-height} width={reveal} height={height * 3} />
					</clipPath>
				</defs>
				<g clipPath={`url(#${clipId})`} fill={color}>
					<polygon points={body} />
					{streaks.map((s, i) =>
						s.gap === null ? (
							<rect key={i} x={s.left} y={s.y} width={s.right - s.left} height={s.t} rx={s.t / 2} />
						) : (
							<g key={i} opacity={0.85}>
								<rect x={s.left} y={s.y} width={s.gap - s.left} height={s.t} rx={s.t / 2} />
								<rect x={s.gap + width * 0.04} y={s.y} width={s.right - s.gap - width * 0.04} height={s.t} rx={s.t / 2} />
							</g>
						),
					)}
				</g>
			</svg>
			{children ? (
				<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
			) : null}
		</div>
	);
};
