import {AbsoluteFill, Img, staticFile} from 'remotion';
import {BRONZE, CHARCOAL, CREAM, display, GOLD, OLIVE, SAND, sans} from '../brand';

/**
 * Cover for soft opening Reel 05 (Birthday Packages), drawn rather than photographed:
 * a two-tier cake with glowing candles, balloons and bunting in the brand palette, over
 * the same headline block and footer as the rest of the soft opening covers.
 *
 * Kept inside Instagram's 3:4 grid crop (y 240-1680); the footer sits below it.
 */

const W = 1080;

// Bunting: flags hang off a sagging string between x 70 and x 1010.
const FLAGS = 11;
const sag = (x: number) => 470 + 70 * Math.sin((Math.PI * (x - 70)) / 940);
const flagColors = [GOLD, SAND, BRONZE, SAND];

const Bunting: React.FC = () => (
	<g>
		<path d={`M 70 ${sag(70)} Q 540 ${470 + 140} 1010 ${sag(1010)}`} stroke={OLIVE} strokeWidth={3} fill="none" />
		{Array.from({length: FLAGS}, (_, i) => {
			const x = 110 + (i * 860) / (FLAGS - 1);
			const y = sag(x) - 4;
			return <path key={i} d={`M ${x - 32} ${y} L ${x + 32} ${y} L ${x} ${y + 70} Z`} fill={flagColors[i % flagColors.length]} />;
		})}
	</g>
);

const Balloon: React.FC<{x: number; y: number; r: number; color: string; tie: [number, number]}> = ({x, y, r, color, tie}) => {
	const bottom = y + r * 1.2;
	return (
		<g>
			<path d={`M ${x} ${bottom + 12} C ${x - 40} ${bottom + 120}, ${tie[0] + 40} ${tie[1] - 140}, ${tie[0]} ${tie[1]}`} stroke={OLIVE} strokeWidth={2.5} fill="none" />
			<ellipse cx={x} cy={y} rx={r} ry={r * 1.2} fill={color} />
			<path d={`M ${x - 12} ${bottom + 14} L ${x + 12} ${bottom + 14} L ${x} ${bottom - 2} Z`} fill={color} />
			<ellipse cx={x - r * 0.38} cy={y - r * 0.45} rx={r * 0.2} ry={r * 0.32} fill="#fff" opacity={0.35} transform={`rotate(-25 ${x - r * 0.38} ${y - r * 0.45})`} />
		</g>
	);
};

/** Frosting edge along the top of a tier: a band with rounded drips hanging off it. */
const drips = (x: number, y: number, w: number, depths: number[]) => {
	const step = w / depths.length;
	let d = `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + 26}`;
	for (let i = depths.length - 1; i >= 0; i--) {
		const cx = x + step * i + step / 2;
		const r = step / 2;
		d += ` L ${cx + r} ${y + 26} L ${cx + r} ${y + 26 + depths[i]} A ${r} ${r} 0 0 1 ${cx - r} ${y + 26 + depths[i]}`;
	}
	return `${d} L ${x} ${y + 26} Z`;
};

const Candle: React.FC<{x: number; top: number}> = ({x, top}) => (
	<g>
		<rect x={x - 10} y={top} width={20} height={78} rx={4} fill={CREAM} />
		{[0, 1, 2].map((i) => (
			<rect key={i} x={x - 10} y={top + 14 + i * 22} width={20} height={7} fill={GOLD} />
		))}
		<line x1={x} y1={top} x2={x} y2={top - 10} stroke={CHARCOAL} strokeWidth={3} />
		<circle cx={x} cy={top - 34} r={40} fill="url(#flameGlow)" />
		<path d={`M ${x} ${top - 54} C ${x + 14} ${top - 34}, ${x + 12} ${top - 14}, ${x} ${top - 12} C ${x - 12} ${top - 14}, ${x - 14} ${top - 34}, ${x} ${top - 54} Z`} fill="#f6ebd6" />
	</g>
);

const Cake: React.FC = () => (
	<g>
		{/* Plate */}
		<ellipse cx={540} cy={1132} rx={330} ry={30} fill={SAND} />
		{/* Bottom tier */}
		<rect x={290} y={930} width={500} height={196} rx={26} fill={GOLD} />
		<path d={drips(290, 930, 500, [40, 22, 56, 30, 46, 20, 52, 34, 26, 44])} fill={CREAM} />
		<rect x={290} y={1066} width={500} height={14} fill={BRONZE} opacity={0.55} />
		{/* Top tier */}
		<rect x={380} y={790} width={320} height={150} rx={22} fill={BRONZE} />
		<path d={drips(380, 790, 320, [34, 18, 44, 24, 38, 20, 30])} fill={CREAM} />
		{/* Little stars piped on the bottom tier */}
		{[360, 450, 540, 630, 720].map((x) => (
			<circle key={x} cx={x} cy={1030} r={8} fill={CREAM} opacity={0.9} />
		))}
		<Candle x={470} top={712} />
		<Candle x={540} top={698} />
		<Candle x={610} top={712} />
	</g>
);

