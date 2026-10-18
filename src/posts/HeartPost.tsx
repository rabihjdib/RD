import {AbsoluteFill, Img, staticFile} from 'remotion';
import {CHARCOAL, display, GOLD, sans} from '../brand';
import {POST_H, POST_W} from './SparkPost';

/**
 * Instagram feed post (1080x1350, 4:5): her shirt reads "WE ♥ ROAD TRIPS", so the
 * post answers it underneath, "And we ♥ Luciole", with a heart in the shirt's red.
 *
 * The panel sits flush along the bottom on purpose: it covers the paper with her name
 * on it, so the post doesn't carry a child's name.
 *
 * Photo: public/posts/heart.jpg. Render: npm run post:heart
 */

const SHIRT_RED = '#a3192b';

const Heart: React.FC<{size: number}> = ({size}) => (
	<svg width={size} height={size * 0.9} viewBox="0 0 100 90" style={{display: 'inline-block', verticalAlign: '-0.08em', margin: '0 0.18em'}}>
		<path d="M50 88 C 20 66, 0 48, 0 26 C 0 11, 11 0, 26 0 C 37 0, 45 6, 50 15 C 55 6, 63 0, 74 0 C 89 0, 100 11, 100 26 C 100 48, 80 66, 50 88 Z" fill={SHIRT_RED} />
	</svg>
);

export const HeartPost: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: '#edece3'}}>
		<Img src={staticFile('posts/heart.jpg')} style={{width: POST_W, height: POST_H, objectFit: 'cover', objectPosition: '50% 0%'}} />

		<div
			style={{
				position: 'absolute',
				left: 0,
				right: 0,
				bottom: 0,
				height: 250,
				borderRadius: '40px 40px 0 0',
				background: '#edece3',
				boxShadow: '0 -14px 40px rgba(41,41,41,0.22)',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 8,
			}}
		>
			<div style={{fontFamily: sans, fontWeight: 700, fontSize: 22, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD}}>Spotted at the atelier</div>
			<div style={{fontFamily: display, fontSize: 96, lineHeight: 1.05, color: CHARCOAL, whiteSpace: 'nowrap'}}>
				And we
				<Heart size={84} />
				Luciole
			</div>
			<div style={{fontFamily: sans, fontWeight: 700, fontSize: 24, color: 'rgba(41,41,41,0.65)'}}>Ages 3 to 12 · Jounieh Souks</div>
		</div>
	</AbsoluteFill>
);
