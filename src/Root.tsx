import {Composition} from 'remotion';
import {LaserTagSpot, SPOT_DURATION} from './LaserTagSpot';

export const RemotionRoot: React.FC = () => (
	<Composition
		id="LaserTagSpot"
		component={LaserTagSpot}
		durationInFrames={SPOT_DURATION}
		fps={30}
		width={1920}
		height={1080}
	/>
);
