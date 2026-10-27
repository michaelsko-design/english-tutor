/**
 * The mission art of each theme that has its own set (ThemeBase.missionArtFolder): a style block
 * and a subject for every picture. Read by scripts/art/renderMissionArt.mjs.
 *
 * The Boss and the chest are drawn as pairs (closed and open side by side on one sheet), so both
 * halves are the same object; scripts/process_art.py splits a "<left>+<right>" sheet in two.
 * Landmarks keep each unit's topic (the unit names in src/data/curriculum) and show it through
 * the theme's own idea. Letters may appear only where a subject names them.
 */

export const MISSION_ART_THEMES = {
  'focus-desk': {
    style: [
      'Flat vector illustration for an English-learning app for teenagers (ages 12–18), in a calm, grown-up study-desk style: flat colour fills, thin even slate outlines, at most one soft shade per colour, simple geometric shapes, like a good editorial icon illustration.',
      'Palette: slate ink #334155 for outlines and dark shapes, slate greys #475569, #94A3B8 and #CBD5E1, warm paper #F1EEE8 for light areas (never pure white), one teal accent #0F9D8A, and orange #F97316 only for one or two small highlights per picture (a light, a tab, a dot).',
      'Muted and quiet. Not childish: no faces on objects, no blush, no sparkles, no glitter, no hearts, no stars, no rainbow colours, no glow effects.',
    ].join('\n'),
    landmarkIdea:
      'Each picture is a small desk still life: two or three everyday study-desk objects that together show one unit topic, standing close together as one group.',
    pairs: {
      boss: {
        names: ['boss-locked', 'boss-open'],
        subject:
          'The end-of-unit challenge, drawn as an exam-hall entrance: a pair of tall slate double doors in a simple paper-coloured stone frame, with two small round windows and a blank teal plate above them. Left: the doors are shut and locked, a heavy teal bar across both handles with a small slate padlock; the windows are dark. Right: the very same doors and frame, swung wide open onto a small lit stage inside, with a plain wooden podium in the middle and warm orange light falling out across the threshold.',
      },
      chest: {
        names: ['chest-closed', 'chest-open'],
        subject:
          'A reward, drawn as a slate-grey hard-shell document briefcase with a teal handle and two orange clasps, standing upright on its short side, seen from a slight three-quarter angle. Left: the briefcase is shut, the clasps closed. Right: the very same briefcase lying open with the lid up, full of small faceted teal gems with a soft orange light rising from inside.',
      },
    },
    singles: {
      'level-badge':
        "The learner's level, drawn as a flat round seal: a wide teal ring with a thin slate outline around a large plain slate #334155 centre disc that is completely empty (a number is written on it later), and a short orange bookmark ribbon with a notched end hanging from the bottom of the ring. The centre disc is in the middle of the picture and takes about half its width. Seen straight from the front, symmetric.",
    },
    landmarks: {
      'g1-u11': 'ABC Friends: three chunky wooden letter tiles, A, B and C, standing in a row beside a short pencil.',
      'g1-u12': 'Letter Parade: three letter cards, G, H and I, hanging in a row from a string line between two binder clips on a small desk stand, like a little parade of flags.',
      'g1-u13': 'Letter Garden: a small potted plant with a few leaves, with three letter tiles, N, O and P, leaning against the pot.',
      'g1-u14': 'All the Letters: an index-card box packed with letter cards fanned upright, the front cards showing X, Y and Z.',
      'g1-u15': 'Word Builder: a tile rack holding three letter tiles that spell C A T, with a small cat figurine sitting beside it.',
      'g1-u16': 'I Can Read!: a picture book standing open on a wooden book stand, its pages showing only simple pictures and blank lines (no title, no writing), with a small desk lamp leaning over it.',
      'g1-u1': 'Hello Forest Friends: a round glass terrarium with a tiny pine tree inside and a small fox figurine sitting beside it.',
      'g1-u2': 'Numbers & Sunshine: a small wooden abacus with ten beads on a rod, beside a round desk lamp whose bulb glows orange like a little sun.',
      'g1-u3': 'My Body & Classroom: a small wooden posable artist mannequin standing beside a school backpack with a book and a pen.',
      'g1-u4': 'Fruit Picnic & Playtime: an open lunch box with an apple and a banana, and a small toy ball beside it.',
      'g2-u1': 'Toy Shop & CVC Words: an open cardboard box with a toy ball, a small toy bat and a little cap peeking out.',
      'g2-u2': 'My Family & Healthy Snacks: a standing photo frame with three simple silhouettes of a family, beside a small bowl of apples.',
      'g2-u3': 'Farm & Pet Friends: a small toy barn with a cow figurine and a pet food bowl in front of it.',
      'g2-u4': 'My Home & My Clothes: a small architect model of a house with a folded shirt lying beside it.',
      'g3-u1': 'Little Artists & School Supplies: a pencil cup full of coloured pencils beside a small open sketchbook and a crayon.',
      'g3-u2': 'Days, Weather & Feelings: a flip desk calendar with blank pages, a small folded umbrella and a little sun-and-cloud desk ornament.',
      'g3-u3': 'Zoo Animals & I Can: a lion figurine standing on a short stack of books, with a small pair of binoculars.',
      'g3-u4': 'My Birthday Party: a cupcake with one candle, a small wrapped present and one balloon tied to it on a string.',
      'g4-u1': 'Superhero Action Academy: a small action figure in a cape standing on a book, beside a folded hero mask.',
      'g4-u2': 'Around the House & My Room: a small cut-away model of a house showing three tiny rooms: a bed, a table, a sofa.',
      'g4-u3': 'Sports Stars & Hobbies: a football, a whistle on a cord and a jar with two paint brushes.',
      'g4-u4': 'The Healthy Food Market: a paper grocery bag with a carrot, leafy greens and an apple poking out of the top.',
      'g5-u1': 'Pet Café & Animals: a café coffee cup on a saucer with a small cat figurine sitting beside it.',
      'g5-u2': 'Town Explorers & Telling Time: a folded town map with a round alarm clock standing on it.',
      'g5-u3': 'My Daily Routine: an open weekly planner with blank check-box lines, a round alarm clock and a breakfast mug.',
      'g5-u4': 'Free Time & Weekends: a pair of headphones, a small guitar leaning beside them and a popcorn bucket.',
      'g6-u1': 'After-School Creators Club: a small chess board with a few pieces and a paint palette leaning against it.',
      'g6-u2': 'Digital Skills: an open laptop with a smartphone beside it, its screen showing a simple sound wave.',
      'g6-u3': 'Last Weekend & Holiday Memories: three instant photos pinned to a small cork board, beside a festive eye mask.',
      'g6-u4': 'Ready for Grade 7: a stack of textbooks with a small folded paper rocket standing on top.',
      'g7-u1': 'Café & Daily Vibes: a bubble tea cup with a wide straw beside a smartphone showing a few blank chat bubbles.',
      'g7-u2': 'Backstage Studio & Live Vlogs: a studio microphone on a small stand with headphones and a little mixing desk.',
      'g7-u3': 'London Mystery Diary: a closed leather diary with an old key and a magnifying glass lying on it.',
      'g7-u4': 'Future Creators & Teen Advice: a desk lamp with an orange-lit bulb shining on an open notebook of plans.',
      'g8-u1': 'Global Travellers & Past Adventures: a passport, a blank plane ticket and a small desk globe.',
      'g8-u2': 'London Clues & Future Plans: a pocket watch and a blank train ticket on a folded street map with one pin in it.',
      'g8-u3': 'Life Milestones & Experiences: a framed blank certificate, a medal on a ribbon and a hiking boot.',
      'g8-u4': 'Planet Earth & Eco-Warriors: a desk globe with a small sprouting plant and a little solar panel beside it.',
      'g9-u1': 'Future Innovators & Teen Podcast: a podcast microphone on a boom arm, headphones and a round on-air light lit orange.',
      'g9-u2': 'The AI Revolution & Debate Club: a small robot figure standing in front of a tiny debate lectern.',
      'g9-u3': 'Media Literacy & the News: a folded newspaper with blank columns, a magnifying glass and an old light bulb.',
      'g9-u4': 'Global Citizens & High School Countdown: a graduation cap resting on a stack of books beside a small globe.',
      'g10-u1': 'Global Youth Summit & Environment: a small model wind turbine beside a recycling bin and a potted plant.',
      'g10-u2': 'Media Literacy & Digital Footprints: a smartphone showing a single footprint on its screen, with a small padlock beside it.',
      'g10-u3': 'Scientific Inquiries: a microscope beside a rack of test tubes and a small jar of deep-blue ocean water.',
      'g10-u4': 'Technology Ethics & Future Dilemmas: a small balance scale with a microchip on one pan and a little person figure on the other.',
      'g11-u1': 'Literature, Cinema & Critical Minds: a film clapperboard with blank boards lying on an open book.',
      'g11-u2': 'Perspectives & Comparative Literature: two books standing open facing each other, with a pair of theatre masks between them.',
      'g11-u3': 'Modals in the Past & Turning Points: an hourglass beside an old photo in a frame and a brass compass.',
      'g11-u4': 'Reading Comprehension & Scientific Unseens: a clipboard holding a bar chart and a pie chart, with a highlighter pen.',
      'g12-u1': 'Academic Connectors: three large linked chain rings lying on a sheet with a simple arrow diagram.',
      'g12-u2': 'The Bagrut Opinion Essay: a fountain pen lying on a lined page with blank lines, beside a short stack of drafts.',
      'g12-u3': "Author's Tone & Unseen Texts: a magnifying glass over a page with one highlighted line, beside a round dial knob.",
      'g12-u4': 'Global Horizons & Professional Future: an open laptop with a small globe and a blank lanyard ID badge beside it.',
    },
  },
};
