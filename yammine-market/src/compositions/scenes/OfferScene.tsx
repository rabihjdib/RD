import React from 'react';
import {AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FloatingBadge} from '../../components/Badges';
import {CategoryChip, Logo} from '../../components/Brand';
import {BrushStroke} from '../../components/BrushStroke';
import {Footage} from '../../components/Footage';
import {GrungeBand, GrungeTexture} from '../../components/Grunge';
import {SlideLine} from '../../components/KineticText';
import {LightLeak} from '../../components/Transitions';
import {C} from '../../theme';
import type {VariantProps} from '../../types';
import {shake} from './shake';

const LEAK = 16;
const HEADLINE_SIZE = 150;

/** Splits the scene evenly across the offer clips. */
export const clipSpans = (count: number, total: number) => {
	const each = Math.floor(total / count);
	return Array.from({length: count}, (_, i) => ({from: i * each, duration: i === count - 1 ? total - i * each : each}));
};

/** Scene 2 (3-8 s): "OUR WEEKLY DEALS IN-STORE" over aisle footage, with floating deal badges. */
export const OfferScene: React.FC<{v: VariantProps}> = ({v}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();
	const urgent = v.energy === 'urgent';
	const spans = clipSpans(v.clips.offer.length, durationInFrames);
	const lineDelay = (i: number) => 8 + i * (urgent ? 6 : 9);
	const lastLine = v.headline.length - 1;
	const underline = spring({frame, fps, delay: lineDelay(lastLine) + 8, config: {damping: 20, stiffness: 150}});
	// A small kick on the big red line's landing.
	const redIndex = v.headline.findIndex((l) => l.color === 'red');
	const [dx, dy] = shake(frame, lineDelay(redIndex) + 6, urgent ? 18 : 8);
	return (
		<AbsoluteFill>
			{spans.map((s, i) => (
				<Sequence key={i} from={s.from} durationInFrames={s.duration}>
					<Footage clip={v.clips.offer[i]} />
				</Sequence>
			))}
			{spans.slice(1).map((s, i) => (
				<Sequence key={`leak-${i}`} from={s.from - LEAK / 2} durationInFrames={LEAK}>
					<LightLeak />
				</Sequence>
			))}
			<AbsoluteFill
				style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(18,18,18,0.6) 62%, rgba(18,18,18,0.92) 100%)'}}
			/>
			<GrungeBand edge="top" height={300} />
			<AbsoluteFill style={{alignItems: 'center', paddingTop: 50}}>
				<Logo width={420} delay={0} />
				<div style={{marginTop: 34}}>
					<CategoryChip text={v.category} delay={10} />
				</div>
			</AbsoluteFill>
			{v.badges.map((b, i) => (
				<FloatingBadge key={i} badge={b} urgent={urgent} />
			))}
			<AbsoluteFill
				style={{
					alignItems: 'center',
					justifyContent: 'flex-end',
					paddingBottom: 380,
					transform: `translate(${dx}px, ${dy}px)`,
				}}
			>
				{v.headline.map((line, i) => (
					<SlideLine
						key={i}
						text={line.text}
						size={HEADLINE_SIZE * (line.scale ?? 1)}
						delay={lineDelay(i)}
						from={i % 2 ? 'right' : 'left'}
						color={line.color === 'red' ? C.red : C.white}
						outline={line.color === 'red'}
					/>
				))}
				<div style={{marginTop: 6, transform: 'rotate(-2deg)'}}>
					<BrushStroke width={620} height={46} seed="offer-underline" progress={underline} />
				</div>
			</AbsoluteFill>
			<GrungeTexture opacity={0.25} />
		</AbsoluteFill>
	);
};
