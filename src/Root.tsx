import {Composition} from 'remotion';
import {LaserTagSpot, SPOT_DURATION} from './LaserTagSpot';
import {LaserTagSpotVertical, VERTICAL_SIZE} from './LaserTagSpotVertical';

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
	</>
);
