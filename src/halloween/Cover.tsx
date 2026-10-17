import {AbsoluteFill, Img, staticFile} from 'remotion';
import {CHARCOAL, CREAM, display, GOLD, SAND, sans} from './timeline';

/**
 * Halloween reel cover (1080x1920 still) on the Luciole identity: the host smiling with
 * one of the masks the kids will decorate, "Halloween at" + the dark logo on a cream
 * band, a gold date badge on the wall, a couple of bats.
 *
 * Instagram crops covers to 3:4 (1080x1440, y 240-1680) in the profile grid, so the
 * title, logo and dates stay inside that band; the bottom line only shows full screen.
 *
 * Photo: public/halloween/cover/frame.jpg, IMG_4776 at 6.65s, converted with its own
 * Dolby Vision metadata (no grading), e.g.
 *   ffmpeg -init_hw_device vulkan -ss 6.65 -i IMG_4776.mov -frames:v 1 -q:v 2 \
 *     -vf "libplacebo=apply_dolbyvision=1:w=1080:h=1920:colorspace=bt709:color_primaries=bt709:color_trc=bt709:range=tv" frame.jpg
 */

export const HALLOWEEN_COVER = {
	title: 'Halloween at',
	dates: ['Oct 30', 'to', 'Nov 1'],
	line: 'Kids create their own costumes',
};

const PHOTO_SHIFT = 130; // lowers the host so the title band clears her hair

const BAT =
	'M50 26 C46 16 36 12 22 14 C28 19 30 25 28 31 C22 27 12 27 3 33 C13 35 19 41 21 49 C29 43 39 43 45 49 L50 41 L55 49 C61 43 71 43 79 49 C81 41 87 35 97 33 C88 27 78 27 72 31 C70 25 72 19 78 14 C64 12 54 16 50 26 Z';

const Bat: React.FC<{x: number; y: number; size: number; tilt: number}> = ({x, y, size, tilt}) => (
	<svg viewBox="0 0 100 60" width={size} height={size * 0.6} style={{position: 'absolute', left: x, top: y, transform: `rotate(${tilt}deg)`}}>
		<path d={BAT} fill={CHARCOAL} stroke={GOLD} strokeWidth={1.6} strokeLinejoin="round" />
	</svg>
);

export const HalloweenCover: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: CREAM}}>
		<Img src={staticFile('halloween/cover/frame.jpg')} style={{position: 'absolute', left: 0, top: PHOTO_SHIFT, width: 1080, height: 1920, objectFit: 'cover'}} />

		{/* Cream title band */}
		<AbsoluteFill
			style={{background: `linear-gradient(180deg, ${CREAM} 0px, ${CREAM} 380px, rgba(237,236,227,0.7) 430px, rgba(237,236,227,0) 480px)`}}
		/>
		<div style={{position: 'absolute', top: 262, left: 0, right: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 26}}>
			<span style={{fontFamily: display, fontSize: 84, color: CHARCOAL, lineHeight: 1, paddingBottom: 18}}>{HALLOWEEN_COVER.title}</span>
			<Img src={staticFile('reel/brand/logo-dark.png')} style={{width: 330}} />
		</div>
		<Bat x={70} y={250} size={96} tilt={-12} />
		<Bat x={930} y={300} size={74} tilt={14} />

		{/* Date badge on the wall, right of her head */}
		<div
			style={{
				position: 'absolute',
				top: 560,
				right: 46,
				width: 230,
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
			<Img src={staticFile('halloween/icons/1f383.svg')} style={{width: 70, height: 70, marginBottom: 8}} />
			{HALLOWEEN_COVER.dates.map((d, i) => (
				<span
					key={d}
					style={{fontFamily: i === 1 ? sans : display, fontWeight: i === 1 ? 700 : 400, fontSize: i === 1 ? 26 : 60, color: i === 1 ? SAND : CREAM, lineHeight: i === 1 ? 1.5 : 1.05, letterSpacing: i === 1 ? '0.2em' : undefined, textTransform: i === 1 ? 'uppercase' : undefined}}
				>
					{d}
				</span>
			))}
		</div>

		{/* Bottom line: below the grid crop, seen when the reel opens full screen */}
		<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(41,41,41,0) 1600px, rgba(41,41,41,0.85) 1730px, rgba(41,41,41,0.95) 1920px)'}} />
		<AbsoluteFill style={{top: 1752, alignItems: 'center'}}>
			<span style={{fontFamily: display, fontSize: 52, color: CREAM}}>{HALLOWEEN_COVER.line}</span>
		</AbsoluteFill>
	</AbsoluteFill>
);
