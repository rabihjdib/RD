import {AbsoluteFill, Img, staticFile} from 'remotion';
import {CHARCOAL, CREAM, display, GOLD, SAND, sans} from '../brand';

/**
 * "How to find us" reel cover (1080x1920 still) on the Luciole identity: the host
 * opening the door into Luciole, "How to find" + the dark logo on a cream band, gold
 * brand stars, and a gold address badge on the wall.
 *
 * Instagram crops covers to 3:4 (1080x1440, y 240-1680) in the profile grid, so the
 * title, logo and badge stay inside that band; the bottom line only shows full screen.
 *
 * Photo: public/findus/cover/frame.jpg, the edited reel (Luciole-Reel04-How-To-Find-Us)
 * at 24.07s, the one moment at the door with no burned-in caption. The reel is already
 * SDR Rec.709, so the frame is taken as is:
 *   ffmpeg -ss 24.07 -i Luciole-Reel04-How-To-Find-Us-.mp4 -frames:v 1 -q:v 1 frame.jpg
 */

export const FINDUS_COVER = {
	title: 'How to find',
	badge: [
		{text: 'Chiha Bldg', small: true},
		{text: '1st floor', small: false},
		{text: 'Jounieh Souks', small: true},
	],
	line: 'Parking right next to us',
};

const PHOTO_SHIFT = 40; // a touch lower so the title band clears her hair

const Star: React.FC<{x: number; y: number; size: number; tilt: number}> = ({x, y, size, tilt}) => (
	<Img src={staticFile('reel/brand/star.png')} style={{position: 'absolute', left: x, top: y, width: size, transform: `rotate(${tilt}deg)`}} />
);

export const FindUsCover: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: CREAM}}>
		<Img src={staticFile('findus/cover/frame.jpg')} style={{position: 'absolute', left: 0, top: PHOTO_SHIFT, width: 1080, height: 1920, objectFit: 'cover'}} />

		{/* Cream title band */}
		<AbsoluteFill
			style={{background: `linear-gradient(180deg, ${CREAM} 0px, ${CREAM} 380px, rgba(237,236,227,0.7) 430px, rgba(237,236,227,0) 480px)`}}
		/>
		<div style={{position: 'absolute', top: 262, left: 0, right: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 26}}>
			<span style={{fontFamily: display, fontSize: 84, color: CHARCOAL, lineHeight: 1, paddingBottom: 18}}>{FINDUS_COVER.title}</span>
			<Img src={staticFile('reel/brand/logo-dark.png')} style={{width: 330}} />
		</div>
		<Star x={58} y={250} size={60} tilt={-8} />
		<Star x={116} y={326} size={32} tilt={10} />
		<Star x={966} y={258} size={50} tilt={12} />
		<Star x={924} y={336} size={28} tilt={-6} />

		{/* Address badge on the wall, right of her head */}
		<div
			style={{
				position: 'absolute',
				top: 540,
				right: 36,
				width: 262,
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
			<Img src={staticFile('findus/icons/1f4cd.svg')} style={{width: 66, height: 66, marginBottom: 8}} />
			{FINDUS_COVER.badge.map(({text, small}) => (
				<span
					key={text}
					style={{fontFamily: small ? sans : display, fontWeight: small ? 700 : 400, fontSize: small ? 22 : 56, color: small ? SAND : CREAM, lineHeight: small ? 1.6 : 1.05, letterSpacing: small ? '0.18em' : undefined, textTransform: small ? 'uppercase' : undefined}}
				>
					{text}
				</span>
			))}
		</div>

		{/* Bottom line: below the grid crop, seen when the reel opens full screen */}
		<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(41,41,41,0) 1600px, rgba(41,41,41,0.85) 1730px, rgba(41,41,41,0.95) 1920px)'}} />
		<AbsoluteFill style={{top: 1752, alignItems: 'center'}}>
			<span style={{fontFamily: display, fontSize: 52, color: CREAM}}>{FINDUS_COVER.line}</span>
		</AbsoluteFill>
	</AbsoluteFill>
);
