import {AbsoluteFill, Img, staticFile} from 'remotion';
import {CREAM, display, GOLD, SAND, sans} from './timeline';

/**
 * Reel cover (1080x1920 still), on the LUCIOLE identity: the two hosts with the Luciole
 * sign and firefly artwork, the dark logo on a cream band, and the hook line in Grown.
 *
 * Instagram crops covers to 3:4 (1080x1440, y 240-1680) in the profile grid, so the
 * logo and headline stay inside that band.
 *
 * Swap the photo: replace public/reel/cover/frame.jpg (any 1080x1920 frame). iPhone
 * footage is HDR (HLG), so tone-map it or the colours come out flat:
 *   ffmpeg -ss 5.7 -i IMG_3766.mov -frames:v 1 -q:v 2 -vf "zscale=t=linear:npl=203,format=gbrpf32le,zscale=p=bt709,\
 *     tonemap=tonemap=mobius:param=0.5:desat=0,zscale=t=bt709:m=bt709:r=tv,scale=1080:1920:force_original_aspect_ratio=increase,\
 *     crop=1080:1920,format=yuvj420p" public/reel/cover/frame.jpg
 */

export const COVER = {
	kicker: 'A brand new concept',
	headline: ['Not your usual', 'play area'],
	arabic: 'مساحة للولاد يبدعوا، وللأهل يرتاحوا',
};

const PHOTO_SHIFT = 110; // pushes the hosts down so the logo band clears their heads

export const LucioleCover: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: CREAM}}>
		<Img
			src={staticFile('reel/cover/frame.jpg')}
			style={{position: 'absolute', left: 0, top: PHOTO_SHIFT, width: 1080, height: 1920, objectFit: 'cover'}}
		/>

		{/* Cream band with the dark logo */}
		<AbsoluteFill
			style={{
				background: `linear-gradient(180deg, ${CREAM} 0px, ${CREAM} 300px, rgba(237,236,227,0.75) 420px, rgba(237,236,227,0) 560px)`,
			}}
		/>
		<Img src={staticFile('reel/brand/logo-dark.png')} style={{position: 'absolute', left: (1080 - 540) / 2, top: 232, width: 540}} />

		{/* Charcoal fade for the headline */}
		<AbsoluteFill
			style={{
				background: 'linear-gradient(180deg, rgba(41,41,41,0) 1120px, rgba(41,41,41,0.82) 1330px, rgba(41,41,41,0.95) 1560px, rgba(41,41,41,0.98) 1920px)',
			}}
		/>

		<AbsoluteFill style={{top: 1262, alignItems: 'center'}}>
			<div style={{display: 'flex', alignItems: 'center', gap: 22}}>
				<div style={{width: 70, height: 2, background: GOLD}} />
				<span style={{fontFamily: sans, fontWeight: 700, fontSize: 28, letterSpacing: '0.32em', textTransform: 'uppercase', color: GOLD}}>{COVER.kicker}</span>
				<div style={{width: 70, height: 2, background: GOLD}} />
			</div>

			<div style={{position: 'relative', marginTop: 18, textAlign: 'center'}}>
				{COVER.headline.map((line) => (
					<div key={line} style={{fontFamily: display, fontSize: 122, lineHeight: 1.04, color: CREAM, whiteSpace: 'nowrap'}}>
						{line}
					</div>
				))}
				<Img src={staticFile('reel/brand/star.png')} style={{position: 'absolute', right: -86, top: -50, width: 118, transform: 'rotate(8deg)'}} />
			</div>

			<div lang="ar" style={{direction: 'rtl', marginTop: 22, fontFamily: sans, fontWeight: 700, fontSize: 44, color: SAND}}>
				{COVER.arabic}
			</div>
		</AbsoluteFill>

		{/* Below the grid crop: only seen when the reel opens full screen. */}
		<AbsoluteFill style={{top: 1740, alignItems: 'center'}}>
			<span style={{fontFamily: display, fontSize: 36, color: 'rgba(237,236,227,0.7)'}}>They Create You Pause &amp; Connect</span>
		</AbsoluteFill>
	</AbsoluteFill>
);
