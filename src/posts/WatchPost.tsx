import {AbsoluteFill, Img, staticFile} from 'remotion';
import {BRONZE, CHARCOAL, display, GOLD, sans} from '../brand';
import {POST_H, POST_W} from './SparkPost';

/**
 * Instagram feed post (1080x1350, 4:5): a team member keeping watch while a girl plays.
 * Worded "every moment" rather than "around the clock", since Luciole keeps opening
 * hours. The card sits bottom right over the table, which also covers the placemats
 * printed with another family's party name.
 *
 * Photo: public/posts/watch.jpg. Render: npm run post:watch
 */

export const WatchPost: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: '#edece3'}}>
		<Img src={staticFile('posts/watch.jpg')} style={{width: POST_W, height: POST_H, objectFit: 'cover', objectPosition: '50% 50%'}} />

		<div
			style={{
				position: 'absolute',
				right: 0,
				bottom: 0,
				width: 580,
				padding: '30px 40px 44px',
				borderRadius: '28px 0 0 0',
				background: '#edece3',
				boxShadow: '0 18px 44px rgba(41,41,41,0.3)',
			}}
		>
			<div style={{fontFamily: sans, fontWeight: 700, fontSize: 21, letterSpacing: '0.24em', textTransform: 'uppercase', color: GOLD}}>Our team</div>
			<div style={{marginTop: 10, fontFamily: display, fontSize: 60, lineHeight: 1.04, color: CHARCOAL, whiteSpace: 'nowrap'}}>
				Eyes on them,
				<br />
				<span style={{color: BRONZE}}>every moment.</span>
			</div>
			<div style={{marginTop: 14, fontFamily: sans, fontWeight: 700, fontSize: 24, lineHeight: 1.4, color: 'rgba(41,41,41,0.7)'}}>
				Our trained team watches over
				<br />
				your kids from drop-off to pick-up.
			</div>
			<Img src={staticFile('reel/brand/logo-dark.png')} style={{marginTop: 16, width: 140}} />
		</div>
	</AbsoluteFill>
);
