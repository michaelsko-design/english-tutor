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

  // Street sits on a near-black map: mid and light greys for the big shapes, lit lime and amber
  // details, and the app draws a light rim around mission art on dark themes.
  'urban-night': {
    style: [
      'Polished 2.5D illustration for an English-learning app for teenagers (ages 12–18), in a cool city-at-night street style, like a high-quality mobile game diorama: a three-quarter view from above with real volume and depth. Every object has a lit top face, a mid side face and a darker side face, soft gradients, gentle ambient shading where surfaces meet, slightly rounded bevelled edges and a little material texture (brick, metal, wood). The lime neon and amber lights cast soft coloured light onto nearby surfaces. Still a clean illustration, not a photo and not a busy realistic 3D render.',
      'Palette: graphite #343844 and mid greys #5B6170 and #8A909C for the big shapes, light grey #C9CED8 for the lit faces and highlights (never pure white), one lime accent #B6F23A for neon tubes, lit signs and trims, and warm amber #F5B544 only for a few lit windows or bulbs. The big shapes are mid and light greys, never near-black, because the picture is shown on a near-black map. A thin charcoal #16181D outline still closes the whole silhouette.',
      'Night-time, moody but clean. Not childish: no faces on objects, no blush, no sparkles, no glitter, no hearts, no stars, no rainbow colours, no graffiti tags or writing. Neon tubes light the surfaces around them but have no glow halo floating in the air.',
    ].join('\n'),
    // The flat style the pilot compared against (renderMissionArt.mjs urban-night:flat)
    styleVariants: {
      flat: [
        'Flat vector illustration for an English-learning app for teenagers (ages 12–18), in a cool city-at-night street style: flat colour fills, clean even charcoal #16181D outlines, at most one soft shade per colour, bold simple shapes, like a good street-culture app illustration.',
        'Palette: graphite #343844 and mid greys #5B6170 and #8A909C for the big shapes, light grey #C9CED8 for highlights and light areas (never pure white), one lime accent #B6F23A for neon tubes, lit signs and trims, and warm amber #F5B544 only for a few lit windows or bulbs. The big shapes are mid and light greys, never near-black, because the picture is shown on a near-black map.',
        'Night-time, moody but clean. Not childish: no faces on objects, no blush, no sparkles, no glitter, no hearts, no stars, no rainbow colours, no graffiti tags or writing. Neon is drawn as flat lime tubes with no glow halo.',
      ].join('\n'),
    },
    landmarkIdea:
      'Each picture is one small free-standing piece of a city street at night, like a corner cut out of the city: a shop front, a kiosk, a market stall, a mural wall, a stage or a doorway, with one or two street objects in front that together show one unit topic. Every sign, poster and screen is blank or shows only a simple picture, never words.',
    pairs: {
      boss: {
        names: ['boss-locked', 'boss-open'],
        subject:
          'The end-of-unit challenge, drawn as a small rooftop stage: a boxy stage booth on a flat rooftop edge, with a blank lime neon-tube frame above its wide opening and a small water tank beside it. Left: a corrugated metal roller shutter is pulled all the way down over the opening and locked with a heavy padlock at the bottom; the neon frame is dark grey and unlit. Right: the very same booth and rooftop with the shutter rolled up into its housing, the neon frame lit lime, and inside a lit stage with a microphone on a stand, a speaker stack and two amber spotlight beams.',
      },
      chest: {
        names: ['chest-closed', 'chest-open'],
        subject:
          'A reward, drawn as a sneaker box, the two boxes standing free on the white background with no frame or panel around them: a graphite shoe box with a lime stripe along the lid and a lime lace tied around it in a bow, seen from a slight three-quarter angle from above. Left: the box is shut, the lace tied. Right: the very same box with the lid leaning against it and the lace loose, the box full of small faceted lime gems on light grey tissue paper.',
      },
    },
    singles: {
      'level-badge':
        "The learner's level, drawn as a vinyl record seen straight from the front: a mid-grey #5B6170 record with thin light grey grooves and a light grey rim, and a large plain graphite #343844 centre label ringed in lime that is completely empty (a number is written on it later). The record fills the picture, the centre label takes about half its width, perfectly round and symmetric, no hole drawn in the middle.",
    },
    landmarks: {
      'g1-u11': 'ABC Friends: a short brick wall painted with three big rounded mural letters, A, B and C, in lime, light grey and amber.',
      'g1-u12': 'Letter Parade: a small street stage with three big marquee-bulb letters, G, H and I, standing on it in a row, under a string of amber bulbs.',
      'g1-u13': 'Letter Garden: a sidewalk planter box full of plants, with the letters N, O and P stencilled in lime on its side.',
      'g1-u14': 'All the Letters: a bus shelter whose lit poster panel shows three big letters, X, Y and Z.',
      'g1-u15': 'Word Builder: a small shop front with a lime neon-tube sign spelling C A T over the door and a cat sitting on the awning.',
      'g1-u16': 'I Can Read!: a little free-library box on a post, its glass door showing rows of books, with a small bench beside it.',
      'g1-u1': 'Hello Forest Friends: a wall with a mural of pine trees and a fox, and a real young tree in a sidewalk planter in front.',
      'g1-u2': 'Numbers & Sunshine: a hopscotch grid chalked on the pavement with the digits 1, 2 and 3, in front of a wall with a round amber sun mural.',
      'g1-u3': 'My Body & Classroom: a small school entrance with a blank chalkboard sandwich sign and a backpack hanging on the stair railing.',
      'g1-u4': 'Fruit Picnic & Playtime: a street fruit stall under a striped awning with crates of apples and bananas, and a ball beside it.',
      'g2-u1': 'Toy Shop & CVC Words: a toy shop window under an awning with a ball, a small bat and a cap on display.',
      'g2-u2': 'My Family & Healthy Snacks: a corner deli front with a family of three silhouettes painted on the window and a crate of apples outside.',
      'g2-u3': 'Farm & Pet Friends: a pet shop front whose sign is only a paw-print picture, with a dog sitting by a water bowl outside and a cow painted on the side wall. No words on the shop.',
      'g2-u4': 'My Home & My Clothes: a small apartment building front with a washing line of shirts strung between two lit windows.',
      'g3-u1': 'Little Artists & School Supplies: a half-painted mural wall with a ladder, a paint bucket and spray-paint cans in front.',
      'g3-u2': 'Days, Weather & Feelings: a bus stop in light rain with an open umbrella leaning on the bench and a sun peeking out from a cloud above.',
      'g3-u3': 'Zoo Animals & I Can: a zoo entrance gate with a lion silhouette standing on top of the arch.',
      'g3-u4': 'My Birthday Party: a small café front with balloons tied to the door and a birthday cake with one candle in the window.',
      'g4-u1': 'Superhero Action Academy: a rooftop corner with a caped hero figure standing on a ventilation box, a spotlight beam behind.',
      'g4-u2': 'Around the House & My Room: a narrow town house cut open at the front, showing three lit rooms: a bedroom, a kitchen and a living room.',
      'g4-u3': 'Sports Stars & Hobbies: a small fenced street court with a basketball hoop, a ball and a skateboard.',
      'g4-u4': 'The Healthy Food Market: a market stall with crates of carrots, leafy greens and apples and a hanging scale.',
      'g5-u1': 'Pet Café & Animals: a café front with a cat sitting in the window and a coffee cup picture on the hanging sign.',
      'g5-u2': 'Town Explorers & Telling Time: a street clock on a tall post at a crossing, beside a signpost with blank arrow signs.',
      'g5-u3': 'My Daily Routine: a morning coffee kiosk with a wall clock, a bicycle parked in front and one amber-lit window.',
      'g5-u4': 'Free Time & Weekends: a small cinema front with a blank lit marquee, a popcorn picture on a poster and a guitar case leaning by the door.',
      'g6-u1': 'After-School Creators Club: a club doorway with a chess table and two stools outside and a paint palette picture on the sign.',
      'g6-u2': 'Digital Skills: a phone kiosk with a giant phone-shaped sign whose screen shows a lime sound wave, a laptop on the counter.',
      'g6-u3': 'Last Weekend & Holiday Memories: a festival stall with a festive eye mask hanging on it and fireworks bursting above a lamp post.',
      'g6-u4': 'Ready for Grade 7: a school gate with a rocket taking off painted on the wall beside it.',
      'g7-u1': 'Café & Daily Vibes: a bubble tea kiosk with a giant bubble tea cup on its roof and a paper lantern.',
      'g7-u2': 'Backstage Studio & Live Vlogs: a studio back door with a lit lime on-air bulb above it and a speaker stack and a mic stand outside.',
      'g7-u3': 'London Mystery Diary: a lamp-lit brick alley corner with an old phone box, a street lamp and footprints leading in.',
      'g7-u4': 'Future Creators & Teen Advice: a maker garage with its door half rolled up, a workbench inside and a lit light-bulb sign above.',
      'g8-u1': 'Global Travellers & Past Adventures: a station entrance with a blank departure board, a suitcase and a backpack by the door.',
      'g8-u2': 'London Clues & Future Plans: an underground station entrance with a blank round sign on a pole and a ticket lying on the steps.',
      'g8-u3': 'Life Milestones & Experiences: a climbing wall on the side of a building with a medal hanging from the top hold.',
      'g8-u4': 'Planet Earth & Eco-Warriors: a rooftop garden with planters, a small tree and two solar panels.',
      'g9-u1': 'Future Innovators & Teen Podcast: a small radio booth with a big microphone sign on its roof and a lit on-air bulb.',
      'g9-u2': 'The AI Revolution & Debate Club: a robot sculpture on a plinth in a small square, facing a street speaker’s podium.',
      'g9-u3': 'Media Literacy & the News: a newsstand kiosk with racks of folded papers and magazines with blank covers.',
      'g9-u4': 'Global Citizens & High School Countdown: high school front steps with a graduation cap and a globe painted on the wall above the door. The whole building fits inside the picture, roof included.',
      'g10-u1': 'Global Youth Summit & Environment: a building corner with a small wind turbine on the roof and recycling bins on the curb. Its banner shows only a leaf picture, never words.',
      'g10-u2': 'Media Literacy & Digital Footprints: a wall with a giant phone mural, a trail of painted footprints on the pavement and a padlock picture on the screen.',
      'g10-u3': 'Scientific Inquiries: a science centre front with a big round porthole window showing a deep-sea fish, and a small telescope on the roof.',
      'g10-u4': 'Technology Ethics & Future Dilemmas: a street crossing with a signpost of two blank arrows pointing different ways and a small robot under a street lamp.',
      'g11-u1': 'Literature, Cinema & Critical Minds: an old cinema front with a blank marquee and a film reel picture on a poster, a book on the ticket counter.',
      'g11-u2': 'Perspectives & Comparative Literature: a theatre door with a lime neon sign of the two theatre masks above it.',
      'g11-u3': 'Modals in the Past & Turning Points: a street corner clock tower with an hourglass picture on a hanging sign.',
      'g11-u4': 'Reading Comprehension & Scientific Unseens: a library front whose sign is only an open-book picture, with a bar chart and a pie chart painted as a mural on its side wall. No words on the building.',
      'g12-u1': 'Academic Connectors: a small footbridge linking two rooftops, with chain-link railings.',
      'g12-u2': 'The Bagrut Opinion Essay: a speaker’s corner: a wooden crate with a megaphone on it, in front of a wall with a giant fountain pen mural.',
      'g12-u3': "Author's Tone & Unseen Texts: a record shop front with a big volume dial picture on its sign and a magnifying glass picture in the window.",
      'g12-u4': 'Global Horizons & Professional Future: an office tower entrance with a globe sculpture in front and lit amber windows above.',
    },
  },
};
