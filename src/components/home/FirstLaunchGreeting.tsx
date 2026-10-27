import React, { useEffect, useRef, useState } from 'react';
import { LearnerGender } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { getCommonArt, pickCutoutSrc } from '../../themes/themeArt';
import { useCountUp } from '../../hooks/useCountUp';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { celebrate } from '../../utils/celebrate';
import { preloadArt } from '../../utils/artStatus';
import { ArtImage } from '../art/ArtImage';
import { Companion, preloadCompanion } from '../companion/Companion';

interface FirstLaunchGreetingProps {
  theme: ThemeDefinition;
  gender: LearnerGender;
  name: string;
  /** The welcome gems already in the new profile */
  welcomeGems: number;
  onDone: () => void;
}

const CHEST_PX = 176;
const COMPANION_PX = 140;
const GEM_COUNT_MS = 900;

/**
 * Feature 27: the first screen after onboarding. The companion says hello and hands over the
 * welcome chest; tapping it opens it and counts up the welcome gems. The app tour (Feature 45)
 * and the placement test offer follow as the next steps of the same sequence.
 */
export const FirstLaunchGreeting: React.FC<FirstLaunchGreetingProps> = ({
  theme,
  gender,
  name,
  welcomeGems,
  onDone,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const isReducedMotion = usePrefersReducedMotion();
  const gemsShown = useCountUp(isOpen ? welcomeGems : 0, GEM_COUNT_MS);
  const continueRef = useRef<HTMLButtonElement>(null);
  const isGirl = gender === 'girl';
  const cleanName = name.trim() || (isGirl ? 'אלופה' : 'אלוף');
  const devicePixelRatio = typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1;
  const chestClosedSrc = pickCutoutSrc(getCommonArt('chest-closed'), CHEST_PX, devicePixelRatio);
  const chestOpenSrc = pickCutoutSrc(getCommonArt('chest-open'), CHEST_PX, devicePixelRatio);

  useEffect(() => {
    preloadArt(chestOpenSrc);
    preloadCompanion(theme, ['cheer'], COMPANION_PX);
  }, [chestOpenSrc, theme]);

  useEffect(() => {
    if (isOpen) continueRef.current?.focus({ preventScroll: true });
  }, [isOpen]);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    celebrate('big');
  };

  const chestFallback = (emoji: string) => (
    <div className="absolute inset-[12%] rounded-[2rem] bg-amber-300/80 ring-4 ring-amber-200/70 shadow-xl flex items-center justify-center text-7xl">
      {emoji}
    </div>
  );

  return (
    <div className={`min-h-screen w-full ${theme.pageBgClass} flex items-center justify-center p-4`}>
      <div className="w-full max-w-md flex flex-col items-center text-center gap-4">
        {/* Companion and speech bubble */}
        <div className="flex items-end gap-2">
          <Companion theme={theme} pose={isOpen ? 'cheer' : 'wave'} size={COMPANION_PX} />
          <div className="mb-10 max-w-[14rem] rounded-2xl rounded-br-md bg-white/95 text-slate-800 px-4 py-3 shadow-lg ring-1 ring-black/5 text-right">
            <p className="font-extrabold text-base leading-snug">
              {isOpen
                ? `${isGirl ? 'תתחדשי' : 'תתחדש'}, ${cleanName}! 🎉`
                : `היי ${cleanName}! ${isGirl ? 'ברוכה הבאה' : 'ברוך הבא'} 👋`}
            </p>
            <p className="text-sm font-bold text-slate-600">
              {isOpen ? (
                'אלה יהלומי הפתיחה שלך.'
              ) : (
                <>
                  אני <bdi>{theme.companion.name}</bdi>, ויש לי מתנה בשבילך.
                </>
              )}
            </p>
          </div>
        </div>

        {/* The chest */}
        <button
          type="button"
          onClick={handleOpen}
          disabled={isOpen}
          aria-label={isOpen ? `התיבה נפתחה: ${welcomeGems} יהלומים` : 'פתיחת תיבת המתנה'}
          className={`relative rounded-[2rem] outline-offset-4 ${isOpen || isReducedMotion ? '' : 'animate-chest-wobble'}`}
          style={{ width: CHEST_PX, height: CHEST_PX }}
        >
          <ArtImage
            key={isOpen ? 'open' : 'closed'}
            src={isOpen ? chestOpenSrc : chestClosedSrc}
            className={`w-full h-full ${isOpen ? 'animate-reward-pop' : ''}`}
            fallback={chestFallback(isOpen ? '💎' : '🎁')}
          />
          {isOpen && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-fuchsia-500 text-white text-xl font-black shadow-lg animate-reward-pop tabular-nums whitespace-nowrap" dir="ltr" lang="en">
              +{gemsShown} 💎
            </span>
          )}
        </button>

        {!isOpen ? (
          <p className="font-extrabold text-base">{isGirl ? 'הקישי על התיבה כדי לפתוח אותה 👆' : 'הקש על התיבה כדי לפתוח אותה 👆'}</p>
        ) : (
          <div className={`w-full rounded-3xl p-4 space-y-3 text-right ${theme.cardBgClass}`}>
            <h1 className="text-xl font-extrabold text-center">
              קיבלת {welcomeGems} {theme.currencyNameHe} במתנה!
            </h1>
            <ul className="text-sm space-y-1.5 font-semibold">
              <li>🛍️ בחנות אפשר לפתוח אווטארים, מדבקות, קישוטים לחדר ומגיני רצף.</li>
              <li>⭐ עוד יהלומים מקבלים על משימות, כוכבים, אתגרים יומיים ותרגול הגייה.</li>
            </ul>
            <button
              ref={continueRef}
              type="button"
              onClick={onDone}
              className={`btn-chunky w-full py-3.5 rounded-2xl font-black text-lg ${theme.primaryBtnClass}`}
            >
              {isGirl ? 'איזה כיף! בואי נעשה סיור קצר 🧭' : 'איזה כיף! בוא נעשה סיור קצר 🧭'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
