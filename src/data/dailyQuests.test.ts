import { describe, expect, it } from 'vitest';
import { DEFAULT_PROFILE } from './defaultProfile';
import {
  ANCHOR_QUEST,
  ROTATING_QUESTS,
  ROTATING_QUESTS_PER_DAY,
  getDailyQuests,
  pickDailyQuestIds,
} from './dailyQuests';
import type { LearnerProfile, MissedWord } from '../types/learner';
import { inflectHebrew } from '../utils/hebrewGender';

const DAY = '2026-11-24';

const makeProfile = (overrides: Partial<LearnerProfile> = {}): LearnerProfile => ({
  ...DEFAULT_PROFILE,
  dailyCounters: { dateStr: '2026-01-01', missionsCompletedToday: 0, voiceWordsPracticedToday: 0, threeStarMissionsToday: 0 },
  ...overrides,
});

const missed = (n: number): Record<string, MissedWord> =>
  Object.fromEntries(
    Array.from({ length: n }, (_, i) => [`w${i}`, { wordEn: `w${i}`, translationHe: 'מילה', missedOn: '2026-11-20' }])
  );

/** Every rotating quest becomes available (a review waiting, a friend contest played, an exam plan) */
const everythingOpen = (): LearnerProfile =>
  makeProfile({
    missedWords: missed(6),
    friendsHub: { isEnabled: true, contestHistory: [{} as never], updatedAt: '2026-11-01T00:00:00.000Z' },
    examPrep: { examDateStr: '2026-12-01' } as LearnerProfile['examPrep'],
  });

describe('pickDailyQuestIds', () => {
  it('always starts with the play-a-mission quest, then two rotating quests', () => {
    const ids = pickDailyQuestIds(makeProfile(), DAY);
    expect(ids[0]).toBe(ANCHOR_QUEST.id);
    expect(ids).toHaveLength(1 + ROTATING_QUESTS_PER_DAY);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives every learner the same quests on the same day', () => {
    expect(pickDailyQuestIds(everythingOpen(), DAY)).toEqual(pickDailyQuestIds(everythingOpen(), DAY));
  });

  it('changes the quests from day to day', () => {
    const days = Array.from({ length: 14 }, (_, i) => `2026-12-${String(i + 1).padStart(2, '0')}`);
    const combos = new Set(days.map((d) => pickDailyQuestIds(everythingOpen(), d).join(',')));
    expect(combos.size).toBeGreaterThan(5);
  });

  it('never offers a quest the learner cannot do', () => {
    const locked = ['quest-quick-review', 'quest-contest', 'quest-exam-prep'];
    for (let day = 1; day <= 28; day += 1) {
      const ids = pickDailyQuestIds(makeProfile(), `2026-12-${String(day).padStart(2, '0')}`);
      expect(ids.filter((id) => locked.includes(id))).toEqual([]);
    }
  });

  it('offers the locked quests once they are open', () => {
    const seen = new Set<string>();
    for (let day = 1; day <= 28; day += 1) {
      pickDailyQuestIds(everythingOpen(), `2026-12-${String(day).padStart(2, '0')}`).forEach((id) => seen.add(id));
    }
    expect(seen).toContain('quest-quick-review');
    expect(seen).toContain('quest-contest');
    expect(seen).toContain('quest-exam-prep');
  });

  it('drops the exam quest once the exam date has passed', () => {
    const afterExam = makeProfile({ examPrep: { examDateStr: '2026-11-01' } as LearnerProfile['examPrep'] });
    for (let day = 1; day <= 28; day += 1) {
      expect(pickDailyQuestIds(afterExam, `2026-12-${String(day).padStart(2, '0')}`)).not.toContain('quest-exam-prep');
    }
  });
});

describe('getDailyQuests', () => {
  it("keeps today's frozen quests even when what is open changes during the day", () => {
    const frozen = [ANCHOR_QUEST.id, 'quest-quick-review', 'quest-dress-up'];
    const profile = makeProfile({
      dailyCounters: {
        dateStr: DAY,
        missionsCompletedToday: 1,
        voiceWordsPracticedToday: 0,
        threeStarMissionsToday: 0,
        questIds: frozen,
      },
    });
    expect(getDailyQuests(profile, DAY).map((q) => q.id)).toEqual(frozen);
  });

  it('ignores a frozen list from an earlier day', () => {
    const profile = makeProfile({
      dailyCounters: {
        dateStr: '2026-11-23',
        missionsCompletedToday: 1,
        voiceWordsPracticedToday: 0,
        threeStarMissionsToday: 0,
        questIds: [ANCHOR_QUEST.id, 'quest-quick-review', 'quest-dress-up'],
      },
    });
    expect(getDailyQuests(profile, DAY).map((q) => q.id)).toEqual(pickDailyQuestIds(profile, DAY));
  });

  it('skips an id it no longer knows', () => {
    const profile = makeProfile({
      dailyCounters: {
        dateStr: DAY,
        missionsCompletedToday: 0,
        voiceWordsPracticedToday: 0,
        threeStarMissionsToday: 0,
        questIds: [ANCHOR_QUEST.id, 'quest-gone'],
      },
    });
    expect(getDailyQuests(profile, DAY).map((q) => q.id)).toEqual([ANCHOR_QUEST.id]);
  });

  it('addresses a boy in the masculine', () => {
    const quests = getDailyQuests(makeProfile({ gender: 'boy' }), DAY);
    expect(quests[0].titleHe).toBe('השלם משימה אחת היום');
  });

  it('has a correct masculine title for every quest', () => {
    const boy = [ANCHOR_QUEST, ...ROTATING_QUESTS].map((q) => inflectHebrew(q.titleHe, 'boy'));
    expect(boy).toEqual([
      'השלם משימה אחת היום',
      'תרגל הגייה של 2 מילים או משפטים במיקרופון',
      'סיים משימה עם 3 כוכבים מלאים',
      'השלם 2 משימות במפה',
      'אמור 5 מילים או משפטים במיקרופון',
      'סיים את החזרה של דקה',
      'סיים משחק מילים בחדר',
      'תרגל רשימת מילים',
      'השג את פרס ההלבשה היומי בארון',
      'סיים תחרות עם חבר או חברה',
      'תרגל למבחן לפי התוכנית',
    ]);
  });

  it('counts an activity-kind quest from the kind counters', () => {
    const dressUp = ROTATING_QUESTS.find((q) => q.id === 'quest-dress-up');
    const counters = {
      dateStr: DAY,
      missionsCompletedToday: 1,
      voiceWordsPracticedToday: 0,
      threeStarMissionsToday: 0,
      kindCounts: { 'dress-up': 1 },
    };
    expect(dressUp?.getCurrentCount(counters)).toBe(1);
    expect(dressUp?.getCurrentCount({ ...counters, kindCounts: {} })).toBe(0);
  });

  it('pays every quest a reward in the usual range', () => {
    for (const quest of [ANCHOR_QUEST, ...ROTATING_QUESTS]) {
      expect(quest.rewardDiamonds).toBeGreaterThanOrEqual(15);
      expect(quest.rewardDiamonds).toBeLessThanOrEqual(25);
      expect(quest.targetCount).toBeGreaterThan(0);
    }
  });
});
