import { useEffect, useState } from 'react';
import type { MissionNode } from '../data/curriculum';
import { loadMiniLesson, MiniLesson } from '../data/miniLessons';

/** A lesson that hasn't arrived by then is skipped, so a slow network never holds up a mission. */
export const LESSON_LOAD_TIMEOUT_MS = 3000;

export type MiniLessonState =
  | { status: 'loading'; lesson: null }
  | { status: 'ready'; lesson: MiniLesson | null };

/** The mission's mini-lesson (Feature 42), loaded with its grade's lessons when the mission opens. */
export function useMiniLesson(mission: Pick<MissionNode, 'id' | 'isBoss'>): MiniLessonState {
  const [state, setState] = useState<MiniLessonState>({ status: 'loading', lesson: null });
  const { id, isBoss } = mission;

  useEffect(() => {
    let isActive = true;
    // Once the wait is over the answer stays "no lesson", so it can't pop up in the middle of the steps.
    const settle = (lesson: MiniLesson | null) => {
      if (isActive) setState((prev) => (prev.status === 'loading' ? { status: 'ready', lesson } : prev));
    };
    const timer = setTimeout(() => settle(null), LESSON_LOAD_TIMEOUT_MS);
    loadMiniLesson({ id, isBoss }).then(settle);
    return () => {
      isActive = false;
      clearTimeout(timer);
    };
  }, [id, isBoss]);

  return state;
}
