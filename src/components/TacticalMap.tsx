import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, mono} from '../theme';

type Pt = [number, number];

const along = (path: Pt[], t: number): Pt => {
	const segs = path.slice(1).map((p, i) => Math.hypot(p[0] - path[i][0], p[1] - path[i][1]));
	const total = segs.reduce((a, b) => a + b, 0);
	let d = Math.max(0, Math.min(1, t)) * total;
	for (let i = 0; i < segs.length; i++) {
		if (d <= segs[i]) {
			const k = d / segs[i];
			return [path[i][0] + (path[i + 1][0] - path[i][0]) * k, path[i][1] + (path[i + 1][1] - path[i][1]) * k];
		}
		d -= segs[i];
	}
	return path[path.length - 1];
};

const toD = (p: Pt[]) => p.map((q, i) => `${i ? 'L' : 'M'}${q[0]} ${q[1]}`).join(' ');

// Arena plan in a 1400 x 820 box.
const walls = [
	'M0 0 H1400 V820 H0 Z',
	'M340 0 V300 M340 420 V820',
	'M700 120 V520 M700 640 V820',
	'M1060 0 V260 M1060 380 V820',
	'M340 300 H520 M520 520 H700',
	'M1060 560 H1240',
];
const platforms: [number, number, number, number][] = [
	[90, 90, 180, 120],
	[790, 230, 180, 110],
	[1150, 620, 170, 120],
];
const mirrors: [Pt, Pt][] = [
	[[470, 650], [560, 740]],
	[[880, 560], [960, 480]],
	[[1180, 120], [1290, 200]],
];
const squad: Pt[][] = [
	[[150, 700], [290, 700], [290, 360], [520, 360], [620, 580], [760, 580], [960, 420]],
	[[150, 620], [260, 520], [400, 420], [640, 440], [900, 300], [1000, 330]],
	[[210, 760], [480, 780], [860, 760], [1000, 700], [1120, 480]],
	[[110, 520], [300, 360], [420, 220], [760, 60], [1000, 140], [1130, 320]],
];
const enemy: Pt = [1180, 360];

/** Overhead tactical read of the arena, revealed by a crane-up from a low oblique angle. */
export const TacticalMap: React.FC<{duration: number}> = ({duration}) => {
	const frame = useCurrentFrame();
	const crane = interpolate(frame, [0, duration * 0.7], [0, 1], {
		extrapolateRight: 'clamp',
		easing: Easing.inOut(Easing.cubic),
	});
	const t = interpolate(frame, [2, duration], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const tilt = interpolate(crane, [0, 1], [62, 0]);
	const scale = interpolate(crane, [0, 1], [1.25, 0.84]);
	const lift = interpolate(crane, [0, 1], [260, 70]);
	const pulse = 1 + 0.35 * Math.abs(Math.sin(frame / 4));

	return (
		<AbsoluteFill style={{perspective: 1500, alignItems: 'center', justifyContent: 'center'}}>
			<div
				style={{
					width: 1400,
					height: 820,
					transform: `translateY(${lift}px) rotateX(${tilt}deg) scale(${scale})`,
					transformOrigin: '50% 70%',
				}}
			>
				<svg width={1400} height={820} viewBox="-20 -20 1440 860" style={{overflow: 'visible'}}>
					<defs>
						<pattern id="hatch" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
							<line x1="0" y1="0" x2="0" y2="12" stroke={C.blueHot} strokeOpacity="0.45" strokeWidth="3" />
						</pattern>
						<filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
							<feGaussianBlur stdDeviation="5" result="b" />
							<feMerge>
								<feMergeNode in="b" />
								<feMergeNode in="SourceGraphic" />
							</feMerge>
						</filter>
					</defs>
					<rect x="-20" y="-20" width="1440" height="860" fill={`${C.ink}CC`} />
					{new Array(23).fill(0).map((_, i) => (
						<line key={`v${i}`} x1={i * 64} y1={0} x2={i * 64} y2={820} stroke={C.blue} strokeOpacity="0.12" />
					))}
					{new Array(13).fill(0).map((_, i) => (
						<line key={`h${i}`} x1={0} y1={i * 64} x2={1400} y2={i * 64} stroke={C.blue} strokeOpacity="0.12" />
					))}
					{platforms.map(([x, y, w, h], i) => (
						<g key={i}>
							<rect x={x} y={y} width={w} height={h} fill="url(#hatch)" stroke={C.blueHot} strokeWidth="2" />
							<text x={x + 8} y={y - 10} fill={C.blueHot} fontFamily={mono} fontSize="16" letterSpacing="2">
								LVL {i + 2}
							</text>
						</g>
					))}
					{mirrors.map(([a, b], i) => (
						<line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#BFE6FF" strokeWidth="5" filter="url(#glow)" />
					))}
					{walls.map((d, i) => (
						<path key={i} d={d} fill="none" stroke={C.white} strokeOpacity="0.85" strokeWidth="6" />
					))}
					{squad.map((p, i) => {
						const len = 2000;
						return (
							<path
								key={i}
								d={toD(p)}
								fill="none"
								stroke={C.blueHot}
								strokeWidth="4"
								strokeDasharray={`${len}`}
								strokeDashoffset={len * (1 - t)}
								strokeLinejoin="round"
								opacity="0.75"
								filter="url(#glow)"
							/>
						);
					})}
					{squad.map((p, i) => {
						const [x, y] = along(p, t);
						return (
							<g key={i} filter="url(#glow)">
								<circle cx={x} cy={y} r="13" fill={C.blueHot} />
								<circle cx={x} cy={y} r="22" fill="none" stroke={C.blueHot} strokeWidth="2" opacity="0.6" />
							</g>
						);
					})}
					<g filter="url(#glow)">
						<circle cx={enemy[0]} cy={enemy[1]} r="13" fill={C.magenta} />
						<circle cx={enemy[0]} cy={enemy[1]} r={34 * pulse} fill="none" stroke={C.magenta} strokeWidth="3" />
						<text x={enemy[0] + 44} y={enemy[1] + 6} fill={C.magenta} fontFamily={mono} fontWeight="700" fontSize="22" letterSpacing="3">
							TARGET
						</text>
					</g>
				</svg>
			</div>
		</AbsoluteFill>
	);
};
