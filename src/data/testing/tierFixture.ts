import type { MissionNode } from '../curriculum';

/** A small mission with complete tier seeds, for the tier step tests (not shipped content). */
export const TIER_FIXTURE_MISSION: MissionNode = {
  id: 'g3-u1-m1',
  unitNumber: 1,
  missionNumber: 1,
  icon: '🐾',
  titleEn: 'My Pets',
  titleHe: 'חיות המחמד שלי',
  storyHookHe: 'נכיר חיות מחמד',
  grammarTopic: 'I have a… / He likes…',
  estimatedMinutes: 5,
  baseXp: 50,
  baseDiamonds: 5,
  skills: ['Pets'],
  sampleSentenceEn: 'I have a small dog and a white cat.',
  sampleSentenceHe: 'יש לי כלב קטן וחתול לבן.',
  vocabulary: [
    { wordEn: 'dog', partOfSpeech: 'noun', translationHe: 'כלב', emoji: '🐶', exampleEn: 'The dog runs in the park.', exampleHe: 'הכלב רץ בפארק.' },
    { wordEn: 'cat', partOfSpeech: 'noun', translationHe: 'חתול', emoji: '🐱', exampleEn: 'The cat sleeps on the sofa.', exampleHe: 'החתול ישן על הספה.' },
    { wordEn: 'bird', partOfSpeech: 'noun', translationHe: 'ציפור', emoji: '🐦', exampleEn: 'The bird sings in the tree.', exampleHe: 'הציפור שרה על העץ.' },
    { wordEn: 'fish', partOfSpeech: 'noun', translationHe: 'דג', emoji: '🐟', exampleEn: 'The fish swims in the water.', exampleHe: 'הדג שוחה במים.' },
  ],
  tierObjectives: {
    explorer: { tier: 'explorer', focusHe: 'x', samplePromptEn: 'I have a dog.', samplePromptHe: 'יש לי כלב.' },
    challenger: { tier: 'challenger', focusHe: 'x', samplePromptEn: 'I have a small dog and a white cat.', samplePromptHe: 'x' },
    master: { tier: 'master', focusHe: 'x', samplePromptEn: 'My bird sings every morning.', samplePromptHe: 'x' },
  },
  drillSeed: {
    wrongWords: [
      { wordEn: 'horse', translationHe: 'סוס' },
      { wordEn: 'cow', translationHe: 'פרה' },
    ],
    shortSentenceEn: 'I have a dog.',
    shortSentenceHe: 'יש לי כלב.',
    rule: {
      questionEn: 'Which sentence is correct?',
      correct: 'She has a cat.',
      wrong: ['She have a cat.', 'She haves a cat.'],
      explainHe: 'עם she משתמשים ב-has.',
      hintHe: 'שימו לב לפועל אחרי she.',
    },
    story: {
      passageEn: 'Dan has a dog named Max. Max likes to run. Every day Dan and Max go to the park.',
      passageHe: 'לדן יש כלב בשם מקס. מקס אוהב לרוץ. כל יום דן ומקס הולכים לפארק.',
      questionEn: 'Where do Dan and Max go every day?',
      questionHe: 'לאן דן ומקס הולכים כל יום?',
      correct: 'To the park.',
      wrong: ['To the school.', 'To the beach.'],
    },
    tiers: {
      explorer: {
        rule: {
          questionEn: 'Which word is right? I ___ a dog.',
          correct: 'have',
          wrong: ['has'],
          explainHe: 'עם I משתמשים ב-have.',
          hintHe: 'עם I אומרים have.',
        },
        story: {
          passageEn: 'I have a cat. The cat is white.',
          passageHe: 'יש לי חתול. החתול לבן.',
          questionEn: 'What color is the cat?',
          questionHe: 'מה צבע החתול?',
          correct: 'White.',
          wrong: ['Black.'],
        },
      },
      challenger: {
        clozeWrong: [
          ['table', 'window'],
          ['table', 'window'],
          ['table', 'window'],
          ['table', 'window'],
        ],
      },
      master: {
        sentenceEn: 'My little bird sings a happy song every morning.',
        sentenceHe: 'הציפור הקטנה שלי שרה שיר שמח כל בוקר.',
        decoys: ['bark', 'angry'],
        voiceEn: 'My brother feeds the fish after school.',
        voiceHe: 'אחי מאכיל את הדגים אחרי בית הספר.',
        errorFix: {
          questionEn: 'Which sentence has no mistake?',
          correct: 'My sister has two white cats.',
          wrong: ['My sister have two white cats.', 'My sister has two whites cat.', 'My sister haves two white cats.'],
          explainHe: 'עם my sister משתמשים ב-has, והשם בסוף ברבים: cats.',
          hintEn: 'Check the verb after "sister".',
        },
        story: {
          passageEn:
            'Tom wanted a pet, but his flat was small. His mother said a fish was the best choice because it needed little space. Tom bought a small blue fish and named it Bubble. Every evening he cleaned the bowl.',
          passageHe: '',
          questionEn: 'Why did Tom choose a fish?',
          questionHe: '',
          correct: 'Because it needed little space.',
          wrong: ['Because it could run fast.', 'Because his mother hated dogs.', 'Because it was very cheap.'],
        },
        storyHintEn: 'Look for the word "because" in the second sentence.',
      },
    },
  },
};
