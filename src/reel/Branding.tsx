import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND} from './data';
import {FireflyField} from './Effects';
import {CHARCOAL, CREAM, display, END_CARD_AT, GOLD, REEL_DURATION, SAND, sans} from './timeline';

/**
 * Logo outro, styled on the LUCIOLE brand guidelines: the white wordmark with its gold
 * star on charcoal, the master-brand tagline in Grown between thin gold rules, then
 * the WhatsApp number and location. Text values live in data.ts BRAND; to change the
 * logo, replace public/reel/brand/logo-white.png (keep a transparent background).
 */

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const LOGO_W = 780;
const LOGO_RATIO = 404 / 838; // logo-white.png is 838x404
const STAR: [number, number] = [0.524, 0.275]; // star centre inside the logo, 0..1

// Material Icons "call" and "place" glyphs (24x24).
const HANDSET =
	'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z';
const PIN =
	'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z';

const WhatsAppIcon: React.FC<{size: number}> = ({size}) => (
	<svg width={size} height={size} viewBox="0 0 48 48">
		<circle cx="24" cy="24" r="22.5" fill="none" stroke={GOLD} strokeWidth="2.5" />
		<path d="M24 12a12 12 0 0 0-10.4 18L12 36l6.2-1.6A12 12 0 1 0 24 12z" fill="none" stroke={CREAM} strokeWidth="2.2" strokeLinejoin="round" />
		<g transform="translate(17.2 17.2) scale(0.57)">
			<path d={HANDSET} fill={CREAM} />
		</g>
	</svg>
);

const PinIcon: React.FC<{size: number}> = ({size}) => (
	<svg width={size} height={size} viewBox="0 0 48 48">
		<circle cx="24" cy="24" r="22.5" fill="none" stroke={GOLD} strokeWidth="2.5" />
		<g transform="translate(12 11) scale(1)">
			<path d={PIN} fill={CREAM} />
		</g>
	</svg>
);

const rise = (frame: number, at: number) => interpolate(frame, [at, at + 10], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});

const ContactRow: React.FC<{icon: React.ReactNode; label: string; value: string; extra?: string; show: number}> = ({icon, label, value, extra, show}) => (
	<div style={{display: 'flex', alignItems: 'center', gap: 28, opacity: show, transform: `translateY(${(1 - show) * 24}px)`}}>
		{icon}
		<div style={{display: 'flex', flexDirection: 'column'}}>
			<span style={{fontFamily: sans, fontWeight: 700, fontSize: 24, letterSpacing: '0.24em', color: SAND, textTransform: 'uppercase', lineHeight: 1.4}}>{label}</span>
			<span style={{fontFamily: sans, fontWeight: 700, fontSize: 64, color: CREAM, lineHeight: 1.1, display: 'flex', alignItems: 'baseline', gap: 22}}>
				{value}
				{extra ? (
					<span lang="ar" style={{direction: 'rtl', fontSize: 44, color: SAND}}>
						{extra}
					</span>
				) : null}
			</span>
		</div>
	</div>
);

export const Outro: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const duration = REEL_DURATION - END_CARD_AT; // mounted in a Sequence starting at END_CARD_AT

	const dim = interpolate(frame, [0, 14], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const logo = spring({frame: frame - 6, fps, config: {damping: 16, stiffness: 90}});
	const logoBlur = interpolate(logo, [0, 1], [14, 0]);
	const star = interpolate(frame, [14, 24, 40], [0, 1, 0.55], clamp) + 0.12 * Math.sin(frame / 5) * (frame > 40 ? 1 : 0);
	const rules = interpolate(frame, [18, 34], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const tagline = rise(frame, 20);
	const phone = rise(frame, 30);
	const place = rise(frame, 36);

	const logoH = LOGO_W * LOGO_RATIO;

	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: CHARCOAL, opacity: dim * 0.9, backdropFilter: `blur(${dim * 14}px)`}} />
			<FireflyField duration={duration} count={30} seed="outro" />
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 140}}>
				<div style={{position: 'relative', width: LOGO_W, height: logoH}}>
					{/* Warm bloom behind the star as it "lights up". */}
					<div
						style={{
							position: 'absolute',
							left: STAR[0] * LOGO_W - 160,
							top: STAR[1] * logoH - 160,
							width: 320,
							height: 320,
							borderRadius: '50%',
							background: 'radial-gradient(circle, rgba(214,178,122,0.75) 0%, rgba(183,144,93,0.25) 40%, rgba(183,144,93,0) 70%)',
							opacity: star,
							transform: `scale(${0.6 + 0.6 * star})`,
						}}
					/>
					<Img
						src={staticFile('reel/brand/logo-white.png')}
						style={{
							position: 'absolute',
							inset: 0,
							width: LOGO_W,
							height: logoH,
							opacity: Math.min(1, logo * 1.4),
							transform: `scale(${0.9 + 0.1 * logo})`,
							filter: `blur(${logoBlur}px)`,
						}}
					/>
				</div>

				<div style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 34}}>
					<div style={{width: 90 * rules, height: 2, background: GOLD}} />
					<span style={{fontFamily: display, fontSize: 46, color: CREAM, opacity: tagline, whiteSpace: 'nowrap'}}>{BRAND.tagline}</span>
					<div style={{width: 90 * rules, height: 2, background: GOLD}} />
				</div>

				<div style={{display: 'flex', flexDirection: 'column', gap: 40, marginTop: 110, alignItems: 'flex-start'}}>
					<ContactRow icon={<WhatsAppIcon size={96} />} label="WhatsApp" value={BRAND.whatsapp} show={phone} />
					<ContactRow icon={<PinIcon size={96} />} label="Location" value={BRAND.location} extra={BRAND.locationAr} show={place} />
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
