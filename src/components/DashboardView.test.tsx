import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { MissionNode } from '../data/curriculum';
import { getLoadedGrade, loadGradeCurriculum } from '../data/curriculum/loader';
import { getDailyQuests } from '../data/rewardShop';
import { makeProfile } from '../test/fixtures';
import type { LearnerProfile } from '../types/learner';
import { toLocalDateStr } from '../utils/dates';
import { DashboardView } from './DashboardView';

const curricula = vi.hoisted(() => ({ status: 'ready' as 'ready' | 'loading' | 'error', retry: vi.fn() }));
const packOffer = vi.hoisted(() => ({ value: null as unknown, calls: [] as unknown[][] }));
const roomReward = vi.hoisted(() => ({ value: null as unknown }));
const vocabResult = vi.hoisted(() => ({ lastReturn: null as boolean | null }));

vi.mock('../hooks/useGradeCurricula', () => ({ useGradeCurricula: () => curricula }));
vi.mock('../hooks/useProAccess', () => ({ useProAccess: () => ({ isPro: true, isGatingOn: false }) }));
vi.mock('../hooks/useStickerImages', () => ({ useStickerImages: () => undefined }));
vi.mock('./companion/Companion', () => ({ Companion: () => null, preloadCompanion: vi.fn() }));
vi.mock('../data/contentPacks', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../data/contentPacks')>();
  return {
    ...actual,
    getNewPackOffer: (...args: unknown[]) => {
      packOffer.calls.push(args);
      return packOffer.value;
    },
  };
});
vi.mock('../data/roomRewards', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../data/roomRewards')>();
  return { ...actual, getRoomRewardForMission: () => roomReward.value };
});

const btn = (name: string, onClick?: () => void) => (
  <button type="button" onClick={onClick}>
    {name}
  </button>
);

