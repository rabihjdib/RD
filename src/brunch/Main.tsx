import {BeatReel, beatReelDuration} from '../beat/BeatReel';
import {BRUNCH} from './data';

/** Brunch & salad bar reel; the edit lives in data.ts, the montage in ../beat/BeatReel. */
export const BRUNCH_DURATION = beatReelDuration(BRUNCH);
export const BrunchReel: React.FC = () => <BeatReel config={BRUNCH} />;
