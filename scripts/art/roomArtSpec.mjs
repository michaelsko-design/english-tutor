/**
 * What the themed My English Room art draws: 26 pictures per theme (sofa, armchair, items, stickers)
 * in the 2.5D corner-room style approved in the pilot (scripts/art/renderRoomPilot.mjs). Data and
 * prompt wording only; renderRoomArt.mjs packs the pictures into sheets and sends them. The bed,
 * wardrobe, desk and shelves are drawn into each theme's room picture (renderBakedRoom.mjs).
 *
 * The room is a corner seen from inside: the left wall has the window, the right wall is plain and
 * carries the shelves. Light comes from the left-wall window, so cast shadows fall to the right and
 * a little toward the viewer.
 */
import { join } from 'node:path';

export const ROOM_ART_DIR = join(process.cwd(), 'art-src', 'room-art');

export const HOUSE_STYLE =
  'Polished 2.5D game art for a children’s English-learning app (ages 6–17): soft rounded shapes with a gentle three-quarter depth, clean dark outlines, smooth cel shading with one soft highlight and one soft shade per colour, rich but friendly colours. No text, no letters, no numbers, no logos, no watermark, no faces on objects, except the eyes and nose of a toy animal or robot.';

export const CUTOUT_RULES = [
  'A thin dark outline closes the whole silhouette of every picture, with no gaps. No pure white inside any drawing: use the lightest colour of its palette instead.',
  'The whole sheet is one plain white image with no lines or boxes of any kind: no frame around the sheet, around a cell or around a picture. Never write any text, label, number, angle or measurement on the sheet.',
  'Plain pure white background (#FFFFFF) around every picture. No ground line, no table top, no floor, no scenery, no frame, no card behind a picture. A picture has a cast shadow ONLY when its own line below says it has a baked-in shadow; every other picture has no shadow at all.',
].join('\n');

/** How each theme dresses its furniture and items (matches its room picture). */
export const THEME_LOOKS = {
  'cozy-studio':
    'cozy pastel style: peach, rose, cream, butter yellow and lavender, soft rounded plush shapes, warm honey wood',
  'neon-pop':
    'neon arcade style: deep indigo and black bodies with glowing cyan and magenta neon edge trims, glossy highlights',
  'starlight-rpg':
    'fantasy storybook style: royal violet, midnight indigo and shiny gold accents, ornate but simple shapes, little stars',
  'focus-desk':
    'calm modern study style: warm paper cream, slate blue-grey, light oak wood and one teal accent, clean simple shapes, matte finishes',
  'urban-night':
    'city loft style: graphite and concrete greys, dark metal and painted brick, one lime-green neon accent, bold simple shapes, a little industrial',
  'travel-journal':
    'explorer style: sand and cream, navy blue and olive green, dark wood and brass, terracotta accents, worn leather and canvas, a little vintage',
};

export const THEME_IDS = Object.keys(THEME_LOOKS);

/** Every picture is drawn in one of these views (see the pilot: the ground angle drifts steeper than asked, so the slopes are stated). */
// No digits or units anywhere in these texts: the model letters numbers it is given onto the picture (the first calibration came back with "~12°" and "~40%" written on it).
const LOW_CAMERA =
  'the camera looks at the object from a very low angle, almost level with it (not from above), so its bottom edges look almost horizontal, only slightly slanted';
const ONLY_THE_OBJECT =
  'Draw ONLY the object itself on the white background: no wall, no wall panel, no room, no box, no corner lines and no surface behind or around it, and no thin lines anywhere on the sheet (earlier sheets drew corner walls, little rooms and stray lines around objects); the perspective shows only in the object’s own shape';
const VIEW_A = `drawn in a low three-quarter 2.5D view: ${LOW_CAMERA}; the object is turned diagonally so its long front side and its short left side are both visible; its long bottom edge slants gently down toward the right and its short bottom edge slants gently down toward the left; it stands on its feet or legs on one flat ground plane. ${ONLY_THE_OBJECT}`;
const RIGHT_WALL_FLAT = `drawn flat, tilted in gentle perspective as if seen from the left: its left end is a little shorter and higher on the page than its right end, so its top and bottom edges slant gently down toward the right. ${ONLY_THE_OBJECT}`;
const ROUND_VIEW = `drawn in a low 2.5D view (${LOW_CAMERA}), resting on one flat ground plane`;

const FLOOR_SHADOW =
  'WITH a baked-in cast shadow on the floor: the light comes from a window on the left, so the shadow lies on the RIGHT-hand side of the object, on the floor to its right and a little in front of it; the soft-edged semi-transparent dark violet-grey shadow touches the bottom of the feet and follows the object’s own outline, and NO part of the shadow shows on the left side of the object; the shadow is a flat shape on the ground only';
const DESK_SHADOW =
  'WITH a small baked-in cast shadow on the surface it stands on: the light comes from the left, so the soft-edged semi-transparent dark violet-grey shadow lies on the RIGHT-hand side of the object, touching its base, and NO part of it shows on the left; the shadow is a flat shape on the surface only';
