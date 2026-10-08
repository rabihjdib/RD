import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BrushBanner, Logo, Ticker} from '../../components/Brand';
import {Footage} from '../../components/Footage';
import {CornerSlashes, GrungeBand, GrungeTexture} from '../../components/Grunge';
import {PopLetters} from '../../components/KineticText';
import {Flash} from '../../components/Transitions';
import {BEAT, C, body} from '../../theme';
import type {VariantProps} from '../../types';
import {shake} from './shake';

// The kick drops on beat 2 (frame 30); the banner lands with it.
const IMPACT = 2 * BEAT;

/** Scene 1 (0-3 s): logo pops in, then "DON'T MISS" slams in on a red brush banner. */
export const IntroScene: React.FC<{v: VariantProps}> = ({v}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const urgent = v.energy === 'urgent';
	const sub = spring({frame, fps, delay: IMPACT + 18, config: {damping: 14, stiffness: 150}});
	const [dx, dy] = shake(frame, IMPACT, urgent ? 26 : 14);
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{transform: `translate(${dx}px, ${dy}px)`}}>
				<Footage clip={v.clips.intro} dim={0.25} />
				<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(18,18,18,0.75) 100%)'}} />
				<GrungeBand edge="top" height={360} />
				<CornerSlashes delay={6} corners={['tl', 'tr']} />
				<AbsoluteFill style={{alignItems: 'center', paddingTop: 70}}>
					<Logo width={600} delay={2} shine />
				</AbsoluteFill>
				<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', top: 140}}>
					<BrushBanner width={1040} height={330} seed="intro-banner" delay={IMPACT - 4}>
						<PopLetters text={v.intro.kicker} size={220} delay={IMPACT} stagger={2} />
					</BrushBanner>
					<div
						style={{
							marginTop: 40,
							fontFamily: body,
							fontWeight: 900,
							fontSize: 46,
							letterSpacing: 6,
							color: C.white,
							textShadow: '0 4px 14px rgba(0,0,0,0.8)',
							opacity: sub,
							transform: `translateY(${interpolate(sub, [0, 1], [40, 0])}px)`,
						}}
					>
						{v.intro.subline}
					</div>
				</AbsoluteFill>
				{v.ticker ? <Ticker text={v.ticker} y={1500} rotate={5} dark /> : null}
				<GrungeTexture opacity={0.3} />
			</AbsoluteFill>
			{urgent ? <Flash at={IMPACT} /> : null}
		</AbsoluteFill>
	);
};
