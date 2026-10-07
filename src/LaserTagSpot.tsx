import {AbsoluteFill, Audio, random, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {EndCard} from './components/EndCard';
import {Fog, Flash, Grain, ScanSweep, Vignette} from './components/Atmosphere';
import {Backdrop, Graded} from './components/Graded';
import {Hud} from './components/Hud';
import {Panel} from './components/Panel';
import {TacticalMap} from './components/TacticalMap';
import {TagHit} from './components/TagHit';
import {Title} from './components/Title';
import {C} from './theme';

// 120 BPM score: one beat = 15 frames. Every cut lands on a beat or an eighth.
export const SPOT_DURATION = 300;
export const END_CARD = 210;
export const CUTS = [0, 30, 60, 90, 112, 135, 165, 195, 210];
export const TAG = 195;
const HERO_W = 760;

export const sectorAt = (f: number) =>
	f < 30 ? 'STAGING' : f < 90 ? 'SECTOR A' : f < 165 ? 'SECTOR B' : f < 210 ? 'OVERHEAD' : 'ARENA';

/** Quick push on every cut, plus a decaying shake on the tag. */
export const useCamera = () => {
	const f = useCurrentFrame();
	const last = [...CUTS].reverse().find((c) => c <= f) ?? 0;
	const punch = 1 + 0.045 * Math.exp(-(f - last) / 3.5);
	const shakeAmt = f >= TAG && f < TAG + 12 ? 18 * Math.exp(-(f - TAG) / 3) : 0;
	const sx = (random(`sx${f}`) - 0.5) * 2 * shakeAmt;
	const sy = (random(`sy${f}`) - 0.5) * 2 * shakeAmt;
	return `translate(${sx}px, ${sy}px) scale(${punch})`;
};

const BottomShade: React.FC = () => (
	<AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(5,7,11,0.85) 0%, rgba(5,7,11,0) 42%)'}} />
);

/** Flash frames on every cut: magenta on the tag, blue into the overhead map. */
export const CutFlashes: React.FC = () => (
	<>
		{CUTS.slice(1).map((c) => (
			<Sequence key={c} from={c} durationInFrames={6}>
				<Flash
					color={c === TAG ? C.magenta : c === 165 ? C.blue : '#ffffff'}
					peak={c === TAG ? 0.85 : c === 210 ? 0.6 : 0.28}
					frames={c === TAG ? 5 : 3}
				/>
			</Sequence>
		))}
	</>
);

