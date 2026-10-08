import {Composition, Still} from 'remotion';
import {LaserTagSpot, SPOT_DURATION} from './LaserTagSpot';
import {LaserTagSpotVertical, VERTICAL_SIZE} from './LaserTagSpotVertical';
import {LucioleCover} from './reel/Cover';
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
	</>
);
