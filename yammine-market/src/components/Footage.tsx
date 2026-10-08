import React from 'react';
import {AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Clip} from '../types';

/** One footage slice, muted, with a slow push in or pull out. */
export const Footage: React.FC<{clip: Clip; blur?: number; dim?: number}> = ({clip, blur = 0, dim = 0}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();
	const p = frame / Math.max(1, durationInFrames);
	const scale = clip.zoom === 'out' ? interpolate(p, [0, 1], [1.16, 1.04]) : interpolate(p, [0, 1], [1.04, 1.16]);
	return (
		<AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#000'}}>
			<OffthreadVideo
				src={staticFile(clip.src)}
				trimBefore={Math.round(clip.start * fps)}
				muted
				style={{
					width: '100%',
					height: '100%',
					objectFit: 'cover',
					objectPosition: clip.focus ?? '50% 50%',
					transform: `scale(${scale})`,
					filter: blur ? `blur(${blur}px)` : undefined,
				}}
			/>
			{dim ? <AbsoluteFill style={{backgroundColor: `rgba(0,0,0,${dim})`}} /> : null}
		</AbsoluteFill>
	);
};
