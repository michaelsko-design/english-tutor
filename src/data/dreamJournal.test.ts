import { describe, expect, it } from 'vitest';
import {
  DREAM_FRAMES,
  DREAM_FRAMES_PER_ENTRY,
  MAX_JOURNAL_ENTRIES,
  fillFrame,
  getJournalEntries,
  getTranslationChoices,
  isSameTranslation,
  pickDreamFrames,
  saveDreamEntry,
} from './dreamJournal';
import { ROOM_ACTIVITY_REPEAT_XP, ROOM_ACTIVITY_XP } from './roomActivities';
import { LearnerProfile } from '../types/learner';

const NOW = new Date(2026, 9, 17, 10, 0);

const baseProfile: LearnerProfile = {
  isOnboarded: true,
  name: 'Noa',
  age: 12,
  gender: 'girl',
  gradeId: 'grade-7',
  preferredTier: 'challenger',
  themeId: 'cozy-studio',
  stats: {
    xp: 0,
    level: 1,
    stars: 0,
    maxPossibleStars: 36,
    diamonds: 0,
    streakDays: 0,
    shabbatShieldActive: true,
    wordsMastered: 0,
    missionsCompleted: 0,
  },
  missionProgress: {},
  unlockedRewardIds: [],
  claimedDailyQuestIds: [],
  dailyCounters: {
    dateStr: '2026-10-16',
    missionsCompletedToday: 0,
    voiceWordsPracticedToday: 0,
    threeStarMissionsToday: 0,
  },
  createdAt: '2026-01-01T00:00:00.000Z',
};

describe('dream frames', () => {
  it('give every band four frames with two blanks of four words each', () => {
    Object.values(DREAM_FRAMES).forEach((frames) => {
      expect(frames).toHaveLength(4);
      frames.forEach((frame) => {
        expect(frame.en).toContain('{0}');
        expect(frame.en).toContain('{1}');
        expect(frame.he).toContain('{0}');
        expect(frame.he).toContain('{1}');
        frame.blanks.forEach((words) => {
          expect(words).toHaveLength(4);
          expect(new Set(words.map((word) => word.en)).size).toBe(4);
        });
      });
    });
  });

  it('picks two frames of the grade band in story order, stable per salt', () => {
    const picked = pickDreamFrames('grade-11', 5);
    expect(picked).toHaveLength(DREAM_FRAMES_PER_ENTRY);
    picked.forEach((frame) => expect(frame.id.startsWith('dream-band3-')).toBe(true));
    const order = DREAM_FRAMES.band3.map((f) => f.id);
    expect(order.indexOf(picked[0].id)).toBeLessThan(order.indexOf(picked[1].id));
    expect(pickDreamFrames('grade-11', 5)).toEqual(picked);
  });
});

describe('fillFrame', () => {
  it('fills the blanks and marks missing ones', () => {
    expect(fillFrame('I see a {0} in the {1}.', ['dog', 'park'])).toBe('I see a dog in the park.');
    expect(fillFrame('I see a {0} in the {1}.', ['dog'])).toBe('I see a dog in the ___.');
  });
});

describe('getTranslationChoices', () => {
  it('offers the correct word and two others from the same blank', () => {
    const frame = DREAM_FRAMES.early[0];
    const chosen = frame.blanks[0][2];
    const choices = getTranslationChoices(frame, 0, chosen, 'x');
    expect(choices).toHaveLength(3);
    expect(choices).toContain(chosen.en);
    choices.forEach((choice) => expect(frame.blanks[0].map((word) => word.en)).toContain(choice));
  });
});

describe('isSameTranslation', () => {
  it('ignores case, spacing and end punctuation', () => {
    expect(isSameTranslation('  A Golden  key.', 'a golden key')).toBe(true);
    expect(isSameTranslation('a gold key', 'a golden key')).toBe(false);
  });
});

describe('saveDreamEntry', () => {
  const entry = { textEn: 'I see a dog in the park.', textHe: 'אני רואה כלב בפארק.', noteHe: '  היה כיף  ' };

  it('saves the dream and gives the daily journal reward', () => {
    const result = saveDreamEntry(baseProfile, entry, true, NOW);
    const saved = getJournalEntries(result.profile);
    expect(saved).toHaveLength(1);
    expect(saved[0]).toMatchObject({ textEn: entry.textEn, noteHe: 'היה כיף', createdAt: NOW.toISOString() });
    expect(result.xpEarned).toBe(ROOM_ACTIVITY_XP);
    expect(result.profile.dailyCounters.voiceWordsPracticedToday).toBe(1);
  });

  it('gives only repeat XP for a second dream the same day', () => {
    const first = saveDreamEntry(baseProfile, entry, false, NOW).profile;
    const second = saveDreamEntry(first, entry, false, new Date(2026, 9, 17, 11, 0));
    expect(second.xpEarned).toBe(ROOM_ACTIVITY_REPEAT_XP);
    expect(getJournalEntries(second.profile)).toHaveLength(2);
  });

  it('keeps only the newest entries', () => {
    let profile = baseProfile;
    for (let i = 0; i < MAX_JOURNAL_ENTRIES + 3; i++) {
      profile = saveDreamEntry(profile, entry, false, new Date(2026, 9, 1 + i, 10, 0)).profile;
    }
    const saved = getJournalEntries(profile);
    expect(saved).toHaveLength(MAX_JOURNAL_ENTRIES);
    expect(saved[0].createdAt).toBe(new Date(2026, 9, 1 + MAX_JOURNAL_ENTRIES + 2, 10, 0).toISOString());
  });
});
