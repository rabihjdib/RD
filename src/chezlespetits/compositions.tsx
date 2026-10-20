import {Still} from 'remotion';
import {AdVisual} from './AdVisual';
import {ADS, FORMATS} from './data';

// Registers every ad in every format as its own Still, e.g. "CLP-S3-toddler-car-seats-m-3x4".
export const ChezLesPetitsStills: React.FC = () => (
	<>
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
