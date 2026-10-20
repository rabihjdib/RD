import {AbsoluteFill} from 'remotion';
import {COD, PHOTOS, RIBBON, SHOWROOMS, SITE, type Ad, type Format, type FORMATS} from './data';
import {PhotoFill} from './PhotoFill';
import {BUTTER, CEDAR, CREAM, FLAG_RED, NAVY, font} from './theme';

export type AdVisualProps = {ad: Ad; format: Format; formatKey: keyof typeof FORMATS};

const LebanonFlag: React.FC<{size: number}> = ({size}) => (
	<svg width={size * 1.5} height={size} viewBox="0 0 30 20" style={{borderRadius: size * 0.12, flexShrink: 0}}>
		<rect width="30" height="20" fill="#fff" />
		<rect width="30" height="5" fill={FLAG_RED} />
		<rect y="15" width="30" height="5" fill={FLAG_RED} />
		<path d="M15 5.6 L18.6 9.6 L16.8 9.6 L19.4 12.4 L16.2 12.4 L16.2 14 L13.8 14 L13.8 12.4 L10.6 12.4 L13.2 9.6 L11.4 9.6 Z" fill={CEDAR} />
	</svg>
);

const Check: React.FC<{size: number}> = ({size}) => (
	<svg width={size} height={size} viewBox="0 0 24 24" style={{flexShrink: 0}}>
		<circle cx="12" cy="12" r="12" fill={NAVY} />
		<path d="M7 12.5l3.2 3.2L17 9" stroke={BUTTER} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

const Pin: React.FC<{size: number}> = ({size}) => (
	<svg width={size} height={size} viewBox="0 0 24 24" style={{flexShrink: 0}}>
		<path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" fill={BUTTER} />
	</svg>
);

/** One visual: a clean photo for Google, or the full overlay layout for Meta. */
export const AdVisual: React.FC<AdVisualProps> = ({ad, format, formatKey}) => {
	const {width, height} = format;
	const photo = PHOTOS[ad.photo];
	const focus = ad.focus?.[formatKey];
	if (!format.overlay) {
		return (
			<AbsoluteFill style={{backgroundColor: CREAM}}>
				<PhotoFill photo={photo} width={width} height={height} focus={focus} />
			</AbsoluteFill>
		);
	}

	// Everything scales off the 1080px-wide Meta canvas.
	const u = width / 1080;
	const barH = 118 * u;
	const tall = height / width > 1.1;
	return (
		<AbsoluteFill style={{backgroundColor: CREAM, fontFamily: font, color: NAVY}}>
			<PhotoFill photo={photo} width={width} height={height} focus={focus} />
			{/* Soft navy wash so the headline holds on any photo */}
			<AbsoluteFill
				style={{
					background: `linear-gradient(180deg, rgba(29,42,72,0.82) 0%, rgba(29,42,72,0.55) ${tall ? 26 : 32}%, rgba(29,42,72,0) ${tall ? 46 : 55}%)`,
				}}
			/>
			<div style={{position: 'absolute', top: 64 * u, left: 64 * u, right: 64 * u}}>
				<div
					style={{
						display: 'inline-block',
						padding: `${8 * u}px ${20 * u}px`,
						borderRadius: 999,
						border: `${2 * u}px solid rgba(251,246,238,0.7)`,
						color: CREAM,
						fontWeight: 800,
						fontSize: 24 * u,
						letterSpacing: 3 * u,
						textTransform: 'uppercase',
					}}
				>
					Chez Les Petits · Since 1912
				</div>
				<div
					style={{
						marginTop: 26 * u,
						color: '#fff',
						fontWeight: 900,
						fontSize: (tall ? 92 : 80) * u,
						lineHeight: 1.0,
						letterSpacing: -1.5 * u,
						textTransform: 'uppercase',
						textShadow: `0 ${4 * u}px ${24 * u}px rgba(0,0,0,0.25)`,
					}}
				>
					{ad.hook}
				</div>
				<div style={{marginTop: 18 * u, color: CREAM, fontWeight: 600, fontSize: 36 * u, lineHeight: 1.25, maxWidth: 820 * u}}>{ad.sub}</div>
				<div style={{marginTop: 28 * u, display: 'flex', flexWrap: 'wrap', gap: 14 * u}}>
					{ad.badges.map((b) => (
						<div
							key={b}
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 10 * u,
								padding: `${12 * u}px ${22 * u}px ${12 * u}px ${14 * u}px`,
								borderRadius: 999,
								backgroundColor: CREAM,
								fontWeight: 800,
								fontSize: 27 * u,
								boxShadow: `0 ${6 * u}px ${18 * u}px rgba(0,0,0,0.18)`,
							}}
						>
							<Check size={30 * u} />
							{b}
						</div>
					))}
				</div>
			</div>
			{/* Delivery ribbon sits just above the bar */}
			<div
				style={{
					position: 'absolute',
					left: 64 * u,
					bottom: barH + 26 * u,
					padding: `${12 * u}px ${24 * u}px`,
					borderRadius: 999,
					backgroundColor: BUTTER,
					fontWeight: 900,
					fontSize: 28 * u,
					boxShadow: `0 ${6 * u}px ${18 * u}px rgba(0,0,0,0.2)`,
				}}
			>
				{RIBBON}
			</div>
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					bottom: 0,
					height: barH,
					backgroundColor: NAVY,
					color: CREAM,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					padding: `0 ${48 * u}px`,
					fontWeight: 800,
					fontSize: 29 * u,
				}}
			>
				<span style={{color: '#fff', fontWeight: 900}}>{SITE}</span>
				<span style={{display: 'flex', alignItems: 'center', gap: 12 * u}}>
					<LebanonFlag size={26 * u} />
					{COD}
				</span>
				<span style={{display: 'flex', alignItems: 'center', gap: 8 * u}}>
					<Pin size={30 * u} />
					{SHOWROOMS}
				</span>
			</div>
		</AbsoluteFill>
	);
};
