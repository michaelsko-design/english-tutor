import React, { useEffect, useState } from 'react';
import { TutorialSlide, TutorialSlideId } from '../../data/appTutorial';
import { APP_NAME } from '../../config/appInfo';
import { getCommonArt, pickCutoutSrc } from '../../themes/themeArt';
import { useCountUp } from '../../hooks/useCountUp';
import { AppLogo } from '../AppLogo';
import { ArtImage } from '../art/ArtImage';
import { HudIcon } from '../hud/HudIcon';
import { ProgressRing } from '../home/ProgressRing';
import { VibeAmount } from '../ui/VibeAmount';

/**
 * Feature 45: the animated picture at the top of each tour slide. Every scene is a small,
 * colourful mock of the part of the app the slide talks about; its pieces pop in one after
 * another (CSS delays), so a slide plays like a short cartoon. Reduced motion shows the end.
 */

/** Each slide's own colours: the stage gradient and the two soft blobs behind the page. */
export const TOUR_ACCENTS: Record<TutorialSlideId, { stageClass: string; blobClasses: [string, string] }> = {
  welcome: { stageClass: 'from-fuchsia-500 via-pink-500 to-orange-400', blobClasses: ['bg-pink-400/30', 'bg-amber-300/30'] },
  missions: { stageClass: 'from-amber-400 via-orange-500 to-rose-500', blobClasses: ['bg-orange-400/30', 'bg-rose-400/25'] },
  map: { stageClass: 'from-emerald-400 via-teal-500 to-cyan-600', blobClasses: ['bg-emerald-400/30', 'bg-cyan-400/25'] },
  economy: { stageClass: 'from-sky-400 via-indigo-500 to-violet-600', blobClasses: ['bg-sky-400/30', 'bg-violet-400/25'] },
  streak: { stageClass: 'from-orange-400 via-red-500 to-pink-600', blobClasses: ['bg-orange-400/30', 'bg-pink-400/25'] },
  dock: { stageClass: 'from-violet-500 via-purple-500 to-fuchsia-500', blobClasses: ['bg-violet-400/30', 'bg-fuchsia-400/25'] },
  finish: { stageClass: 'from-pink-500 via-amber-400 to-emerald-400', blobClasses: ['bg-amber-300/30', 'bg-emerald-400/25'] },
};

const POP_START_MS = 150;
const POP_STEP_MS = 140;
const SCENE_START_MS = 450;
const CASTLE_PX = 76;
const DAY_LABELS_HE = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'];

/** The animation delay of the i-th piece of a scene. */
export function popDelay(index: number, startMs = POP_START_MS): React.CSSProperties {
  return { animationDelay: `${startMs + index * POP_STEP_MS}ms` };
}

/** False until the scene has been on screen for a moment, so rings and counters fill visibly. */
function useSceneStarted(delayMs = SCENE_START_MS): boolean {
  const [isStarted, setIsStarted] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setIsStarted(true), delayMs);
    return () => window.clearTimeout(timer);
  }, [delayMs]);
  return isStarted;
}

const Sparkle: React.FC<{ emoji: string; className: string; delayMs: number }> = ({ emoji, className, delayMs }) => (
  <span
    className={`absolute text-2xl animate-tour-twinkle pointer-events-none ${className}`}
    style={{ animationDelay: `${delayMs}ms` }}
    aria-hidden="true"
  >
    {emoji}
  </span>
);

const WelcomeScene: React.FC = () => (
  <div className="h-full flex flex-col items-center justify-center gap-3">
    <Sparkle emoji="✨" className="top-4 right-6" delayMs={0} />
    <Sparkle emoji="⭐" className="top-8 left-8" delayMs={500} />
    <Sparkle emoji="💫" className="bottom-6 right-10" delayMs={900} />
    <Sparkle emoji="✨" className="bottom-8 left-6" delayMs={1300} />
    <AppLogo size={64} className="animate-tour-pop shadow-lg ring-2 ring-white/40" />
    <p className="animate-tour-pop text-4xl font-black text-white drop-shadow-lg" dir="ltr" lang="en" style={popDelay(0)}>
      {APP_NAME}
    </p>
    <div className="flex gap-3" aria-hidden="true">
      {['🎮', '⭐', '💎', '🏠', '👫'].map((emoji, i) => (
        <span
          key={emoji}
          className="animate-tour-pop w-12 h-12 rounded-2xl bg-white/25 ring-2 ring-white/40 flex items-center justify-center text-2xl shadow-lg"
          style={popDelay(i + 2)}
        >
          {emoji}
        </span>
      ))}
    </div>
  </div>
);

