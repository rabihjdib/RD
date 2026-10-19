import {Card, SAFE_BOTTOM, Story, StoryFrame} from './StoryFrame';

/**
 * Instagram Stories made from the carousels: one full-bleed Story per photo slide,
 * carrying that slide's copy on a cream card (see StoryFrame). Proud's closing star
 * slide has no photo, so its line rides on the last photo Story instead.
 *
 * Photos: public/carousel/<name>/*.jpg. Render: npm run stories:carousels
 */

// Card placements: across the top or bottom, or a narrower card on one side.
const top: Card = {left: 40, top: 240, w: 1000};
const bottom: Card = {left: 40, bottom: SAFE_BOTTOM + 20, w: 1000};
const topLeft = (w: number): Card => ({left: 40, top: 240, w});
const topRight = (w: number): Card => ({right: 40, top: 240, w});

type S = Omit<Story, 'x'> & {x?: number};

const CAROUSELS: {name: string; stories: S[]}[] = [
	{
		name: 'atelier',
		stories: [
			{photo: 'flower.jpg', card: bottom, kicker: "L'Atelier", lines: ['Every creation starts', 'with *one small piece*.'], size: 56},
			{photo: 'focus.jpg', card: bottom, kicker: 'Focus', lines: ['Tiny pieces, *big focus*.'], size: 56, sub: 'Picking colours and following a pattern builds fine motor skills and concentration, and to them it is just play.'},
			{photo: 'colours.jpg', card: bottom, kicker: 'Imagination', lines: ['Colours become', '*their own ideas*.'], size: 56, sub: 'Patterns, puzzles and pixel art. No screens, just their imagination doing the work.'},
			{photo: 'smile.jpg', card: bottom, kicker: 'For parents', lines: ['They create.', 'You *pause & connect*.'], size: 56, sub: 'While they build, you get a real coffee and a real conversation at our café.'},
		],
	},
	{
		name: 'umbrella',
		stories: [
			{photo: 'group.jpg', card: top, kicker: "L'Atelier · Umbrella workshop", lines: ['A plain umbrella.', '*Their* design.'], size: 60},
			{photo: 'design.jpg', card: bottom, kicker: 'Step 1 · Design', lines: ['First the idea,', '*then the paint*.'], size: 56, sub: 'Their name, stars, hearts: every umbrella starts as a sketch on paper.'},
			{photo: 'customize.jpg', card: bottom, kicker: 'Step 2 · Customize', lines: ['Every stroke,', '*their choice*.'], size: 56, sub: 'Paint, gems and gold details. No two umbrellas leave the same.'},
			{photo: 'home.jpg', card: topLeft(560), kicker: 'Step 3 · Take it home', lines: ['Made at Luciole,', '*used every day*.'], size: 52, sub: 'Ready for school on the next rainy day.'},
		],
	},
	{
		name: 'build',
		stories: [
			{photo: 'engineers.jpg', card: topLeft(460), kicker: "L'Atelier · Build", lines: ["Tomorrow's", 'engineers', 'start *here*.'], size: 62},
			{photo: 'imagine.jpg', card: top, kicker: 'Step 1 · Imagine', lines: ['Every build starts', 'with *a big idea*.'], size: 56, sub: 'Tiles, shapes and colours. They decide what it becomes.'},
			{photo: 'build.jpg', card: topRight(400), kicker: 'Step 2 · Build', lines: ['Piece by piece,', '*their own city*.'], size: 44, sub: 'Cars, cranes and boats.'},
			{photo: 'solve.jpg', card: top, kicker: 'Step 3 · Solve', lines: ['Test, fix, try again.', '*That’s engineering.*'], size: 56, sub: 'Problem solving, patience and teamwork.'},
		],
	},
	{
		name: 'team',
		stories: [
			{photo: 'smiles.jpg', x: 30, card: topRight(480), kicker: 'Our team', lines: ['Meet the team', 'behind', '*the smiles*.'], size: 58},
			{photo: 'level.jpg', card: topRight(460), kicker: 'Professional', lines: ['They kneel to', '*their level*.'], size: 52, sub: 'Trained to guide, patient by nature, always at eye level with your child.'},
			{photo: 'care.jpg', card: bottom, kicker: 'Gentle', lines: ['Every little detail,', '*done with care*.'], size: 56, sub: 'A gem on a cheek or a first painting: nothing is too small for them.'},
			{photo: 'fun.jpg', card: top, kicker: 'Young & passionate', lines: ['Young, passionate', 'and *genuinely fun*.'], size: 56, sub: 'They don’t just watch the kids. They play, create and laugh with them.'},
			{photo: 'hands.jpg', card: topRight(420), kicker: 'Peace of mind', lines: ['Your child,', '*in the best*', '*hands*.'], size: 54, sub: 'So you can truly pause & connect.'},
		],
	},
	{
		name: 'proud',
		stories: [
			{photo: 'made.jpg', card: top, kicker: "L'Atelier · Proud moments", lines: ['Look what *we made*!'], size: 66},
			{photo: 'can.jpg', card: topLeft(380), kicker: 'Pride', lines: ['Every', 'finished', 'piece says', '*I can do it*.'], size: 54, sub: 'Confidence is built one small success at a time.'},
			{photo: 'hope.jpg', card: bottom, kicker: 'Hope', lines: ['Today a little garden.', '*Tomorrow, anything.*'], size: 54, sub: 'Small hands today. Big futures tomorrow.'},
		],
	},
	{
		name: 'wood',
		stories: [
			{photo: 'crew.jpg', card: top, kicker: 'The wood workshop · with Wood Wizard', lines: ['Little carpenters', '*at work*.'], size: 64},
			{photo: 'tools.jpg', card: top, kicker: 'Hands on', lines: ['Real tools. *Real skills.*'], size: 58, sub: 'Hammers, nails, files and sandpaper, safely guided step by step.'},
			{photo: 'guide.jpg', card: top, kicker: 'Expert guidance', lines: ['Expert hands', '*guide theirs*.'], size: 58, sub: 'Our wood masters show them how, then let them try.'},
			{photo: 'together.jpg', card: topRight(560), kicker: 'Option 1', lines: ['Parents, *join in*.'], size: 54, sub: 'Build it together and discover a new craft side by side.'},
			{photo: 'watch.jpg', card: top, kicker: 'Option 2', lines: ['Or let them *fly solo*.'], size: 58, sub: 'Drop them off, enjoy a coffee at our café, and come back to a proud little carpenter.'},
			{photo: 'home.jpg', card: bottom, kicker: 'Take it home', lines: ['Made by them.', '*Taken home.*'], size: 58, sub: 'Every child leaves with a piece they built with their own hands.'},
		],
	},
	{
		name: 'birthday',
		stories: [
			{photo: 'decor.jpg', card: top, kicker: 'Birthdays at Luciole', lines: ['We take care', 'of *everything*.'], size: 60, sub: 'Food, decoration, entertainment and your theme. You just enjoy the day.'},
			{photo: 'theme.jpg', card: bottom, kicker: 'Your theme', lines: ['Their dream party,', '*their theme*.'], size: 56, sub: 'Little scientist, artist or astronaut: we bring their idea to life.'},
			{photo: 'table.jpg', card: top, kicker: 'Decoration', lines: ['Styled down to', '*the last napkin*.'], size: 56, sub: 'Backdrops, balloons, placemats and table settings, all matched to the theme.'},
			{photo: 'show.jpg', card: topLeft(440), kicker: 'Entertainment', lines: ['Shows that', 'make them', '*scream with joy*.'], size: 48, sub: 'Live experiments, foam, games and animation.'},
			{photo: 'hands-on.jpg', card: bottom, kicker: 'Activities', lines: ['They don’t just watch.', '*They do it.*'], size: 56, sub: 'Hands-on workshops at our atelier, part of the party.'},
			{photo: 'food.jpg', card: top, kicker: 'Food', lines: ['A menu they love,', '*served for them*.'], size: 56, sub: 'Kids menu, fresh juice and a buffet for the parents.'},
			{photo: 'cake.jpg', card: topLeft(500), kicker: 'And you?', lines: ['You just', '*enjoy the*', '*moment*.'], size: 56, sub: 'No running around. This time, you celebrate too.'},
			{photo: 'group.jpg', card: top, kicker: 'Book their birthday', lines: ['Let’s make it', '*unforgettable*.'], size: 58, sub: 'Packages from $20 per child. Book 3 weeks ahead and leave the rest to us.'},
		],
	},
	{
		name: 'setup',
		stories: [
			{photo: 'table.jpg', card: top, kicker: 'Birthdays & kids gatherings', lines: ['A beautiful set-up,', '*ready for them*.'], size: 56, sub: 'Table, seats and decoration styled before the first guest arrives.'},
			{photo: 'games.jpg', card: top, kicker: 'Games room', lines: ['Fun at *every corner*.'], size: 58, sub: 'Giant wall games, puzzles and toys between every activity.'},
			{photo: 'seats.jpg', card: topRight(480), kicker: 'Made for kids', lines: ['A table that', 'feels *like theirs*.'], size: 48, sub: 'Kid-height tables, soft poufs and room for every friend.'},
			{photo: 'served.jpg', card: bottom, kicker: 'Served with care', lines: ['Served at their table,', '*with a smile*.'], size: 54, sub: 'Our team looks after every plate, so parents can sit back.'},
			{photo: 'gathering.jpg', card: bottom, kicker: 'Your celebration', lines: ['Gather them all.', '*We set the scene.*'], size: 56, sub: 'Birthdays, playdates and class gatherings, styled to your theme.'},
		],
	},
	{
		name: 'science',
		stories: [
			{photo: 'wow.jpg', card: bottom, kicker: "L'Atelier · Science fun", lines: ['Let them discover science.', '*And have fun.*'], size: 52},
			{photo: 'lab.jpg', card: bottom, kicker: 'Step into the lab', lines: ['Real experiments,', '*real wow*.'], size: 56, sub: 'Lab coats on, goggles down, and the fog starts rolling.'},
			{photo: 'cloud.jpg', card: bottom, kicker: 'Hands on', lines: ['They don’t just watch.', '*They make the clouds.*'], size: 52, sub: 'Every child gets a turn to run the experiment.'},
			{photo: 'curious.jpg', card: topRight(420), kicker: 'Curiosity', lines: ['Every “why?”', 'gets *an answer*.'], size: 46},
			{photo: 'fun.jpg', card: topLeft(470), kicker: 'Learning through play', lines: ['Science they', 'will *never forget*.'], size: 46, sub: 'Science parties for ages 2 to 12.'},
		],
	},
	{
		name: 'buffet',
		stories: [
			{photo: 'counter.jpg', card: top, kicker: 'Luciole café & bistro', lines: ['Our buffet & salad bar,', '*crafted for you*.'], size: 52, sub: 'By Chef Mazen, for events, daily brunch, lunch gatherings and birthdays.'},
			{photo: 'croissants.jpg', card: bottom, kicker: 'Breakfast & brunch', lines: ['Fresh from the oven,', '*every morning*.'], size: 56, sub: 'Croissants, pain au chocolat and artisan breads.'},
			{photo: 'salad.jpg', card: topRight(470), kicker: 'Salad bar', lines: ['Fresh, light', 'and *made*', '*your way*.'], size: 52},
			{photo: 'rolls.jpg', card: topRight(560), kicker: 'Lunch gatherings', lines: ['Bites made', '*to share*.'], size: 58, sub: 'Platters for ladies’ lunches and business meetings.'},
			{photo: 'sandwiches.jpg', card: bottom, kicker: 'Private events', lines: ['Your guests, *our table*.'], size: 56},
			{photo: 'guests.jpg', card: top, kicker: 'Events & celebrations', lines: ['Ladies’ gatherings, business', 'lunches *and birthdays*.'], size: 48},
			{photo: 'book.jpg', card: top, kicker: 'Book your event', lines: ['Tell us the occasion.', '*We set the buffet.*'], size: 56, sub: 'luciolelebanon.com'},
		],
	},
	{
		name: 'discover',
		stories: [
			{photo: 'spiral.jpg', card: topLeft(560), kicker: "Life at L'Atelier", lines: ['Endless fun.', 'Endless knowledge.', '*Endless discovery.*'], size: 50, sub: 'Even a spinning ball teaches them speed and gravity.'},
			{photo: 'paint.jpg', card: topRight(460), kicker: 'Endless fun', lines: ['A little glitter,', '*a lot of fun*.'], size: 48},
			{photo: 'bricks.jpg', card: topRight(450), kicker: 'Endless discovery', lines: ['Brick by brick,', '*a new world*.'], size: 50, sub: 'Free building time where their imagination leads.'},
			{photo: 'connect.jpg', card: topRight(450), kicker: 'For parents', lines: ['They create.', '*You pause*', '*& connect.*'], size: 50, sub: 'Enjoy a coffee at our café while they play and learn.'},
		],
	},
	{
		name: 'little',
		stories: [
			{photo: 'clay.jpg', card: topLeft(540), kicker: "L'Atelier · Ages 2 to 12", lines: ['From 2 years', '*and up*.'], size: 56},
			{photo: 'apron.jpg', card: {left: 40, bottom: SAFE_BOTTOM + 20, w: 440}, kicker: 'Little explorers', lines: ['Tiny hands,', '*big discoveries*.'], size: 44, sub: 'Clay, colours and first creations, at their own pace.'},
		],
	},
];

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

/** Every carousel Story, flattened: Still id, output file and the frame to render. */
export const CAROUSEL_STORIES = CAROUSELS.flatMap(({name, stories}) =>
	stories.map((story, i) => ({
		id: `StoryCarousel${cap(name)}${i + 1}`,
		file: `luciole-story-${name}-${i + 1}`,
		dir: `carousel/${name}`,
		story: {x: 50, ...story} as Story,
	})),
);

export const CarouselStory: React.FC<{story: number; file?: string}> = ({story}) => {
	const s = CAROUSEL_STORIES[story];
	return <StoryFrame story={s.story} dir={s.dir} />;
};
