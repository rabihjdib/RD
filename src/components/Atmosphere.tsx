import {AbsoluteFill, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../theme';

/** Low rolling fog: soft tinted blobs drifting across the lower half of frame. */
export const Fog: React.FC<{strength?: number}> = ({strength = 1}) => {
	const frame = useCurrentFrame();
	const {width, height} = useVideoConfig();
	const blobs = new Array(7).fill(0).map((_, i) => {
		const speed = 0.6 + random(`fs${i}`) * 1.2;
		const x = ((random(`fx${i}`) * (width + 480) + frame * speed * (i % 2 ? 1 : -1)) % (width + 680)) - 340;
		const y = height * 0.57 + random(`fy${i}`) * height * 0.39 + Math.sin(frame / 22 + i) * 18;
		const r = 380 + random(`fr${i}`) * 420;
		const tint = i % 3 === 0 ? C.magenta : i % 3 === 1 ? C.blue : '#9DB4D0';
		return {x, y, r, tint};
	});
	return (
		<AbsoluteFill style={{mixBlendMode: 'screen', opacity: 0.32 * strength, pointerEvents: 'none'}}>
			{blobs.map((b, i) => (
				<div
					key={i}
					style={{
						position: 'absolute',
						left: b.x - b.r,
						top: b.y - b.r * 0.45,
						width: b.r * 2,
						height: b.r * 0.9,
						borderRadius: '50%',
						background: `radial-gradient(ellipse at center, ${b.tint}99 0%, ${b.tint}33 40%, transparent 70%)`,
						filter: 'blur(30px)',
					}}
				/>
			))}
		</AbsoluteFill>
	);
};

/** Light film grain, re-seeded every frame. */
export const Grain: React.FC = () => {
	const frame = useCurrentFrame();
	const {width, height} = useVideoConfig();
	return (
		<AbsoluteFill style={{mixBlendMode: 'overlay', opacity: 0.22, pointerEvents: 'none'}}>
			<svg width={width} height={height}>
				<filter id="grain">
					<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={frame % 60} stitchTiles="stitch" />
					<feColorMatrix type="saturate" values="0" />
				</filter>
				<rect width="100%" height="100%" filter="url(#grain)" />
			</svg>
		</AbsoluteFill>
	);
};

export const Vignette: React.FC = () => (
	<AbsoluteFill
		style={{
			background: 'radial-gradient(ellipse 85% 80% at 50% 50%, transparent 55%, rgba(3,4,8,0.75) 100%)',
			pointerEvents: 'none',
		}}
	/>
);

/** Thin neon line sweeping down the frame on a cut, like an LED strip pulse. */
export const ScanSweep: React.FC<{color?: string}> = ({color = C.blueHot}) => {
	const frame = useCurrentFrame();
	const {height} = useVideoConfig();
	const y = frame * (height / 6.75) - 40;
	if (y > height + 60) return null;
	return (
		<div
			style={{
				position: 'absolute',
				left: 0,
				right: 0,
				top: y,
				height: 3,
				background: color,
				boxShadow: `0 0 24px 6px ${color}88`,
				opacity: 0.8,
			}}
		/>
	);
};

/** Single-frame flash used to punctuate cuts. */
export const Flash: React.FC<{color?: string; frames?: number; peak?: number}> = ({color = '#ffffff', frames = 4, peak = 0.7}) => {
	const frame = useCurrentFrame();
	const o = Math.max(0, 1 - frame / frames) * peak;
	return <AbsoluteFill style={{backgroundColor: color, opacity: o, mixBlendMode: 'screen'}} />;
};
