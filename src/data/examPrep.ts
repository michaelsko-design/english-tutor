import { CURRICULUM_BY_GRADE, isPhonicsUnit } from './curriculum';
import { addDays, daysBetween, parseDateStr, toLocalDateStr } from '../utils/dates';
import { DrillType, MissionExerciseStep, getExercisesForMission } from './missionExercises';
import { levelForXp, recordDailyActivity } from './progressRewards';
import {
  ExamFocusBlock,
  ExamPlanDay,
  ExamPrepPlan,
  ExamSkill,
  GradeId,
  LearnerGender,
  LearnerProfile,
  ProficiencyTier,
} from '../types/learner';
import { seededShuffle } from '../utils/shuffle';
import { buildBankSteps, type ExamBankPack, type ExamBankPool } from './examBank';

/**
 * "Get Ready for an Exam" (Feature 18).
 *
 * The learner picks an exam date, the curriculum units and the skills the exam covers. The plan
 * spreads (unit × skill) focus blocks over the days before the exam, adds a mixed review day and
 * ends with a mock mini-exam. Practice items come from the grade's exam question bank (Feature 43,
 * `examBank.ts`): the first items of each list for practice, the reserved ones for the mock. A unit
 * without a bank uses the matching steps of its mission drills.
 */

export const EXAM_SKILLS: readonly ExamSkill[] = ['vocabulary', 'grammar', 'sentences', 'unseen'];
export const EXAM_MAX_DAYS_AHEAD = 21;
export const EXAM_SESSION_MAX_STEPS = 8;
export const MOCK_EXAM_QUESTION_COUNT = 12;
/** Mock exam score (percent) that earns the "Exam Ready" certificate. */
export const EXAM_READY_SCORE = 70;
/** Session score (percent) that counts as a 3-star activity for the daily quest. */
const THREE_STAR_SCORE = 80;
/** A mixed review day is added once there are at least this many practice days. */
const MIXED_REVIEW_MIN_PRACTICE_DAYS = 3;
const SATURDAY = 6;

export const EXAM_SESSION_REWARD_XP = 20;
export const EXAM_SESSION_REWARD_DIAMONDS = 3;
export const MOCK_EXAM_REWARD_XP = 40;
export const MOCK_EXAM_REWARD_DIAMONDS = 5;
/** Repeating a finished session gives a little XP and no diamonds. */
export const EXAM_REPEAT_REWARD_XP = 5;
export const CERTIFICATE_BONUS_DIAMONDS = 15;

export interface ExamSkillMeta {
  emoji: string;
  labelHe: string;
  labelEn: string;
  descriptionHe: string;
  stepType: DrillType;
}

export const EXAM_SKILL_META: Record<ExamSkill, ExamSkillMeta> = {
  vocabulary: {
    emoji: '🔤',
    labelHe: 'אוצר מילים',
    labelEn: 'Vocabulary',
    descriptionHe: 'מילים ותרגומים מהיחידות',
    stepType: 'chat-reply',
  },
  grammar: {
    emoji: '📝',
    labelHe: 'דקדוק',
    labelEn: 'Grammar',
    descriptionHe: 'כללי הדקדוק של היחידות',
    stepType: 'grammar-detective',
  },
  sentences: {
    emoji: '🧩',
    labelHe: 'בניית משפטים',
    labelEn: 'Sentence building',
    descriptionHe: 'סידור מילים למשפט נכון',
    stepType: 'sentence-builder',
  },
  unseen: {
    emoji: '📖',
    labelHe: 'הבנת הנקרא',
    labelEn: 'Unseen reading',
    descriptionHe: 'קטעי קריאה ושאלות הבנה',
    stepType: 'story-unseen',
  },
};

/** A drill step tagged with the exam material it practises. */
export interface ExamSessionStep extends MissionExerciseStep {
  skill: ExamSkill;
  unitNumber: number;
}

export interface ExamAnswer {
  skill: ExamSkill;
  isCorrect: boolean;
}

export interface ExamScoreSummary {
  correctCount: number;
  totalQuestions: number;
  scorePercent: number;
  bySkill: Partial<Record<ExamSkill, { correct: number; total: number }>>;
}

export interface ExamUnitOption {
  unitNumber: number;
  titleEn: string;
  titleHe: string;
  badgeEmoji: string;
  topics: string[];
}

export interface ExamPlanInput {
  gradeId: GradeId;
  examDateStr: string;
  unitNumbers: number[];
  skills: ExamSkill[];
  todayStr: string;
  isShabbatObserver: boolean;
  createdAt: string;
}

