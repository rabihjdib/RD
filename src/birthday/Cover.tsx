import {AbsoluteFill, Img, staticFile} from 'remotion';
import {CHARCOAL, CREAM, display, GOLD, OLIVE, SAND, sans} from '../brand';

/**
 * Birthday reel cover (1080x1920 still) on the Luciole identity: the host smiling in the
 * games corner, "Birthdays at" + the dark logo on a cream band, balloons in the party's
 * own olive, charcoal and gold, and a gold "Book 3 weeks ahead" badge on the wall.
 *
 * Instagram crops covers to 3:4 (1080x1440, y 240-1680) in the profile grid, so the
 * title, logo and badge stay inside that band; the bottom line only shows full screen.
 *
 * Photo: public/birthday/cover/frame-b.jpg, IMG_4669 at 2.55s, converted with its own
 * Dolby Vision metadata (no grading), e.g.
 *   ffmpeg -init_hw_device vulkan -ss 2.55 -i IMG_4669.mov -frames:v 1 -q:v 2 \
 *     -vf "libplacebo=apply_dolbyvision=1:w=1080:h=1920:colorspace=bt709:color_primaries=bt709:color_trc=bt709:range=tv" frame-b.jpg
 */

export const BIRTHDAY_COVER = {
	title: 'Birthdays at',
	badge: [
		{text: 'Book', small: true},
		{text: '3 weeks', small: false},
		{text: 'ahead', small: true},
	],
	line: 'The whole place is all yours',
};

const PHOTO_SHIFT = 120; // lowers the host so the title band clears her hair

const Balloon: React.FC<{x: number; y: number; size: number; tilt: number; color: string}> = ({x, y, size, tilt, color}) => (
	<svg viewBox="0 0 60 110" width={size} height={size * (110 / 60)} style={{position: 'absolute', left: x, top: y, transform: `rotate(${tilt}deg)`, transformOrigin: '50% 30%'}}>
		<path d="M30 70 C33 80 26 88 31 98 C35 104 28 108 30 110" fill="none" stroke={CHARCOAL} strokeWidth={1.4} opacity={0.55} />
		<path d="M30 2 C14 2 3 15 3 31 C3 48 17 63 30 68 C43 63 57 48 57 31 C57 15 46 2 30 2 Z" fill={color} stroke={GOLD} strokeWidth={1.6} />
		<path d="M27 68 L33 68 L31 73 L29 73 Z" fill={color} />
		<ellipse cx={20} cy={20} rx={5} ry={9} fill="#fff" opacity={0.28} transform="rotate(25 20 20)" />
	</svg>
);

export const BirthdayCover: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: CREAM}}>
		<Img src={staticFile('birthday/cover/frame-b.jpg')} style={{position: 'absolute', left: 0, top: PHOTO_SHIFT, width: 1080, height: 1920, objectFit: 'cover'}} />

		{/* Cream title band */}
		<AbsoluteFill
			style={{background: `linear-gradient(180deg, ${CREAM} 0px, ${CREAM} 380px, rgba(237,236,227,0.7) 430px, rgba(237,236,227,0) 480px)`}}
		/>
		<div style={{position: 'absolute', top: 262, left: 0, right: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 26}}>
			<span style={{fontFamily: display, fontSize: 84, color: CHARCOAL, lineHeight: 1, paddingBottom: 18}}>{BIRTHDAY_COVER.title}</span>
			<Img src={staticFile('reel/brand/logo-dark.png')} style={{width: 330}} />
		</div>
		<Balloon x={38} y={236} size={62} tilt={-14} color={OLIVE} />
		<Balloon x={88} y={270} size={50} tilt={6} color={CHARCOAL} />
		<Balloon x={968} y={250} size={58} tilt={12} color={OLIVE} />
		<Balloon x={930} y={300} size={44} tilt={-6} color={GOLD} />

		{/* Booking badge on the wall, right of her head */}
		<div
			style={{
				position: 'absolute',
				top: 560,
				right: 40,
				width: 236,
				padding: '22px 0 24px',
				borderRadius: 30,
				background: 'rgba(41,41,41,0.88)',
				border: `3px solid ${GOLD}`,
				boxShadow: '0 18px 44px rgba(0,0,0,0.3)',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				transform: 'rotate(4deg)',
			}}
		>
			<Img src={staticFile('birthday/icons/1f382.svg')} style={{width: 70, height: 70, marginBottom: 8}} />
			{BIRTHDAY_COVER.badge.map(({text, small}) => (
				<span
					key={text}
					style={{fontFamily: small ? sans : display, fontWeight: small ? 700 : 400, fontSize: small ? 26 : 56, color: small ? SAND : CREAM, lineHeight: small ? 1.5 : 1.05, letterSpacing: small ? '0.2em' : undefined, textTransform: small ? 'uppercase' : undefined}}
				>
					{text}
				</span>
			))}
		</div>

		{/* Bottom line: below the grid crop, seen when the reel opens full screen */}
		<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(41,41,41,0) 1600px, rgba(41,41,41,0.85) 1730px, rgba(41,41,41,0.95) 1920px)'}} />
		<AbsoluteFill style={{top: 1752, alignItems: 'center'}}>
			<span style={{fontFamily: display, fontSize: 52, color: CREAM}}>{BIRTHDAY_COVER.line}</span>
		</AbsoluteFill>
	</AbsoluteFill>
);