// Confetti: [x, y, rotation, colour, shape]
const CONFETTI: [number, number, number, string, 'r' | 'c'][] = [
	[120, 760, 20, GOLD, 'r'], [196, 880, -30, BRONZE, 'c'], [90, 1010, 45, SAND, 'r'], [240, 1060, 10, OLIVE, 'c'],
	[960, 790, -15, BRONZE, 'r'], [880, 930, 35, GOLD, 'c'], [1000, 1040, -40, OLIVE, 'r'], [840, 1080, 5, SAND, 'c'],
	[330, 640, 60, SAND, 'r'], [760, 610, -55, GOLD, 'r'], [420, 700, 0, OLIVE, 'c'], [690, 730, 0, GOLD, 'c'],
];

const Confetti: React.FC = () => (
	<g>
		{CONFETTI.map(([x, y, rot, color, shape], i) =>
			shape === 'r' ? (
				<rect key={i} x={x - 12} y={y - 5} width={24} height={10} rx={2} fill={color} transform={`rotate(${rot} ${x} ${y})`} />
			) : (
				<circle key={i} cx={x} cy={y} r={7} fill={color} />
			),
		)}
	</g>
);

/** Charcoal block for the text, its top edge scalloped like piped frosting. */
const panelTop = (() => {
	const y = 1230;
	const scallops = 12;
	const step = W / scallops;
	let d = `M 0 1920 L 0 ${y}`;
	for (let i = 0; i < scallops; i++) {
		d += ` A ${step / 2} ${step * 0.45} 0 0 1 ${(i + 1) * step} ${y}`;
	}
	return `${d} L ${W} 1920 Z`;
})();

export const BirthdayCover: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: CREAM}}>
		<svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
			<defs>
				<radialGradient id="flameGlow">
					<stop offset="0" stopColor="#f6ebd6" stopOpacity={0.95} />
					<stop offset="0.4" stopColor="#d6b27a" stopOpacity={0.55} />
					<stop offset="1" stopColor={GOLD} stopOpacity={0} />
				</radialGradient>
				<radialGradient id="warm" cx="50%" cy="45%" r="60%">
					<stop offset="0" stopColor="#f7f1e2" />
					<stop offset="1" stopColor={CREAM} />
				</radialGradient>
			</defs>
			<rect width={W} height={1920} fill="url(#warm)" />
			<Bunting />
			<Balloon x={170} y={700} r={92} color={GOLD} tie={[300, 1100]} />
			<Balloon x={290} y={560} r={70} color={SAND} tie={[310, 1100]} />
			<Balloon x={910} y={680} r={96} color={BRONZE} tie={[780, 1100]} />
			<Balloon x={790} y={540} r={68} color={GOLD} tie={[770, 1100]} />
			<Confetti />
			<Cake />
			<path d={panelTop} fill={CHARCOAL} />
		</svg>

		<Img src={staticFile('reel/brand/logo-dark.png')} style={{position: 'absolute', left: (W - 460) / 2, top: 250, width: 460}} />
		<Img src={staticFile('reel/brand/star.png')} style={{position: 'absolute', left: 60, top: 600, width: 54, transform: 'rotate(-12deg)'}} />
		<Img src={staticFile('reel/brand/star.png')} style={{position: 'absolute', left: 968, top: 880, width: 44, transform: 'rotate(10deg)'}} />

		<AbsoluteFill style={{top: 1268, alignItems: 'center'}}>
			<div style={{display: 'flex', alignItems: 'center', gap: 22}}>
				<div style={{width: 56, height: 2, background: GOLD}} />
				<span style={{fontFamily: sans, fontWeight: 700, fontSize: 26, letterSpacing: '0.28em', textTransform: 'uppercase', color: GOLD}}>Birthday packages</span>
				<div style={{width: 56, height: 2, background: GOLD}} />
			</div>
			<div style={{marginTop: 16, textAlign: 'center', fontFamily: display, fontSize: 108, lineHeight: 1.04, color: CREAM, whiteSpace: 'nowrap'}}>
				<div>Birthdays without</div>
				<div>
					the <span style={{color: GOLD}}>stress</span>
				</div>
			</div>
			<div style={{marginTop: 30, fontFamily: sans, fontWeight: 700, fontSize: 36, color: CHARCOAL, background: GOLD, borderRadius: 50, padding: '14px 40px'}}>From $20 per child</div>
		</AbsoluteFill>

		{/* Below the grid crop: only seen when the reel opens full screen. */}
		<AbsoluteFill style={{top: 1752, alignItems: 'center'}}>
			<div style={{display: 'flex', alignItems: 'center', gap: 18, fontFamily: sans, fontWeight: 700, fontSize: 24, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(237,236,227,0.7)'}}>
				<span style={{color: GOLD}}>05 / 08</span>
				<Img src={staticFile('reel/brand/star.png')} style={{width: 26}} />
				<span>Now open in Jounieh souks</span>
			</div>
		</AbsoluteFill>
	</AbsoluteFill>
);
