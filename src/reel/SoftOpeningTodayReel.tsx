import {AbsoluteFill, Audio, Easing, Img, interpolate, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRONZE, CHARCOAL, CREAM, display, GOLD, SAND, sans} from '../brand';
import {SOFT_OPENING_DATE} from '../posts/SoftOpeningPost';
import {EASE, Firefly, FIREFLIES, Kicker, useRise} from './SoftOpeningReel';

/**
 * Story video (1080x1920, 30 fps, 12 s): "It's today" for the soft opening, the animated
 * version of the photo Story. The copy rises in, the gold arch draws itself, happy kids
 * appear inside it, and on the music's drop (4 s) confetti bursts up from both bottom
 * corners while the "Doors open at 4 PM" pill pops in. Everything then holds to be read.
 * Copy stays between the Story profile bar (top 220) and reply bar (bottom 270).
 *
 * Music: public/reel/music/luciole-celebration.mp3 (scripts/make_celebration_music.py),
 * built at 120 BPM so its drop lands on frame 120. Sound effects: public/reel/sfx
 * (scripts/make_reel_sfx.py). Render: npm run reel:soft-opening-today
 *
 * Timing (frames):
 *   0-30    glow and fireflies;  12 logo;  36 "Soft opening"
 *   48, 64  "It's today," / "we light up." (whoosh)
 *   76-116  arch draws (sparkle at 112); 92-122 the photo appears inside it
 *   120     drop: confetti from both bottom corners (popper), pill pops in at 124
 *   146-190 date, "L'Atelier · Café · Bistro", address and WhatsApp
 *   190-360 hold while the confetti settles
 */

export const SOFT_OPENING_TODAY_DURATION = 360;
const DROP = 120;
const PHOTO = 'carousel/proud/made.jpg';

const ARCH_W = 600;
const ARCH_H = 620;
const archPath = (inset: number) => {
	const w = ARCH_W - inset * 2;
	const h = ARCH_H - inset * 2;
	const r = w / 2;
	const c = 30;
	return `M ${inset} ${inset + h - c} L ${inset} ${inset + r} A ${r} ${r} 0 0 1 ${inset + w} ${inset + r} L ${inset + w} ${inset + h - c} Q ${inset + w} ${inset + h} ${inset + w - c} ${inset + h} L ${inset + c} ${inset + h} Q ${inset} ${inset + h} ${inset} ${inset + h - c} Z`;
};

const PhotoArch: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const draw = interpolate(frame, [76, 116], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
	const reveal = interpolate(frame, [92, 122], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE});
	const pill = spring({frame: frame - (DROP + 4), fps, config: {damping: 10, mass: 0.6, stiffness: 140}});
	// A slow push-in on the photo and a breathing glow on the arch once everything is in.
	const push = interpolate(frame, [92, 360], [1.12, 1.0], {extrapolateRight: 'clamp'});
	const pulse = frame > 200 ? 0.5 + 0.5 * Math.sin((frame - 200) / 14) : 0;
	return (
		<div style={{position: 'relative', width: ARCH_W, height: ARCH_H + 44}}>
			<svg width={ARCH_W} height={ARCH_H} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				<defs>
					<clipPath id="todayArch">
						<path d={archPath(2)} />
					</clipPath>
				</defs>
				<g clipPath="url(#todayArch)" opacity={reveal}>
					<image href={staticFile(PHOTO)} x={0} y={0} width={ARCH_W} height={ARCH_H} preserveAspectRatio="xMidYMid slice" transform={`translate(${ARCH_W / 2} ${ARCH_H / 2}) scale(${push}) translate(${-ARCH_W / 2} ${-ARCH_H / 2})`} />
				</g>
				<path
					d={archPath(2)}
					fill="none"
					stroke={GOLD}
					strokeWidth={5}
					pathLength={1}
					strokeDasharray={1}
					strokeDashoffset={1 - draw}
					style={{filter: `drop-shadow(0 0 ${6 + pulse * 14}px rgba(214,178,122,${0.35 + pulse * 0.4}))`}}
				/>
			</svg>
			<div
				style={{
					position: 'absolute',
					left: '50%',
					bottom: 0,
					transform: `translateX(-50%) scale(${pill})`,
					display: 'flex',
					alignItems: 'baseline',
					gap: 16,
					padding: '14px 40px 18px',
					borderRadius: 999,
					background: CHARCOAL,
					border: `3px solid ${GOLD}`,
					whiteSpace: 'nowrap',
					boxShadow: '0 14px 30px rgba(0,0,0,0.3)',
				}}
			>
				<span style={{fontFamily: sans, fontWeight: 700, fontSize: 20, letterSpacing: '0.26em', textTransform: 'uppercase', color: CREAM}}>Doors open at</span>
				<span style={{fontFamily: display, fontSize: 64, lineHeight: 1, color: GOLD}}>4 PM</span>
			</div>
		</div>
	);
};

// Confetti in the brand palette, fired up from both bottom corners on the drop.
const COLOURS = [GOLD, BRONZE, '#9aa65a', SAND, CHARCOAL, '#ffffff', '#d6b27a'];
const PIECES = 140;
const GRAVITY = 0.9;
const DRAG = 0.972;