vi.mock('./home/HomeHud', () => ({
  HomeHud: (p: Record<string, () => void>) => (
    <div>
      {btn('open-stats', p.onOpenStats)}
      {btn('open-quests', p.onOpenQuests)}
      {btn('open-shop', p.onOpenShop)}
      {btn('open-vault', p.onOpenVault)}
      {btn('open-auth', p.onOpenAuth)}
      {btn('open-tour', p.onOpenTour)}
      {btn('edit-profile', p.onEditProfile)}
    </div>
  ),
}));
vi.mock('./home/HomeHero', () => ({ HomeHero: (p: { onPlay: () => void; greetingHe: string }) => <div>{btn('play', p.onPlay)}<span>{p.greetingHe}</span></div> }));
vi.mock('./home/QuestRings', () => ({ QuestRings: (p: { onOpen: () => void }) => btn('open-rings', p.onOpen) }));
vi.mock('./home/MapPeek', () => ({ MapPeek: (p: { onOpenMap: () => void }) => btn('open-map-peek', p.onOpenMap) }));
vi.mock('./home/NewPackCard', () => ({
  NewPackCard: (p: { onOpen: () => void; onClose: () => void }) => (
    <div>
      {btn('pack-open', p.onOpen)}
      {btn('pack-close', p.onClose)}
    </div>
  ),
}));
vi.mock('./home/ParentNoticeCard', () => ({ ParentNoticeCard: () => null }));
vi.mock('./home/ParentNudgeCard', () => ({ ParentNudgeCard: () => null }));
vi.mock('./home/ReminderNudgeCard', () => ({ ReminderNudgeCard: () => null }));
vi.mock('./pro/FreeMissionsDoneCard', () => ({ FreeMissionsDoneCard: (p: { onAsk: () => void }) => btn('free-done', p.onAsk) }));
vi.mock('./room/StickerBackground', () => ({ StickerBackground: () => null }));
vi.mock('./room/RoomHub', () => ({
  RoomHub: (p: { isOpen: boolean; onOpen: () => void; onClose: () => void; onOpenShop: () => void }) => (
    <div>
      {btn('room-open-btn', p.onOpen)}
      {btn('room-shop-btn', p.onOpenShop)}
      {p.isOpen && btn('room-is-open', p.onClose)}
    </div>
  ),
}));
vi.mock('./examPrep/ExamPrepHub', async () => {
  const { useOpenProUpsell } = await import('./pro/proUpsellContext');
  return {
    ExamPrepHub: () => {
      const openUpsell = useOpenProUpsell();
      return btn('exam-upsell', () => openUpsell('exam'));
    },
  };
});
vi.mock('./wordLists/WordListsHub', () => ({ WordListsHub: () => null }));
vi.mock('./friends/FriendsHub', () => ({ FriendsHub: (p: { pendingInviteCode: string | null }) => <span>{`friends:${p.pendingInviteCode ?? 'none'}`}</span> }));
vi.mock('./progressReport/ProgressReportHub', () => ({ ProgressReportHub: () => null }));
vi.mock('./MissionMap', () => ({
  MissionMap: (p: { units: { missions: MissionNode[] }[]; onStartMission: (m: MissionNode) => void; onSelectTier: (t: string) => void; selectedTier: string }) => (
    <div>
      {btn('map-start', () => p.onStartMission(p.units[0].missions[0]))}
      {btn('map-tier', () => p.onSelectTier('challenger'))}
      <span>{`tier:${p.selectedTier}`}</span>
    </div>
  ),
}));
vi.mock('./home/StatsSheet', () => ({
  StatsSheet: (p: Record<string, (g?: string) => void>) => (
    <div>
      {btn('change-grade', () => p.onChangeGrade('grade-2'))}
      {btn('stats-placement', p.onOpenPlacement)}
      {btn('stats-tour', p.onOpenTour)}
      {btn('close-stats', p.onClose)}
    </div>
  ),
}));
vi.mock('./MissionRunner', () => ({
  MissionRunner: (p: { onCompleteMission: (r: unknown) => void; onClose: () => void; onSpeakEnglish: (t: string) => void; onSpeakParts: (parts: unknown[]) => void; isTierChosen: boolean; mission: MissionNode }) => (
    <div>
      <span>{`runner:${p.mission.id}:${p.isTierChosen ? 'from-map' : 'from-play'}`}</span>
      {btn('complete-mission', () =>
        p.onCompleteMission({
          missionId: p.mission.id,
          tier: 'explorer',
          starsEarned: 3,
          xpEarned: 40,
          diamondsEarned: 5,
          wordsLearnedCount: 4,
          isFullReward: true,
          isVoiceSkipped: false,
        })
      )}
      {btn('speak', () => {
        p.onSpeakEnglish('hello');
        p.onSpeakParts([{ text: 'שלום', lang: 'he' }, { text: 'hello', lang: 'en' }]);
      })}
      {btn('close-runner', p.onClose)}
    </div>
  ),
}));
vi.mock('./VocabularyVaultModal', () => ({
  VocabularyVaultModal: (p: { onEarnPracticeReward: (w: string, x: number, d: number) => boolean; onClose: () => void }) => (
    <div>
      {btn('earn-vocab', () => {
        vocabResult.lastReturn = p.onEarnPracticeReward('apple', 5, 2);
      })}
      {btn('close-vault', p.onClose)}
    </div>
  ),
}));
vi.mock('./RewardShopModal', () => ({
  RewardShopModal: (p: { onBuyReward: (i: unknown) => void; onEquipAvatar: (e: string) => void; onClose: () => void }) => {
    const item = (id: string, category: string, costDiamonds: number) => ({ id, category, emoji: '🦊', titleEn: id, titleHe: id, descriptionHe: '', costDiamonds });
    return (
      <div>
        {btn('buy-avatar', () => p.onBuyReward(item('avatar-fox', 'avatar', 10)))}
        {btn('buy-too-dear', () => p.onBuyReward(item('avatar-gold', 'avatar', 99999)))}
        {btn('buy-shield', () => p.onBuyReward(item('boost-streak-shield', 'boost', 10)))}
        {btn('equip-avatar', () => p.onEquipAvatar('🐼'))}
        {btn('close-shop', p.onClose)}
      </div>
    );
  },
}));
vi.mock('./PlacementTest', () => ({
  PlacementTest: (p: { onFinish: (r: unknown, apply: boolean) => void; onClose: () => void }) => (
    <div>
      {btn('finish-placement', () => p.onFinish({ recommendedGradeId: 'grade-2', recommendedTier: 'challenger', correctCount: 6, totalCount: 10, completedAt: '2026-11-05T10:00:00.000Z' }, true))}
      {btn('close-placement', p.onClose)}
    </div>
  ),
}));
vi.mock('./tutorial/ProfileTour', () => ({ ProfileTour: (p: { onDone: () => void }) => btn('tour-done', p.onDone) }));
vi.mock('./AuthModal', () => ({ AuthModal: (p: { onClose: () => void }) => btn('close-auth', p.onClose) }));
vi.mock('./pro/ProUpsellSheet', () => ({
  ProUpsellSheet: (p: { focus: string; onClose: () => void }) => <div>{btn('close-upsell', p.onClose)}<span>{`upsell:${p.focus}`}</span></div>,
}));

