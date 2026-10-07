import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, mono} from '../theme';

const pad = (n: number) => String(n).padStart(2, '0');

/** Frame-wide tactical overlay: corner brackets, status readouts, live timecode. */
export const Hud: React.FC<{sector: string}> = ({sector}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();
	const fadeIn = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: 'clamp'});
	const blink = Math.floor(frame / 8) % 2 === 0;
	const tc = `00:00:${pad(Math.floor(frame / fps))}:${pad(frame % fps)}`;
	const progress = frame / durationInFrames;
	const text: React.CSSProperties = {
		position: 'absolute',
		fontFamily: mono,
		fontWeight: 700,
		fontSize: 20,
		letterSpacing: 4,
		color: C.white,
		textShadow: `0 0 10px ${C.blue}`,
	};
	const corner = (style: React.CSSProperties) => (
		<div style={{position: 'absolute', width: 54, height: 54, borderColor: `${C.white}CC`, borderStyle: 'solid', borderWidth: 0, ...style}} />
	);

	return (
		<AbsoluteFill style={{opacity: fadeIn, pointerEvents: 'none'}}>
			{corner({left: 40, top: 40, borderLeftWidth: 3, borderTopWidth: 3})}
			{corner({right: 40, top: 40, borderRightWidth: 3, borderTopWidth: 3})}
			{corner({left: 40, bottom: 40, borderLeftWidth: 3, borderBottomWidth: 3})}
			{corner({right: 40, bottom: 40, borderRightWidth: 3, borderBottomWidth: 3})}
			<div style={{...text, left: 72, top: 58}}>ARENA 02 // {sector}</div>
			<div style={{...text, right: 72, top: 58, display: 'flex', alignItems: 'center', gap: 12}}>
				<span
					style={{
						width: 12,
						height: 12,
						borderRadius: 6,
						background: C.magenta,
						boxShadow: `0 0 12px ${C.magenta}`,
						opacity: blink ? 1 : 0.25,
					}}
				/>
				LIVE {tc}
			</div>
			<div style={{...text, left: 72, bottom: 58, fontSize: 18}}>
				<span style={{color: C.blueHot}}>BLUE</span> 4/4 &nbsp;&nbsp; <span style={{color: C.magenta}}>MAGENTA</span>{' '}
				{frame >= 197 ? '3/4' : '4/4'}
			</div>
			<div style={{position: 'absolute', right: 72, bottom: 66, display: 'flex', gap: 6}}>
				{new Array(16).fill(0).map((_, i) => (
					<div
						key={i}
						style={{
							width: 14,
							height: 8,
							background: i / 16 < progress ? C.blueHot : `${C.white}33`,
							boxShadow: i / 16 < progress ? `0 0 8px ${C.blue}` : undefined,
						}}
					/>
				))}
			</div>
		</AbsoluteFill>
	);
};
