import {BeatReel, beatReelDuration} from '../beat/BeatReel';
import {CAFE} from './data';

/** Café tour reel; the edit lives in data.ts, the montage in ../beat/BeatReel. */
export const CAFE_DURATION = beatReelDuration(CAFE);
export const CafeReel: React.FC = () => <BeatReel config={CAFE} />;
