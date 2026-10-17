import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {BrushWipe} from '../components/Transitions';
import {SCENES, WIPE} from '../theme';
import type {VariantProps} from '../types';
import {FeatureScene} from './scenes/FeatureScene';
import {IntroScene} from './scenes/IntroScene';
import {OfferScene} from './scenes/OfferScene';
import {OutroScene} from './scenes/OutroScene';

const CUTS = [SCENES.offer.from, SCENES.feature.from, SCENES.outro.from];

/** The 15 s weekly deals spot. Everything that differs between variants comes in through props. */
export const WeeklyDeals: React.FC<VariantProps> = (v) => (
	<AbsoluteFill style={{backgroundColor: '#000'}}>
		<Sequence durationInFrames={SCENES.intro.duration} name="1 Intro">
			<IntroScene v={v} />
		</Sequence>
		<Sequence from={SCENES.offer.from} durationInFrames={SCENES.offer.duration} name="2 Offer">
			<OfferScene v={v} />
		</Sequence>
		<Sequence from={SCENES.feature.from} durationInFrames={SCENES.feature.duration} name="3 Feature">
			<FeatureScene v={v} />
		</Sequence>
		<Sequence from={SCENES.outro.from} durationInFrames={SCENES.outro.duration} name="4 Outro">
			<OutroScene v={v} />
		</Sequence>

		{CUTS.map((cut) => (
			<Sequence key={cut} from={cut - WIPE / 2} durationInFrames={WIPE} name="Brush wipe">
				<BrushWipe />
			</Sequence>
		))}

		<Audio src={staticFile(v.music)} volume={0.9} />
		{CUTS.map((cut) => (
			<Sequence key={`whoosh-${cut}`} from={cut - WIPE / 2 - 2} durationInFrames={20}>
				<Audio src={staticFile('audio/whoosh.wav')} volume={0.55} />
			</Sequence>
		))}
		{v.badges.map((b, i) => (
			<Sequence key={`pop-${i}`} from={SCENES.offer.from + b.delay} durationInFrames={8}>
				<Audio src={staticFile('audio/pop.wav')} volume={0.45} />
			</Sequence>
		))}
		<Sequence from={SCENES.feature.from + 4} durationInFrames={8}>
			<Audio src={staticFile('audio/pop.wav')} volume={0.6} />
		</Sequence>
	</AbsoluteFill>
);