const NO_SHADOW = 'with NO shadow';

/**
 * The pictures. `group` orders the packing; `view` is one of the views above; `shadow` is none, floor
 * or desk. `subject` is the base description; `overrides` replaces it for a theme (the pilot's
 * approved texts). The sofa and armchair are drawn facing the viewer (see frontFurnitureJobs).
 */
const ITEMS = [
  { id: 'room-sofa', group: 'big', view: VIEW_A, shadow: 'floor', subject: 'a two-seat sofa with two back cushions and four feet',
    overrides: {
      'cozy-studio': 'a plump two-seat sofa in rose-pink with cream cushions and short honey-wood legs',
      'neon-pop': 'a low modern two-seat sofa in dark indigo with glowing cyan neon strip along the bottom edge and magenta cushions',
      'starlight-rpg': 'a royal two-seat sofa in deep violet velvet with gold trim, tufted back, carved gold feet and a star-patterned cushion',
    } },
  { id: 'room-chair', group: 'big', view: VIEW_A, shadow: 'floor', subject: 'a small cushioned armchair for a child, with four legs' },

  { id: 'room-plant', group: 'round', view: ROUND_VIEW, shadow: 'floor', subject: 'a leafy potted plant in a round pot' },
  { id: 'room-ball', group: 'round', view: ROUND_VIEW, shadow: 'floor', subject: 'a classic football (soccer ball)' },
  { id: 'room-drum', group: 'round', view: ROUND_VIEW, shadow: 'floor', subject: 'a small round drum with two drumsticks lying across the top' },

  { id: 'room-picture', group: 'wall', view: RIGHT_WALL_FLAT, shadow: 'none', subject: 'a framed picture showing a simple landscape of hills and a sun' },
  { id: 'room-mirror', group: 'wall', view: RIGHT_WALL_FLAT, shadow: 'none', subject: 'a tall oval wall mirror in a decorative frame, with a soft shine across the glass' },
  { id: 'room-clock', group: 'wall', view: RIGHT_WALL_FLAT, shadow: 'none', subject: 'a round wall clock with two simple hands and no numbers' },
  { id: 'room-kite', group: 'wall', view: RIGHT_WALL_FLAT, shadow: 'none', subject: 'a diamond-shaped kite with a tail of three bows, hanging on the wall' },

  { id: 'room-lamp', group: 'desk', view: VIEW_A, shadow: 'desk', subject: 'a small desk lamp with a shade, switched on',
    overrides: {
      'cozy-studio': 'a small desk lamp with a round cream fabric shade and a rose-pink ceramic base, warm glowing bulb light',
      'neon-pop': 'a desk lamp made of a bent dark metal arm with a glowing magenta neon tube shade and a cyan neon ring at its base',
      'starlight-rpg': 'a small magical lantern lamp with a gold frame, a glowing warm yellow orb inside and little gold stars hanging from it',
    } },
  { id: 'room-computer', group: 'desk', view: VIEW_A, shadow: 'desk', subject: 'an open laptop computer whose screen shows a simple abstract picture, no text' },
  { id: 'room-globe', group: 'desk', view: VIEW_A, shadow: 'desk', subject: 'a small desk globe of the Earth on a stand' },
  { id: 'object-phone', group: 'desk', view: VIEW_A, shadow: 'desk', subject: 'a smartphone lying flat, its screen glowing with two plain speech bubbles and no text' },
  { id: 'object-games-book', group: 'desk', view: VIEW_A, shadow: 'desk', subject: 'a chunky game book lying flat, closed, with a star badge on the cover',
    overrides: {
      'cozy-studio': 'a chunky padded hardcover game book lying flat, rose-pink cover with a cream page block, a lavender ribbon bookmark hanging out, a simple yellow star badge on the cover',
      'neon-pop': 'a sleek game book lying flat, dark indigo cover with a glowing cyan neon edge outline and a magenta neon controller symbol on the cover, dark page block',
      'starlight-rpg': 'a thick magical spell-tome lying flat, violet leather cover with golden corner plates, a golden clasp and a gold crescent moon and star on the cover, cream page block',
    } },
  { id: 'decor-neon-lamp', group: 'desk', view: VIEW_A, shadow: 'desk', subject: 'a flower-shaped table lamp: a glowing blossom on a stem with two leaves, on a round base' },

  { id: 'room-books', group: 'shelf', view: VIEW_A, shadow: 'none', subject: 'a small stack of three books of different sizes' },
  { id: 'room-teddy', group: 'shelf', view: VIEW_A, shadow: 'none', subject: 'a sitting teddy bear toy with a small bow' },
  { id: 'room-robot', group: 'shelf', view: VIEW_A, shadow: 'none', subject: 'a small friendly toy robot with a square head and an antenna' },
  { id: 'room-cactus', group: 'shelf', view: VIEW_A, shadow: 'none', subject: 'a small round cactus with two little arms in a small pot' },
  { id: 'room-trophy', group: 'shelf', view: VIEW_A, shadow: 'none', subject: 'a golden winner’s cup trophy with two handles on a small base' },

  { id: 'room-star', group: 'board', view: RIGHT_WALL_FLAT, shadow: 'none', subject: 'a bright five-point star sticker' },
  { id: 'room-rainbow', group: 'board', view: RIGHT_WALL_FLAT, shadow: 'none', subject: 'a rainbow sticker with a small cloud at each end' },
  { id: 'room-heart', group: 'board', view: RIGHT_WALL_FLAT, shadow: 'none', subject: 'a plump heart sticker with a shiny highlight' },
  { id: 'sticker-strawberry-croissant', group: 'board', view: RIGHT_WALL_FLAT, shadow: 'none', subject: 'a croissant sticker' },
  { id: 'sticker-backstage-pass', group: 'board', view: RIGHT_WALL_FLAT, shadow: 'none', subject: 'an electric guitar sticker' },
  { id: 'sticker-london-compass', group: 'board', view: RIGHT_WALL_FLAT, shadow: 'none', subject: 'a round navigation compass sticker with a needle' },
];

