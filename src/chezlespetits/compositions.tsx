import {Still} from 'remotion';
import {AdVisual} from './AdVisual';
import {ADS, FORMATS} from './data';
import {LogoAsset} from './LogoAsset';

// Registers every ad in every format as its own Still, e.g. "CLP-S3-toddler-car-seats-m-3x4".
export const ChezLesPetitsStills: React.FC = () => (
	<>
		<Still id="CLP-logo-1x1" component={LogoAsset} defaultProps={{logoWidth: 1000}} width={1200} height={1200} />
		<Still id="CLP-logo-4x1" component={LogoAsset} defaultProps={{logoWidth: 560}} width={1200} height={300} />
		{ADS.flatMap((ad) =>
			(Object.keys(FORMATS) as (keyof typeof FORMATS)[]).map((key) => {
				const format = FORMATS[key];
				return (
					<Still
						key={`${ad.id}-${format.id}`}
						id={`CLP-${ad.id}-${format.id}`}
						component={AdVisual}
						defaultProps={{ad, format, formatKey: key}}
						width={format.width}
						height={format.height}
					/>
				);
			}),
		)}
	</>
);
