import {AbsoluteFill, Img, staticFile} from 'remotion';
import {BRONZE, CHARCOAL, display, GOLD, sans} from '../brand';
import {POST_H, POST_W} from './SparkPost';

/**
 * Instagram feed post (1080x1350, 4:5): even moms like to discover. The photo is
 * cropped to her upper body at the supplies wall so the paints and shelves lead; the
 * message sits on a cream card over the open wood panel under the green wave.
 *
 * Photo: public/posts/mom-discover.jpg. Render: npm run post:mom-discover
 */

// Crop window in source pixels (1512x2016): x 330..1274, y 150..1330 (cut at the waist),
// scaled to 1080 wide.
const CROP_X = 330;
const CROP_Y = 150;
const CROP_W = 944;
const SCALE = POST_W / CROP_W;

export const MomDiscoverPost: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: '#edece3', overflow: 'hidden'}}>
		<Img src={staticFile('posts/mom-discover.jpg')} style={{position: 'absolute', left: -CROP_X * SCALE, top: -CROP_Y * SCALE, width: 1512 * SCALE, height: 2016 * SCALE}} />

		<div
			style={{
				position: 'absolute',
				left: 120,
				top: 250,
				width: 560,
				padding: '24px 32px 26px',
				borderRadius: 26,
				background: 'rgba(237,236,227,0.95)',
				boxShadow: '0 18px 44px rgba(41,41,41,0.3)',
			}}
		>
			<div style={{fontFamily: sans, fontWeight: 700, fontSize: 22, letterSpacing: '0.28em', textTransform: 'uppercase', color: GOLD}}>Not just for kids</div>
			<div style={{marginTop: 10, fontFamily: display, fontSize: 58, lineHeight: 1.04, color: CHARCOAL, whiteSpace: 'nowrap'}}>
				Even moms
				<br />
				<span style={{color: BRONZE}}>love to discover.</span>
			</div>
			<div style={{marginTop: 14, fontFamily: sans, fontWeight: 700, fontSize: 23, lineHeight: 1.4, color: 'rgba(41,41,41,0.7)'}}>
				Paints, canvases and new ideas.
				<br />
				There&rsquo;s a little artist in you too.
			</div>
			<Img src={staticFile('reel/brand/logo-dark.png')} style={{marginTop: 14, width: 130}} />
		</div>
	</AbsoluteFill>
);