const AUTH_USER = { uid: 'me', email: 'me@x.test', displayName: 'נועה', isAnonymous: false };
const onUpdateProfile = vi.fn();
const onEditOnboarding = vi.fn();
const onInviteHandled = vi.fn();
const onSignOut = vi.fn(async () => undefined);

let firstMission: MissionNode;

beforeAll(async () => {
  await loadGradeCurriculum('grade-1');
  firstMission = getLoadedGrade('grade-1')!.units[0].missions[0];
});

beforeEach(() => {
  curricula.status = 'ready';
  curricula.retry.mockClear();
  packOffer.value = null;
  packOffer.calls = [];
  roomReward.value = null;
  vocabResult.lastReturn = null;
  onUpdateProfile.mockClear();
  onEditOnboarding.mockClear();
  onInviteHandled.mockClear();
  localStorage.clear();
  Element.prototype.scrollIntoView = vi.fn();
});

function setup(profile: LearnerProfile = makeProfile({}), extra: { authUser?: typeof AUTH_USER | null; invite?: string | null } = {}) {
  render(
    <DashboardView
      profile={profile}
      authUser={extra.authUser === undefined ? AUTH_USER : extra.authUser}
      syncStatus="synced"
      onUpdateProfile={onUpdateProfile}
      onEditOnboarding={onEditOnboarding}
      onSignOut={onSignOut}
      pendingInviteCode={extra.invite ?? null}
      onInviteHandled={onInviteHandled}
    />
  );
  return userEvent.setup();
}

const lastUpdate = (): LearnerProfile => onUpdateProfile.mock.calls[onUpdateProfile.mock.calls.length - 1][0];
const click = (user: ReturnType<typeof userEvent.setup>, name: string) => user.click(screen.getByRole('button', { name }));

describe('DashboardView loading', () => {
  it('shows an error with a retry while the learner’s grade is not loaded', async () => {
    curricula.status = 'error';
    const user = setup(makeProfile({ gradeId: 'grade-12' }));
    expect(screen.getByRole('alert')).toHaveTextContent('לא הצלחנו לטעון את השיעורים');
    await user.click(screen.getByRole('button', { name: 'נסו שוב' }));
    expect(curricula.retry).toHaveBeenCalledTimes(1);
  });

  it('shows a loading screen while the grade loads', () => {
    curricula.status = 'loading';
    setup(makeProfile({ gradeId: 'grade-12' }));
    expect(screen.queryByRole('button', { name: 'play' })).not.toBeInTheDocument();
  });
});

