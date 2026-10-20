import {useId} from 'react';
import {Img, staticFile} from 'remotion';
import type {Glyph as GlyphKind, Photo} from './data';
import {PhotoFill} from './PhotoFill';

// The brand cloud, drawn as true vector geometry instead of a stretched trace: a pill-shaped
// base with three round bumps on top, like the cloud in the logo. Drawn for a 3:2 box; keep
// boxes near that shape and the bumps stay distinct, round and never stretched.
type Circle = {cx: number; cy: number; r: number};
type Parts = {base: {x: number; y: number; w: number; h: number; rx: number}; bumps: Circle[]};

const cloudParts = (w: number, h: number): Parts => ({
	base: {x: 0, y: h * 0.45, w, h: h * 0.55, rx: h * 0.275},
	bumps: [
		{cx: w * 0.22, cy: h * 0.5, r: h * 0.3},
		{cx: w * 0.5, cy: h * 0.45, r: h * 0.45},
		{cx: w * 0.77, cy: h * 0.52, r: h * 0.34},
	],
});

/** The cloud's shapes, grown by `grow` px all round (used to draw a clean outer outline). */
const CloudShapes: React.FC<{width: number; height: number; grow?: number; fill?: string}> = ({width, height, grow = 0, fill}) => {
	const {base, bumps} = cloudParts(width, height);
	return (
		<>
			<rect x={base.x - grow} y={base.y - grow} width={base.w + grow * 2} height={base.h + grow * 2} rx={base.rx + grow} fill={fill} />
			{bumps.map((c) => (
				<circle key={`${c.cx},${c.cy}`} cx={c.cx} cy={c.cy} r={c.r + grow} fill={fill} />
			))}
		</>
	);
};

type Box = {left: number; top: number; width: number; height: number};

/**
 * A solid cloud, optionally outlined. The outline is the same shapes grown by the stroke width
 * and painted underneath, so overlapping bumps never show seams. With `fill` set to the page
 * colour this also draws an outline-only cloud.
 */
export const CloudShape: React.FC<Box & {fill?: string; stroke?: string; strokeWidth?: number; opacity?: number}> = ({
	left,
	top,
	width,
	height,
	fill = 'none',
	stroke,
	strokeWidth = 0,
	opacity = 1,
}) => (
	<svg width={width} height={height} style={{position: 'absolute', left, top, opacity, overflow: 'visible'}}>
		{stroke && strokeWidth ? <CloudShapes width={width} height={height} grow={strokeWidth} fill={stroke} /> : null}
		{fill !== 'none' ? <CloudShapes width={width} height={height} fill={fill} /> : null}
	</svg>
);

/** A photo masked to the brand cloud with a black outline. */
export const CloudPhoto: React.FC<Box & {photo: Photo; focus?: {x: number; y: number}; outline: number}> = ({photo, focus, outline, ...box}) => {
	const id = `cloud-${useId().replace(/:/g, '')}`;
	return (
		<>
			<CloudShape {...box} stroke="#000" strokeWidth={outline} />
			<svg width={0} height={0} style={{position: 'absolute'}}>
				<clipPath id={id} clipPathUnits="userSpaceOnUse">
					<CloudShapes width={box.width} height={box.height} />
				</clipPath>
			</svg>
			<div style={{position: 'absolute', ...box, clipPath: `url(#${id})`}}>
				<PhotoFill photo={photo} width={box.width} height={box.height} focus={focus} />
			</div>
		</>
	);
};

const Glyph: React.FC<{kind: GlyphKind}> = ({kind}) => {
	if (kind === 'pin') {
		return <path d="M12 4.5a5 5 0 0 0-5 5c0 3.8 5 9 5 9s5-5.2 5-9a5 5 0 0 0-5-5zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" fill="#fff" />;
	}
	if (kind === 'list') {
		return <path d="M7 8.5h1.6M7 12.5h1.6M7 16.5h1.6M11 8.5h6M11 12.5h6M11 16.5h6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />;
	}
	if (kind === 'original') {
		return <path d="M7 12.5l3.2 3.2L17 9" stroke="#fff" strokeWidth="2.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />;
	}
	if (kind === 'cod') {
		return (
			<>
				<rect x="5" y="8" width="14" height="9" rx="2" fill="#fff" />
				<circle cx="12" cy="12.5" r="2.2" fill="currentColor" />
			</>
		);
	}
	return (
		<>
			<path d="M4 8.5h9v7H4zM13 10.5h3.6l2.4 2.6v2.4H13z" fill="#fff" />
			<circle cx="7.5" cy="16.5" r="1.7" fill="#fff" stroke="currentColor" strokeWidth="1" />
			<circle cx="15.8" cy="16.5" r="1.7" fill="#fff" stroke="currentColor" strokeWidth="1" />
		</>
	);
};

/** Trust icon: a filled brand cloud with a white glyph. */
export const CloudIcon: React.FC<{kind: GlyphKind; size: number; color: string}> = ({kind, size, color}) => {
	const w = size * 1.5;
	return (
		<svg width={w} height={size} viewBox={`0 0 ${w} ${size}`} style={{flexShrink: 0, color}}>
			<CloudShapes width={w} height={size} fill={color} />
			<g transform={`translate(${(w - size) / 2 + size * 0.04},${size * 0.1}) scale(${size / 26})`}>
				<Glyph kind={kind} />
			</g>
		</svg>
	);
};

/** Traced logo: black script in a white-filled cloud, readable on any background. 200:90. */
export const Logo: React.FC<{width: number}> = ({width}) => (
	<Img src={staticFile('chez-les-petits/logo.svg')} style={{width, height: width * 0.45, display: 'block'}} />
);
