import {Composition, Still} from 'remotion';
import {LaserTagSpot, SPOT_DURATION} from './LaserTagSpot';
import {LaserTagSpotVertical, VERTICAL_SIZE} from './LaserTagSpotVertical';
import {HalloweenReel, REEL_DURATION as HALLOWEEN_DURATION} from './halloween/Main';
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