const GROUP_ORDER = ['big', 'round', 'wall', 'desk', 'shelf', 'board'];

const SHADOW_TEXT = { none: NO_SHADOW, floor: FLOOR_SHADOW, desk: DESK_SHADOW };

/** The picture of one item for a theme. */
function pictureOf(theme, item) {
  const base = item.overrides?.[theme] ?? item.subject;
  return {
    id: item.id,
    hasShadow: item.shadow !== 'none',
    subject: `(${theme} theme, ${THEME_LOOKS[theme]}) ${base}, ${item.view}; ${SHADOW_TEXT[item.shadow]}`,
  };
}

/** Every picture of every theme as a job for the sheet packer: { key, kind, subject, path, hasShadow }. */
export function allJobs() {
  const ordered = [...ITEMS].sort((a, b) => GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group));
  return THEME_IDS.flatMap((theme) =>
    ordered.map((item) => pictureOf(theme, item)).map((picture) => ({
      key: `${theme}/${picture.id}`,
      kind: 'single',
      subject: picture.subject,
      hasShadow: picture.hasShadow,
      path: join(ROOM_ART_DIR, theme, `${picture.id}.png`),
    }))
  );
}

export const ROOM_ART_SPEC = { style: HOUSE_STYLE, landmarkIdea: '' };

/**
 * The sofa and armchair for a room with its furniture drawn in (scripts/art/renderBakedRoom.mjs): they
 * face the viewer straight on, at the room's own camera, so they never need turning and fit anywhere on
 * its floor. Several takes of each on one sheet, with the room picture as the reference; the picked
 * take becomes room-sofa / room-chair (process_room_art.py adds the shadow).
 */
export const FRONT_FURNITURE_THEMES = ['starlight-rpg', 'cozy-studio', 'neon-pop', 'focus-desk', 'urban-night', 'travel-journal'];
const FRONT_TAKES = { 'room-sofa': 5, 'room-chair': 4 };
const FRONT_NOTE = 'drawn alone, with NO shadow at all (not on the floor and not on the object)';
const TAKE_WORDS = ['first', 'second', 'third', 'fourth', 'fifth'];

const FRONT_VIEW = [
  'drawn for the room in the reference picture, with exactly its camera: a low camera looking almost straight ahead, NOT from above',
  'the object stands on the floor facing the viewer straight on: its front is parallel to the picture and its back is toward the back wall of that room, so we see its front and a little of its top, and its sides only a little, in gentle perspective',
  'its bottom edge is level; its upright edges stay exactly vertical; it stands on its feet on the floor; it is drawn at a size to fit that room and matches the style of the bed, wardrobe and desk in it',
  ONLY_THE_OBJECT,
].join('; ');

/** The front-facing sofa and armchair takes: { key, kind, subject, path, theme, referencePicture }. */
export function frontFurnitureJobs() {
  return FRONT_FURNITURE_THEMES.flatMap((theme) =>
    Object.entries(FRONT_TAKES).flatMap(([id, takes]) => {
      const item = ITEMS.find((candidate) => candidate.id === id);
      const base = item.overrides?.[theme] ?? item.subject;
      return Array.from({ length: takes }, (_, index) => ({
        key: `${theme}/${id}-front-${index + 1}`,
        kind: 'single',
        theme,
        hasShadow: false,
        referencePicture: 'room-baked.webp',
        // a word, not a digit: the model letters digits it is given onto the picture
        subject: `(${theme} theme, ${THEME_LOOKS[theme]}) ${base}, ${FRONT_VIEW}; ${FRONT_NOTE}; the ${TAKE_WORDS[index]} take of it, with its own design, different from the other takes`,
        path: join(ROOM_ART_DIR, theme, `${id}-front-${index + 1}.png`),
      }));
    })
  );
}
