import { useEffect, useState } from 'react';
import type { GradeId } from '../types/learner';
import { loadExamBank, type ExamBankPack } from '../data/examBank';

/** A bank that hasn't arrived by then is skipped, so a slow network never holds up a session. */
export const EXAM_BANK_LOAD_TIMEOUT_MS = 3000;

export type ExamBankState =
  | { status: 'loading'; bank: null }
  | { status: 'ready'; bank: ExamBankPack | null };

/** The grade's exam question bank (Feature 43), loaded when an exam session opens. */
export function useExamBank(gradeId: GradeId): ExamBankState {
  const [state, setState] = useState<ExamBankState>({ status: 'loading', bank: null });

  useEffect(() => {
    let isActive = true;
    // Once the wait is over the answer stays "no bank", so the questions can't change mid-session.
    const settle = (bank: ExamBankPack | null) => {
      if (isActive) setState((prev) => (prev.status === 'loading' ? { status: 'ready', bank } : prev));
    };
    const timer = setTimeout(() => settle(null), EXAM_BANK_LOAD_TIMEOUT_MS);
    loadExamBank(gradeId).then(settle);
    return () => {
      isActive = false;
      clearTimeout(timer);
    };
  }, [gradeId]);

  return state;
}
