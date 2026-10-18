import {AbsoluteFill, Img, staticFile} from 'remotion';
import {BRONZE, CHARCOAL, display, GOLD, sans} from '../brand';
import {POST_H, POST_W} from './SparkPost';

/**
 * Instagram feed post (1080x1350, 4:5): a boy holding the smiley he built at the wood
 * workshop, so two smiles: happy result, priceless smile. The card sits top left and
 * also covers the girl in the background, who is only a bystander in this shot.
 *
 * Photo: public/posts/smile.jpg. Render: npm run post:smile
 */

export const SmilePost: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: '#edece3'}}>
		<Img src={staticFile('posts/smile.jpg')} style={{width: POST_W, height: POST_H, objectFit: 'cover', objectPosition: '50% 0%'}} />

		<div
			style={{
				position: 'absolute',
				left: 40,
				top: 40,
				width: 470,
				padding: '26px 32px 28px',
				borderRadius: 24,
				background: 'rgba(237,236,227,0.96)',
				boxShadow: '0 18px 44px rgba(41,41,41,0.28)',
			}}
		>
			<div style={{fontFamily: sans, fontWeight: 700, fontSize: 21, letterSpacing: '0.24em', textTransform: 'uppercase', color: GOLD}}>After the workshop</div>
			<div style={{marginTop: 10, fontFamily: display, fontSize: 60, lineHeight: 1.04, color: CHARCOAL, whiteSpace: 'nowrap'}}>
				Happy result.
				<br />
				<span style={{color: BRONZE}}>Priceless smile.</span>
			</div>
			<div style={{marginTop: 14, fontFamily: sans, fontWeight: 700, fontSize: 24, lineHeight: 1.4, color: 'rgba(41,41,41,0.7)'}}>
				Built with his own hands
				<br />
				at our wood workshop.
			</div>
			<Img src={staticFile('reel/brand/logo-dark.png')} style={{marginTop: 16, width: 140}} />
		</div>
	</AbsoluteFill>
);