const Confetti: React.FC = () => {
	const frame = useCurrentFrame();
	const t = frame - DROP;
	if (t < 0) return null;
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			{Array.from({length: PIECES}, (_, i) => {
				const left = i % 2 === 0;
				const r = (k: string) => random(`confetti-${i}-${k}`);
				// Cannons sit in the bottom corners, aimed up and in across the whole frame.
				let x = left ? -20 : 1100;
				let y = 1900;
				let vx = (left ? 1 : -1) * (4 + r('vx') * 16);
				let vy = -(48 + r('vy') * 30);
				const delay = Math.floor(r('d') * 6);
				const steps = t - delay;
				if (steps < 0) return null;
				for (let s = 0; s < steps; s++) {
					x += vx;
					y += vy;
					vx *= DRAG;
					vy = vy * DRAG + GRAVITY;
					if (vy > 5) vy = 5; // paper reaches a gentle terminal speed
				}
				if (y > 1980) return null;
				const sway = steps > 25 ? Math.sin(steps / (6 + r('s') * 6) + r('p') * 6) * 10 : 0;
				const spin = steps * (6 + r('spin') * 14) * (r('dir') > 0.5 ? 1 : -1);
				const flip = Math.cos(steps / (3 + r('f') * 4));
				const w = 14 + r('w') * 14;
				const h = r('shape') > 0.75 ? w : w * 1.8;
				const fade = interpolate(steps, [120, 170], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: x + sway,
							top: y,
							width: w,
							height: h,
							borderRadius: r('shape') > 0.75 ? '50%' : 2,
							background: COLOURS[Math.floor(r('c') * COLOURS.length)],
							opacity: fade,
							transform: `rotate(${spin}deg) scaleY(${flip})`,
							boxShadow: '0 2px 4px rgba(0,0,0,0.12)',
						}}
					/>
				);
			})}
		</AbsoluteFill>
	);
};

export const SoftOpeningTodayReel: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const glow = interpolate(frame, [0, 40], [0, 1], {extrapolateRight: 'clamp'});
	// A warm flash of light on the drop.
	const flash = interpolate(frame, [DROP, DROP + 4, DROP + 24], [0, 0.22, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const logo = spring({frame: frame - 12, fps, config: {damping: 16, mass: 0.7}});
	const line1 = useRise(48, 26, 50);
	const line2 = useRise(64, 26, 50);
	const date = useRise(146, 20, 20);
	const tagline = useRise(160, 22, 24);
	const contact = useRise(176, 22, 20);

	return (
		<AbsoluteFill style={{backgroundColor: CREAM}}>
			<AbsoluteFill style={{opacity: glow, background: 'radial-gradient(circle at 50% 50%, rgba(214,178,122,0.34) 0%, rgba(214,178,122,0) 55%)'}} />
			{FIREFLIES.map(([x, y, s], i) => (
				<Firefly key={i} x={x} y={y} s={s} i={i} />
			))}

			<div style={{position: 'absolute', left: 0, right: 0, top: 266, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
				<Img src={staticFile('reel/brand/logo-dark.png')} style={{width: 240, opacity: Math.min(logo * 1.4, 1), transform: `scale(${0.85 + 0.15 * logo})`}} />
				<div style={{marginTop: 40}}>
					<Kicker />
				</div>
				<div style={{marginTop: 12, fontFamily: display, fontSize: 96, lineHeight: 1.02, color: CHARCOAL, whiteSpace: 'nowrap'}}>
					<div style={line1}>It&rsquo;s today,</div>
					<div style={{...line2, color: BRONZE}}>we light up.</div>
				</div>
				<div style={{marginTop: 44}}>
					<PhotoArch />
				</div>
				<div style={{...date, marginTop: 22, fontFamily: sans, fontWeight: 700, fontSize: 30, color: 'rgba(41,41,41,0.75)'}}>Today · {SOFT_OPENING_DATE}</div>
				<div style={{...tagline, marginTop: 34, fontFamily: display, fontSize: 42, color: CHARCOAL}}>L&rsquo;Atelier · Café · Bistro</div>
				<div style={{...contact, marginTop: 16, fontFamily: sans, fontWeight: 700, fontSize: 25, letterSpacing: '0.26em', textTransform: 'uppercase', color: GOLD}}>
					Jounieh Souks · WhatsApp 81 540 282
				</div>
			</div>

			<Confetti />
			<AbsoluteFill style={{background: '#fff6e2', opacity: flash, mixBlendMode: 'screen'}} />

			<Audio src={staticFile('reel/music/luciole-celebration.mp3')} volume={1} />
			<Sequence from={48}>
				<Audio src={staticFile('reel/sfx/whoosh.wav')} volume={0.3} />
			</Sequence>
			<Sequence from={110}>
				<Audio src={staticFile('reel/sfx/sparkle.wav')} volume={0.35} />
			</Sequence>
			<Sequence from={DROP}>
				<Audio src={staticFile('reel/sfx/popper.wav')} volume={0.75} />
			</Sequence>
			<Sequence from={DROP + 3}>
				<Audio src={staticFile('reel/sfx/popper.wav')} volume={0.6} />
			</Sequence>
			<Sequence from={DROP + 10}>
				<Audio src={staticFile('reel/sfx/confetti.wav')} volume={0.45} />
			</Sequence>
			<Sequence from={DROP + 4}>
				<Audio src={staticFile('reel/sfx/pop.wav')} volume={0.4} />
			</Sequence>
			<Sequence from={178}>
				<Audio src={staticFile('reel/sfx/sparkle.wav')} volume={0.25} />
			</Sequence>
		</AbsoluteFill>
	);
};
