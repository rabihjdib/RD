import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, display, mono} from '../theme';

type Props = {
	word: string;
	kicker?: string;
	x: number;
	y: number;
	align?: 'left' | 'center' | 'right';
	size?: number;
	delay?: number;
};

/** Headline that slams in with an RGB split that settles to clean white. */
export const Title: React.FC<Props> = ({word, kicker, x, y, align = 'left', size = 200, delay = 3}) => {
	const f = useCurrentFrame() - delay;
	const p = interpolate(f, [0, 6], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.back(1.6)),
	});
	const split = interpolate(f, [0, 8], [14, 2.5], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const scale = interpolate(p, [0, 1], [1.35, 1]);
	const spacing = interpolate(p, [0, 1], [24, 2]);
	const translateX = align === 'center' ? '-50%' : align === 'right' ? '-100%' : '0';

	const text = (color: string, dx: number, blend?: 'screen') => (
		<div
			style={{
				position: 'absolute',
				left: dx,
				top: 0,
				color,
				mixBlendMode: blend,
				whiteSpace: 'nowrap',
			}}
		>
			{word}
		</div>
	);

	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				transform: `translateX(${translateX}) scale(${scale})`,
				transformOrigin: align === 'right' ? 'right center' : align === 'center' ? 'center' : 'left center',
				opacity: p,
				textAlign: align,
			}}
		>
			{kicker ? (
				<div
					style={{
						fontFamily: mono,
						fontWeight: 700,
						fontSize: 24,
						letterSpacing: 8,
						color: C.blueHot,
						marginBottom: 6,
						opacity: interpolate(f, [3, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
					}}
				>
					{kicker}
				</div>
			) : null}
			<div
				style={{
					position: 'relative',
					fontFamily: display,
					fontSize: size,
					lineHeight: 0.92,
					letterSpacing: spacing,
					textTransform: 'uppercase',
				}}
			>
				<div style={{visibility: 'hidden', whiteSpace: 'nowrap'}}>{word}</div>
				{text(C.magenta, -split, 'screen')}
				{text(C.blue, split, 'screen')}
				{text(C.white, 0)}
			</div>
		</div>
	);
};
