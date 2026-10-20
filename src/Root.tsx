import {Composition, Still} from 'remotion';
import {LaserTagSpot, SPOT_DURATION} from './LaserTagSpot';
import {LaserTagSpotVertical, VERTICAL_SIZE} from './LaserTagSpotVertical';
import {AtelierCover} from './atelier/Cover';
import {ATELIER_DURATION, AtelierTour} from './atelier/Main';
import {BirthdayCover} from './birthday/Cover';
import {BRUNCH_DURATION, BrunchReel} from './brunch/Main';
import {CAFE_DURATION, CafeReel} from './cafe/Main';
import {OPENING_DURATION, OpeningReel} from './opening/Main';
import {BirthdayReel, REEL_DURATION as BIRTHDAY_DURATION} from './birthday/Main';
import {BrandCover} from './covers/BrandCover';
import {COVERS} from './covers/specs';
import {HalloweenCover} from './halloween/Cover';
import {HalloweenReel, REEL_DURATION as HALLOWEEN_DURATION} from './halloween/Main';
import {LucioleCover} from './reel/Cover';
import {LucioleReel, REEL_DURATION} from './reel/Main';
import {FPS, HEIGHT, WIDTH} from './reel/data';
import {TourCover} from './tour/Cover';

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
		<Composition id="HalloweenReel" component={HalloweenReel} durationInFrames={HALLOWEEN_DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
		<Still id="HalloweenCover" component={HalloweenCover} width={WIDTH} height={HEIGHT} />
		<Composition id="BirthdayReel" component={BirthdayReel} durationInFrames={BIRTHDAY_DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
		<Still id="BirthdayCover" component={BirthdayCover} width={WIDTH} height={HEIGHT} />
		<Composition id="AtelierTour" component={AtelierTour} durationInFrames={ATELIER_DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
		<Still id="AtelierCover" component={AtelierCover} width={WIDTH} height={HEIGHT} />
		<Composition id="BrunchReel" component={BrunchReel} durationInFrames={BRUNCH_DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
		<Composition id="CafeReel" component={CafeReel} durationInFrames={CAFE_DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
		<Composition id="OpeningReel" component={OpeningReel} durationInFrames={OPENING_DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
		<Still id="TourCover" component={TourCover} width={WIDTH} height={HEIGHT} />
		{COVERS.map((spec) => (
			<Still key={spec.id} id={spec.id} component={BrandCover} defaultProps={{spec}} width={WIDTH} height={HEIGHT} />
		))}
	</>
);
