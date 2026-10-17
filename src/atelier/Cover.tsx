import {AbsoluteFill, Img, staticFile} from 'remotion';
import {CHARCOAL, CREAM, display, GOLD, SAND, sans} from '../brand';

/**
 * L'Atelier tour cover (1080x1920 still) on the Luciole identity: the workshop wall with
 * its paints, figurines and pink drawers, "L'Atelier at" + the dark logo on a cream band,
 * gold brand stars, and a "Paint, Build, Play" badge over the counter.
 *
 * Instagram crops covers to 3:4 (1080x1440, y 240-1680) in the profile grid, so the
 * title, logo and badge stay inside that band; the bottom line only shows full screen.
 *
 * Photo: public/atelier/cover/frame.jpg, IMG_4527 at 2.9s, converted with its own Dolby
 * Vision metadata (no grading), e.g.
 *   ffmpeg -init_hw_device vulkan -ss 2.9 -i IMG_4527.mov -frames:v 1 -q:v 2 \
 *     -vf "libplacebo=apply_dolbyvision=1:w=1080:h=1920:colorspace=bt709:color_primaries=bt709:color_trc=bt709:range=tv" frame.jpg
 */

export const ATELIER_COVER = {
	title: 'L’Atelier at',
	badge: ['Paint', 'Build', 'Play'],
	line: 'A creative corner for little artists',
};

const PHOTO_SHIFT = 170; // lowers the shelves so the scalloped arch shows under the band

const Star: React.FC<{x: number; y: number; size: number; tilt: number}> = ({x, y, size, tilt}) => (
	<Img src={staticFile('reel/brand/star.png')} style={{position: 'absolute', left: x, top: y, width: size, transform: `rotate(${tilt}deg)`}} />
);

export const AtelierCover: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: CREAM}}>
		<Img src={staticFile('atelier/cover/frame.jpg')} style={{position: 'absolute', left: 0, top: PHOTO_SHIFT, width: 1080, height: 1920, objectFit: 'cover'}} />

		{/* Cream title band */}
		<AbsoluteFill
			style={{background: `linear-gradient(180deg, ${CREAM} 0px, ${CREAM} 380px, rgba(237,236,227,0.7) 430px, rgba(237,236,227,0) 480px)`}}
		/>
		<div style={{position: 'absolute', top: 262, left: 0, right: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 26}}>
			<span style={{fontFamily: display, fontSize: 84, color: CHARCOAL, lineHeight: 1, paddingBottom: 18}}>{ATELIER_COVER.title}</span>
			<Img src={staticFile('reel/brand/logo-dark.png')} style={{width: 330}} />
		</div>
		<Star x={58} y={250} size={64} tilt={-8} />
		<Star x={120} y={330} size={34} tilt={10} />
		<Star x={962} y={262} size={52} tilt={12} />
		<Star x={918} y={340} size={28} tilt={-6} />

		{/* Badge over the counter, bottom left */}
		<div
			style={{
				position: 'absolute',
				top: 1270,
				left: 56,
				width: 250,
				padding: '22px 0 26px',
				borderRadius: 30,
				background: 'rgba(41,41,41,0.88)',
				border: `3px solid ${GOLD}`,
				boxShadow: '0 18px 44px rgba(0,0,0,0.3)',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				transform: 'rotate(-4deg)',
			}}
		>
			<Img src={staticFile('birthday/icons/1f3a8.svg')} style={{width: 70, height: 70, marginBottom: 10}} />
			{ATELIER_COVER.badge.map((word, i) => (
				<span key={word} style={{fontFamily: display, fontSize: 56, color: i === 1 ? GOLD : CREAM, lineHeight: 1.08}}>
					{word}
				</span>
			))}
			<span style={{marginTop: 10, fontFamily: sans, fontWeight: 700, fontSize: 22, letterSpacing: '0.22em', textTransform: 'uppercase', color: SAND}}>Jounieh</span>
		</div>

		{/* Bottom line: below the grid crop, seen when the reel opens full screen */}
		<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(41,41,41,0) 1600px, rgba(41,41,41,0.85) 1730px, rgba(41,41,41,0.95) 1920px)'}} />
		<AbsoluteFill style={{top: 1752, alignItems: 'center'}}>
			<span style={{fontFamily: display, fontSize: 52, color: CREAM}}>{ATELIER_COVER.line}</span>
		</AbsoluteFill>
	</AbsoluteFill>
);
