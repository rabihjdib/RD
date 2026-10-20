import {AbsoluteFill} from 'remotion';
import {Logo} from './Cloud';

/** Google Ads logo assets: square 1200x1200 and landscape 1200x300, logo on plain white. */
export const LogoAsset: React.FC<{logoWidth: number}> = ({logoWidth}) => (
	<AbsoluteFill style={{backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center'}}>
		<Logo width={logoWidth} />
	</AbsoluteFill>
);
