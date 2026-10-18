import {Composition, Still} from 'remotion';
import {AtelierPanorama, AtelierSlide, SLIDE_H, SLIDE_W, SLIDES} from './carousel/AtelierCarousel';
import {UMBRELLA_SLIDES, UmbrellaPanorama, UmbrellaSlide} from './carousel/UmbrellaCarousel';
import {BUILD_SLIDES, BuildPanorama, BuildSlide} from './carousel/BuildCarousel';
import {TEAM_SLIDES, TeamPanorama, TeamSlide} from './carousel/TeamCarousel';
import {PROUD_SLIDES, ProudPanorama, ProudSlide} from './carousel/ProudCarousel';
import {LaserTagSpot, SPOT_DURATION} from './LaserTagSpot';
import {LaserTagSpotVertical, VERTICAL_SIZE} from './LaserTagSpotVertical';
import {HalloweenReel, REEL_DURATION as HALLOWEEN_DURATION} from './halloween/Main';
import {HeartPost} from './posts/HeartPost';
import {LovePost} from './posts/LovePost';
import {QUOTES, QuotePost} from './posts/QuotePosts';
import {POST_H, POST_W, SparkPost} from './posts/SparkPost';
import {BirthdayCover} from './reel/BirthdayCover';
import {LucioleCover} from './reel/Cover';
import {COVER_SERIES, ReelCover} from './reel/ReelCovers';
import {LucioleReel, REEL_DURATION} from './reel/Main';
import {FPS, HEIGHT, WIDTH} from './reel/data';

export const RemotionRoot: React.FC = () => (
	<>
		<Composition
			id="LaserTagSpot"
			component={LaserTagSpot}
			durationInFrames={SPOT_DURATION}
			fps={30}
			width={1920}
			height={1080}
		/>
		<Composition
			id="LaserTagSpotVertical"
			component={LaserTagSpotVertical}
			durationInFrames={SPOT_DURATION}
			fps={30}
			{...VERTICAL_SIZE}
		/>
		<Composition id="LucioleReel" component={LucioleReel} durationInFrames={REEL_DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
		<Still id="LucioleCover" component={LucioleCover} width={WIDTH} height={HEIGHT} />
		<Still id="LucioleBirthdayCover" component={BirthdayCover} width={WIDTH} height={HEIGHT} />
		<Still id="AtelierCarousel" component={AtelierPanorama} width={SLIDE_W * SLIDES} height={SLIDE_H} />
		{Array.from({length: SLIDES}, (_, i) => (
			<Still key={i} id={`AtelierSlide${i + 1}`} component={AtelierSlide} defaultProps={{index: i}} width={SLIDE_W} height={SLIDE_H} />
		))}
		<Still id="SparkPost" component={SparkPost} width={POST_W} height={POST_H} />
		<Still id="LovePost" component={LovePost} width={POST_W} height={POST_H} />
		<Still id="HeartPost" component={HeartPost} width={POST_W} height={POST_H} />
		{QUOTES.map((_, i) => (
			<Still key={i} id={`QuotePost${i + 1}`} component={QuotePost} defaultProps={{index: i}} width={POST_W} height={POST_H} />
		))}
		<Still id="UmbrellaCarousel" component={UmbrellaPanorama} width={SLIDE_W * UMBRELLA_SLIDES} height={SLIDE_H} />
		{Array.from({length: UMBRELLA_SLIDES}, (_, i) => (
			<Still key={i} id={`UmbrellaSlide${i + 1}`} component={UmbrellaSlide} defaultProps={{index: i}} width={SLIDE_W} height={SLIDE_H} />
		))}
		<Still id="BuildCarousel" component={BuildPanorama} width={SLIDE_W * BUILD_SLIDES} height={SLIDE_H} />
		{Array.from({length: BUILD_SLIDES}, (_, i) => (
			<Still key={i} id={`BuildSlide${i + 1}`} component={BuildSlide} defaultProps={{index: i}} width={SLIDE_W} height={SLIDE_H} />
		))}
		<Still id="TeamCarousel" component={TeamPanorama} width={SLIDE_W * TEAM_SLIDES} height={SLIDE_H} />
		{Array.from({length: TEAM_SLIDES}, (_, i) => (
			<Still key={i} id={`TeamSlide${i + 1}`} component={TeamSlide} defaultProps={{index: i}} width={SLIDE_W} height={SLIDE_H} />
		))}
		<Still id="ProudCarousel" component={ProudPanorama} width={SLIDE_W * PROUD_SLIDES} height={SLIDE_H} />
		{Array.from({length: PROUD_SLIDES}, (_, i) => (
			<Still key={i} id={`ProudSlide${i + 1}`} component={ProudSlide} defaultProps={{index: i}} width={SLIDE_W} height={SLIDE_H} />
		))}
		{COVER_SERIES.flatMap(({prefix, covers}) =>
			covers.map((cover) => (
				<Still
					key={`${prefix}${cover.n}`}
					id={`${prefix}${String(cover.n).padStart(2, '0')}`}
					component={ReelCover}
					defaultProps={cover}
					width={WIDTH}
					height={HEIGHT}
				/>
			)),
		)}
		<Composition id="HalloweenReel" component={HalloweenReel} durationInFrames={HALLOWEEN_DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
	</>
);
