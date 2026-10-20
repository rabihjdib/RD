import {AbsoluteFill, Img, staticFile} from 'remotion';
import {CloudIcon, CloudPhoto, CloudShape, Logo} from './Cloud';
import {PHOTOS, TRUST, type Ad, type Card, type Format, type FORMATS, type Statement, type Trust} from './data';
import {CTA, GREY, INK, PALETTES, body, display} from './theme';

export type AdVisualProps = {ad: Ad; format: Format; formatKey: keyof typeof FORMATS};

const ProductCard: React.FC<{card: Card; accent: string; left: number; top: number; width: number; height: number; u: number}> = ({
	card,
	accent,
	u,
	...box
}) => (
	<div
		style={{
			position: 'absolute',
			...box,
			borderRadius: 26 * u,
			backgroundColor: '#fff',
			boxShadow: `0 ${10 * u}px ${30 * u}px rgba(0,0,0,0.12)`,
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			padding: 14 * u,
		}}
	>
		<Img src={staticFile(card.file)} style={{flex: 1, minHeight: 0, width: '100%', objectFit: 'contain'}} />
		<div style={{fontFamily: display, fontWeight: 600, fontSize: 22 * u, color: accent, textTransform: 'uppercase', marginTop: 8 * u}}>{card.brand}</div>
	</div>
);

const Backdrop: React.FC<{width: number; height: number; u: number; bg: string; tint: string; accent: string}> = ({width, height, u, bg, tint, accent}) => (
	<>
		<CloudShape left={-70 * u} top={height - 170 * u} width={480 * u} height={320 * u} fill="#fff" opacity={0.75} />
		<CloudShape left={width - 330 * u} top={-130 * u} width={480 * u} height={320 * u} fill={tint} opacity={0.85} />
		<CloudShape left={34 * u} top={30 * u} width={57 * u} height={38 * u} fill={bg} stroke={accent} strokeWidth={3 * u} opacity={0.9} />
	</>
);

const Eyebrow: React.FC<{text: string; color: string; size: number}> = ({text, color, size}) => (
	<div style={{fontFamily: body, fontWeight: 800, fontSize: size, letterSpacing: size * 0.14, textTransform: 'uppercase', color}}>{text}</div>
);

const CtaPill: React.FC<{text: string; u: number}> = ({text, u}) => (
	<div
		style={{
			display: 'inline-block',
			marginTop: 22 * u,
			padding: `${13 * u}px ${26 * u}px`,
			borderRadius: 999,
			backgroundColor: CTA,
			color: '#fff',
			fontFamily: display,
			fontWeight: 600,
			fontSize: 20 * u,
		}}
	>
		{text}
	</div>
);

type Box = {left: number; top: number; width: number; height: number};

/** White brand cloud carrying the ad's big statement, for ads without a photo. */
const StatementCloud: React.FC<Box & {statement: Statement; accent: string; icon: string; outline: number}> = ({
	statement,
	accent,
	icon,
	outline,
	...box
}) => {
	// Type scales with the cloud (designed at 680x560) so every format reads the same.
	const s = Math.min(box.width / 680, box.height / 560);
	return (
		<>
			<CloudShape {...box} fill="#fff" stroke="#000" strokeWidth={outline} />
			<div
				style={{
					position: 'absolute',
					left: box.left,
					width: box.width,
					// The logo cloud's lobes sit up top, so the content centres a little low.
					top: box.top + box.height * 0.2,
					height: box.height * 0.74,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					textAlign: 'center',
				}}
			>
				<CloudIcon kind={statement.icon} size={64 * s} color={icon} />
				<div style={{marginTop: 6 * s, fontFamily: display, fontWeight: 600, fontSize: 120 * s * Math.min(1, 7 / statement.big.length), lineHeight: 1, color: accent}}>{statement.big}</div>
				<div style={{marginTop: 12 * s, fontFamily: body, fontWeight: 700, fontSize: 26 * s, color: INK, maxWidth: box.width * 0.7}}>{statement.caption}</div>
				{statement.chips ? (
					<div style={{marginTop: 18 * s, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 * s, maxWidth: box.width * 0.78}}>
						{statement.chips.map((c) => (
							<div
								key={c}
								style={{
									padding: `${7 * s}px ${16 * s}px`,
									borderRadius: 999,
									border: `${2 * s}px solid ${accent}`,
									fontFamily: display,
									fontWeight: 600,
									fontSize: 20 * s,
									color: accent,
								}}
							>
								{c}
							</div>
						))}
					</div>
				) : null}
			</div>
		</>
	);
};

const Hero: React.FC<Box & {ad: Ad; focus?: {x: number; y: number}; outline: number}> = ({ad, focus, outline, ...box}) => {
	const pal = PALETTES[ad.palette];
	if (ad.photo) {
		return <CloudPhoto {...box} photo={PHOTOS[ad.photo]} focus={focus} outline={outline} />;
	}
	if (ad.statement) {
		return <StatementCloud {...box} statement={ad.statement} accent={pal.accent} icon={pal.icon} outline={outline} />;
	}
	return null;
};

