/**
 * Which app missions cover each heading of the Ministry's Grammar Bands (Curriculum 2020).
 * Each rule pairs a heading pattern with a pattern searched in the app's mission grammar topics
 * and titles. Hand-written and approximate: a hit means "a mission names this structure",
 * not that every descriptor under the heading is practised.
 */

export interface GrammarHeading {
  band: string;
  heading: string;
  /** "GRADE 4 (A1)" for Bands I–II, "4 POINTS (B1)" for Band III */
  firstLevel: string | null;
  descriptors: string[];
}

interface GrammarRule {
  heading: RegExp;
  /** null = not a topic of its own: every sentence uses it */
  appTopic: RegExp | null;
}

/** First matching rule wins, so the specific ones come before the general ones */
const RULES: readonly GrammarRule[] = [
  { heading: /clauses: declarative/i, appTopic: null },
  { heading: /clauses: interrogative/i, appTopic: /question/i },
  { heading: /clauses: coordinated|conjunctions: coordinating/i, appTopic: /coordinat|connectors? of addition|and \/ but|\bbut\b.*\bor\b/i },
  { heading: /clauses: subordinated|conjunctions: subordinating/i, appTopic: /because|although|while|concession|subordinat|connectors? of (cause|contrast|result)/i },
  { heading: /relative.*non-defining/i, appTopic: /non-defining/i },
  { heading: /relative/i, appTopic: /relative clause/i },
  { heading: /reported speech/i, appTopic: /reported speech|indirect speech/i },
  { heading: /conditional imperative/i, appTopic: /conditional imperative|if .*imperative/i },
  { heading: /real condition \(modality\)/i, appTopic: /first conditional.*(modal|might|can|may)|realistic predictions/i },
  { heading: /first conditional/i, appTopic: /first conditional/i },
  { heading: /second conditional/i, appTopic: /second conditional/i },
  { heading: /third conditional/i, appTopic: /third conditional/i },
  { heading: /discourse markers/i, appTopic: /discourse marker|academic connectors|conjunctive adverb/i },
  { heading: /passives: present/i, appTopic: /present simple passive|passive voice \(present|(am \/ )?is ?\/ ?are \+ v3/i },
  { heading: /passives: past/i, appTopic: /past simple passive|passive voice \(past|was ?\/ ?were \+ v3/i },
  { heading: /imperative/i, appTopic: /imperative|commands|instructions/i },
  { heading: /past.*linking|past simple linking/i, appTopic: /was \/ were|was\/were/i },
  { heading: /present\/linking questions|present linking verbs questions/i, appTopic: /what is this|is it\b|questions?.*\b(am|is|are)\b/i },
  { heading: /present\/linking|present linking/i, appTopic: /to be|am \/ is \/ are|\bI am\b|it is/i },
  { heading: /there is\/there are/i, appTopic: /there is/i },
  { heading: /present simple mental process/i, appTopic: /stative|mental|I like|know, believe/i },
  { heading: /present simple \(with adverbs of frequency\)/i, appTopic: /frequency/i },
  { heading: /present simple.*questions/i, appTopic: /do \/ does|present simple.*question/i },
  { heading: /^verbs: present simple/i, appTopic: /present simple/i },
  { heading: /past simple \(irregular\)/i, appTopic: /irregular|\bV2\b/i },
  { heading: /past simple.*questions/i, appTopic: /\bdid\b/i },
  { heading: /past simple - lexical verbs \(regular\)/i, appTopic: /regular verbs|-ed\b/i },
  { heading: /past simple/i, appTopic: /past simple(?! passive)(?! of)|-ed\b/i },
  { heading: /present continuous for future/i, appTopic: /present (continuous|progressive) for (the )?future/i },
  { heading: /present continuous/i, appTopic: /present (continuous|progressive)/i },
  { heading: /future continuous/i, appTopic: /future continuous|future progressive/i },
  { heading: /future in the past/i, appTopic: /future in the past|was going to/i },
  { heading: /future perfect/i, appTopic: /future perfect/i },
  { heading: /will ?\+ ?verb/i, appTopic: /\bwill\b/i },
  { heading: /going to/i, appTopic: /going to/i },
  { heading: /past continuous/i, appTopic: /past (continuous|progressive)/i },
  { heading: /present perfect continuous/i, appTopic: /present perfect (continuous|progressive)/i },
  { heading: /present perfect/i, appTopic: /present perfect/i },
  { heading: /past perfect continuous/i, appTopic: /past perfect (continuous|progressive)/i },
  { heading: /past perfect/i, appTopic: /past perfect/i },
  { heading: /can questions/i, appTopic: /can.*question/i },
  { heading: /cannot\/can't/i, appTopic: /can't|cannot/i },
  { heading: /modality: can$/i, appTopic: /\bcan\b/i },
  { heading: /modality: could/i, appTopic: /\bcould\b/i },
  { heading: /would like/i, appTopic: /would like/i },
  { heading: /modality: would/i, appTopic: /\bwould\b/i },
  { heading: /modality: must/i, appTopic: /\bmust\b/i },
  { heading: /modality: should/i, appTopic: /\bshould\b/i },
  { heading: /used to/i, appTopic: /used to/i },
  { heading: /uncountable/i, appTopic: /uncountable|how much/i },
  { heading: /countable/i, appTopic: /plural|countable/i },
  { heading: /no article/i, appTopic: /zero article|no article/i },
  { heading: /articles/i, appTopic: /\ba \/ an\b|article/i },
  { heading: /reflexive/i, appTopic: /reflexive|myself/i },
  { heading: /pronouns/i, appTopic: /pronoun|I \/ we \/ they|he \/ she \/ it/i },
  { heading: /adjectives: noun phrases/i, appTopic: /adjective/i },
  { heading: /complex noun phrases/i, appTopic: /noun phrase/i },
  { heading: /noun phrases|nouns: phrases/i, appTopic: /noun phrase|before nouns/i },
  { heading: /possessives/i, appTopic: /possessive/i },
  { heading: /quantity|nouns: determiners/i, appTopic: /how many|how much|some \/ any|quantit|determiner/i },
  { heading: /comparative/i, appTopic: /comparative/i },
  { heading: /superlative/i, appTopic: /superlative/i },
  { heading: /adverbs: frequency/i, appTopic: /frequency/i },
  { heading: /adverbs: manner/i, appTopic: /adverbs? of manner|-ly adverb/i },
  { heading: /sequencing/i, appTopic: /sequenc|first.*then/i },
  { heading: /prepositions/i, appTopic: /preposition/i },
];

export type GrammarStatus = 'covered' | 'implicit' | 'later' | 'missing' | 'no-rule';

export interface GrammarResult {
  band: string;
  heading: string;
  firstLevel: string | null;
  status: GrammarStatus;
  /** First grade whose mission topics name the structure */
  appGrade?: number;
  appTopic?: string;
}

export interface GradeTopics {
  grade: number;
  topics: string[];
}

export function ruleFor(heading: string): GrammarRule | undefined {
  return RULES.find((rule) => rule.heading.test(heading.trim()));
}

/** Check one heading against the app's topics, counting grades up to `lastGrade` as on time */
export function checkHeading(heading: GrammarHeading, grades: readonly GradeTopics[], lastGrade: number): GrammarResult {
  const base = { band: heading.band, heading: heading.heading.trim(), firstLevel: heading.firstLevel };
  const rule = ruleFor(heading.heading);
  if (rule === undefined) return { ...base, status: 'no-rule' };
  if (rule.appTopic === null) return { ...base, status: 'implicit' };
  const pattern = rule.appTopic;
  for (const { grade, topics } of grades) {
    const topic = topics.find((t) => pattern.test(t));
    if (topic !== undefined) return { ...base, status: grade <= lastGrade ? 'covered' : 'later', appGrade: grade, appTopic: topic };
  }
  return { ...base, status: 'missing' };
}
