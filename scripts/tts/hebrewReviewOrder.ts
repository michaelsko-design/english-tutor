/**
 * The order the review page walks the Hebrew clips in, and which part of the app each clip belongs to:
 * the lines every learner meets, the core units, the last two core units of each grade (Pro), and the
 * content packs (not released yet). A clip used in several places takes the earliest one.
 */
import { CURRICULUM_WITH_ALL_PACKS } from '../../src/data/curriculum/packs/all';
import { HEBREW_AUDIO_GRADES } from '../../src/data/hebrewAudio';
import { buildGeneralHebrewCorpus, buildUnitHebrewCorpus, type UnitScope } from './hebrewCorpus';

export const REVIEW_GROUPS = ['general', 'core', 'pro-tail', 'packs', 'other'] as const;
export type ReviewGroup = (typeof REVIEW_GROUPS)[number];

/** How many core units at the end of each grade are Pro only. */
const PRO_TAIL_UNITS = 2;

export interface ReviewPlace {
  group: ReviewGroup;
  /** Position in the walk: smaller is reviewed earlier. */
  rank: number;
  /** For example "g1 u3"; empty for the general lines. */
  label: string;
}

interface Section {
  group: ReviewGroup;
  label: string;
  keys: string[];
}

function unitSections(): Section[] {
  const sections: Section[] = [];
  for (const gradeId of HEBREW_AUDIO_GRADES) {
    const units = CURRICULUM_WITH_ALL_PACKS[gradeId].units;
    const coreCount = units.filter((unit) => !unit.packId).length;
    for (const unit of units) {
      const scope: UnitScope = { gradeId, unitNumber: unit.unitNumber };
      const group: ReviewGroup = unit.packId ? 'packs' : unit.unitNumber > coreCount - PRO_TAIL_UNITS ? 'pro-tail' : 'core';
      const grade = gradeId.replace('grade-', 'g');
      sections.push({ group, label: `${grade} u${unit.unitNumber}`, keys: buildUnitHebrewCorpus(scope).list().map((phrase) => phrase.key) });
    }
  }
  return sections;
}

/** Where each clip key stands in the walk; keys in no section (a few shared lines) are left out: the server files them under 'other', last. */
export function buildReviewPlaces(): ReadonlyMap<string, ReviewPlace> {
  const general: Section = { group: 'general', label: '', keys: buildGeneralHebrewCorpus().list().map((phrase) => phrase.key) };
  const unitSectionList = unitSections();
  // Sections in group order, each group keeping grade and unit order
  const ordered = [general, ...REVIEW_GROUPS.slice(1, -1).flatMap((group) => unitSectionList.filter((section) => section.group === group))];
  const places = new Map<string, ReviewPlace>();
  ordered.forEach((section, rank) => {
    for (const key of section.keys) if (!places.has(key)) places.set(key, { group: section.group, rank, label: section.label });
  });
  return places;
}
