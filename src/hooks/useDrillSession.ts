import { useCallback, useMemo, useReducer } from 'react';

export interface DrillFeedback {
  isCorrect: boolean;
  text: string;
}

export interface DrillSessionState<TAnswer> {
  stepIdx: number;
  answers: TAnswer[];
  /** A wrong try on this step, so a later right one no longer counts as first-try */
  hasMissed: boolean;
  isResolved: boolean;
  feedback: DrillFeedback | null;
  selectedIdx: number | null;
  wordIndices: number[];
  isFinished: boolean;
}

export type DrillSessionAction<TAnswer> =
  | { type: 'select'; idx: number }
  | { type: 'setWords'; indices: number[] }
  | { type: 'resolve'; answer: TAnswer; feedback: DrillFeedback }
  | { type: 'miss'; feedback: DrillFeedback }
  | { type: 'setFeedback'; feedback: DrillFeedback | null }
  | { type: 'next'; stepCount: number };

export function createDrillSessionState<TAnswer>(): DrillSessionState<TAnswer> {
  return {
    stepIdx: 0,
    answers: [],
    hasMissed: false,
    isResolved: false,
    feedback: null,
    selectedIdx: null,
    wordIndices: [],
    isFinished: false,
  };
}

/** Everything that belongs to one step and starts empty on the next. */
const STEP_RESET = {
  hasMissed: false,
  isResolved: false,
  feedback: null,
  selectedIdx: null,
  wordIndices: [] as number[],
};

export function drillSessionReducer<TAnswer>(
  state: DrillSessionState<TAnswer>,
  action: DrillSessionAction<TAnswer>
): DrillSessionState<TAnswer> {
  switch (action.type) {
    case 'select':
      return { ...state, selectedIdx: action.idx };
    case 'setWords':
      return { ...state, wordIndices: action.indices };
    case 'resolve':
      // Written by step index, so a step can never be counted twice.
      return {
        ...state,
        answers: [...state.answers.slice(0, state.stepIdx), action.answer],
        isResolved: true,
        feedback: action.feedback,
      };
    case 'miss':
      return { ...state, hasMissed: true, feedback: action.feedback };
    case 'setFeedback':
      return { ...state, feedback: action.feedback };
    case 'next':
      if (state.stepIdx + 1 < action.stepCount) {
        return { ...state, ...STEP_RESET, stepIdx: state.stepIdx + 1 };
      }
      return { ...state, isFinished: true };
  }
}

/**
 * The per-step state the practice runners share: the step, the answers so far, whether this
 * step was already missed, and the option or tiles chosen. Scoring and rules stay in the runner.
 */
export function useDrillSession<TAnswer>() {
  const [state, dispatch] = useReducer(
    drillSessionReducer<TAnswer>,
    undefined,
    createDrillSessionState<TAnswer>
  );

  const selectOption = useCallback((idx: number) => dispatch({ type: 'select', idx }), []);
  const setWordIndices = useCallback((indices: number[]) => dispatch({ type: 'setWords', indices }), []);
  const resolve = useCallback(
    (answer: TAnswer, feedback: DrillFeedback) => dispatch({ type: 'resolve', answer, feedback }),
    []
  );
  const miss = useCallback((feedback: DrillFeedback) => dispatch({ type: 'miss', feedback }), []);
  const setFeedback = useCallback(
    (feedback: DrillFeedback | null) => dispatch({ type: 'setFeedback', feedback }),
    []
  );
  const next = useCallback((stepCount: number) => dispatch({ type: 'next', stepCount }), []);

  return useMemo(
    () => ({ ...state, selectOption, setWordIndices, resolve, miss, setFeedback, next }),
    [state, selectOption, setWordIndices, resolve, miss, setFeedback, next]
  );
}

/** Compares built and target sentences ignoring case, punctuation and spacing. */
export function normalizeSentence(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s']/g, '').replace(/\s+/g, ' ').trim();
}
