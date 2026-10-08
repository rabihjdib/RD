import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND} from './data';
import {FireflyField} from './Effects';
import {END_CARD_AT, INK, REEL_DURATION, sans, serif, YELLOW} from './timeline';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Round avatar: the brand initial with a firefly glow. Swap for the real logo with <Img>. */
const Avatar: React.FC<{size: number}> = ({size}) => (
	<div
		style={{
			width: size,
			height: size,
			borderRadius: '50%',
			flexShrink: 0,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			background: 'radial-gradient(circle at 62% 70%, #FFF3A3 0%, #FFD60A 28%, #1C2238 62%)',
			border: '3px solid #FFFFFF',
			fontFamily: serif,
			fontStyle: 'italic',
			fontWeight: 700,
			fontSize: size * 0.56,
			color: '#FFFFFF',
			textShadow: '0 2px 8px rgba(0,0,0,0.5)',
		}}
	>
		{BRAND.name[0]}
	</div>
);

const FollowButton: React.FC<{size: number; pulse: number}> = ({size, pulse}) => (
	<div
		style={{
			display: 'flex',
			alignItems: 'center',
			gap: size * 0.25,
			padding: `${size * 0.22}px ${size * 0.55}px`,
			borderRadius: 999,
			background: YELLOW,
			color: INK,
			fontFamily: sans,
			fontWeight: 900,
			fontSize: size,
			lineHeight: 1,
			transform: `scale(${pulse})`,
		}}
	>
		<Img src={staticFile('reel/icons/1f514.svg')} style={{width: size * 0.95, height: size * 0.95}} />
		Follow
	</div>
);

/**
 * Small follow pill that slides in after the hook and stays until the end card, with
 * a nudge every few seconds. Sits bottom left, above Instagram's caption block.
 */
export const FollowBadge: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const IN = 45;
	if (frame < IN || frame >= END_CARD_AT) return null;

	const enter = spring({frame: frame - IN, fps, config: {damping: 14, stiffness: 120}});
	const out = interpolate(frame, [END_CARD_AT - 8, END_CARD_AT], [1, 0], clamp);
	const beat = (frame - IN) % 150; // every 5s
	const pulse = 1 + 0.12 * Math.sin(interpolate(beat, [90, 108], [0, Math.PI], clamp));

	return (
		<div
			style={{
				position: 'absolute',
				left: 48,
				top: 1478,
				display: 'flex',
				alignItems: 'center',
				gap: 16,
				padding: '10px 12px 10px 10px',
				borderRadius: 999,
				background: 'rgba(14,14,20,0.66)',
				border: '1.5px solid rgba(255,255,255,0.18)',
				boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
				transform: `translateX(${(1 - enter) * -460}px)`,
				opacity: out,
			}}
		>
			<Avatar size={68} />
			<div style={{display: 'flex', flexDirection: 'column', marginRight: 6}}>
				<span style={{fontFamily: serif, fontStyle: 'italic', fontWeight: 700, fontSize: 34, color: '#FFFFFF', lineHeight: 1.05}}>{BRAND.name}</span>
				<span style={{fontFamily: sans, fontWeight: 700, fontSize: 22, color: 'rgba(255,255,255,0.75)', lineHeight: 1.3}}>{BRAND.handle}</span>
			</div>
			<FollowButton size={30} pulse={pulse} />
		</div>
	);
};

/** End card over the frozen last frame: wordmark, tagline in both languages, follow CTA. */
export const EndCard: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const duration = REEL_DURATION - END_CARD_AT;
	const t = frame; // mounted in a Sequence starting at END_CARD_AT

	const dim = interpolate(t, [0, 12], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const logo = spring({frame: t - 4, fps, config: {damping: 12, stiffness: 110}});
	const line = interpolate(t, [12, 22], [0, 1], clamp);
	const lineAr = interpolate(t, [16, 26], [0, 1], clamp);
	const cta = spring({frame: t - 20, fps, config: {damping: 10, stiffness: 160}});
	const pulse = 1 + 0.05 * Math.sin(Math.max(0, t - 34) / 4);
	const glow = 24 + 10 * Math.sin(t / 6);

	return (
		<AbsoluteFill>
			<AbsoluteFill
				style={{
					opacity: dim,
					background: 'linear-gradient(180deg, rgba(12,14,28,0.35) 0%, rgba(12,14,28,0.78) 45%, rgba(12,14,28,0.9) 100%)',
					backdropFilter: `blur(${dim * 10}px)`,
				}}
			/>
			<FireflyField duration={duration} count={34} seed="end" />
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 220, paddingRight: 60}}>
				<div
					style={{
						fontFamily: serif,
						fontStyle: 'italic',
						fontWeight: 700,
						fontSize: 200,
						color: '#FFFFFF',
						lineHeight: 1,
						textShadow: `0 0 ${glow}px rgba(255,214,10,0.65), 0 8px 30px rgba(0,0,0,0.45)`,
						transform: `scale(${0.7 + 0.3 * logo})`,
						opacity: Math.min(1, logo * 1.5),
					}}
				>
					{BRAND.name}
				</div>
				<div
					style={{
						marginTop: 34,
						fontFamily: sans,
						fontWeight: 900,
						fontSize: 50,
						color: '#FFFFFF',
						opacity: line,
						transform: `translateY(${(1 - line) * 16}px)`,
					}}
				>
					{BRAND.tagline}
				</div>
				<div
					lang="ar"
					style={{
						direction: 'rtl',
						marginTop: 6,
						fontFamily: sans,
						fontWeight: 700,
						fontSize: 46,
						color: YELLOW,
						opacity: lineAr,
						transform: `translateY(${(1 - lineAr) * 16}px)`,
					}}
				>
					{BRAND.taglineAr}
				</div>
				<div style={{marginTop: 64, transform: `scale(${cta * pulse})`, opacity: Math.min(1, cta * 1.4)}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 22, padding: '14px 18px 14px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.12)', border: '2px solid rgba(255,255,255,0.3)'}}>
						<Avatar size={96} />
						<span style={{fontFamily: sans, fontWeight: 900, fontSize: 44, color: '#FFFFFF'}}>{BRAND.handle}</span>
						<FollowButton size={44} pulse={1} />
					</div>
				</div>
				<div lang="ar" style={{direction: 'rtl', marginTop: 22, fontFamily: sans, fontWeight: 700, fontSize: 38, color: 'rgba(255,255,255,0.85)', opacity: cta}}>
					تابعونا لتعرفوا أكتر
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
