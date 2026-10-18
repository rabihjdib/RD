import {AbsoluteFill, Img, staticFile} from 'remotion';
import {BRONZE, CHARCOAL, display, GOLD, sans} from '../brand';
import {POST_H, POST_W} from './SparkPost';

/**
 * Instagram feed post (1080x1350, 4:5): her shirt reads "JUST PRETENDING I KNOW WHAT
 * I'M DOING", so the post answers it on the plain wall beside her: just pretending?
 * No need, we show you what to do and how.
 *
 * Photo: public/posts/pretend.jpg. Render: npm run post:pretend
 */

export const PretendPost: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: '#edece3'}}>
		<Img src={staticFile('posts/pretend.jpg')} style={{width: POST_W, height: POST_H, objectFit: 'cover', objectPosition: '50% 0%'}} />

		{/* A light wash to even out the wall behind the type; it stops above the table. */}
		<AbsoluteFill
			style={{
				background: 'linear-gradient(90deg, rgba(237,236,227,0.55) 0px, rgba(237,236,227,0.45) 380px, rgba(237,236,227,0) 500px)',
				maskImage: 'linear-gradient(180deg, #000 520px, transparent 720px)',
			}}
		/>

		<div style={{position: 'absolute', left: 110, top: 70, width: 350}}>
			<div style={{fontFamily: sans, fontWeight: 700, fontSize: 22, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD}}>L'Atelier</div>
			<div style={{marginTop: 16, fontFamily: display, fontSize: 60, lineHeight: 1.06, color: CHARCOAL, whiteSpace: 'nowrap'}}>
				Just
				<br />
				pretending?
				<br />
				<span style={{color: BRONZE}}>No need.</span>
			</div>
			<div style={{marginTop: 20, fontFamily: sans, fontWeight: 700, fontSize: 26, lineHeight: 1.45, color: 'rgba(41,41,41,0.72)'}}>
				At Luciole, we show you
				<br />
				what to do, and how
				<br />
				to do it.
			</div>
			<Img src={staticFile('reel/brand/logo-dark.png')} style={{marginTop: 30, width: 180}} />
		</div>
	</AbsoluteFill>
);
