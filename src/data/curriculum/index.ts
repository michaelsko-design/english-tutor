import { GradeId } from '../../types/learner';
import { GradeCurriculumPack, MissionNode } from './types';

import { grade1Curriculum } from './elementary/grade1';
import { grade2Curriculum } from './elementary/grade2';
import { grade3Curriculum } from './elementary/grade3';
import { grade4Curriculum } from './elementary/grade4';
import { grade5Curriculum } from './elementary/grade5';
import { grade6Curriculum } from './elementary/grade6';

import { grade7Curriculum } from './middleSchool/grade7';
import { grade8Curriculum } from './middleSchool/grade8';
import { grade9Curriculum } from './middleSchool/grade9';

import { grade10Curriculum } from './highSchool/grade10';
import { grade11Curriculum } from './highSchool/grade11';
import { grade12Curriculum } from './highSchool/grade12';

export * from './types';

export const CURRICULUM_BY_GRADE: Record<GradeId, GradeCurriculumPack> = {
  'grade-1': grade1Curriculum,
  'grade-2': grade2Curriculum,
  'grade-3': grade3Curriculum,
  'grade-4': grade4Curriculum,
  'grade-5': grade5Curriculum,
  'grade-6': grade6Curriculum,
  'grade-7': grade7Curriculum,
  'grade-8': grade8Curriculum,
  'grade-9': grade9Curriculum,
  'grade-10': grade10Curriculum,
  'grade-11': grade11Curriculum,
  'grade-12': grade12Curriculum,
};

export function getSuggestedMissionForGrade(
  gradeId: GradeId,
  missionProgress: Record<string, number>
): MissionNode {
  const pack = CURRICULUM_BY_GRADE[gradeId] || CURRICULUM_BY_GRADE['grade-7'];
  const allMissions = pack.units.flatMap((u) => u.missions);

  const nextUncompleted = allMissions.find((m) => (missionProgress[m.id] || 0) === 0);
  return nextUncompleted || allMissions[0];
}
