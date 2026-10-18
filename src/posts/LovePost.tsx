import {AbsoluteFill, Img, staticFile} from 'remotion';
import {BRONZE, CHARCOAL, display, GOLD, sans} from '../brand';
import {POST_H, POST_W} from './SparkPost';

/**
 * Instagram feed post (1080x1350, 4:5): the brand promise over a mother-and-daughter
 * moment. The message sits on the plain panelled wall above them; the white logo sits
 * on her black dress in the bottom corner.
 *
 * Photo: public/posts/love.jpg. Render: npm run post:love
 */

export const LovePost: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: '#edece3'}}>
		<Img src={staticFile('posts/love.jpg')} style={{width: POST_W, height: POST_H, objectFit: 'cover', objectPosition: '50% 0%'}} />

		{/* Soft cream at the top so the type sits on an even ground. */}
		<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(237,236,227,0.88) 0px, rgba(237,236,227,0.7) 200px, rgba(237,236,227,0) 330px)'}} />

		<div style={{position: 'absolute', left: 0, right: 0, top: 64, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
			<div style={{fontFamily: sans, fontWeight: 700, fontSize: 24, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD}}>Built by moms, for moms</div>
			<div style={{marginTop: 18, fontFamily: display, fontSize: 82, lineHeight: 1.04, color: CHARCOAL, whiteSpace: 'nowrap'}}>
				Your kids are <span style={{color: BRONZE}}>our kids</span>.
			</div>
			<div style={{marginTop: 16, fontFamily: sans, fontWeight: 700, fontSize: 30, color: 'rgba(41,41,41,0.72)'}}>A place full of love and care.</div>
		</div>

		<Img src={staticFile('reel/brand/logo-white.png')} style={{position: 'absolute', right: 160, bottom: 64, width: 210}} />
	</AbsoluteFill>
);
