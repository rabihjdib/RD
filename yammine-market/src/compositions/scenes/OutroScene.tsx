import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BrushBanner, Logo} from '../../components/Brand';
import {Footage} from '../../components/Footage';
import {CornerSlashes, GrungeTexture} from '../../components/Grunge';
import {C, body, display} from '../../theme';
import type {VariantProps} from '../../types';

const Pin: React.FC<{size: number}> = ({size}) => (
	<svg width={size} height={size} viewBox="0 0 24 24">
		<path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" fill={C.red} />
	</svg>
);

/** Scene 4 (12-15 s): logo centred on charcoal, "VISIT US IN-STORE TODAY!" and the store location. */
export const OutroScene: React.FC<{v: VariantProps}> = ({v}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const loc = spring({frame, fps, delay: 34, config: {damping: 14, stiffness: 140}});
	const settle = interpolate(frame, [0, 90], [1.04, 1]);
	return (
		<AbsoluteFill style={{backgroundColor: C.charcoal}}>
			<Footage clip={v.clips.outro} blur={22} dim={0.55} />
			<AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, rgba(18,18,18,0.35) 0%, rgba(18,18,18,0.92) 75%)`}} />
			<GrungeTexture opacity={0.45} />
			<CornerSlashes delay={4} />
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', transform: `scale(${settle})`, paddingBottom: 120}}>
				<Logo width={840} delay={3} shine />
				<div style={{marginTop: 70}}>
					<BrushBanner width={1000} height={360} seed="outro-banner" delay={16}>
						<div
							style={{
								fontFamily: display,
								fontSize: 118,
								lineHeight: 1.02,
								color: C.white,
								textAlign: 'center',
								maxWidth: 860,
								textShadow: '0 6px 0 rgba(0,0,0,0.3)',
							}}
						>
							{v.outro.cta}
						</div>
					</BrushBanner>
				</div>
				<div
					style={{
						marginTop: 50,
						display: 'flex',
						alignItems: 'center',
						gap: 14,
						opacity: loc,
						transform: `translateY(${(1 - loc) * 40}px)`,
						fontFamily: body,
						fontWeight: 800,
						fontSize: 36,
						letterSpacing: 3,
						color: C.white,
					}}
				>
					<Pin size={48} />
					{v.outro.location}
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
