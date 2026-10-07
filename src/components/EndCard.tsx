import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, display, mono} from '../theme';

export const BOOKING = {
	whatsapp: '81 541 986',
	location: 'ANTELIAS',
};

const WHATSAPP_GREEN = '#25D366';
// Material Icons "call" and "place" glyphs (24x24).
const HANDSET =
	'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z';
const PIN =
	'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z';

const WhatsAppBadge: React.FC<{size: number}> = ({size}) => (
	<svg width={size} height={size} viewBox="0 0 48 48">
		<circle cx="24" cy="24" r="24" fill={WHATSAPP_GREEN} />
		<path d="M24 10a14 14 0 0 0-12.1 21L10 38l7.2-1.9A14 14 0 1 0 24 10z" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinejoin="round" />
		<g transform="translate(15.6 15.6) scale(0.7)">
			<path d={HANDSET} fill="#fff" />
		</g>
	</svg>
);

const PinBadge: React.FC<{size: number}> = ({size}) => (
	<svg width={size} height={size} viewBox="0 0 48 48">
		<circle cx="24" cy="24" r="23" fill="none" stroke={C.magenta} strokeWidth="2.5" />
		<g transform="translate(10 9) scale(1.17)">
			<path d={PIN} fill={C.white} />
		</g>
	</svg>
);

const reveal = (frame: number, at: number) =>
	interpolate(frame, [at, at + 7], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

/** Brand end card: neon flicker-on logo, tagline, WhatsApp booking number and location. */
export const EndCard: React.FC = () => {
	const frame = useCurrentFrame();
	const {width, height} = useVideoConfig();
	const vertical = height > width;

	// Neon tube flicker as the logo powers on, then a slow breathing glow.
	const flicker = [0, 0.9, 0.15, 1, 0.35, 1, 0.8, 1];
	const logoOn = frame < flicker.length ? flicker[frame] : 1;
	const logoScale = interpolate(frame, [0, 14], [1.12, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.exp)});
	const glow = 14 + 6 * Math.sin(frame / 5);

	const tag = reveal(frame, 8);
	const line = interpolate(frame, [10, 24], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
	const book = reveal(frame, 14);
	const loc = reveal(frame, 20);

	const logoW = vertical ? 900 : 820;
	const numberSize = vertical ? 120 : 96;
	const badge = vertical ? 104 : 84;

	const kicker: React.CSSProperties = {
		fontFamily: mono,
		fontWeight: 700,
		fontSize: vertical ? 28 : 22,
		letterSpacing: 7,
		color: C.blueHot,
	};
	const big: React.CSSProperties = {
		fontFamily: display,
		fontSize: numberSize,
		lineHeight: 1,
		color: C.white,
		letterSpacing: 3,
		whiteSpace: 'nowrap',
	};

	const bookingBlock = (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 24,
				opacity: book,
				transform: `translateY(${(1 - book) * 24}px)`,
			}}
		>
			<WhatsAppBadge size={badge} />
			<div style={{textAlign: 'left'}}>
				<div style={kicker}>BOOK ON WHATSAPP</div>
				<div style={{...big, textShadow: `0 0 22px ${WHATSAPP_GREEN}66`}}>{BOOKING.whatsapp}</div>
			</div>
		</div>
	);
	const locationBlock = (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 24,
				opacity: loc,
				transform: `translateY(${(1 - loc) * 24}px)`,
			}}
		>
			<PinBadge size={badge} />
			<div style={{textAlign: 'left'}}>
				<div style={{...kicker, color: C.magenta}}>LOCATION</div>
				<div style={{...big, textShadow: `0 0 22px ${C.magenta}66`}}>{BOOKING.location}</div>
			</div>
		</div>
	);

	return (
		<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: vertical ? -60 : 0}}>
				<Img
					src={staticFile('logo-white.png')}
					style={{
						width: logoW,
						opacity: logoOn,
						transform: `scale(${logoScale})`,
						filter: `drop-shadow(0 0 ${glow}px ${C.blue}) drop-shadow(0 0 ${glow * 2.2}px ${C.blue}66)`,
					}}
				/>
				<div
					style={{
						marginTop: vertical ? 54 : 44,
						fontFamily: display,
						fontSize: vertical ? 116 : 88,
						lineHeight: 1,
						letterSpacing: interpolate(tag, [0, 1], [26, 6]),
						color: C.white,
						opacity: tag,
						textShadow: `0 0 18px ${C.magenta}88`,
					}}
				>
					ENTER THE ARENA
				</div>
				<div
					style={{
						margin: vertical ? '30px 0 60px' : '22px 0 40px',
						height: 4,
						width: (vertical ? 820 : 1000) * line,
						background: `linear-gradient(90deg, ${C.blue}, ${C.magenta})`,
						boxShadow: `0 0 18px ${C.magenta}`,
					}}
				/>
				<div
					style={{
						display: 'flex',
						flexDirection: vertical ? 'column' : 'row',
						alignItems: vertical ? 'flex-start' : 'center',
						gap: vertical ? 48 : 90,
					}}
				>
					{bookingBlock}
					{vertical ? null : <div style={{width: 2, height: 110, background: `${C.white}33`, opacity: loc}} />}
					{locationBlock}
				</div>
			</div>
		</AbsoluteFill>
	);
};
