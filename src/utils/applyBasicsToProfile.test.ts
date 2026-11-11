import { describe, expect, it } from 'vitest';
import { makeProfile } from '../test/fixtures';
import type { GradeId } from '../types/learner';
import type { SignupDraft } from '../data/signupDraft';
import { applyBasicsToProfile, getStartingGradeId } from './applyBasicsToProfile';

const NOW = new Date('2026-11-11T10:00:00.000Z');
const newProfile = () => makeProfile({ isOnboarded: false, preferredTier: 'challenger' });
const basics = (gradeId: GradeId): SignupDraft => ({ name: 'נועה', gender: 'girl', gradeId, hasParentConsent: true });

describe('getStartingGradeId', () => {
  it.each<GradeId>(['grade-1', 'grade-2', 'grade-3'])('starts %s on grade 1 (English starts in 3rd grade)', (gradeId) => {
    expect(getStartingGradeId(gradeId)).toBe('grade-1');
  });

  it.each<GradeId>(['grade-4', 'grade-8', 'grade-12'])('starts %s on its own grade', (gradeId) => {
    expect(getStartingGradeId(gradeId)).toBe(gradeId);
  });
});

describe('applyBasicsToProfile', () => {
  it.each<GradeId>(['grade-1', 'grade-2', 'grade-3'])(
    'puts a new %s learner on grade 1 and keeps the picked grade as the school grade',
    (gradeId) => {
      const saved = applyBasicsToProfile(newProfile(), basics(gradeId), NOW);
      expect(saved).toMatchObject({ isOnboarded: true, gradeId: 'grade-1', schoolGradeId: gradeId });
    }
  );

  it('keeps grades 4 and up on the picked grade', () => {
    const saved = applyBasicsToProfile(newProfile(), basics('grade-8'), NOW);
    expect(saved).toMatchObject({ gradeId: 'grade-8', schoolGradeId: 'grade-8' });
  });

  it.each<GradeId>(['grade-2', 'grade-5', 'grade-11'])('starts a new %s learner on the explorer tier', (gradeId) => {
    expect(applyBasicsToProfile(newProfile(), basics(gradeId), NOW).preferredTier).toBe('explorer');
  });

  it('leaves the grade and tier of an already onboarded learner as the basics and profile say', () => {
    const onboarded = makeProfile({ gradeId: 'grade-3', schoolGradeId: 'grade-3', preferredTier: 'master' });
    const saved = applyBasicsToProfile(onboarded, basics('grade-3'), NOW);
    expect(saved).toMatchObject({ gradeId: 'grade-3', preferredTier: 'master' });
  });

  it('does not change the profile it was given', () => {
    const profile = newProfile();
    applyBasicsToProfile(profile, basics('grade-3'), NOW);
    expect(profile).toMatchObject({ isOnboarded: false, gradeId: 'grade-1', preferredTier: 'challenger' });
  });
});
