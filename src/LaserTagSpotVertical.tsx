import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Fog, Grain, ScanSweep, Vignette} from './components/Atmosphere';
import {EndCard} from './components/EndCard';
import {Backdrop, Graded} from './components/Graded';
import {Hud} from './components/Hud';
import {Panel} from './components/Panel';
import {TacticalMap} from './components/TacticalMap';
import {TagHit} from './components/TagHit';
import {Title} from './components/Title';
import {CutFlashes, sectorAt, TAG, useCamera} from './LaserTagSpot';
import {C} from './theme';

// 9:16 cut for Reels / TikTok / Shorts. Same beats, score and effects as the 16:9 spot;
// the footage is natively vertical so most shots run full frame. Text stays clear of
// the platform UI (roughly the top 200px and bottom 380px).
const W = 1080;
const H = 1920;
const ROW3 = 628;
const ROW2 = 951;
const GAP = 18;

/** Dark band behind a headline that sits over busy footage. */
const Band: React.FC<{y: number; h?: number}> = ({y, h = 420}) => (
	<div
		style={{
			position: 'absolute',
			left: 0,
			right: 0,
			top: y - h / 2,
			height: h,
			background: 'linear-gradient(180deg, rgba(5,7,11,0) 0%, rgba(5,7,11,0.78) 50%, rgba(5,7,11,0) 100%)',
		}}
	/>
);

const Full: React.FC<{label: string; accent?: string; children: React.ReactNode}> = ({label, accent, children}) => (
	<Panel x={0} w={W} h={H} label={label} accent={accent} labelTop={240}>
		{children}
	</Panel>
);

export const LaserTagSpotVertical: React.FC = () => {
	const frame = useCurrentFrame();
	const camera = useCamera();

	return (
		<AbsoluteFill style={{backgroundColor: C.ink}}>
			<AbsoluteFill style={{transform: camera}}>
				{/* 01 GEAR UP */}
				<Sequence from={0} durationInFrames={30}>
					<Full label="CAM 01 // BRIEFING">
						<Graded clip="briefing" from={96} duration={30} zoom={[1.06, 1.2]} origin={[0.62, 0.32]} warm />
					</Full>
					<Band y={1240} />
					<Title word="Gear up." kicker="01 // SQUAD UP" x={W / 2} y={1130} align="center" size={220} />
					<ScanSweep />
				</Sequence>

				{/* 02 COMMUNICATE: three stacked feeds */}
				<Sequence from={30} durationInFrames={30}>
					<Panel x={0} y={0} w={W} h={ROW3} labelTop={210} label="CAM 02">
						<Graded clip="briefing" from={30} duration={30} zoom={[1.05, 1.15]} origin={[0.6, 0.35]} focus={[0.5, 0.3]} warm />
					</Panel>
					<Panel x={0} y={ROW3 + GAP} w={W} h={ROW3} delay={3} labelTop={20} label="CAM 03" accent={C.magenta}>
						<Graded clip="corridor" from={66} duration={30} zoom={[1.05, 1.15]} origin={[0.45, 0.4]} focus={[0.5, 0.38]} />
					</Panel>
					<Panel x={0} y={(ROW3 + GAP) * 2} w={W} h={ROW3} delay={6} labelTop={20} label="CAM 04">
						<Graded clip="tires" from={24} duration={30} zoom={[1.0, 1.1]} origin={[0.5, 0.45]} focus={[0.5, 0.45]} />
					</Panel>
					<Band y={1283} h={360} />
					<Title word="Communicate." kicker="02 // CALL IT" x={W / 2} y={1190} align="center" size={140} delay={5} />
				</Sequence>

				{/* 03 FLANK */}
				<Sequence from={60} durationInFrames={30}>
					<Full label="CAM 05 // FLANK ROUTE" accent={C.magenta}>
						<Graded clip="flank" from={51} duration={30} zoom={[1.0, 1.22]} origin={[0.38, 0.62]} />
					</Full>
					<Band y={470} />
					<Title word="Flank." kicker="03 // MOVE WIDE" x={W / 2} y={340} align="center" size={250} />
				</Sequence>

				{/* 04 Low cover */}
				<Sequence from={90} durationInFrames={22}>
					<Full label="CAM 06 // LOW COVER">
						<Graded clip="tires" from={100} duration={22} zoom={[1.12, 1.26]} origin={[0.45, 0.42]} drift={[-20, 0]} />
					</Full>
					<ScanSweep color={C.magenta} />
				</Sequence>

				{/* 05 Short tele punch */}
				<Sequence from={112} durationInFrames={23}>
					<Full label="CAM 07 // 85MM" accent={C.magenta}>
						<Graded clip="corridor" from={69} duration={23} zoom={[1.4, 1.55]} origin={[0.45, 0.32]} />
					</Full>
				</Sequence>

				{/* 06 MOVE AS ONE: ground over platform */}
				<Sequence from={135} durationInFrames={30}>
					<Panel x={0} y={0} w={W} h={ROW2} labelTop={210} label="CAM 08 // GROUND">
						<Graded clip="flank" from={519} duration={30} zoom={[1.0, 1.1]} origin={[0.5, 0.55]} focus={[0.5, 0.55]} />
					</Panel>
					<Panel x={0} y={ROW2 + GAP} w={W} h={ROW2} delay={3} labelTop={20} label="CAM 09 // LVL 2" accent={C.magenta}>
						<Graded clip="tires" from={210} duration={30} zoom={[1.0, 1.08]} origin={[0.45, 0.3]} focus={[0.5, 0.4]} />
					</Panel>
					<Band y={960} h={380} />
					<Title word="Move as one." kicker="04 // COORDINATE" x={W / 2} y={870} align="center" size={150} delay={4} />
				</Sequence>

				{/* 07 Overhead tactical read */}
				<Sequence from={165} durationInFrames={30}>
					<Backdrop clip="flank" from={120} />
					<TacticalMap duration={30} endScale={0.7} endLift={60} />
					<Title word="Outsmart." kicker="05 // READ THE MAP" x={W / 2} y={380} align="center" size={180} delay={8} />
				</Sequence>

				{/* 08 TAG */}
				<Sequence from={TAG} durationInFrames={15}>
					<Full label="CAM 10 // CONTACT" accent={C.magenta}>
						<Graded clip="corridor" from={198} duration={15} zoom={[1.3, 1.36]} origin={[0.4, 0.45]} />
					</Full>
					<TagHit from={[341, 902]} to={[760, 540]} labelBelow />
				</Sequence>

				{/* 09 End card */}
				<Sequence from={210} durationInFrames={30}>
					<Backdrop clip="corridor" from={210} />
					<Fog strength={1.6} />
					<EndCard />
				</Sequence>

				<Fog />
			</AbsoluteFill>

			<Hud sector={sectorAt(frame)} textTop={170} textBottom={330} />
			<Vignette />
			<Grain />
			<CutFlashes />
			<Audio src={staticFile('audio/score.wav')} />
		</AbsoluteFill>
	);
};

export const VERTICAL_SIZE = {width: W, height: H};