export type ExamDayStatus = 'done' | 'today' | 'missed' | 'upcoming';

// ---- Dates (local calendar days): src/utils/dates.ts, re-exported for existing imports ----

export { addDays, daysBetween, parseDateStr, toLocalDateStr };

/**
 * Study days run from today to the day before the exam, skipping Saturdays for Shabbat
 * observers. An exam today or tomorrow gives a 1-day crash course (today only). Exams in the
 * past or more than EXAM_MAX_DAYS_AHEAD days away give no dates.
 */
export function getStudyDates(
  todayStr: string,
  examDateStr: string,
  isShabbatObserver: boolean
): string[] {
  const daysAhead = daysBetween(todayStr, examDateStr);
  if (daysAhead < 0 || daysAhead > EXAM_MAX_DAYS_AHEAD) return [];
  if (daysAhead <= 1) return [todayStr];

  const dates = Array.from({ length: daysAhead }, (_, i) => addDays(todayStr, i)).filter(
    (d) => !isShabbatObserver || parseDateStr(d).getDay() !== SATURDAY
  );
  return dates.length > 0 ? dates : [todayStr];
}

// ---- Plan building ---------------------------------------------------------------------

export function getUnitOptions(gradeId: GradeId): ExamUnitOption[] {
  const pack = CURRICULUM_BY_GRADE[gradeId] || CURRICULUM_BY_GRADE['grade-7'];
  // Grade 1's letters and blending units have no exam questions (Feature 48)
  return pack.units.filter((u) => !isPhonicsUnit(u)).map((u) => ({
    unitNumber: u.unitNumber,
    titleEn: u.titleEn,
    titleHe: u.titleHe,
    badgeEmoji: u.badgeEmoji,
    topics: Array.from(new Set(u.missions.map((m) => m.grammarTopic))),
  }));
}

function getAllBlocks(unitNumbers: readonly number[], skills: readonly ExamSkill[]): ExamFocusBlock[] {
  return unitNumbers.flatMap((unitNumber) => skills.map((skill) => ({ unitNumber, skill })));
}

/** Splits the blocks into contiguous chunks, or cycles them when there are more days. */
function distributeBlocks(blocks: ExamFocusBlock[], dayCount: number): ExamFocusBlock[][] {
  if (blocks.length >= dayCount) {
    return Array.from({ length: dayCount }, (_, i) =>
      blocks.slice(
        Math.floor((i * blocks.length) / dayCount),
        Math.floor(((i + 1) * blocks.length) / dayCount)
      )
    );
  }
  return Array.from({ length: dayCount }, (_, i) => [blocks[i % blocks.length]]);
}

export function buildExamPlan(input: ExamPlanInput): ExamPrepPlan {
  const availableUnits = new Set(getUnitOptions(input.gradeId).map((u) => u.unitNumber));
  const unitNumbers = Array.from(new Set(input.unitNumbers))
    .filter((n) => availableUnits.has(n))
    .sort((a, b) => a - b);
  const skills = EXAM_SKILLS.filter((s) => input.skills.includes(s));
  const studyDates = getStudyDates(input.todayStr, input.examDateStr, input.isShabbatObserver);

  if (unitNumbers.length === 0) throw new Error('Exam plan needs at least one unit');
  if (skills.length === 0) throw new Error('Exam plan needs at least one skill');
  if (studyDates.length === 0) throw new Error('Exam date is out of range');

  const blocks = getAllBlocks(unitNumbers, skills);
  const lastDate = studyDates[studyDates.length - 1];
  let practice: { dateStr: string; focus: ExamFocusBlock[] }[];

  if (studyDates.length === 1) {
    practice = [{ dateStr: lastDate, focus: [] }];
  } else {
    const practiceDates = studyDates.slice(0, -1);
    const hasMixedReview = practiceDates.length >= MIXED_REVIEW_MIN_PRACTICE_DAYS;
    const focusedDates = hasMixedReview ? practiceDates.slice(0, -1) : practiceDates;
    const chunks = distributeBlocks(blocks, focusedDates.length);
    practice = focusedDates.map((dateStr, i) => ({ dateStr, focus: chunks[i] }));
    if (hasMixedReview) practice.push({ dateStr: practiceDates[practiceDates.length - 1], focus: [] });
  }

  const days: ExamPlanDay[] = [
    ...practice.map((p, i) => ({ dayIndex: i, kind: 'practice' as const, ...p })),
    { dayIndex: practice.length, dateStr: lastDate, kind: 'mock', focus: [] },
  ];

  return {
    id: `exam-${Date.parse(input.createdAt).toString(36)}`,
    createdAt: input.createdAt,
    gradeId: input.gradeId,
    examDateStr: input.examDateStr,
    unitNumbers,
    skills,
    days,
  };
}