export const LaserTagSpot: React.FC = () => {
	const frame = useCurrentFrame();
	const camera = useCamera();

	return (
		<AbsoluteFill style={{backgroundColor: C.ink}}>
			<AbsoluteFill style={{transform: camera}}>
				{/* 01 GEAR UP: low-angle hero on the briefing, headset LEDs firing */}
				<Sequence from={0} durationInFrames={30}>
					<Backdrop clip="briefing" from={96} />
					<Panel x={230} w={HERO_W} label="CAM 01 // BRIEFING">
						<Graded clip="briefing" from={96} duration={30} zoom={[1.06, 1.2]} origin={[0.62, 0.32]} warm />
					</Panel>
					<Title word="Gear up." kicker="01 // SQUAD UP" x={1080} y={380} size={230} />
					<ScanSweep />
				</Sequence>

				{/* 02 COMMUNICATE: three-up split, the whole squad in one frame */}
				<Sequence from={30} durationInFrames={30}>
					<Panel x={0} w={628} label="CAM 02">
						<Graded clip="briefing" from={30} duration={30} zoom={[1.15, 1.25]} origin={[0.7, 0.3]} warm />
					</Panel>
					<Panel x={646} w={628} delay={3} label="CAM 03" accent={C.magenta}>
						<Graded clip="corridor" from={66} duration={30} zoom={[1.05, 1.15]} origin={[0.45, 0.35]} />
					</Panel>
					<Panel x={1292} w={628} delay={6} label="CAM 04">
						<Graded clip="tires" from={24} duration={30} zoom={[1.0, 1.1]} origin={[0.5, 0.4]} />
					</Panel>
					<BottomShade />
					<Title word="Communicate." kicker="02 // CALL IT" x={960} y={740} align="center" size={180} delay={5} />
				</Sequence>

				{/* 03 FLANK: tracking push as the runner breaks for the tree line */}
				<Sequence from={60} durationInFrames={30}>
					<Backdrop clip="flank" from={51} />
					<Panel x={930} w={HERO_W} label="CAM 05 // FLANK ROUTE" accent={C.magenta}>
						<Graded clip="flank" from={51} duration={30} zoom={[1.0, 1.22]} origin={[0.38, 0.62]} />
					</Panel>
					<Title word="Flank." kicker="03 // MOVE WIDE" x={150} y={380} size={250} />
				</Sequence>

				{/* 04 Low cover behind the tyre stack */}
				<Sequence from={90} durationInFrames={22}>
					<Backdrop clip="tires" from={100} />
					<Panel x={580} w={HERO_W} label="CAM 06 // LOW COVER">
						<Graded clip="tires" from={100} duration={22} zoom={[1.12, 1.26]} origin={[0.45, 0.42]} drift={[-20, 0]} />
					</Panel>
					<ScanSweep color={C.magenta} />
				</Sequence>

				{/* 05 Short tele punch on the aim */}
				<Sequence from={112} durationInFrames={23}>
					<Backdrop clip="corridor" from={69} />
					<Panel x={410} w={1100} label="CAM 07 // 85MM" accent={C.magenta}>
						<Graded clip="corridor" from={69} duration={23} zoom={[1.28, 1.4]} origin={[0.45, 0.3]} />
					</Panel>
				</Sequence>

				{/* 06 MOVE AS ONE: two-up, ground level and elevated platform */}
				<Sequence from={135} durationInFrames={30}>
					<Panel x={0} w={951} label="CAM 08 // GROUND">
						<Graded clip="flank" from={519} duration={30} zoom={[1.0, 1.1]} origin={[0.5, 0.55]} />
					</Panel>
					<Panel x={969} w={951} delay={3} label="CAM 09 // LVL 2" accent={C.magenta}>
						<Graded clip="tires" from={210} duration={30} zoom={[1.0, 1.08]} origin={[0.45, 0.3]} />
					</Panel>
					<BottomShade />
					<Title word="Move as one." kicker="04 // COORDINATE" x={960} y={740} align="center" size={180} delay={4} />
				</Sequence>

				{/* 07 Overhead crane reveal: the tactical read */}
				<Sequence from={165} durationInFrames={30}>
					<Backdrop clip="flank" from={120} />
					<TacticalMap duration={30} />
					<Title word="Outsmart." kicker="05 // READ THE MAP" x={1830} y={96} align="right" size={116} delay={8} />
				</Sequence>

				{/* 08 TAG */}
				<Sequence from={TAG} durationInFrames={15}>
					<Backdrop clip="corridor" from={198} />
					<Panel x={230} w={HERO_W} label="CAM 10 // CONTACT" accent={C.magenta}>
						<Graded clip="corridor" from={198} duration={15} zoom={[1.3, 1.36]} origin={[0.4, 0.45]} />
					</Panel>
					<TagHit from={[470, 495]} to={[1340, 470]} />
				</Sequence>

				{/* 09 End card */}
				<Sequence from={END_CARD} durationInFrames={SPOT_DURATION - END_CARD}>
					<Backdrop clip="corridor" from={150} />
					<Fog strength={1.6} />
					<EndCard />
				</Sequence>

				<Fog />
			</AbsoluteFill>

			<Hud sector={sectorAt(frame)} hideFrom={END_CARD} />
			<Vignette />
			<Grain />

			<CutFlashes />
			<Audio src={staticFile('audio/score.wav')} />
		</AbsoluteFill>
	);
};
