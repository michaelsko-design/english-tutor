/**
 * What each vocabulary picture shows (scripts/art/renderVocabPictures.mjs). A word missing here is
 * drawn from the default subject: the word and its Hebrew meaning, as one clear object. Hand-written
 * subjects are for words a default would get wrong: actions, feelings, colours, numbers, places,
 * and words whose emoji shows something else.
 *
 * Keys are the lowercase English word, or `word|Hebrew` when one word has two meanings.
 */
export const SUBJECTS = {
  // Pilot sheet (already drawn)
  doll: "a doll: a classic soft toy baby doll with yarn hair and a simple pink dress, standing, clearly a toy (not a real child, not a nesting doll)",
  desk: "a desk: a child's wooden school writing desk with one drawer, a closed notebook and a pencil on top, seen from the front at a slight angle, with no chair",
  carpet: 'a carpet: a rectangular patterned floor rug with fringes on the short ends, lying flat, seen from above at an angle',
  card: 'a greeting card: a folded card standing half open, with a balloon and a heart drawn on its front, no writing',
  kitten: 'a kitten: a tiny fluffy baby cat with a big head, big eyes and short legs, sitting, clearly very young and small',
  puppy: 'a puppy: a tiny round baby dog with floppy ears, big paws and a big head, sitting, clearly very young',
  jump: 'jump: a happy child in the middle of a jump, both feet high off the ground, arms up, with small motion lines under the feet',
  fly: 'fly: a small bird flying with wings spread wide, with a few curved air lines behind it, in the middle of the cell',
  brother: 'brother: a big boy and a little boy standing side by side holding hands, looking alike (same hair colour)',
  sister: 'sister: a big girl and a little girl standing side by side holding hands, looking alike (same hair colour)',
  grandparents: 'grandparents: a smiling grandmother and grandfather with grey hair and glasses standing side by side, arm in arm',
  'bat|מחבט': 'a bat: a wooden baseball bat lying diagonally next to a white baseball, sports equipment only (not the animal)',
  box: 'a box: a closed brown cardboard box, simple cube shape, no labels',
  teddy: 'a teddy bear: a soft brown plush teddy bear sitting, with a small bow tie',
  chair: 'a chair: a simple wooden kitchen chair with four legs and a backrest, seen at an angle, with no table',
  hat: 'a hat: a simple straw sun hat with a round brim and a ribbon band',

  // Two meanings of one word
  'bat|עטלף': 'a bat (the animal): a small cute brown bat flying with its wings spread',
  'orange|תפוז': 'an orange (the fruit): a whole round orange with a small green leaf, next to one orange slice',
  'orange|כתום': 'the colour orange: a big round splash of bright orange paint, nothing else',

  // People and family
  friend: 'friends: two smiling children of the same age, a boy and a girl, standing side by side with their arms around each other’s shoulders',
  mother: 'mother: a smiling young mother hugging her small child',
  father: 'father: a smiling young father carrying his small child on his shoulders',
  family: 'a family: a mother, a father and two children standing together, smiling',
  baby: 'a baby: a small smiling baby in a diaper sitting up, holding a rattle',
  queen: 'a queen: a friendly queen with a golden crown and a long red royal robe',
  team: 'a team: four children in the same matching sports shirts standing together with their arms raised, one holding a ball',
  club: 'a club: a small group of children sitting together around a table building a model rocket',
  winner: 'a winner: a happy child on the top step of a winners’ podium holding up a golden trophy',

  // Body
  eye: 'an eye: one big friendly cartoon eye with eyelashes',
  hand: 'a hand: an open hand with five fingers, palm facing forward',
  ear: 'an ear: one human ear, side view',
  nose: 'a nose: a friendly cartoon human nose, side view',
  lip: 'lips: a pair of smiling pink lips',

  // Actions
  stand: 'stand: a child standing up straight on both feet, arms by the sides, smiling',
  sit: 'sit: a child sitting on a chair, hands on knees',
  open: 'open: a child opening a big door, the door half open',
  listen: 'listen: a child holding a hand behind one ear, listening carefully, with small sound waves coming toward the ear',
  eat: 'eat: a child at a table eating soup with a spoon',
  drink: 'drink: a child drinking a glass of water',
  swim: 'swim: a child swimming in blue water, arms stroking, head above the water',
  run: 'run: a child running fast, one leg forward, arms swinging, with motion lines behind',
  dance: 'dance: a child dancing happily, one leg lifted, arms up, with small music notes around',
  sing: 'sing: a child singing with mouth open, holding a microphone, with music notes coming out',
  climb: 'climb: a child climbing up a ladder, holding the rungs with both hands',
  help: 'help: a child helping a smaller child up after a fall, reaching out a hand',
  draw: 'draw: a child drawing a sun on a sheet of paper with a crayon',
  read: 'read: a child sitting and reading an open book',
  'wake up': 'wake up: a child sitting up in bed, stretching and yawning, with a ringing alarm clock next to the bed',
  brush: 'brush (teeth): a child brushing their teeth with a toothbrush, foam on the mouth',
  sleep: 'sleep: a child sleeping in bed under a blanket, eyes closed, with a small "z z" shape drawn as curly lines (no letters)',
  record: 'record: a child speaking into a microphone on a stand, with a red recording light on the microphone',
  yawn: 'yawn: a sleepy child yawning with a wide open mouth and one hand near the mouth',
  hello: 'hello: a smiling child waving one hand hello',
  goodbye: 'goodbye: a child with a backpack walking away and waving goodbye over the shoulder',
  quiet: 'quiet: a child holding one finger to the lips to ask for silence, with no letters, no sound marks and no speech bubble',
  question: 'a question: a child scratching their head, looking puzzled, with a big question-mark-shaped thought bubble (the only symbol allowed)',

  // Feelings and descriptions
  happy: 'happy: a child with a big happy smile, eyes shining, arms open',
  sad: 'sad: a sad child with a frown and one tear on the cheek',
  tired: 'tired: a very tired child with droopy half-closed eyes and slumped shoulders, holding a pillow',
  strong: 'strong: a child lifting a big pair of dumbbells over the head, smiling',
  brave: 'brave: a small child in a superhero cape standing proudly with fists on hips',
  healthy: 'healthy: a smiling child holding an apple in one hand and a bottle of water in the other, standing on a green lawn',
  fluffy: 'fluffy: a very fluffy round white rabbit with thick soft fur',
  friendly: 'friendly: a smiling child giving a flower to another child',
  big: 'big: a big elephant standing next to a tiny mouse, the elephant clearly much bigger',
  little: 'little: a tiny little mouse next to a big shoe, the mouse clearly very small',
  high: 'high: a kite flying very high above a small house and tree',
  together: 'together: three children holding hands in a row, smiling',
  online: 'online: a child smiling at a laptop screen that shows another child waving (a video call)',

  // Colours (no text)
  red: 'the colour red: a big round splash of bright red paint, nothing else',
  blue: 'the colour blue: a big round splash of bright blue paint, nothing else',
  green: 'the colour green: a big round splash of bright green paint, nothing else',
  purple: 'the colour purple: a big round splash of bright purple paint, nothing else',
  yellow: 'the colour yellow: a big round splash of bright yellow paint, nothing else',

  // Numbers (objects to count, never digits)
  zero: 'zero: an empty round plate with nothing on it',
  one: 'one: exactly one red apple',
  three: 'three: exactly three red apples in a row',
  five: 'five: exactly 5 (five) red apples in one straight row, count them: one, two, three, four, five, no more and no fewer',
  six: 'six: exactly six red apples in two rows of three',
  eight: 'eight: exactly eight red apples in two rows of four',
  nine: 'nine: exactly nine red apples in three rows of three',
  ten: 'ten: exactly 10 (ten) red apples in two rows, five apples in the top row and five apples in the bottom row, no more and no fewer',

  // Time
  clock: 'a clock: a round wall clock with hands and small dots instead of numbers',
  "o'clock": "o'clock: a round wall clock showing exactly three o'clock (long hand straight up, short hand pointing right), dots instead of numbers",
  'half past': 'half past: a round wall clock where the long minute hand points straight down to the bottom (the six position) and the short hour hand points to the right and slightly down, halfway between three and four; dots instead of numbers',
  calendar: 'a calendar: a wall calendar page with a grid of empty squares and one day circled in red, no numbers or letters',
  friday: 'Friday (the day before Shabbat): a table set for a Friday evening dinner with two candles, a braided challah bread and a cup',
  weekend: 'the weekend: a happy family having a picnic on a blanket in a park',
  birthday: 'a birthday: a child wearing a party hat blowing out candles on a birthday cake',

  // Weather
  weather: 'the weather: a sun, a cloud with rain drops and a snowflake together in one small group',
  rainy: 'rainy: a grey cloud with lots of rain falling onto an open umbrella',
  sunny: 'sunny: a bright smiling sun shining in a clear blue sky',
  cloudy: 'cloudy: several grey and white clouds covering the sky',
  windy: 'windy: a tree bending in strong wind with leaves blowing away and wind lines',
  rain: 'rain: a cloud with rain drops falling',

  // Places and rooms
  bedroom: 'a bedroom: a cosy small bedroom with a bed, a pillow and a bedside lamp',
  kitchen: 'a kitchen: a small kitchen with a stove, a pot on it and a fridge',
  bathroom: 'a bathroom: a small bathroom with a bathtub, a sink and a mirror',
  garden: 'a garden: a small flower garden with colourful flowers and a little fence',
  library: 'a library: tall bookshelves full of colourful books with a small reading table',
  supermarket: 'a supermarket: a shop shelf full of food items next to a shopping cart',
  school: 'a school: a school building with a bell on the roof and a small playground',
  cinema: 'a cinema: rows of red cinema seats facing a big bright movie screen',
  beach: 'a beach: sand, sea waves, a beach umbrella and a sandcastle',
  house: 'a house: a small house with a red roof, a door, two windows and a chimney',
  door: 'a door: a closed wooden front door with a round door knob',
  window: 'a window: a window with four glass panes and open curtains',
  shelf: 'a shelf: one wooden wall shelf with a few books and a small plant on it',

  // Meals
  breakfast: 'breakfast: a plate with a fried egg and toast, a glass of orange juice next to it, morning sun',
  lunch: 'lunch: a lunch box with a sandwich, an apple and a small juice box',
  dinner: 'dinner: a dinner plate with chicken, rice and vegetables, a fork and knife beside it',

  // School and tech
  homework: 'homework: a child at a desk at home writing in a notebook with a pencil, a school bag beside the chair',
  science: 'science: a microscope next to two glass test tubes with coloured liquid',
  message: 'a message: a mobile phone screen showing a chat speech bubble (no letters)',
  password: 'a password: a closed padlock next to a small key',
  website: 'a website: a computer screen showing a simple web page with a picture and coloured blocks (no letters)',
  screen: 'a screen: a computer monitor screen on a stand',
  laptop: 'a laptop: an open laptop computer',
  headphones: 'headphones: a pair of over-ear headphones',
  instrument: 'a musical instrument: a guitar, a drum and a trumpet together',
  ink: 'ink: a small glass ink bottle with dark blue ink and a fountain pen dipped in it',
  paper: 'paper: a stack of white paper sheets',
  paintbrush: 'a paintbrush: one paintbrush with paint on its tip',
  envelope: 'an envelope: a closed white paper envelope',

  // Things whose emoji shows something else
  insect: 'an insect: a ladybug with six legs, clearly an insect',
  alligator: 'an alligator: a friendly green alligator with a wide rounded snout',
  iguana: 'an iguana: a green iguana lizard',
  zipper: 'a zipper: a jacket zipper, half open, close up',
  pot: 'a pot: a cooking pot with two handles and a lid',
  cup: 'a cup: a cup with a handle on a saucer',
  chip: 'chips: a paper cone of french fries',
  pin: 'a pin: a push pin pinned into a notice board',
  log: 'a log: a round wooden log, part of a tree trunk',
  leaf: 'a leaf: one single green leaf',
  rabbit: 'a rabbit: a grey rabbit with long ears',
  hen: 'a hen: a brown hen standing',
  jacket: 'a jacket: a zipped winter jacket',
  bag: 'a bag: a school backpack',
  backpack: 'a backpack: a school backpack with two straps',
  football: 'football (soccer): a black-and-white soccer ball',
  vegetables: 'vegetables: a carrot, a tomato, a cucumber and broccoli together',
  fruit: 'fruit: an apple, a banana, grapes and an orange together',
  goldfish: 'a goldfish: one orange goldfish in a round fish bowl',
  costume: 'a costume: a child dressed up in a lion costume for a party',
  present: 'a present: a gift box wrapped in paper with a big ribbon bow',
  gift: 'a gift: a gift box wrapped in paper with a big ribbon bow',
  party: 'a party: balloons, a party hat and confetti together',
  water: 'water: a clear glass of water',
  book: 'a book: one closed book with a plain cover',
  joystick: 'a joystick: a video game joystick controller',
  tennis: 'tennis: a tennis racket and a yellow tennis ball',
  basketball: 'a basketball: an orange basketball',
  chess: 'chess: a chessboard with a few chess pieces on it',
  mirror: 'a mirror: an oval wall mirror with a wooden frame',
  lamp: 'a lamp: a table lamp with a lampshade, switched on',
};

/** The subject for a word without a hand-written one. */
export function defaultSubject(word, he) {
  return `${word} (in Hebrew: ${he}): one clear, simple picture of exactly this, drawn on its own`;
}
