import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, mono} from '../theme';

type Props = {
	x: number;
	y?: number;
	w: number;
	h?: number;
	delay?: number;
	label?: string;
	accent?: string;
	children: React.ReactNode;
};

/** A neon-edged window that wipes open from its centre line. */
export const Panel: React.FC<Props> = ({x, y = 0, w, h = 1080, delay = 0, label, accent = C.blueHot, children}) => {
	const frame = useCurrentFrame() - delay;
	const open = interpolate(frame, [0, 7], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.exp),
	});
	const inset = (1 - open) * 50;
	const tick = 26;

	return (
		<div style={{position: 'absolute', left: x, top: y, width: w, height: h}}>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					overflow: 'hidden',
					clipPath: `inset(0 ${inset}% 0 ${inset}%)`,
				}}
			>
				{children}
			</div>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					clipPath: `inset(0 ${inset}% 0 ${inset}%)`,
					boxShadow: `inset 0 0 0 2px ${accent}, 0 0 18px ${accent}66`,
					opacity: 0.85,
				}}
			/>
			{[
				{left: -6, top: -6, borderLeft: 1, borderTop: 1},
				{right: -6, top: -6, borderRight: 1, borderTop: 1},
				{left: -6, bottom: -6, borderLeft: 1, borderBottom: 1},
				{right: -6, bottom: -6, borderRight: 1, borderBottom: 1},
			].map((c, i) => (
				<div
					key={i}
					style={{
						position: 'absolute',
						width: tick,
						height: tick,
						left: c.left,
						right: c.right,
						top: c.top,
						bottom: c.bottom,
						borderLeft: c.borderLeft ? `3px solid ${C.white}` : undefined,
						borderRight: c.borderRight ? `3px solid ${C.white}` : undefined,
						borderTop: c.borderTop ? `3px solid ${C.white}` : undefined,
						borderBottom: c.borderBottom ? `3px solid ${C.white}` : undefined,
						opacity: open,
					}}
				/>
			))}
			{label ? (
				<div
					style={{
						position: 'absolute',
						left: 18,
						top: 108,
						fontFamily: mono,
						fontWeight: 700,
						fontSize: 18,
						letterSpacing: 3,
						color: C.white,
						padding: '4px 10px',
						background: `${C.ink}AA`,
						borderLeft: `3px solid ${accent}`,
						opacity: interpolate(frame, [4, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
					}}
				>
					{label}
				</div>
			) : null}
		</div>
	);
};
