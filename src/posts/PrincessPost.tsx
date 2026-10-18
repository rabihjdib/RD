import {AbsoluteFill, Img, staticFile} from 'remotion';
import {BRONZE, CHARCOAL, display, GOLD, sans} from '../brand';
import {POST_H, POST_W} from './SparkPost';

/**
 * Instagram feed post (1080x1350, 4:5): a smiling girl in a Luciole apron at the
 * building table. "Strong little princess" with a twist: the princesses here build
 * their own castles. The card sits left over the games shelves, clear of her face,
 * her hair and the embroidered logo on the apron.
 *
 * Photo: public/posts/princess.jpg. Render: npm run post:princess
 */

export const PrincessPost: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: '#edece3'}}>
		<Img src={staticFile('posts/princess.jpg')} style={{width: POST_W, height: POST_H, objectFit: 'cover', objectPosition: '50% 100%'}} />

		<div
			style={{
				position: 'absolute',
				left: 30,
				top: 380,
				width: 370,
				padding: '26px 30px 28px',
				borderRadius: 24,
				background: 'rgba(237,236,227,0.96)',
				boxShadow: '0 18px 44px rgba(41,41,41,0.28)',
			}}
		>
			<div style={{fontFamily: sans, fontWeight: 700, fontSize: 21, letterSpacing: '0.24em', textTransform: 'uppercase', color: GOLD}}>Little builders</div>
			<div style={{marginTop: 10, fontFamily: display, fontSize: 60, lineHeight: 1.04, color: CHARCOAL, whiteSpace: 'nowrap'}}>
				Strong
				<br />
				little
				<br />
				<span style={{color: BRONZE}}>princess.</span>
			</div>
			<div style={{marginTop: 14, fontFamily: sans, fontWeight: 700, fontSize: 24, lineHeight: 1.4, color: 'rgba(41,41,41,0.7)'}}>
				Here, princesses build
				<br />
				their own castles,
				<br />
				brick by brick.
			</div>
			<Img src={staticFile('reel/brand/logo-dark.png')} style={{marginTop: 16, width: 140}} />
		</div>
	</AbsoluteFill>
);
