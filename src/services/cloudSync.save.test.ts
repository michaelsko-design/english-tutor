import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ExamPrepPlan, LearnerProfile } from '../types/learner';

const mocks = vi.hoisted(() => {
  const batch = { set: vi.fn(), update: vi.fn(), commit: vi.fn(() => Promise.resolve()) };
  return { batch };
});

vi.mock('./firebase', () => ({ db: {} }));
vi.mock('firebase/firestore', () => ({
  deleteField: vi.fn(() => '__delete__'),
  doc: vi.fn(() => ({ path: 'learners/uid-1' })),
  getDocFromCache: vi.fn(),
  getDocFromServer: vi.fn(),
  runTransaction: vi.fn(),
  writeBatch: vi.fn(() => mocks.batch),
}));

const { saveProfileToFirestore } = await import('./cloudSync');

const plan: ExamPrepPlan = {
  id: 'exam-new',
  createdAt: '2026-11-12T13:23:05.047Z',
  gradeId: 'grade-7',
  examDateStr: '2026-11-16',
  unitNumbers: [1],
  skills: ['grammar'],
  days: [{ dayIndex: 0, dateStr: '2026-11-12', kind: 'mock', focus: [] }],
};

describe('saveProfileToFirestore examPrep', () => {
  beforeEach(() => {
    mocks.batch.set.mockClear();
    mocks.batch.update.mockClear();
  });

  it('writes the exam plan as a whole, so the previous plan leaves no archive or certificate behind', async () => {
    await saveProfileToFirestore('uid-1', { examPrep: plan } as LearnerProfile);

    expect(mocks.batch.set).toHaveBeenCalledWith(expect.anything(), expect.anything(), { merge: true });
    expect(mocks.batch.update).toHaveBeenCalledWith(expect.anything(), { examPrep: plan });
  });

  it('does not touch the exam plan when the profile has none', async () => {
    await saveProfileToFirestore('uid-1', {} as LearnerProfile);

    expect(mocks.batch.update).not.toHaveBeenCalled();
  });
});

describe('saveProfileToFirestore room outfit', () => {
  const baseRoom = { placements: {}, namedItemIds: [], updatedAt: '2026-11-12T10:00:00.000Z' };

  beforeEach(() => {
    mocks.batch.update.mockClear();
  });

  it('writes the outfit as a whole, so a taken-off item does not stay in the cloud', async () => {
    const room = { ...baseRoom, outfit: { head: 'cap' } };

    await saveProfileToFirestore('uid-1', { room } as unknown as LearnerProfile);

    expect(mocks.batch.update).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ 'room.outfit': { head: 'cap' } })
    );
  });

  it('deletes the cloud outfit when every item was taken off', async () => {
    await saveProfileToFirestore('uid-1', { room: baseRoom } as unknown as LearnerProfile);

    expect(mocks.batch.update).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ 'room.outfit': '__delete__' })
    );
  });
});
