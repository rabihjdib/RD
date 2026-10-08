// Every variant is a plain data object of this shape, so a new video is a new
// entry in data/variants.ts, not new components.

/** A slice of one of the transcoded clips in public/footage. */
export type Clip = {
	/** Path under public/, e.g. 'footage/tea-aisle.mp4'. */
	src: string;
	/** Second of the source clip the slice starts at. */
	start: number;
	/** CSS object-position, to keep the subject in frame under the text. */
	focus?: string;
	/** Ken Burns direction. */
	zoom?: 'in' | 'out';
};

export type BadgeKind = 'tag' | 'burst' | 'bag';

/** A floating deal badge in the offer scene. Positions are in px on the 1080x1920 canvas. */
export type Badge = {
	kind: BadgeKind;
	label: string;
	sublabel?: string;
	x: number;
	y: number;
	size: number;
	/** Frames after the scene starts before the badge pops in. */
	delay: number;
	rotate?: number;
};

export type HeadlineLine = {
	text: string;
	color: 'white' | 'red';
	/** Relative type size, 1 = default headline size. */
	scale?: number;
};

export type Energy = 'standard' | 'urgent';

export type VariantProps = {
	/** Shown in the Studio sidebar and used for the output file name. */
	name: string;
	energy: Energy;
	/** Short category chip under the logo in scenes 2 and 3. */
	category: string;
	intro: {
		kicker: string;
		subline: string;
	};
	headline: HeadlineLine[];
	badges: Badge[];
	feature: {
		highlight: string;
		highlightSub: string;
		pulseLabel: string;
		pulseSublabel: string;
	};
	outro: {
		cta: string;
		location: string;
	};
	/** Scrolling tape for urgent variants; omitted for standard ones. */
	ticker?: string;
	clips: {
		intro: Clip;
		/** Played back to back across the offer scene, joined by light leaks. */
		offer: Clip[];
		feature: Clip;
		outro: Clip;
	};
	music: string;
};
