import {AbsoluteFill, Img, staticFile} from 'remotion';
import {BRONZE, CHARCOAL, display, GOLD, sans} from '../brand';
import {POST_H, POST_W} from './SparkPost';

/**
 * Instagram feed post (1080x1350, 4:5): a beaming boy holding the letter A he made in
 * nails and string at the wood workshop. The card sits top left, clear of his face, and
 * also covers the printed web address on a bystander's T-shirt.
 *
 * Photo: public/posts/creator.jpg. Render: npm run post:creator
 */

export const CreatorPost: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: '#edece3'}}>
		<Img src={staticFile('posts/creator.jpg')} style={{width: POST_W, height: POST_H, objectFit: 'cover', objectPosition: '50% 50%'}} />

		<div
			style={{
				position: 'absolute',
				left: 24,
				top: 24,
				width: 320,
				padding: '26px 30px 28px',
				borderRadius: 24,
				background: 'rgba(237,236,227,0.96)',
				boxShadow: '0 18px 44px rgba(41,41,41,0.28)',
			}}
		>
			<div style={{fontFamily: sans, fontWeight: 700, fontSize: 21, letterSpacing: '0.24em', textTransform: 'uppercase', color: GOLD}}>Wood workshop</div>
			<div style={{marginTop: 10, fontFamily: display, fontSize: 60, lineHeight: 1.04, color: CHARCOAL, whiteSpace: 'nowrap'}}>
				Happy
				<br />
				<span style={{color: BRONZE}}>creator.</span>
			</div>
			<div style={{marginTop: 14, fontFamily: sans, fontWeight: 700, fontSize: 24, lineHeight: 1.4, color: 'rgba(41,41,41,0.7)'}}>
				A is for amazing.
				<br />
				Hammered, strung
				<br />
				and made with love.
			</div>
			<Img src={staticFile('reel/brand/logo-dark.png')} style={{marginTop: 16, width: 140}} />
		</div>
	</AbsoluteFill>
);
