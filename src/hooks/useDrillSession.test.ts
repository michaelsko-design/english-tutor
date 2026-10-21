import { describe, expect, it } from 'vitest';
import {
  DrillSessionAction,
  createDrillSessionState,
  drillSessionReducer,
  normalizeSentence,
} from './useDrillSession';

const run = (actions: DrillSessionAction<string>[]) =>
  actions.reduce(drillSessionReducer<string>, createDrillSessionState<string>());

const right = { isCorrect: true, text: 'yes' };
const wrong = { isCorrect: false, text: 'no' };

describe('drillSessionReducer', () => {
  it('records an answer by step index so a step is never counted twice', () => {
    const state = run([
      { type: 'resolve', answer: 'a', feedback: right },
      { type: 'resolve', answer: 'b', feedback: right },
    ]);
    expect(state.answers).toEqual(['b']);
    expect(state.isResolved).toBe(true);
  });

  it('marks a miss without resolving the step', () => {
    const state = run([{ type: 'miss', feedback: wrong }]);
    expect(state.hasMissed).toBe(true);
    expect(state.isResolved).toBe(false);
    expect(state.feedback).toEqual(wrong);
  });

  it('clears the step state when moving to the next step', () => {
    const state = run([
      { type: 'select', idx: 2 },
      { type: 'setWords', indices: [1, 0] },
      { type: 'miss', feedback: wrong },
      { type: 'resolve', answer: 'a', feedback: right },
      { type: 'next', stepCount: 3 },
    ]);
    expect(state).toMatchObject({
      stepIdx: 1,
      hasMissed: false,
      isResolved: false,
      feedback: null,
      selectedIdx: null,
      wordIndices: [],
      answers: ['a'],
    });
  });

  it('finishes on the last step instead of advancing', () => {
    const state = run([{ type: 'next', stepCount: 1 }]);
    expect(state.isFinished).toBe(true);
    expect(state.stepIdx).toBe(0);
  });

  it('overwrites the answer of a replayed step instead of appending', () => {
    const state = run([
      { type: 'resolve', answer: 'a', feedback: right },
      { type: 'next', stepCount: 2 },
      { type: 'resolve', answer: 'b', feedback: right },
    ]);
    expect(state.answers).toEqual(['a', 'b']);
  });
});

describe('normalizeSentence', () => {
  it('ignores case, punctuation and extra spaces', () => {
    expect(normalizeSentence('  I like  Apples! ')).toBe('i like apples');
  });
});
