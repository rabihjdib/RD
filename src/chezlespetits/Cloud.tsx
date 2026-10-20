import {Img, staticFile} from 'remotion';
import {CLOUD} from './cloud';
import type {Photo, Trust} from './data';
import {PhotoFill} from './PhotoFill';

/** The logo cloud path stretched to a width x height box (all its coordinates are x,y pairs). */
export const cloudPath = (width: number, height: number) => {
	const sx = width / CLOUD.width;
	const sy = height / CLOUD.height;
	return CLOUD.d.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_, x, y) => `${(+x * sx).toFixed(1)},${(+y * sy).toFixed(1)}`);
};

type Box = {left: number; top: number; width: number; height: number};

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
	<svg
		width={width + strokeWidth * 2}
		height={height + strokeWidth * 2}
		style={{position: 'absolute', left: left - strokeWidth, top: top - strokeWidth, opacity, overflow: 'visible'}}
	>
		<path d={cloudPath(width, height)} transform={`translate(${strokeWidth},${strokeWidth})`} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
	</svg>
);

/** A photo masked to the brand cloud with the logo's black outline. */
export const CloudPhoto: React.FC<Box & {photo: Photo; focus?: {x: number; y: number}; outline: number}> = ({photo, focus, outline, ...box}) => (
	<>
		<div style={{position: 'absolute', ...box, clipPath: `path('${cloudPath(box.width, box.height)}')`}}>
			<PhotoFill photo={photo} width={box.width} height={box.height} focus={focus} />
		</div>
		<CloudShape {...box} stroke="#000" strokeWidth={outline} />
	</>
);

const Glyph: React.FC<{kind: Trust}> = ({kind}) => {
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
export const CloudIcon: React.FC<{kind: Trust; size: number; color: string}> = ({kind, size, color}) => {
	const w = size * 1.5;
	return (
		<svg width={w} height={size} viewBox={`0 0 ${w} ${size}`} style={{flexShrink: 0, color}}>
			<path d={cloudPath(w, size)} fill={color} />
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
