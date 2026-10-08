import React from 'react';
import {Composition} from 'remotion';
import {WeeklyDeals} from './compositions/WeeklyDeals';
import {variants} from './data/variants';
import {DURATION, FPS, HEIGHT, WIDTH} from './theme';

// One composition per campaign variant. Props are editable live in the Studio sidebar.
export const RemotionRoot: React.FC = () => (
	<>
		{variants.map(({id, props}) => (
			<Composition
				key={id}
				id={id}
				component={WeeklyDeals}
				durationInFrames={DURATION}
				fps={FPS}
				width={WIDTH}
				height={HEIGHT}
				defaultProps={props}
			/>
		))}
	</>
);