// ---- Session content -------------------------------------------------------------------

/** Where a session's questions come from: the grade's bank (null: the mission questions only). */
interface ExamQuestionSource {
  bank: ExamBankPack | null;
  pool: ExamBankPool;
}

/**
 * The block's questions, shuffled per session: the unit's bank items of the pool, or, for a unit
 * without a bank, the step of each unit mission that practises `skill`.
 */
function getBlockSteps(
  plan: ExamPrepPlan,
  rawBlock: ExamFocusBlock,
  tier: ProficiencyTier,
  gender: LearnerGender,
  salt: number,
  seedKey: string,
  source: ExamQuestionSource
): ExamSessionStep[] {
  const block = toTopicUnitBlock(plan.gradeId, rawBlock);
  const meta = EXAM_SKILL_META[block.skill];
  const badgeLabelHe = `${meta.emoji} ${meta.labelHe} · יחידה ${block.unitNumber}`;
  const unitBank = source.bank?.[block.unitNumber];
  const steps = unitBank
    ? buildBankSteps(unitBank, {
        gradeId: plan.gradeId,
        unitNumber: block.unitNumber,
        skill: block.skill,
        pool: source.pool,
        tier,
        gender,
        salt,
        badgeLabelHe,
      })
    : getMissionBlockSteps(plan, block, tier, gender, salt, badgeLabelHe);
  return seededShuffle(steps, `${seedKey}|${block.unitNumber}|${block.skill}`);
}

/**
 * A grade 1 plan saved before the letters and blending units came first (Feature 48) names units
 * 1–4 for what are now units 7–10. Phonics units are never chosen for an exam, so such a number is
 * moved past them.
 */
function toTopicUnitBlock(gradeId: GradeId, block: ExamFocusBlock): ExamFocusBlock {
  const units = CURRICULUM_BY_GRADE[gradeId]?.units ?? [];
  const unit = units.find((u) => u.unitNumber === block.unitNumber);
  if (!unit || !isPhonicsUnit(unit)) return block;
  return { ...block, unitNumber: block.unitNumber + units.filter(isPhonicsUnit).length };
}

function getMissionBlockSteps(
  plan: ExamPrepPlan,
  block: ExamFocusBlock,
  tier: ProficiencyTier,
  gender: LearnerGender,
  salt: number,
  badgeLabelHe: string
): ExamSessionStep[] {
  const pack = CURRICULUM_BY_GRADE[plan.gradeId] || CURRICULUM_BY_GRADE['grade-7'];
  const unit = pack.units.find((u) => u.unitNumber === block.unitNumber);
  if (!unit) return [];

  const meta = EXAM_SKILL_META[block.skill];
  return unit.missions.flatMap((mission) => {
    const step = getExercisesForMission(mission, tier, gender, salt).find(
      (s) => s.type === meta.stepType
    );
    if (!step) return [];
    return [
      {
        ...step,
        skill: block.skill,
        unitNumber: block.unitNumber,
        badgeLabelHe,
        // The mission's own wording ("you finished every step") doesn't fit an exam session.
        options:
          block.skill === 'unseen'
            ? step.options?.map((o) =>
                o.isCorrect ? { ...o, explanationHe: 'מעולה! זו התשובה הנכונה לפי הקטע 🎯' } : o
              )
            : step.options,
      },
    ];
  });
}

/** Round-robin merge: one item from each list in turn. */
function interleave<T>(lists: readonly T[][]): T[] {
  const longest = Math.max(0, ...lists.map((l) => l.length));
  return Array.from({ length: longest }, (_, i) => lists.flatMap((l) => (i < l.length ? [l[i]] : []))).flat();
}

export function buildSessionSteps(
  plan: ExamPrepPlan,
  day: ExamPlanDay,
  tier: ProficiencyTier,
  gender: LearnerGender,
  salt: number,
  bank: ExamBankPack | null = null
): ExamSessionStep[] {
  const focus = day.focus.length > 0 ? day.focus : getAllBlocks(plan.unitNumbers, plan.skills);
  const seedKey = `${plan.id}|day${day.dayIndex}|${salt}`;
  const source: ExamQuestionSource = { bank, pool: 'practice' };
  const perBlock = focus.map((b) => getBlockSteps(plan, b, tier, gender, salt, seedKey, source));
  return interleave(perBlock).slice(0, EXAM_SESSION_MAX_STEPS);
}

