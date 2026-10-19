import {AbsoluteFill, Img, staticFile} from 'remotion';
import {CHARCOAL, GOLD, sans} from '../brand';
import {CreatorPost} from '../posts/CreatorPost';
import {HeartPost} from '../posts/HeartPost';
import {LovePost} from '../posts/LovePost';
import {MomDiscoverPost} from '../posts/MomDiscoverPost';
import {PretendPost} from '../posts/PretendPost';
import {PrincessPost} from '../posts/PrincessPost';
import {QuotePost} from '../posts/QuotePosts';
import {SmilePost} from '../posts/SmilePost';
import {POST_H, POST_W, SparkPost} from '../posts/SparkPost';
import {WatchPost} from '../posts/WatchPost';

/**
 * Instagram Stories (1080x1920, 9:16) made from the feed posts. Each post sits as a
 * rounded card inside the Story safe zone, over a blurred, enlarged copy of itself,
 * with a booking pill underneath. Using the finished post keeps every crop and every
 * card that covers names or other families' branding exactly as approved.
 *
 * Render: npm run stories:posts
 */

export const STORY_W = 1080;
export const STORY_H = 1920;

type PostEntry = {id: string; file: string; Post: React.FC<{index: number}>; index?: number};

const asIndexed = (C: React.FC) => C as unknown as React.FC<{index: number}>;

export const STORY_POSTS: PostEntry[] = [
	{id: 'Spark', file: 'spark-of-the-future', Post: asIndexed(SparkPost)},
	{id: 'Quote1', file: 'quote-1', Post: QuotePost, index: 0},
	{id: 'Quote2', file: 'quote-2', Post: QuotePost, index: 1},
	{id: 'Quote3', file: 'quote-3', Post: QuotePost, index: 2},
	{id: 'Quote4', file: 'quote-4', Post: QuotePost, index: 3},
	{id: 'Love', file: 'your-kids-are-our-kids', Post: asIndexed(LovePost)},
	{id: 'Heart', file: 'and-we-love-luciole', Post: asIndexed(HeartPost)},
	{id: 'Pretend', file: 'no-need-to-pretend', Post: asIndexed(PretendPost)},
	{id: 'MomDiscover', file: 'moms-love-to-discover', Post: asIndexed(MomDiscoverPost)},
	{id: 'Smile', file: 'priceless-smile', Post: asIndexed(SmilePost)},
	{id: 'Watch', file: 'eyes-on-them', Post: asIndexed(WatchPost)},
	{id: 'Princess', file: 'strong-little-princess', Post: asIndexed(PrincessPost)},
	{id: 'Creator', file: 'happy-creator', Post: asIndexed(CreatorPost)},
];

// The post card: 90% size, clear of the profile bar at the top and the reply bar below.
const CARD_SCALE = 0.9;
const CARD_W = POST_W * CARD_SCALE;
const CARD_H = POST_H * CARD_SCALE;
const CARD_X = (STORY_W - CARD_W) / 2;
const CARD_Y = 250;

// The blurred backdrop fills the full height.
const BG_SCALE = STORY_H / POST_H;

export const PostStory: React.FC<{post: number}> = ({post}) => {
	const {Post, index = 0} = STORY_POSTS[post];
	return (
		<AbsoluteFill style={{backgroundColor: '#edece3', overflow: 'hidden'}}>
			<div
				style={{
					position: 'absolute',
					left: (STORY_W - POST_W * BG_SCALE) / 2,
					top: 0,
					width: POST_W,
					height: POST_H,
					transform: `scale(${BG_SCALE})`,
					transformOrigin: 'top left',
					filter: 'blur(28px)',
				}}
			>
				<Post index={index} />
			</div>
			<AbsoluteFill style={{background: 'rgba(41,41,41,0.28)'}} />

			<div
				style={{
					position: 'absolute',
					left: CARD_X,
					top: CARD_Y,
					width: CARD_W,
					height: CARD_H,
					borderRadius: 32,
					overflow: 'hidden',
					boxShadow: '0 30px 70px rgba(0,0,0,0.4)',
				}}
			>
				<div style={{width: POST_W, height: POST_H, transform: `scale(${CARD_SCALE})`, transformOrigin: 'top left'}}>
					<Post index={index} />
				</div>
			</div>

			<div style={{position: 'absolute', left: 0, right: 0, top: CARD_Y + CARD_H + 60, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 24,
						padding: '20px 40px',
						borderRadius: 999,
						background: '#edece3',
						boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
					}}
				>
					<Img src={staticFile('reel/brand/logo-dark.png')} style={{width: 130}} />
					<span style={{width: 2, height: 40, background: 'rgba(41,41,41,0.2)'}} />
					<span style={{fontFamily: sans, fontWeight: 700, fontSize: 30, color: CHARCOAL}}>Book on WhatsApp · 81 540 282</span>
				</div>
				<div style={{marginTop: 22, fontFamily: sans, fontWeight: 700, fontSize: 22, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.5)'}}>
					<span style={{color: GOLD}}>✦</span> Jounieh Souks <span style={{color: GOLD}}>✦</span>
				</div>
			</div>
		</AbsoluteFill>
	);
};
