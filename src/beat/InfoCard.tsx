import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {CHARCOAL, CREAM, display, GOLD, SAND, sans} from '../brand';

/**
 * Centred info panel for a BeatReel (opening hours and the like): charcoal card with a gold
 * border, a gold kicker, a Grown heading, then rows of "label / value" that rise in one after
 * another. A value is a list of parts joined with gold dots (Grown's own dot is tiny).
 */

export type InfoRow = {label?: string; value: string[]; gold?: boolean};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const InfoCard: React.FC<{kicker?: string; heading: string; rows: InfoRow[]; frames: number}> = ({kicker, heading, rows, frames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const enter = spring({frame, fps, config: {damping: 18, stiffness: 160}});
	const exit = interpolate(frame, [frames - 7, frames], [1, 0], clamp);
	const rise = (i: number) => spring({frame: frame - 8 - i * 5, fps, config: {damping: 18, stiffness: 150}});
	return (
		<AbsoluteFill style={{opacity: exit}}>
			<AbsoluteFill style={{background: 'rgba(41,41,41,0.35)', opacity: enter}} />
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
				<div
					style={{
						width: 900,
						padding: '48px 40px 54px',
						borderRadius: 40,
						background: 'rgba(41,41,41,0.93)',
						border: `3px solid ${GOLD}`,
						boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						opacity: enter,
						transform: `scale(${0.94 + 0.06 * enter})`,
					}}
				>
					{kicker ? (
						<span style={{fontFamily: sans, fontWeight: 700, fontSize: 28, letterSpacing: '0.24em', textTransform: 'uppercase', color: GOLD}}>{kicker}</span>
					) : null}
					<span style={{fontFamily: display, fontSize: 92, lineHeight: 1.1, color: CREAM, marginTop: 14, textAlign: 'center'}}>{heading}</span>
					<div style={{width: 220 * enter, height: 3, borderRadius: 2, background: GOLD, margin: '26px 0 18px'}} />
					{rows.map((r, i) => (
						<div
							key={`${r.label}-${r.value.join()}`}
							style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 22, opacity: rise(i), transform: `translateY(${(1 - rise(i)) * 24}px)`}}
						>
							{r.label ? (
								<span style={{fontFamily: sans, fontWeight: 700, fontSize: 26, letterSpacing: '0.22em', textTransform: 'uppercase', color: SAND}}>{r.label}</span>
							) : null}
							<span style={{fontFamily: display, fontSize: r.gold ? 96 : 64, lineHeight: 1.15, color: r.gold ? GOLD : CREAM, textShadow: `0 2px 12px ${CHARCOAL}`}}>
								{r.value.map((p, j) => (
									<span key={p}>
										{j > 0 ? <span style={{color: GOLD, padding: '0 18px'}}>•</span> : null}
										{p}
									</span>
								))}
							</span>
						</div>
					))}
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
