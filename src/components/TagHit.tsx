import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, display, mono} from '../theme';

/** Laser fired from the muzzle point across frame into a hit marker. */
export const TagHit: React.FC<{from: [number, number]; to: [number, number]}> = ({from, to}) => {
	const frame = useCurrentFrame();
	const reach = interpolate(frame, [1, 4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad)});
	const beamFade = interpolate(frame, [5, 11], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const x2 = from[0] + (to[0] - from[0]) * reach;
	const y2 = from[1] + (to[1] - from[1]) * reach;
	const ring = interpolate(frame, [3, 12], [20, 120], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
	const ringO = interpolate(frame, [3, 14], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const label = interpolate(frame, [4, 7], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<svg width="1920" height="1080" style={{position: 'absolute'}}>
				<defs>
					<filter id="beam" x="-20%" y="-200%" width="140%" height="500%">
						<feGaussianBlur stdDeviation="7" result="b" />
						<feMerge>
							<feMergeNode in="b" />
							<feMergeNode in="b" />
							<feMergeNode in="SourceGraphic" />
						</feMerge>
					</filter>
				</defs>
				<g opacity={beamFade} filter="url(#beam)">
					<line x1={from[0]} y1={from[1]} x2={x2} y2={y2} stroke={C.magenta} strokeWidth="10" strokeLinecap="round" />
					<line x1={from[0]} y1={from[1]} x2={x2} y2={y2} stroke="#FFE6FA" strokeWidth="3" strokeLinecap="round" />
				</g>
				<g opacity={ringO}>
					<circle cx={to[0]} cy={to[1]} r={ring} fill="none" stroke={C.magenta} strokeWidth="4" />
					<circle cx={to[0]} cy={to[1]} r={ring * 0.55} fill="none" stroke={C.white} strokeWidth="2" />
				</g>
				<g opacity={label} stroke={C.white} strokeWidth="4">
					{[45, 135, 225, 315].map((a) => {
						const r = (a * Math.PI) / 180;
						return (
							<line
								key={a}
								x1={to[0] + Math.cos(r) * 18}
								y1={to[1] + Math.sin(r) * 18}
								x2={to[0] + Math.cos(r) * 42}
								y2={to[1] + Math.sin(r) * 42}
							/>
						);
					})}
				</g>
			</svg>
			<div
				style={{
					position: 'absolute',
					left: to[0] + 120,
					top: to[1] - 78,
					opacity: label,
					transform: `translateX(${(1 - label) * 30}px)`,
				}}
			>
				<div style={{fontFamily: mono, fontWeight: 700, fontSize: 24, letterSpacing: 6, color: C.magenta}}>HIT CONFIRMED</div>
				<div style={{fontFamily: display, fontSize: 120, lineHeight: 1, color: C.white, textShadow: `0 0 26px ${C.magenta}`}}>
					TAGGED
				</div>
				<div style={{fontFamily: mono, fontWeight: 700, fontSize: 28, letterSpacing: 4, color: C.blueHot}}>+100 // BLUE</div>
			</div>
		</AbsoluteFill>
	);
};