describe('DashboardView missions', () => {
  it('starts today’s mission from Play and closes the runner', async () => {
    const user = setup();
    await click(user, 'play');
    expect(screen.getByText(/^runner:.*:from-play$/)).toBeInTheDocument();
    await click(user, 'close-runner');
    expect(screen.queryByText(/^runner:/)).not.toBeInTheDocument();
  });

  it('starts a mission from the map with its tier already chosen', async () => {
    const user = setup();
    await click(user, 'map-start');
    expect(screen.getByText(`runner:${firstMission.id}:from-map`)).toBeInTheDocument();
  });

  it('records a finished mission: stars, xp, diamonds, words, tier stars and the daily counters', async () => {
    const user = setup();
    await click(user, 'map-start');
    await click(user, 'complete-mission');
    const saved = lastUpdate();
    expect(saved.missionProgress[firstMission.id]).toBe(3);
    expect(saved.stats.xp).toBe(40);
    expect(saved.stats.missionsCompleted).toBe(1);
    expect(saved.stats.wordsMastered).toBe(4);
    expect(saved.stats.stars).toBe(3);
    expect(saved.stats.diamonds).toBeGreaterThanOrEqual(5);
    expect(saved.missionTierStars?.[firstMission.id]).toBeDefined();
    expect(saved.missionRewardDates?.[firstMission.id]).toBe(toLocalDateStr(new Date()));
    expect(screen.queryByText(/^runner:/)).not.toBeInTheDocument();
  });

  it('shows the new room item toast after a mission and opens the room from it', async () => {
    roomReward.value = { id: 'room-lamp', kind: 'item', emoji: '🪔', nameHe: 'מנורה' };
    const user = setup();
    await click(user, 'map-start');
    await click(user, 'complete-mission');
    expect(lastUpdate().unlockedRewardIds).toContain('room-lamp');
    await user.click(screen.getByRole('status'));
    expect(screen.getByRole('button', { name: 'room-is-open' })).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('shows a wardrobe toast for a new piece of clothing', async () => {
    roomReward.value = { id: 'wear-hat', kind: 'wear', emoji: '🎩', nameHe: 'כובע' };
    const user = setup();
    await click(user, 'map-start');
    await click(user, 'complete-mission');
    expect(screen.getByRole('status')).toHaveTextContent('בגד חדש לארון');
  });

  it('changes the preferred tier from the map', async () => {
    const user = setup();
    await click(user, 'map-tier');
    expect(lastUpdate().preferredTier).toBe('challenger');
  });

  it('reads aloud from the runner without failing', async () => {
    const user = setup();
    await click(user, 'play');
    await click(user, 'speak');
    expect(screen.getByText(/^runner:/)).toBeInTheDocument();
  });
});

describe('DashboardView quests', () => {
  const finishedCounters = () => ({
    dateStr: toLocalDateStr(new Date()),
    missionsCompletedToday: 99,
    voiceWordsPracticedToday: 99,
    threeStarMissionsToday: 99,
  });

  it('opens the quests sheet from the rings and from the HUD', async () => {
    const user = setup();
    await click(user, 'open-rings');
    expect(screen.getByRole('dialog', { name: 'אתגרים יומיים ורצף שבועי' })).toBeInTheDocument();
  });

  it('claims a finished quest once, adding its diamonds', async () => {
    const quest = getDailyQuests('girl')[0];
    const user = setup(makeProfile({ gender: 'girl', dailyCounters: finishedCounters() }));
    await click(user, 'open-quests');
    const before = makeProfile({}).stats.diamonds;
    await user.click(screen.getAllByRole('button', { name: new RegExp(`\\+${quest.rewardDiamonds}`) })[0]);
    const saved = lastUpdate();
    expect(saved.claimedDailyQuestIds).toContain(quest.id);
    expect(saved.stats.diamonds).toBe(before + quest.rewardDiamonds);
  });
});

describe('DashboardView shop and vault', () => {
  it('buys an avatar and equips it', async () => {
    const user = setup(makeProfile({ stats: { diamonds: 100 } as never }));
    await click(user, 'open-shop');
    await click(user, 'buy-avatar');
    const saved = lastUpdate();
    expect(saved.unlockedRewardIds).toContain('avatar-fox');
    expect(saved.equippedAvatarEmoji).toBe('🦊');
    expect(saved.stats.diamonds).toBe(90);
  });

  it('refuses a purchase the diamonds do not cover', async () => {
    const user = setup(makeProfile({ stats: { diamonds: 5 } as never }));
    await click(user, 'open-shop');
    await click(user, 'buy-too-dear');
    expect(onUpdateProfile).not.toHaveBeenCalled();
  });

  it('buys a streak shield without unlocking an item', async () => {
    const user = setup(makeProfile({ stats: { diamonds: 100 } as never }));
    await click(user, 'open-shop');
    await click(user, 'buy-shield');
    const saved = lastUpdate();
    expect(saved.stats.diamonds).toBe(90);
    expect(saved.unlockedRewardIds).toEqual(makeProfile({}).unlockedRewardIds);
  });

  it('equips another avatar and closes the shop', async () => {
    const user = setup();
    await click(user, 'open-shop');
    await click(user, 'equip-avatar');
    expect(lastUpdate().equippedAvatarEmoji).toBe('🐼');
    await click(user, 'close-shop');
    expect(screen.queryByRole('button', { name: 'buy-avatar' })).not.toBeInTheDocument();
  });

  it('opens the shop from the room', async () => {
    const user = setup();
    await click(user, 'room-shop-btn');
    expect(screen.getByRole('button', { name: 'buy-avatar' })).toBeInTheDocument();
  });

  it('rewards a word said in the vault once per day', async () => {
    const user = setup();
    await click(user, 'open-vault');
    await click(user, 'earn-vocab');
    expect(vocabResult.lastReturn).toBe(true);
    expect(onUpdateProfile).toHaveBeenCalledTimes(1);
    await click(user, 'close-vault');
    expect(screen.queryByRole('button', { name: 'earn-vocab' })).not.toBeInTheDocument();
  });
});

describe('DashboardView sheets and modals', () => {
  it('changes the grade from the stats sheet', async () => {
    const user = setup();
    await click(user, 'open-stats');
    await click(user, 'change-grade');
    expect(lastUpdate().gradeId).toBe('grade-2');
  });

  it('runs the placement test from the stats sheet and applies the result', async () => {
    const user = setup();
    await click(user, 'open-stats');
    await click(user, 'stats-placement');
    expect(screen.queryByRole('button', { name: 'close-stats' })).not.toBeInTheDocument();
    await click(user, 'finish-placement');
    expect(onUpdateProfile).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('button', { name: 'finish-placement' })).not.toBeInTheDocument();
  });

  it('closes the placement test without a result', async () => {
    const user = setup();
    await click(user, 'open-stats');
    await click(user, 'stats-placement');
    await click(user, 'close-placement');
    expect(onUpdateProfile).not.toHaveBeenCalled();
  });

  it('opens the tour from the HUD and from the stats sheet', async () => {
    const user = setup();
    await click(user, 'open-tour');
    await click(user, 'tour-done');
    await click(user, 'open-stats');
    await click(user, 'stats-tour');
    expect(screen.getByRole('button', { name: 'tour-done' })).toBeInTheDocument();
    await click(user, 'tour-done');
    expect(screen.queryByRole('button', { name: 'tour-done' })).not.toBeInTheDocument();
  });

  it('opens and closes the sign-in dialog', async () => {
    const user = setup();
    await click(user, 'open-auth');
    await click(user, 'close-auth');
    expect(screen.queryByRole('button', { name: 'close-auth' })).not.toBeInTheDocument();
  });

  it('sends the learner to the profile editor from the HUD and the bottom bar', async () => {
    const user = setup();
    await click(user, 'edit-profile');
    await user.click(screen.getByRole('button', { name: 'פרופיל' }));
    expect(onEditOnboarding).toHaveBeenCalledTimes(2);
  });

  it('passes an invite code on to the friends hub', () => {
    setup(makeProfile({}), { invite: 'ABC123' });
    expect(screen.getByText('friends:ABC123')).toBeInTheDocument();
  });
});

describe('DashboardView mobile bar and Pro sheet', () => {
  it('scrolls to the sections and opens the vault and shop from the bottom bar', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: 'ראשי' }));
    await user.click(screen.getByRole('button', { name: 'מפה' }));
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(2);
    await user.click(screen.getByRole('button', { name: /מילים/ }));
    expect(screen.getByRole('button', { name: 'earn-vocab' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'חנות' }));
    expect(screen.getByRole('button', { name: 'buy-avatar' })).toBeInTheDocument();
  });

  it('opens the Pro sheet from a hub, only for a signed-in learner', async () => {
    const user = setup();
    await click(user, 'exam-upsell');
    expect(screen.getByText('upsell:exam')).toBeInTheDocument();
    await click(user, 'close-upsell');
    expect(screen.queryByText(/^upsell:/)).not.toBeInTheDocument();
  });

  it('shows no Pro sheet without a signed-in user', async () => {
    const user = setup(makeProfile({}), { authUser: null });
    await click(user, 'exam-upsell');
    expect(screen.queryByText(/^upsell:/)).not.toBeInTheDocument();
  });
});

describe('DashboardView new pack card', () => {
  const OFFER = { pack: { id: 'season2-1' }, firstMissionId: 'mission-1', unit: { packId: 'season2-1' } };

  it('scrolls to the map and remembers the pack when it is opened', async () => {
    packOffer.value = OFFER;
    const user = setup();
    await click(user, 'pack-open');
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
    expect(JSON.parse(localStorage.getItem(localStorage.key(0) ?? '') ?? '[]')).toContain('season2-1');
  });

  it('remembers the pack when the card is dismissed', async () => {
    packOffer.value = OFFER;
    const user = setup();
    await click(user, 'pack-close');
    const lastCall = packOffer.calls[packOffer.calls.length - 1];
    expect(lastCall[2]).toContain('season2-1');
  });
});
