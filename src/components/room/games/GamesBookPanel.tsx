import React, { useMemo, useState } from 'react';
import confetti from 'canvas-confetti';
import { Lock } from 'lucide-react';
import { RoomActivityReward } from '../../../data/roomActivities';
import {
  WORD_GAMES,
  WordGameId,
  buildCrosswordPuzzle,
  buildFindingPuzzle,
  buildScramble,
  buildSearchPuzzle,
  getBestGameScore,
  getGameWords,
  getWordGame,
  isGameUnlocked,
  recordGameResult,
} from '../../../data/wordGames';
import { LearnerProfile } from '../../../types/learner';
import { ThemeDefinition } from '../../../themes/themeRegistry';
import { ActivityRewardSummary } from '../ActivityRewardSummary';
import { RoomPanelFrame } from '../RoomPanelFrame';
import { CrosswordGame } from './CrosswordGame';
import { ScrambleGame } from './ScrambleGame';
import { WordHuntGame } from './WordHuntGame';

interface GamesBookPanelProps {
  profile: LearnerProfile;
  theme: ThemeDefinition;
  onUpdateProfile: (updated: LearnerProfile) => void;
  onSpeakEnglish: (text: string, rate?: number) => void;
  onClose: () => void;
}

type BookView =
  | { kind: 'menu' }
  | { kind: 'play'; gameId: WordGameId; seed: number }
  | { kind: 'result'; gameId: WordGameId; score: number; reward: RoomActivityReward };

const newSeed = () => Math.floor(Math.random() * 1_000_000_000);

/** Feature 12, phase 5: the Games Book — word games that unlock with stars. */
export const GamesBookPanel: React.FC<GamesBookPanelProps> = ({ profile, theme, onUpdateProfile, onSpeakEnglish, onClose }) => {
  const [view, setView] = useState<BookView>({ kind: 'menu' });
  const words = useMemo(() => getGameWords(profile), [profile]);
  const stars = profile.stats.stars || 0;

  const play = (gameId: WordGameId) => setView({ kind: 'play', gameId, seed: newSeed() });

  const handleFinish = (gameId: WordGameId, score: number) => {
    const reward = recordGameResult(profile, gameId, score, new Date());
    onUpdateProfile(reward.profile);
    if (reward.isFullReward) confetti({ particleCount: 70, spread: 65, origin: { y: 0.6 } });
    setView({ kind: 'result', gameId, score, reward });
  };

  // Built once per play (the seed), so the puzzle stays the same while the learner solves it.
  const playSeed = view.kind === 'play' ? view.seed : null;
  const playGameId = view.kind === 'play' ? view.gameId : null;
  const puzzle = useMemo(() => {
    if (playSeed === null || playGameId === null) return null;
    if (playGameId === 'scramble') return { kind: 'scramble' as const, rounds: buildScramble(words, playSeed) };
    if (playGameId === 'crossword') return { kind: 'crossword' as const, puzzle: buildCrosswordPuzzle(words, playSeed) };
    if (playGameId === 'search') return { kind: 'search' as const, puzzle: buildSearchPuzzle(words, profile.preferredTier, playSeed) };
    return { kind: 'finding' as const, puzzle: buildFindingPuzzle(words, playSeed) };
    // The words and tier are read when a game starts; later profile updates don't reshuffle it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playSeed, playGameId]);

  const renderGame = (gameId: WordGameId, seed: number) => {
    if (!puzzle) return null;
    const common = {
      gender: profile.gender,
      theme,
      onSpeakEnglish,
      onFinish: (score: number) => handleFinish(gameId, score),
    };
    if (puzzle.kind === 'scramble') return <ScrambleGame key={seed} rounds={puzzle.rounds} {...common} />;
    if (puzzle.kind === 'crossword') return <CrosswordGame key={seed} puzzle={puzzle.puzzle} {...common} />;
    return (
      <WordHuntGame
        key={seed}
        puzzle={puzzle.puzzle}
        showEnglishList={puzzle.kind === 'search'}
        isStream={puzzle.kind === 'finding'}
        {...common}
      />
    );
  };

  if (view.kind === 'play') {
    const game = getWordGame(view.gameId);
    return (
      <RoomPanelFrame titleHe={`${game.emoji} ${game.titleHe} · ${game.titleEn}`} theme={theme} onClose={() => setView({ kind: 'menu' })} closeLabel="לספר המשחקים 📖">
        <p className={`text-xs ${theme.mutedTextClass}`}>{game.descriptionHe}</p>
        {renderGame(view.gameId, view.seed)}
      </RoomPanelFrame>
    );
  }

  if (view.kind === 'result') {
    const game = getWordGame(view.gameId);
    return (
      <RoomPanelFrame titleHe={`${game.emoji} ${game.titleHe}`} theme={theme} onClose={() => setView({ kind: 'menu' })} closeLabel="לספר המשחקים 📖">
        <ActivityRewardSummary
          reward={view.reward}
          theme={theme}
          gender={profile.gender}
          headlineHe={`${game.titleHe}: ${view.score}% 🏆 · שיא: ${getBestGameScore(profile, view.gameId) ?? view.score}%`}
          emptyHe=""
          againLabel="שוב! 🔁"
          onAgain={() => play(view.gameId)}
          onClose={onClose}
        />
      </RoomPanelFrame>
    );
  }

  return (
    <RoomPanelFrame titleHe="📖 ספר המשחקים · Games Book" theme={theme} onClose={onClose}>
      <p className={`text-xs ${theme.mutedTextClass}`}>
        משחקי מילים מאוצר המילים של הכיתה שלך ומרשימות המילים שלך. משחקים חדשים נפתחים עם כוכבים — יש לך {stars} ⭐
      </p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {WORD_GAMES.map((game) => {
          const isUnlocked = isGameUnlocked(profile, game.id);
          const best = getBestGameScore(profile, game.id);
          return (
            <li key={game.id}>
              <button
                type="button"
                onClick={() => isUnlocked && play(game.id)}
                disabled={!isUnlocked}
                className={`w-full p-3 rounded-2xl text-right flex items-center gap-3 ${theme.secondaryBtnClass} disabled:opacity-60`}
              >
                <span className="text-3xl leading-none" aria-hidden="true">
                  {isUnlocked ? game.emoji : '🔒'}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-extrabold text-sm">
                    {game.titleHe} · <span dir="ltr">{game.titleEn}</span>
                  </span>
                  <span className={`block text-[11px] ${theme.mutedTextClass}`}>
                    {isUnlocked
                      ? best !== undefined
                        ? `שיא: ${best}%`
                        : game.descriptionHe
                      : `נפתח ב־${game.starsRequired} ⭐ (חסרים לך ${game.starsRequired - stars})`}
                  </span>
                </span>
                {!isUnlocked && <Lock className="w-4 h-4 opacity-60 shrink-0" />}
              </button>
            </li>
          );
        })}
      </ul>
    </RoomPanelFrame>
  );
};
