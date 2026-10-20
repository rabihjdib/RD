import {BeatReel, beatReelDuration} from '../beat/BeatReel';
import {OPENING} from './data';

/** "We're officially open" reel; the edit lives in data.ts, the montage in ../beat/BeatReel. */
export const OPENING_DURATION = beatReelDuration(OPENING);
export const OpeningReel: React.FC = () => <BeatReel config={OPENING} />;
