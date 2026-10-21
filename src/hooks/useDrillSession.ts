import { useCallback, useMemo, useReducer } from 'react';

export interface DrillFeedback {
  isCorrect: boolean;
  text: string;
}

export interface DrillSessionState<TAnswer, TFeedback extends DrillFeedback = DrillFeedback> {
  stepIdx: number;
  answers: TAnswer[];
  /** A wrong try on this step, so a later right one no longer counts as first-try */
  hasMissed: boolean;
  isResolved: boolean;
  feedback: TFeedback | null;
  selectedIdx: number | null;
  wordIndices: number[];
  isFinished: boolean;
}

export type DrillSessionAction<TAnswer, TFeedback extends DrillFeedback = DrillFeedback> =
  | { type: 'select'; idx: number }
  | { type: 'setWords'; indices: number[] }
  | { type: 'resolve'; answer: TAnswer; feedback: TFeedback }
  | { type: 'miss'; feedback: TFeedback }
  | { type: 'setFeedback'; feedback: TFeedback | null }
  | { type: 'next'; stepCount: number }
  | { type: 'resetStep' };

export function createDrillSessionState<
  TAnswer,
  TFeedback extends DrillFeedback = DrillFeedback,
>(): DrillSessionState<TAnswer, TFeedback> {
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

export function drillSessionReducer<TAnswer, TFeedback extends DrillFeedback = DrillFeedback>(
  state: DrillSessionState<TAnswer, TFeedback>,
  action: DrillSessionAction<TAnswer, TFeedback>
): DrillSessionState<TAnswer, TFeedback> {
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
    case 'resetStep':
      return { ...state, ...STEP_RESET };
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
export function useDrillSession<TAnswer, TFeedback extends DrillFeedback = DrillFeedback>() {
  const [state, dispatch] = useReducer(
    drillSessionReducer<TAnswer, TFeedback>,
    undefined,
    createDrillSessionState<TAnswer, TFeedback>
  );

  const selectOption = useCallback((idx: number) => dispatch({ type: 'select', idx }), []);
  const setWordIndices = useCallback((indices: number[]) => dispatch({ type: 'setWords', indices }), []);
  const resolve = useCallback(
    (answer: TAnswer, feedback: TFeedback) => dispatch({ type: 'resolve', answer, feedback }),
    []
  );
  const miss = useCallback((feedback: TFeedback) => dispatch({ type: 'miss', feedback }), []);
  const setFeedback = useCallback(
    (feedback: TFeedback | null) => dispatch({ type: 'setFeedback', feedback }),
    []
  );
  const next = useCallback((stepCount: number) => dispatch({ type: 'next', stepCount }), []);
  const resetStep = useCallback(() => dispatch({ type: 'resetStep' }), []);

  return useMemo(
    () => ({ ...state, selectOption, setWordIndices, resolve, miss, setFeedback, next, resetStep }),
    [state, selectOption, setWordIndices, resolve, miss, setFeedback, next, resetStep]
  );
}

/** Compares built and target sentences ignoring case, punctuation and spacing. */
export function normalizeSentence(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s']/g, '').replace(/\s+/g, ' ').trim();
}
