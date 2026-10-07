import {AbsoluteFill, Easing, interpolate, OffthreadVideo, staticFile, useCurrentFrame} from 'remotion';
import {C} from '../theme';

export type Clip = 'briefing' | 'corridor' | 'tires' | 'flank';

type Props = {
	clip: Clip;
	from: number;
	duration: number;
	zoom?: [number, number];
	origin?: [number, number];
	drift?: [number, number];
	warm?: boolean;
	focus?: [number, number];
};

/** One source clip, pushed in over the shot and graded to the blue/magenta/gunmetal look. */
export const Graded: React.FC<Props> = ({clip, from, duration, zoom = [1.02, 1.1], origin = [0.5, 0.45], drift = [0, 0], warm, focus = [0.5, 0.5]}) => {
	const frame = useCurrentFrame();
	const t = interpolate(frame, [0, duration], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.cubic),
	});
	const scale = interpolate(t, [0, 1], zoom);
	const dx = drift[0] * t;
	const dy = drift[1] * t;

	return (
		<AbsoluteFill style={{overflow: 'hidden', backgroundColor: C.ink}}>
			<AbsoluteFill
				style={{
					transform: `translate(${dx}px, ${dy}px) scale(${scale})`,
					transformOrigin: `${origin[0] * 100}% ${origin[1] * 100}%`,
				}}
			>
				<OffthreadVideo
					src={staticFile(`footage/${clip}.mp4`)}
					trimBefore={from}
					muted
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'cover',
						objectPosition: `${focus[0] * 100}% ${focus[1] * 100}%`,
						filter: `contrast(1.28) saturate(${warm ? 0.75 : 1.25}) brightness(${warm ? 0.82 : 0.95})`,
					}}
				/>
			</AbsoluteFill>
			{/* Cool the mids: blue to magenta split tone */}
			<AbsoluteFill
				style={{
					background: `linear-gradient(120deg, ${C.blue} 0%, #3B2BFF 55%, ${C.magenta} 100%)`,
					mixBlendMode: warm ? 'color' : 'soft-light',
					opacity: warm ? 0.42 : 0.55,
				}}
			/>
			{/* Gunmetal crush in the shadows */}
			<AbsoluteFill
				style={{
					background: 'radial-gradient(ellipse 75% 70% at 50% 45%, rgba(0,0,0,0) 40%, rgba(5,7,11,0.85) 100%)',
				}}
			/>
		</AbsoluteFill>
	);
};

/** Full-frame blurred fill so vertical footage sits inside a 16:9 frame with depth behind it. */
export const Backdrop: React.FC<{clip: Clip; from: number}> = ({clip, from}) => (
	<AbsoluteFill style={{overflow: 'hidden', backgroundColor: C.ink}}>
		<OffthreadVideo
			src={staticFile(`footage/${clip}.mp4`)}
			trimBefore={from}
			muted
			style={{
				position: 'absolute',
				width: '120%',
				height: '120%',
				left: '-10%',
				top: '-10%',
				objectFit: 'cover',
				filter: 'blur(38px) saturate(1.4) brightness(0.45) contrast(1.2)',
			}}
		/>
		<AbsoluteFill
			style={{
				background: `linear-gradient(90deg, ${C.blue}55, transparent 45%, transparent 55%, ${C.magenta}44)`,
				mixBlendMode: 'screen',
			}}
		/>
		<AbsoluteFill
			style={{
				backgroundImage:
					'linear-gradient(rgba(120,180,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(120,180,255,0.06) 1px, transparent 1px)',
				backgroundSize: '64px 64px',
			}}
		/>
	</AbsoluteFill>
);
