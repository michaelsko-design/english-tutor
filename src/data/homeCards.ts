/**
 * At most one optional home card per visit (retention audit, 2026-11-23).
 *
 * The home screen has several optional cards (a gift, a review, a tip, an invite...). Stacked together they push the
 * map down and blur the one thing to do next, so the home screen shows only the first card in this order that wants
 * to show. A visit is the app opening, or coming back home from a mission. Once a card has been shown it keeps its
 * place for the visit (a card that loads later does not push it out), and when it is closed or used, no other card
 * takes its place until the next visit.
 *
 * Not in the list, always shown: the notice that a parent joined or reset the PIN (the child is told at once) and the
 * card saying every free mission is done.
 */
export const HOME_CARD_PRIORITY = [
  // One-time gifts and rewards the learner already earned
  'welcome-back',
  'streak-reward',
  // Something to play: a newly released pack, missed words to review
  'new-pack',
  'quick-review',
  // One-time looks back and first-use tips
  'week-one',
  'home-tip',
  // A Pro week a parent started (status, or the one-time "it ended" note)
  'pro-week',
  // Optional asks last
  'reminder-nudge',
  'parent-nudge',
] as const;

export type HomeCardId = (typeof HOME_CARD_PRIORITY)[number];

/**
 * The card to show now. `lockedId` is the card already shown in this visit: it keeps its place while it still wants
 * to show, and once it is gone nothing replaces it. With no card shown yet, the first wanting card in priority order.
 */
export function pickHomeCard(wanting: ReadonlySet<HomeCardId>, lockedId: HomeCardId | null): HomeCardId | null {
  if (lockedId !== null) return wanting.has(lockedId) ? lockedId : null;
  return HOME_CARD_PRIORITY.find((id) => wanting.has(id)) ?? null;
}