/**
 * Up to MOCK_EXAM_QUESTION_COUNT questions, balanced across skills and grouped by skill. Units
 * with a bank use only its reserved items, so the mock never repeats a practice question.
 */
export function buildMockExamSteps(
  plan: ExamPrepPlan,
  tier: ProficiencyTier,
  gender: LearnerGender,
  salt: number,
  bank: ExamBankPack | null = null
): ExamSessionStep[] {
  const seedKey = `${plan.id}|mock|${salt}`;
  const source: ExamQuestionSource = { bank, pool: 'mock' };
  const pools = plan.skills.map((skill) =>
    interleave(
      plan.unitNumbers.map((unitNumber) =>
        getBlockSteps(plan, { unitNumber, skill }, tier, gender, salt, seedKey, source)
      )
    )
  );

  const taken = pools.map(() => 0);
  let total = 0;
  let hasMore = true;
  while (total < MOCK_EXAM_QUESTION_COUNT && hasMore) {
    hasMore = false;
    for (let i = 0; i < pools.length && total < MOCK_EXAM_QUESTION_COUNT; i++) {
      if (taken[i] < pools[i].length) {
        taken[i] += 1;
        total += 1;
        hasMore = true;
      }
    }
  }
  return pools.flatMap((pool, i) => pool.slice(0, taken[i]));
}

// ---- Scoring & rewards -----------------------------------------------------------------

export function summarizeAnswers(answers: readonly ExamAnswer[]): ExamScoreSummary {
  const bySkill: ExamScoreSummary['bySkill'] = {};
  answers.forEach((a) => {
    const prev = bySkill[a.skill] || { correct: 0, total: 0 };
    bySkill[a.skill] = { correct: prev.correct + (a.isCorrect ? 1 : 0), total: prev.total + 1 };
  });
  const correctCount = answers.filter((a) => a.isCorrect).length;
  return {
    correctCount,
    totalQuestions: answers.length,
    scorePercent: answers.length ? Math.round((correctCount / answers.length) * 100) : 0,
    bySkill,
  };
}

export function getWeakSkills(summary: ExamScoreSummary): ExamSkill[] {
  return EXAM_SKILLS.filter((skill) => {
    const s = summary.bySkill[skill];
    return s && s.total > 0 && (s.correct / s.total) * 100 < EXAM_READY_SCORE;
  });
}

/**
 * Saves a finished session or mock exam on the plan and grants its rewards. The first
 * completion of a day earns the full reward; repeats keep the best score and earn a little XP.
 * A mock score of EXAM_READY_SCORE or more earns the certificate (and its bonus) once.
 */
export function applyExamResultToProfile(
  profile: LearnerProfile,
  dayIndex: number,
  answers: readonly ExamAnswer[],
  now: Date
): LearnerProfile {
  const plan = profile.examPrep;
  const day = plan?.days.find((d) => d.dayIndex === dayIndex);
  if (!plan || !day) return profile;

  const nowIso = now.toISOString();
  const { scorePercent } = summarizeAnswers(answers);
  const isFirst = !day.completedAt;
  const isMock = day.kind === 'mock';
  const earnsCertificate = isMock && scorePercent >= EXAM_READY_SCORE && !plan.certificateEarnedAt;

  const updatedPlan: ExamPrepPlan = {
    ...plan,
    days: plan.days.map((d) =>
      d.dayIndex === dayIndex
        ? {
            ...d,
            completedAt: d.completedAt ?? nowIso,
            scorePercent: Math.max(d.scorePercent ?? 0, scorePercent),
          }
        : d
    ),
    ...(isMock ? { bestMockScore: Math.max(plan.bestMockScore ?? 0, scorePercent) } : {}),
    ...(earnsCertificate ? { certificateEarnedAt: nowIso } : {}),
  };

  const xpGain = isFirst ? (isMock ? MOCK_EXAM_REWARD_XP : EXAM_SESSION_REWARD_XP) : EXAM_REPEAT_REWARD_XP;
  const diamondGain =
    (isFirst ? (isMock ? MOCK_EXAM_REWARD_DIAMONDS : EXAM_SESSION_REWARD_DIAMONDS) : 0) +
    (earnsCertificate ? CERTIFICATE_BONUS_DIAMONDS : 0);

  const withActivity = recordDailyActivity(
    profile,
    { missions: 1, voiceWords: 0, threeStarMissions: scorePercent >= THREE_STAR_SCORE ? 1 : 0 },
    toLocalDateStr(now)
  );
  const xp = withActivity.stats.xp + xpGain;

  return {
    ...withActivity,
    examPrep: updatedPlan,
    stats: {
      ...withActivity.stats,
      xp,
      level: levelForXp(xp, withActivity.stats.level),
      diamonds: withActivity.stats.diamonds + diamondGain,
    },
  };
}

