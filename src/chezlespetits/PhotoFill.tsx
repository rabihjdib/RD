import {Img, staticFile} from 'remotion';
import type {Photo} from './data';

/** Covers a width x height box with the photo's usable region, framed on its focus point. */
export const PhotoFill: React.FC<{photo: Photo; width: number; height: number; focus?: {x: number; y: number}; zoom?: number}> = ({
	photo,
	width,
	height,
	focus,
	zoom = 1,
}) => {
	const crop = photo.crop ?? {x: 0, y: 0, w: photo.width, h: photo.height};
	const f = focus ?? photo.focus ?? {x: 0.5, y: 0.5};
	const scale = Math.max(width / crop.w, height / crop.h) * zoom;
	const spareX = crop.w * scale - width;
	const spareY = crop.h * scale - height;
	return (
		<div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
			<Img
				src={staticFile(photo.file)}
				style={{
					position: 'absolute',
					width: photo.width * scale,
					height: photo.height * scale,
					left: -crop.x * scale - spareX * f.x,
					top: -crop.y * scale - spareY * f.y,
					maxWidth: 'none',
				}}
			/>
		</div>
	);
};
