import type {CoverSpec} from './BrandCover';

/**
 * Covers for the client's own edited reels. The reels are already SDR Rec.709, so each
 * frame is taken as is (no colour change), e.g.
 *   ffmpeg -ss 15.65 -i Luciole-Reel04-How-To-Find-Us-.mp4 -frames:v 1 -q:v 1 public/covers/findus.jpg
 *
 *   findus     Reel04 How To Find Us   15.65s  walking past the round building (no caption)
 *   atelier02  Reel02 Atelier          24.2s   plate covers "And the kids go home"
 *   bistro     Reel03 Bistro Cafe      4.13s   smiling to camera at the window (no caption)
 *   members    Reel06 Memberships      3.75s   smiling; band hides the top caption, plate the bottom one
 *   safety     Reel08 Safety v2        18.7s   behind the locked gate; band and plate cover its captions
 *   welcome    Reel09 Welcome Atelier  11.7s   boys at the building games (no caption)
 *   hours      Reel07 Hours Booking v3 0.0s    host smiling at the counter, first frame (no caption)
 *   atelier-wall  our AtelierTour (IMG_4535 at 2.3s, Dolby Vision conversion as in scripts/dv_convert.sh), the artwork wall
 */
export const COVERS: CoverSpec[] = [
	{
		id: 'FindUsCover',
		photo: 'findus.jpg',
		shift: 330,
		title: 'How to find',
		badge: {
			icon: '1f4cd',
			top: 1200,
			side: 'left',
			lines: [{text: 'Chiha Bldg', small: true}, {text: '1st floor'}, {text: 'Jounieh Souks', small: true}],
		},
		line: 'Parking right next to us',
	},
	{
		id: 'Atelier02Cover',
		photo: 'atelier02.jpg',
		shift: 120,
		title: 'L’Atelier at',
		plate: {top: 1222, kicker: 'No tablets, no screens, just', text: ['Paint', 'Clay', 'Imagination']},
		line: 'This is where the magic happens',
	},
	{
		id: 'BistroCover',
		photo: 'bistro.jpg',
		shift: 150,
		title: 'Café & Bistro at',
		titleSize: 72,
		badge: {
			icon: '2615',
			top: 560,
			side: 'left',
			lines: [{text: 'Open', small: true}, {text: 'Tue to Sun'}, {text: '8am to 10pm', small: true}],
		},
		line: 'Your pause starts here',
	},
	{
		id: 'MembershipsCover',
		photo: 'members.jpg',
		shift: -60,
		title: 'Memberships at',
		titleSize: 76,
		plate: {top: 1075, icon: '2728', kicker: 'Explorer or Innovator?', text: 'Which spark is yours?'},
		line: 'Every visit leaves a mark',
	},
	{
		id: 'SafetyCover',
		photo: 'safety.jpg',
		shift: 40,
		title: 'Safety at',
		plate: {top: 930, minHeight: 360, icon: '1f6e1', kicker: 'Built by moms, for moms', text: 'Safety comes first'},
		line: 'The main door is always locked',
	},
	{
		id: 'WelcomeAtelierCover',
		photo: 'welcome.jpg',
		shift: 120,
		title: 'Kids Atelier at',
		titleSize: 76,
		badge: {
			icon: '1f3a8',
			top: 1330,
			side: 'left',
			lines: [{text: 'Build'}, {text: 'Play', gold: true}, {text: 'Create'}],
		},
		line: 'Free play & new friends',
	},
	{
		id: 'HoursCover',
		photo: 'hours.jpg',
		shift: 100,
		title: 'Visit',
		plate: {
			top: 1240,
			kicker: 'Save this before you visit',
			rows: [
				{label: 'Café & Bistro', value: ['Tue to Sun', '8am to 10pm']},
				{label: 'Kids Atelier', value: ['Tue to Fri', '3pm to 10pm']},
				{label: '', value: ['Sat & Sun', '10am to 10pm']},
			],
			footer: 'Closed Mondays',
		},
		line: 'Book on WhatsApp 81 540 282',
	},
	{
		id: 'AtelierWallCover',
		photo: 'atelier-wall.jpg',
		shift: 150,
		title: 'L’Atelier at',
		plate: {top: 1360, icon: '2728', kicker: 'Paint, build, play', text: 'Every child is a spark'},
		line: 'A creative corner for little artists',
	},
];