/** One visual in the Chez Les Petits cloud style: pastel world, logo, copy, cloud-masked photo. */
export const AdVisual: React.FC<AdVisualProps> = ({ad, format, formatKey}) => {
	const {width, height} = format;
	const pal = PALETTES[ad.palette];
	const focus = ad.focus?.[formatKey];
	const u = width / 1200;
	const landscape = width / height > 1.4;

	if (landscape) {
		// The cloud keeps its natural 3:2 shape, fully inside the frame.
		const cloud = {left: 500 * u, top: (height - 460 * u) / 2, width: 690 * u, height: 460 * u};
		const cardW = 165 * u;
		const cardH = 175 * u;
		return (
			<AbsoluteFill style={{backgroundColor: pal.bg}}>
				<Backdrop width={width} height={height} u={u} bg={pal.bg} tint={pal.tint} accent={pal.accent} />
				<Hero {...cloud} ad={ad} focus={focus} outline={4 * u} />
				{ad.cards?.slice(0, 2).map((card, i) => (
					<ProductCard
						key={card.file}
						card={card}
						accent={pal.accent}
						u={u}
						left={width - 30 * u - (2 - i) * (cardW + 14 * u) + 14 * u}
						top={height - cardH - 40 * u}
						width={cardW}
						height={cardH}
					/>
				))}
				<div style={{position: 'absolute', left: 60 * u, top: 22 * u}}>
					<Logo width={150 * u} />
				</div>
				<div style={{position: 'absolute', left: 48 * u, top: 128 * u, width: 440 * u}}>
					<Eyebrow text={ad.eyebrow} color={pal.accent} size={17 * u} />
					<div style={{marginTop: 10 * u, fontFamily: display, fontWeight: 600, fontSize: 46 * u, lineHeight: 1.08, color: INK, width: 470 * u}}>{ad.headline}</div>
					<div style={{marginTop: 14 * u, fontFamily: body, fontWeight: 500, fontSize: 19 * u, lineHeight: 1.45, color: GREY}}>{ad.sub}</div>
					<CtaPill text={ad.cta} u={u} />
					<div style={{marginTop: 28 * u, display: 'flex', flexDirection: 'column', gap: 14 * u}}>
						{(['cod', 'delivery'] as Trust[]).map((t) => (
							<div key={t} style={{display: 'flex', alignItems: 'center', gap: 12 * u, fontFamily: body, fontWeight: 500, fontSize: 17 * u, color: INK}}>
								<CloudIcon kind={t} size={24 * u} color={pal.icon} />
								{TRUST[t]}
							</div>
						))}
					</div>
				</div>
			</AbsoluteFill>
		);
	}

	// Square and portrait: copy on top, cloud photo above the dark trust bar. The cloud always
	// keeps its natural 3:2 shape; spare height goes to the copy.
	const barH = 118 * u;
	const headerEnd = 400 * u;
	const space = height - barH - 44 * u - headerEnd;
	const cloudH = Math.min((width - 120 * u) / 1.5, space);
	const cloudW = cloudH * 1.5;
	// Sits a little below the middle of the free space, under the copy.
	const cloud = {left: (width - cloudW) / 2, top: headerEnd + (space - cloudH) * 0.6, width: cloudW, height: cloudH};
	const showCta = cloud.top > 520 * u;
	// Tall formats have room to spare, so the copy steps up a size there.
	const t = showCta ? u * 1.15 : u;
	const cardW = 200 * u;
	const cardH = 225 * u;
	return (
		<AbsoluteFill style={{backgroundColor: pal.bg}}>
			<Backdrop width={width} height={height - barH} u={u} bg={pal.bg} tint={pal.tint} accent={pal.accent} />
			<Hero {...cloud} ad={ad} focus={focus} outline={5 * u} />
			{ad.cards?.slice(0, 2).map((card, i) => (
				<ProductCard
					key={card.file}
					card={card}
					accent={pal.accent}
					u={u}
					left={width - 130 * u - (2 - i) * (cardW + 14 * u) + 14 * u}
					top={height - barH - cardH - 70 * u}
					width={cardW}
					height={cardH}
				/>
			))}
			<div style={{position: 'absolute', left: 84 * u, top: 34 * u}}>
				<Logo width={200 * u} />
			</div>
			<div style={{position: 'absolute', left: 64 * u, right: 64 * u, top: 196 * u}}>
				<Eyebrow text={ad.eyebrow} color={pal.accent} size={22 * t} />
				<div style={{marginTop: 12 * t, fontFamily: display, fontWeight: 600, fontSize: 68 * t, lineHeight: 1.05, color: INK}}>{ad.headline}</div>
				<div style={{marginTop: 14 * t, fontFamily: body, fontWeight: 500, fontSize: 25 * t, lineHeight: 1.4, color: GREY}}>{ad.sub}</div>
				{showCta ? <CtaPill text={ad.cta} u={t * 1.25} /> : null}
			</div>
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					bottom: 0,
					height: barH,
					backgroundColor: INK,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 40 * u,
				}}
			>
				{(['original', 'cod', 'delivery'] as Trust[]).map((t) => (
					<div key={t} style={{display: 'flex', alignItems: 'center', gap: 12 * u, fontFamily: body, fontWeight: 700, fontSize: 23 * u, color: '#fff'}}>
						<CloudIcon kind={t} size={28 * u} color={pal.icon} />
						{TRUST[t]}
					</div>
				))}
			</div>
		</AbsoluteFill>
	);
};