const MissionsScene: React.FC<{ slide: TutorialSlide }> = ({ slide }) => (
  <div className="h-full flex flex-col items-center justify-center gap-5 px-3">
    <div className="relative animate-tour-pop" style={popDelay(0)} aria-hidden="true">
      <span className="absolute inset-0 rounded-full bg-white/60 animate-coin-pulse" />
      <span className="relative block px-6 py-3 rounded-full bg-white text-orange-600 font-black text-lg shadow-xl">
        ▶ בואו נשחק!
      </span>
      <span className="absolute -bottom-5 -left-4 text-3xl animate-tour-tap">👆</span>
    </div>
    {/* The five steps, in reading order along a trail */}
    <div className="relative w-full max-w-xs" aria-hidden="true">
      <span className="absolute top-1/2 inset-x-5 h-1.5 -translate-y-1/2 rounded-full bg-white/30" />
      <span className="absolute top-1/2 inset-x-5 h-1.5 -translate-y-1/2 rounded-full bg-white animate-tour-fill" style={popDelay(1)} />
      <div className="relative flex justify-between">
        {slide.points.map((point, i) => (
          <span
            key={point.emoji}
            className="animate-tour-pop w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center text-xl"
            style={popDelay(i + 2)}
          >
            {point.emoji}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const MapCoin: React.FC<{ stars: number; isLocked?: boolean; index: number; offsetClass: string }> = ({
  stars,
  isLocked = false,
  index,
  offsetClass,
}) => (
  <div className={`flex flex-col items-center gap-1 ${offsetClass}`}>
    <span
      className={`animate-tour-pop w-14 h-14 rounded-full flex items-center justify-center text-2xl font-black shadow-lg ring-4 ${
        isLocked ? 'bg-slate-300 ring-slate-200 text-slate-500' : 'bg-amber-300 ring-amber-100 text-amber-700'
      }`}
      style={popDelay(index * 2)}
    >
      {isLocked ? '🔒' : index + 1}
    </span>
    <span className="flex gap-0.5 h-5">
      {Array.from({ length: isLocked ? 0 : 3 }, (_, s) => (
        <span key={s} className="animate-tour-pop" style={popDelay(index * 2 + 1 + s * 0.4)}>
          <HudIcon name="star" className="w-5 h-5" isGreyed={s >= stars} />
        </span>
      ))}
    </span>
  </div>
);

const MapScene: React.FC = () => {
  const devicePixelRatio = typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1;
  const castleSrc = pickCutoutSrc(getCommonArt('boss-locked'), CASTLE_PX, devicePixelRatio);
  return (
    <div className="h-full flex items-center justify-center px-4" aria-hidden="true">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 200" preserveAspectRatio="none">
        <path d="M300 70 C 240 150, 200 40, 150 110 S 60 60, 20 120" fill="none" stroke="white" strokeOpacity="0.45" strokeWidth="10" strokeLinecap="round" strokeDasharray="2 18" />
      </svg>
      <div className="relative w-full flex items-center justify-between">
        <MapCoin stars={3} index={0} offsetClass="-translate-y-5" />
        <MapCoin stars={1} index={1} offsetClass="translate-y-4" />
        <MapCoin stars={0} index={2} isLocked offsetClass="-translate-y-3" />
        <div className="animate-tour-pop flex flex-col items-center" style={popDelay(7)}>
          <span className="block relative" style={{ width: CASTLE_PX, height: CASTLE_PX }}>
            <ArtImage
              src={castleSrc}
              className="w-full h-full drop-shadow-xl"
              fallback={<span className="absolute inset-0 flex items-center justify-center text-5xl">🏰</span>}
            />
          </span>
          <span className="px-2 py-0.5 rounded-full bg-white/90 text-teal-700 text-xs font-black shadow">👑 בוס</span>
        </div>
      </div>
    </div>
  );
};

const EconomyScene: React.FC<{ avatarEmoji: string }> = ({ avatarEmoji }) => {
  const isStarted = useSceneStarted();
  const gems = useCountUp(isStarted ? 50 : 0, 1200);
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4 px-4" aria-hidden="true">
      <div className="flex items-center gap-6">
        {/* The level ring around the avatar */}
        <div className="animate-tour-pop relative" style={popDelay(0)}>
          <ProgressRing ratio={isStarted ? 0.8 : 0.1} size={84} strokeWidth={8} arcClassName="text-amber-300" trackClassName="text-white/25">
            <span className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-3xl">{avatarEmoji}</span>
          </ProgressRing>
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 rounded-full bg-amber-300 text-slate-900 text-xs font-black shadow whitespace-nowrap">
            רמה 2
          </span>
          <span className="absolute -top-3 -right-6 px-2 py-0.5 rounded-full bg-white text-indigo-600 text-xs font-black shadow animate-tour-pop" dir="ltr" style={popDelay(3)}>
            <VibeAmount amount={20} hasPlus />
          </span>
        </div>
        {/* The diamonds counter */}
        <div className="animate-tour-pop flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white shadow-xl" style={popDelay(1)}>
          <HudIcon name="gem" className="w-8 h-8" />
          <span className="text-2xl font-black text-fuchsia-600 tabular-nums">{gems}</span>
        </div>
      </div>
      {/* What the diamonds buy */}
      <div className="flex items-center gap-2">
        <span className="text-white text-sm font-black">🛍️</span>
        {['🐱', '🕶️', '👑', '🛡️', '🪴'].map((emoji, i) => (
          <span key={emoji} className="animate-tour-pop w-10 h-10 rounded-xl bg-white/25 ring-2 ring-white/40 flex items-center justify-center text-xl" style={popDelay(i + 4)}>
            {emoji}
          </span>
        ))}
      </div>
    </div>
  );
};

const StreakScene: React.FC<{ isShabbatObserver: boolean }> = ({ isShabbatObserver }) => {
  const isStarted = useSceneStarted(SCENE_START_MS + 600);
  const questRatios = [1, 0.66, 0.33];
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4 px-3" aria-hidden="true">
      <div className="flex gap-1.5">
        {DAY_LABELS_HE.map((day, i) => {
          const isShabbatDay = i >= 5 && isShabbatObserver;
          return (
            <div key={day} className="flex flex-col items-center gap-1">
              <span
                className="animate-tour-pop w-10 h-10 rounded-full bg-white/90 shadow flex items-center justify-center text-xl"
                style={popDelay(i)}
              >
                {isShabbatDay ? '🛡️' : i < 5 ? <HudIcon name="flame" className="w-6 h-6" /> : '💤'}
              </span>
              <span className="text-xs font-black text-white">{day}</span>
            </div>
          );
        })}
      </div>
      <div className="flex gap-3">
        {questRatios.map((ratio, i) => (
          <span key={ratio} className="animate-tour-pop" style={popDelay(i + 7)}>
            <ProgressRing ratio={isStarted ? ratio : 0} size={46} strokeWidth={5} arcClassName="text-white" trackClassName="text-white/25">
              <span className="text-lg">{['🎯', '🎙️', '⭐'][i]}</span>
            </ProgressRing>
          </span>
        ))}
      </div>
    </div>
  );
};

const DockScene: React.FC<{ slide: TutorialSlide }> = ({ slide }) => (
  <div className="h-full flex items-center justify-center px-3" aria-hidden="true">
    <div className="flex gap-2">
      {slide.points.map((point, i) => (
        <span
          key={point.emoji}
          className="animate-tour-pop w-[3.75rem] h-[4.75rem] px-0.5 rounded-2xl bg-white shadow-xl flex flex-col items-center justify-center gap-1"
          style={popDelay(i)}
        >
          <span className="text-2xl leading-none">{point.emoji}</span>
          <span className="text-xs leading-tight font-black text-purple-700 text-center">{point.labelHe}</span>
        </span>
      ))}
    </div>
  </div>
);

const FinishScene: React.FC = () => (
  <div className="h-full flex items-center justify-center" aria-hidden="true">
    <Sparkle emoji="⭐" className="top-6 right-10" delayMs={0} />
    <Sparkle emoji="💎" className="top-10 left-10" delayMs={400} />
    <Sparkle emoji="🔥" className="bottom-8 right-14" delayMs={800} />
    <Sparkle emoji="✨" className="bottom-6 left-14" delayMs={1200} />
    <span className="animate-tour-pop" style={popDelay(0)}>
      <HudIcon name="trophy" className="w-28 h-28 drop-shadow-2xl" />
    </span>
  </div>
);

interface TourSceneProps {
  slide: TutorialSlide;
  avatarEmoji: string;
  isShabbatObserver: boolean;
}

export const TourScene: React.FC<TourSceneProps> = ({ slide, avatarEmoji, isShabbatObserver }) => {
  switch (slide.id) {
    case 'welcome':
      return <WelcomeScene />;
    case 'missions':
      return <MissionsScene slide={slide} />;
    case 'map':
      return <MapScene />;
    case 'economy':
      return <EconomyScene avatarEmoji={avatarEmoji} />;
    case 'streak':
      return <StreakScene isShabbatObserver={isShabbatObserver} />;
    case 'dock':
      return <DockScene slide={slide} />;
    case 'finish':
      return <FinishScene />;
  }
};
