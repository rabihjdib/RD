import React, {useMemo} from 'react';
import {AbsoluteFill, Img, random, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, HEIGHT, WIDTH} from '../theme';
import {BrushStroke} from './BrushStroke';

/** Speckle and scratch texture over the whole frame. */
export const GrungeTexture: React.FC<{opacity?: number}> = ({opacity = 0.35}) => (
	<AbsoluteFill style={{pointerEvents: 'none'}}>
		<Img src={staticFile('brand/grunge.png')} style={{width: '100%', height: '100%', opacity, mixBlendMode: 'screen'}} />
	</AbsoluteFill>
);

const raggedEdge = (seed: string, depth: number) => {
	const pts: string[] = [];
	const n = 40;
	for (let i = 0; i <= n; i++) {
		const x = (WIDTH * i) / n;
		const big = Math.sin(i * 0.55 + random(seed) * 6) * depth * 0.35;
		pts.push(`${x},${depth * 0.55 + big + random(`${seed}-${i}`) * depth * 0.45}`);
	}
	return pts;
};

/** Charcoal band with a torn edge, at the top or bottom of the frame like the poster. */
export const GrungeBand: React.FC<{edge: 'top' | 'bottom'; height: number; delay?: number}> = ({edge, height, delay = 0}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = spring({frame, fps, delay, config: {damping: 16, stiffness: 120}});
	const tear = 90;
	const points = useMemo(() => {
		const e = raggedEdge(`band-${edge}`, tear).map((p) => {
			const [x, y] = p.split(',').map(Number);
			return `${x},${height - tear + y}`;
		});
		return [`0,0`, `${WIDTH},0`, ...e.reverse()].join(' ');
	}, [edge, height]);
	const shift = (1 - s) * -(height + tear);
	return (
		<div
			style={{
				position: 'absolute',
				left: 0,
				width: WIDTH,
				height: height + tear,
				top: edge === 'top' ? shift : undefined,
				bottom: edge === 'bottom' ? shift : undefined,
				transform: edge === 'bottom' ? 'scaleY(-1)' : undefined,
				filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.5))',
			}}
		>
			<svg width={WIDTH} height={height + tear}>
				<defs>
					<linearGradient id={`band-grad-${edge}`} x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stopColor={C.charcoal} stopOpacity="0.98" />
						<stop offset="1" stopColor={C.charcoal} stopOpacity="0.9" />
					</linearGradient>
				</defs>
				<polygon points={points} fill={`url(#band-grad-${edge})`} />
			</svg>
		</div>
	);
};

/** Red diagonal brush slashes in the corners, painted on with a delay. */
export const CornerSlashes: React.FC<{delay?: number; corners?: Array<'tl' | 'tr' | 'bl' | 'br'>}> = ({
	delay = 0,
	corners = ['tl', 'tr', 'bl', 'br'],
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const place = {
		tl: {left: -160, top: 40, rotate: -28, fromRight: true},
		tr: {left: WIDTH - 360, top: 20, rotate: 24, fromRight: false},
		bl: {left: -180, top: HEIGHT - 190, rotate: 24, fromRight: true},
		br: {left: WIDTH - 340, top: HEIGHT - 230, rotate: -26, fromRight: false},
	};
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			{corners.map((c, i) => {
				const p = spring({frame, fps, delay: delay + i * 3, config: {damping: 20, stiffness: 140}});
				const pl = place[c];
				return (
					<div key={c} style={{position: 'absolute', left: pl.left, top: pl.top, transform: `rotate(${pl.rotate}deg)`}}>
						<BrushStroke width={520} height={70} seed={`slash-${c}`} progress={p} fromRight={pl.fromRight} />
					</div>
				);
			})}
		</AbsoluteFill>
	);
};
