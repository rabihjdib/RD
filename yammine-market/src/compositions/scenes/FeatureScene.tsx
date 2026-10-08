import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {StarBurst} from '../../components/Badges';
import {BrushBanner, CategoryChip, Logo, Ticker} from '../../components/Brand';
import {Footage} from '../../components/Footage';
import {GrungeBand, GrungeTexture} from '../../components/Grunge';
import {PopLetters} from '../../components/KineticText';
import {Flash} from '../../components/Transitions';
import {BEAT, C, display} from '../../theme';
import type {VariantProps} from '../../types';

const BADGE = 430;

/** Rotating red light rays behind the pulsing badge. */
const Rays: React.FC<{size: number; spin: number; opacity: number}> = ({size, spin, opacity}) => (
	<svg width={size} height={size} viewBox="-50 -50 100 100" style={{position: 'absolute', transform: `rotate(${spin}deg)`, opacity}}>
		<defs>
			<radialGradient id="ray-fade">
				<stop offset="0.2" stopColor={C.red} stopOpacity="0.9" />
				<stop offset="1" stopColor={C.red} stopOpacity="0" />
			</radialGradient>
		</defs>
		{Array.from({length: 12}, (_, i) => (
			<polygon key={i} points="0,0 -4,-50 4,-50" fill="url(#ray-fade)" transform={`rotate(${i * 30})`} />
		))}
	</svg>
);

/** Scene 3 (8-12 s): "PLENTY OF DEALS AVAILABLE NOW!" banners and a badge pulsing on the beat. */
export const FeatureScene: React.FC<{v: VariantProps}> = ({v}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const urgent = v.energy === 'urgent';
	const pop = spring({frame, fps, delay: 4, config: {damping: 8, stiffness: 190, mass: 0.7}});
	// Thump on every beat: quick swell that decays before the next one.
	const phase = (frame % BEAT) / BEAT;
	const pulse = Math.exp(-phase * 6) * (urgent ? 0.14 : 0.09);
	const sub = spring({frame, fps, delay: 30, config: {damping: 12, stiffness: 170}});
	return (
		<AbsoluteFill>
			<Footage clip={v.clips.feature} dim={0.2} />
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(18,18,18,0.85) 100%)'}} />
			<GrungeBand edge="top" height={300} />
			<AbsoluteFill style={{alignItems: 'center', paddingTop: 50}}>
				<Logo width={420} />
				<div style={{marginTop: 34}}>
					<CategoryChip text={v.category} delay={6} />
				</div>
			</AbsoluteFill>
			<AbsoluteFill style={{alignItems: 'center', top: 470, height: BADGE * 1.6}}>
				<div style={{position: 'relative', width: BADGE, height: BADGE, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<Rays size={BADGE * 2.2} spin={frame * (urgent ? 1.6 : 0.7)} opacity={pop * 0.8} />
					<div
						style={{
							transform: `scale(${pop * (1 + pulse)}) rotate(${interpolate(pop, [0, 1], [-160, -8])}deg)`,
							filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.55))',
						}}
					>
						<StarBurst size={BADGE} label={v.feature.pulseLabel} sublabel={v.feature.pulseSublabel} spin={frame * 0.6} />
					</div>
				</div>
			</AbsoluteFill>
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: urgent ? 470 : 400}}>
				<BrushBanner width={1020} height={240} seed="feature-banner" delay={12}>
					<PopLetters text={v.feature.highlight} size={128} delay={16} stagger={1} />
				</BrushBanner>
				<div
					style={{
						marginTop: -10,
						transform: `translateX(${(1 - sub) * 1100}px) rotate(2deg)`,
					}}
				>
					<BrushBanner width={860} height={190} seed="feature-sub" delay={28} color={C.charcoal} fromRight>
						<div style={{fontFamily: display, fontSize: 108, color: C.white, whiteSpace: 'nowrap'}}>{v.feature.highlightSub}</div>
					</BrushBanner>
				</div>
			</AbsoluteFill>
			{v.ticker ? <Ticker text={v.ticker} y={1560} rotate={-4} /> : null}
			<GrungeTexture opacity={0.25} />
			{urgent ? (
				<>
					<Flash at={4} />
					<Flash at={4 + 4 * BEAT} length={4} />
				</>
			) : null}
		</AbsoluteFill>
	);
};
