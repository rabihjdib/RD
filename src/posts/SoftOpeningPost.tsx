import {AbsoluteFill, Img, staticFile, useVideoConfig} from 'remotion';
import {BRONZE, CHARCOAL, CREAM, display, GOLD, sans} from '../brand';

/**
 * Announcement: the soft opening at 4 PM, as "Tomorrow" or, with `today`, "It’s today".
 * Built for both the feed
 * (1080x1350) and Stories (1080x1920); the layout stacks around a gold arch, like the
 * venue's own archways, with fireflies (a luciole is a firefly) glowing around it.
 * The Story keeps its copy clear of the profile bar and the reply bar.
 *
 * Render: npm run post:soft-opening
 */

export const SOFT_OPENING_DATE = 'Tuesday 20 October';

// [x, y (fraction of height), core size] for each firefly glow.
const FIREFLIES: [number, number, number][] = [
	[150, 0.3, 18],
	[940, 0.26, 14],
	[870, 0.6, 22],
	[205, 0.64, 16],
	[95, 0.47, 11],
	[985, 0.45, 12],
	[110, 0.88, 10],
	[970, 0.9, 14],
	[560, 0.12, 9],
];

export const SoftOpeningPost: React.FC<{today?: boolean; photo?: string}> = ({today = false, photo}) => {
	const {height} = useVideoConfig();
	const story = height > 1500;
	const archW = 600;
	const archH = story ? 640 : 520;
	return (
		<AbsoluteFill style={{backgroundColor: CREAM, alignItems: 'center', justifyContent: 'center'}}>
			{/* Warm glow behind the arch. */}
			<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 52%, rgba(214,178,122,0.32) 0%, rgba(214,178,122,0) 55%)'}} />

			{FIREFLIES.map(([x, y, s], i) => (
				<div
					key={i}
					style={{
						position: 'absolute',
						left: x - s / 2,
						top: y * height - s / 2,
						width: s,
						height: s,
						borderRadius: s,
						background: '#f6ebd6',
						boxShadow: `0 0 ${s}px ${s * 0.5}px rgba(214,178,122,0.9), 0 0 ${s * 4}px ${s * 1.8}px rgba(183,144,93,0.4)`,
					}}
				/>
			))}

			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transform: story ? `scale(${photo ? 1 : 1.18})` : undefined}}>
				<Img src={staticFile('reel/brand/logo-dark.png')} style={{width: 250}} />

				<div style={{marginTop: story ? 70 : 44, fontFamily: sans, fontWeight: 700, fontSize: 26, letterSpacing: '0.34em', textTransform: 'uppercase', color: GOLD}}>Soft opening</div>
				<div style={{marginTop: 14, fontFamily: display, fontSize: 96, lineHeight: 1.02, color: CHARCOAL, whiteSpace: 'nowrap'}}>
					{today ? 'It’s today,' : 'Tomorrow,'}
					<br />
					<span style={{color: BRONZE}}>we light up.</span>
				</div>

				{photo ? (
					// Photo version: happy kids fill the arch, and the time sits on a charcoal pill across its foot.
					<div style={{position: 'relative', marginTop: story ? 60 : 40, width: archW, height: archH + 40}}>
						<div style={{position: 'absolute', left: 0, top: 0, width: archW, height: archH, borderRadius: `${archW / 2}px ${archW / 2}px 30px 30px`, border: `4px solid ${GOLD}`, overflow: 'hidden', boxShadow: '0 24px 50px rgba(41,41,41,0.25)'}}>
							<Img src={staticFile(photo)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 30%'}} />
						</div>
						<div style={{position: 'absolute', left: '50%', bottom: 0, transform: 'translateX(-50%)', display: 'flex', alignItems: 'baseline', gap: 16, padding: '14px 40px 18px', borderRadius: 999, background: CHARCOAL, border: `3px solid ${GOLD}`, whiteSpace: 'nowrap', boxShadow: '0 14px 30px rgba(0,0,0,0.3)'}}>
							<span style={{fontFamily: sans, fontWeight: 700, fontSize: 20, letterSpacing: '0.26em', textTransform: 'uppercase', color: CREAM}}>Doors open at</span>
							<span style={{fontFamily: display, fontSize: 64, lineHeight: 1, color: GOLD}}>4 PM</span>
						</div>
					</div>
				) : (
					<div
						style={{
							position: 'relative',
							marginTop: story ? 70 : 44,
							width: archW,
							height: archH,
							borderRadius: `${archW / 2}px ${archW / 2}px 30px 30px`,
							border: `4px solid ${GOLD}`,
							background: 'rgba(255,255,255,0.45)',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							paddingTop: archW * 0.18,
						}}
					>
						{/* Inner arch line, as on the archways at Luciole. */}
						<div style={{position: 'absolute', inset: 16, borderRadius: `${archW / 2 - 16}px ${archW / 2 - 16}px 18px 18px`, border: '1.5px solid rgba(183,144,93,0.55)'}} />
						<div style={{fontFamily: sans, fontWeight: 700, fontSize: 24, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(41,41,41,0.6)'}}>Doors open at</div>
						<div style={{marginTop: 4, fontFamily: display, fontSize: 210, lineHeight: 1, color: CHARCOAL}}>
							4<span style={{fontSize: 110, color: GOLD}}> PM</span>
						</div>
						<div style={{marginTop: 14, fontFamily: sans, fontWeight: 700, fontSize: 30, color: 'rgba(41,41,41,0.75)'}}>{today ? `Today · ${SOFT_OPENING_DATE}` : SOFT_OPENING_DATE}</div>
					</div>
				)}
				{photo && <div style={{marginTop: 24, fontFamily: sans, fontWeight: 700, fontSize: 30, color: 'rgba(41,41,41,0.75)'}}>{today ? `Today · ${SOFT_OPENING_DATE}` : SOFT_OPENING_DATE}</div>}

				<div style={{marginTop: story ? 64 : 40, fontFamily: display, fontSize: 40, color: CHARCOAL}}>L&rsquo;Atelier · Café · Bistro</div>
				<div style={{marginTop: 18, fontFamily: sans, fontWeight: 700, fontSize: 24, letterSpacing: '0.26em', textTransform: 'uppercase', color: GOLD}}>
					Jounieh Souks · WhatsApp 81 540 282
				</div>
			</div>
		</AbsoluteFill>
	);
};
