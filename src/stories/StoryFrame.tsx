import {AbsoluteFill, Img, staticFile} from 'remotion';
import {BRONZE, CHARCOAL, display, GOLD, sans} from '../brand';
import {Heart} from '../posts/HeartPost';

/**
 * One full-bleed Instagram Story (1080x1920, 9:16). The 3:4 photo fills the frame at
 * full height, so the horizontal crop (`x`, an objectPosition percentage) picks which
 * part stays in. The copy sits on a cream card between the profile bar (top 220) and
 * the reply bar (bottom 270); `flush` cards run to the bottom edge, solid, where they
 * cover a name or another family's branding.
 */

export const STORY_W = 1080;
export const STORY_H = 1920;
export const SAFE_BOTTOM = 270;

export type Card = {
	left?: number;
	right?: number;
	top?: number;
	bottom?: number;
	w: number;
	align?: 'left' | 'center';
	flush?: boolean; // runs to the bottom edge, text kept above the reply bar
};

export type Story = {
	photo: string;
	x: number;
	card: Card;
	kicker: string;
	lines: string[];
	size: number;
	sub?: string[] | string;
	heart?: boolean; // "And we ♥ Luciole"
};

const Emphasis: React.FC<{text: string}> = ({text}) => (
	<>
		{text.split(/(\*[^*]+\*)/).map((part, i) =>
			part.startsWith('*') ? (
				<span key={i} style={{color: BRONZE}}>
					{part.slice(1, -1)}
				</span>
			) : (
				part
			),
		)}
	</>
);

export const StoryFrame: React.FC<{story: Story; dir: string}> = ({story: s, dir}) => {
	const {card} = s;
	const center = card.align === 'center';
	return (
		<AbsoluteFill style={{backgroundColor: '#edece3'}}>
			<Img src={staticFile(`${dir}/${s.photo}`)} style={{width: STORY_W, height: STORY_H, objectFit: 'cover', objectPosition: `${s.x}% 50%`}} />

			<div
				style={{
					position: 'absolute',
					left: card.left,
					right: card.right,
					top: card.top,
					bottom: card.flush ? 0 : card.bottom,
					width: card.w,
					padding: card.flush ? `40px 48px ${SAFE_BOTTOM}px` : '28px 34px 30px',
					borderRadius: card.flush ? (card.w === STORY_W ? '40px 40px 0 0' : '32px 0 0 0') : 28,
					background: card.flush ? '#edece3' : 'rgba(237,236,227,0.96)', // flush cards hide names and branding, so solid
					boxShadow: '0 18px 50px rgba(41,41,41,0.3)',
					display: 'flex',
					flexDirection: 'column',
					alignItems: center ? 'center' : 'flex-start',
					textAlign: center ? 'center' : 'left',
				}}
			>
				<div style={{fontFamily: sans, fontWeight: 700, fontSize: 22, letterSpacing: '0.26em', textTransform: 'uppercase', color: GOLD}}>{s.kicker}</div>
				<div style={{marginTop: 10, fontFamily: display, fontSize: s.size, lineHeight: 1.05, color: CHARCOAL}}>
					{s.lines.map((line) => (
						<div key={line} style={{whiteSpace: card.w >= 900 ? 'normal' : 'nowrap'}}>
							<Emphasis text={line} />
							{s.heart && (
								<>
									<Heart size={s.size * 0.85} />
									Luciole
								</>
							)}
						</div>
					))}
				</div>
				{s.sub && (
					<div style={{marginTop: 14, fontFamily: sans, fontWeight: 700, fontSize: 25, lineHeight: 1.4, color: 'rgba(41,41,41,0.7)'}}>
						{(typeof s.sub === 'string' ? [s.sub] : s.sub).map((line) => (
							<div key={line}>{line}</div>
						))}
					</div>
				)}
				<div
					style={{
						marginTop: 18,
						paddingTop: 14,
						alignSelf: 'stretch',
						borderTop: '1px solid rgba(41,41,41,0.15)',
						display: 'flex',
						// Narrow cards stack the logo over the number.
						flexDirection: card.w < 520 ? 'column' : 'row',
						justifyContent: center ? 'center' : 'space-between',
						alignItems: card.w < 520 ? 'flex-start' : 'center',
						gap: card.w < 520 ? 10 : 24,
					}}
				>
					<Img src={staticFile('reel/brand/logo-dark.png')} style={{width: 130}} />
					<span style={{fontFamily: sans, fontWeight: 700, fontSize: 19, letterSpacing: '0.12em', textTransform: 'uppercase', color: GOLD}}>WhatsApp 81 540 282</span>
				</div>
			</div>
		</AbsoluteFill>
	);
};
