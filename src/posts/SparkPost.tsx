import {AbsoluteFill, Img, staticFile} from 'remotion';
import {CHARCOAL, display, GOLD, sans} from '../brand';

/**
 * Instagram feed post (1080x1350, 4:5): an original quote on the child of the future,
 * set over the soft window side of a portrait taken in the atelier. The quote plays on
 * the name: a luciole is a firefly, a small spark of light.
 *
 * Photo: public/posts/spark-girl.jpg. Render: npm run post:spark
 */

export const POST_W = 1080;
export const POST_H = 1350;

export const SparkPost: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: '#edece3'}}>
		<Img src={staticFile('posts/spark-girl.jpg')} style={{width: POST_W, height: POST_H, objectFit: 'cover', objectPosition: '50% 40%'}} />

		{/* Cream wash over the blurred window side so the type reads; it fades out before her face. */}
		<AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(237,236,227,0.92) 0px, rgba(237,236,227,0.82) 360px, rgba(237,236,227,0.35) 560px, rgba(237,236,227,0) 680px)'}} />

		<div style={{position: 'absolute', left: 80, top: 150, width: 520}}>
			<div style={{fontFamily: sans, fontWeight: 700, fontSize: 22, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD}}>The child of the future</div>
			<div style={{marginTop: 26, fontFamily: display, fontSize: 80, lineHeight: 1.04, color: CHARCOAL}}>
				Every child
				<br />
				carries a
				<br />
				<span style={{position: 'relative', color: GOLD}}>
					spark
					{/* The firefly: a glowing dot just above the word. */}
					<span
						style={{
							position: 'absolute',
							right: -34,
							top: 2,
							width: 16,
							height: 16,
							borderRadius: 8,
							background: '#f6ebd6',
							boxShadow: '0 0 14px 6px rgba(214,178,122,0.9), 0 0 44px 18px rgba(183,144,93,0.45)',
						}}
					/>
				</span>
				<br />
				of the future.
			</div>
			<div style={{marginTop: 30, fontFamily: sans, fontWeight: 700, fontSize: 30, lineHeight: 1.4, color: 'rgba(41,41,41,0.75)'}}>
				Our job is to give it
				<br />
				room to shine.
			</div>
		</div>

		<div style={{position: 'absolute', left: 80, bottom: 80, display: 'flex', flexDirection: 'column', gap: 12}}>
			<Img src={staticFile('reel/brand/logo-dark.png')} style={{width: 220}} />
			<span style={{fontFamily: display, fontSize: 30, color: CHARCOAL}}>They create. You pause &amp; connect.</span>
		</div>
	</AbsoluteFill>
);