// ---- Plan progress ---------------------------------------------------------------------

export function getDayStatus(day: ExamPlanDay, todayStr: string): ExamDayStatus {
  if (day.completedAt) return 'done';
  if (day.dateStr < todayStr) return 'missed';
  if (day.dateStr === todayStr) return 'today';
  return 'upcoming';
}

function getMockDay(plan: ExamPrepPlan): ExamPlanDay | undefined {
  return plan.days.find((d) => d.kind === 'mock');
}

/** The mock exam opens on its own day, or earlier once every practice day is done. */
export function isMockUnlocked(plan: ExamPrepPlan, todayStr: string): boolean {
  const mock = getMockDay(plan);
  if (!mock) return false;
  const practiceDone = plan.days.every((d) => d.kind === 'mock' || Boolean(d.completedAt));
  return practiceDone || mock.dateStr <= todayStr;
}

/** The first unfinished session available today, catch-up days first. */
export function getNextSession(plan: ExamPrepPlan, todayStr: string): ExamPlanDay | null {
  const mockUnlocked = isMockUnlocked(plan, todayStr);
  return (
    plan.days.find(
      (d) =>
        !d.completedAt && (d.kind === 'mock' ? mockUnlocked : d.dateStr <= todayStr)
    ) ?? null
  );
}

/** A plan is active until the learner archives it; it is "past" once the exam day is over. */
export function isExamPast(plan: ExamPrepPlan, todayStr: string): boolean {
  return plan.examDateStr < todayStr;
}

// ---- Confidence tips -------------------------------------------------------------------

const SKILL_TIPS: Record<ExamSkill, { girl: string; boy: string }> = {
  grammar: {
    girl: 'דקדוק: חפשי מילות רמז לזמן (yesterday, now, every day) כדי לבחור את צורת הפועל הנכונה.',
    boy: 'דקדוק: חפש מילות רמז לזמן (yesterday, now, every day) כדי לבחור את צורת הפועל הנכונה.',
  },
  vocabulary: {
    girl: 'אוצר מילים: עברי שוב על מילות היחידה במאגר המילים 🎙️ ואמרי כל מילה בקול.',
    boy: 'אוצר מילים: עבור שוב על מילות היחידה במאגר המילים 🎙️ ואמור כל מילה בקול.',
  },
  sentences: {
    girl: 'בניית משפטים: זכרי את הסדר — מי (נושא) + פועל + כל השאר.',
    boy: 'בניית משפטים: זכור את הסדר — מי (נושא) + פועל + כל השאר.',
  },
  unseen: {
    girl: 'הבנת הנקרא: קראי קודם את השאלה, ואז חפשי את התשובה בקטע.',
    boy: 'הבנת הנקרא: קרא קודם את השאלה, ואז חפש את התשובה בקטע.',
  },
};

const GENERAL_TIPS: { girl: string; boy: string }[] = [
  {
    girl: 'במבחן: קראי כל שאלה פעמיים, ורק אז עני.',
    boy: 'במבחן: קרא כל שאלה פעמיים, ורק אז ענה.',
  },
  {
    girl: 'התחילי מהשאלות הקלות וחזרי לקשות בסוף.',
    boy: 'התחל מהשאלות הקלות וחזור לקשות בסוף.',
  },
  {
    girl: 'בלילה שלפני: שינה טובה וארוחת בוקר — כך המוח עובד הכי טוב 😴🍎',
    boy: 'בלילה שלפני: שינה טובה וארוחת בוקר — כך המוח עובד הכי טוב 😴🍎',
  },
  {
    girl: 'נשימה עמוקה! תרגלת, ואת מוכנה יותר ממה שנדמה לך 💪',
    boy: 'נשימה עמוקה! תרגלת, ואתה מוכן יותר ממה שנדמה לך 💪',
  },
];

const MAX_TIPS = 5;

/** Tips for the weak skills first, then general exam-day tips. */
export function getConfidenceTips(
  skills: readonly ExamSkill[],
  weakSkills: readonly ExamSkill[],
  gender: LearnerGender
): string[] {
  const skillTips = EXAM_SKILLS.filter((s) => skills.includes(s) && weakSkills.includes(s)).map(
    (s) => SKILL_TIPS[s][gender]
  );
  return [...skillTips, ...GENERAL_TIPS.map((t) => t[gender])].slice(0, MAX_TIPS);
}
