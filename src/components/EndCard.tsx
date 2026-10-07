import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, display, mono} from '../theme';

export const EndCard: React.FC = () => {
	const frame = useCurrentFrame();
	const rise = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.exp)});
	const line = interpolate(frame, [4, 16], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
	const cta = interpolate(frame, [10, 16], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const glow = 18 + 8 * Math.sin(frame / 3);

	return (
		<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
			<div style={{textAlign: 'center', transform: `translateY(${(1 - rise) * 40}px)`, opacity: rise}}>
				<div style={{fontFamily: mono, fontWeight: 700, fontSize: 26, letterSpacing: 12, color: C.blueHot, marginBottom: 14}}>
					LASER TAG // SQUAD BATTLES
				</div>
				<div
					style={{
						fontFamily: display,
						fontSize: 190,
						lineHeight: 0.95,
						letterSpacing: interpolate(rise, [0, 1], [30, 6]),
						color: C.white,
						textShadow: `0 0 ${glow}px ${C.blue}, 0 0 ${glow * 2}px ${C.magenta}55`,
					}}
				>
					ENTER THE ARENA
				</div>
				<div
					style={{
						margin: '26px auto 0',
						height: 4,
						width: 900 * line,
						background: `linear-gradient(90deg, ${C.blue}, ${C.magenta})`,
						boxShadow: `0 0 18px ${C.magenta}`,
					}}
				/>
				<div
					style={{
						display: 'inline-block',
						marginTop: 34,
						padding: '14px 34px',
						fontFamily: mono,
						fontWeight: 700,
						fontSize: 26,
						letterSpacing: 8,
						color: C.ink,
						background: C.white,
						boxShadow: `0 0 24px ${C.blue}`,
						opacity: cta,
						transform: `scale(${0.9 + 0.1 * cta})`,
					}}
				>
					BOOK YOUR SQUAD
				</div>
			</div>
		</AbsoluteFill>
	);
};
