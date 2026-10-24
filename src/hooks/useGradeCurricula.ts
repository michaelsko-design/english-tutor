import { useCallback, useEffect, useMemo, useState } from 'react';
import type { GradeId } from '../types/learner';
import { loadGrades } from '../data/curriculum/loader';
import type { GradeCurriculumPack } from '../data/curriculum';

export type GradePacks = Partial<Record<GradeId, GradeCurriculumPack>>;

export interface GradeCurriculaState {
  status: 'loading' | 'ready' | 'error';
  packs: GradePacks;
  /** Loads again after an error (back online) */
  retry: () => void;
}

const NO_PACKS: GradePacks = {};

/**
 * The curriculum of the given grades, loaded on demand (each grade is its own chunk). While a
 * grade list changes the previous packs stay in `packs`, so a screen can keep showing what it has.
 */
export function useGradeCurricula(gradeIds: readonly GradeId[]): GradeCurriculaState {
  const key = [...new Set(gradeIds)].sort().join(',');
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ key: string; attempt: number; packs: GradePacks | null }>({
    key: '',
    attempt: 0,
    packs: NO_PACKS,
  });

  useEffect(() => {
    let isActive = true;
    const ids = key === '' ? [] : (key.split(',') as GradeId[]);
    loadGrades(ids)
      .then((packs) => isActive && setResult({ key, attempt, packs }))
      .catch(() => isActive && setResult({ key, attempt, packs: null }));
    return () => {
      isActive = false;
    };
  }, [key, attempt]);

  const retry = useCallback(() => setAttempt((count) => count + 1), []);

  return useMemo((): GradeCurriculaState => {
    const isCurrent = result.key === key && result.attempt === attempt;
    if (!isCurrent) return { status: 'loading', packs: result.packs ?? NO_PACKS, retry };
    if (result.packs === null) return { status: 'error', packs: NO_PACKS, retry };
    return { status: 'ready', packs: result.packs, retry };
  }, [result, key, attempt, retry]);
}

/** One grade's curriculum: `pack` is set once it is loaded. */
export function useGradeCurriculum(gradeId: GradeId): {
  status: GradeCurriculaState['status'];
  pack: GradeCurriculumPack | undefined;
  retry: () => void;
} {
  const state = useGradeCurricula([gradeId]);
  return {
    status: state.status,
    pack: state.status === 'ready' ? state.packs[gradeId] : undefined,
    retry: state.retry,
  };
}
