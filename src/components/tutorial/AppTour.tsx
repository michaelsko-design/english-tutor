import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { TOUR_COMPANION_PX, TutorialSlide } from '../../data/appTutorial';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { useDialog } from '../../hooks/useDialog';
import { celebrate } from '../../utils/celebrate';
import { Companion, preloadCompanion } from '../companion/Companion';
import { popDelay, TOUR_ACCENTS, TourScene } from './TourScenes';
import { Button } from '../ui/Button';

interface AppTourProps {
  theme: ThemeDefinition;
  slides: TutorialSlide[];
  avatarEmoji: string;
  isShabbatObserver: boolean;
  /** The last slide's button: what comes next ("let's play", or the placement test) */
  finishLabelHe: string;
  /** Finished, skipped or closed */
  onDone: () => void;
}

const COMPANION_PX = TOUR_COMPANION_PX;
/** A horizontal swipe longer than this turns the page */
const SWIPE_MIN_PX = 50;

/**
 * Feature 45: the app tour. A full-screen slideshow led by the companion: each slide has an
 * animated scene (a small mock of that part of the app) and the companion's speech card. Swipe,
 * the arrow keys or the buttons move between slides; "דילוג" or Escape closes it at any time.
 */
export const AppTour: React.FC<AppTourProps> = ({ theme, slides, avatarEmoji, isShabbatObserver, finishLabelHe, onDone }) => {
  const [slideIdx, setSlideIdx] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const swipeStartX = useRef<number | null>(null);
  const hasCelebrated = useRef(false);
  const isFirstSlide = useRef(true);
  useDialog(dialogRef, { onClose: onDone, initialFocusRef: nextRef });

  const slide = slides[slideIdx];
  const isLast = slideIdx === slides.length - 1;
  const accent = TOUR_ACCENTS[slide.id];

  const goTo = (idx: number) => setSlideIdx(Math.max(0, Math.min(slides.length - 1, idx)));
  const goNext = () => (isLast ? onDone() : goTo(slideIdx + 1));

  useEffect(() => {
    preloadCompanion(theme, [...new Set(slides.map((s) => s.pose))], COMPANION_PX);
  }, [theme, slides]);

  // A new slide moves the screen reader to its heading; the first slide keeps the button's focus
  useEffect(() => {
    if (isFirstSlide.current) {
      isFirstSlide.current = false;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
  }, [slideIdx]);

  useEffect(() => {
    if (isLast && !hasCelebrated.current) {
      hasCelebrated.current = true;
      celebrate('medium');
    }
  }, [isLast]);

  // Right to left: the next slide is on the left
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goNext();
    else if (e.key === 'ArrowRight') goTo(slideIdx - 1);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    swipeStartX.current = e.pointerType === 'mouse' ? null : e.clientX;
  };
  const handlePointerUp = (e: React.PointerEvent) => {
    if (swipeStartX.current === null) return;
    const dx = e.clientX - swipeStartX.current;
    swipeStartX.current = null;
    if (dx > SWIPE_MIN_PX) goNext();
    else if (dx < -SWIPE_MIN_PX) goTo(slideIdx - 1);
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="סיור באפליקציה"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className={`fixed inset-0 z-[70] overflow-y-auto overflow-x-hidden outline-none ${theme.pageBgClass}`}
    >
      {/* Soft colour blobs in the slide's colours */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <span className={`absolute -top-20 -right-16 w-72 h-72 rounded-full blur-3xl transition-colors duration-700 animate-tour-drift ${accent.blobClasses[0]}`} />
        <span
          className={`absolute -bottom-24 -left-20 w-80 h-80 rounded-full blur-3xl transition-colors duration-700 animate-tour-drift ${accent.blobClasses[1]}`}
          style={{ animationDelay: '-4s' }}
        />
      </div>

      <div className="relative max-w-md mx-auto min-h-full flex flex-col gap-3 px-4 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-[calc(1rem+env(safe-area-inset-bottom))]">
        {/* Close, progress dots, skip */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onDone}
            className={`min-w-11 min-h-11 flex items-center justify-center rounded-xl ${theme.secondaryBtnClass}`}
            aria-label="סגירת הסיור"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5" role="group" aria-label={`שקופית ${slideIdx + 1} מתוך ${slides.length}`}>
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`שקופית ${i + 1}: ${s.titleHe}`}
                aria-current={i === slideIdx ? 'step' : undefined}
                className="min-h-11 flex items-center"
              >
                <span
                  className={`block h-2.5 rounded-full transition-all duration-300 ${
                    i === slideIdx ? 'w-6 bg-gradient-to-l ' + TOUR_ACCENTS[s.id].stageClass : i < slideIdx ? 'w-2.5 bg-current opacity-60' : 'w-2.5 bg-current opacity-20'
                  }`}
                />
              </button>
            ))}
          </div>
          {isLast ? (
            <span className="min-w-11" aria-hidden="true" />
          ) : (
            <button type="button" onClick={onDone} className={`min-h-11 px-2 rounded-xl text-sm font-extrabold ${theme.mutedTextClass} hover:underline`}>
              דילוג
            </button>
          )}
        </div>

        {/* The animated scene; the key replays its animation on every slide */}
        <div
          key={slide.id}
          className={`relative h-48 sm:h-56 rounded-[2rem] overflow-hidden shadow-2xl ring-4 ring-white/40 bg-gradient-to-br animate-tour-pop ${accent.stageClass}`}
        >
          <TourScene slide={slide} avatarEmoji={avatarEmoji} isShabbatObserver={isShabbatObserver} />
        </div>

        {/* The companion and its speech card */}
        <div key={`talk-${slide.id}`} className="flex items-start gap-2">
          <div className="shrink-0 pt-2">
            <Companion theme={theme} pose={slide.pose} size={COMPANION_PX} />
          </div>
          <div className={`relative flex-1 min-w-0 rounded-3xl rounded-tr-md p-4 shadow-lg animate-tour-rise ${theme.cardBgClass}`}>
            {slide.id === 'welcome' && (
              <p className={`text-sm font-extrabold ${theme.accentTextClass}`}>
                היי! אני <bdi>{theme.companion.name}</bdi> 👋
              </p>
            )}
            <h2 ref={headingRef} tabIndex={-1} className="text-xl font-black leading-tight outline-none">
              {slide.titleHe}
            </h2>
            <p className={`mt-1 text-base font-bold leading-snug ${theme.mutedTextClass}`}>{slide.bodyHe}</p>
            {slide.points.length > 0 && slide.id !== 'missions' && (
              <ul className="mt-2.5 space-y-1.5">
                {slide.points.map((point, i) => (
                  <li key={point.emoji} className="flex items-start gap-2 animate-tour-rise" style={popDelay(i, 250)}>
                    <span className="text-lg leading-5 shrink-0" aria-hidden="true">
                      {point.emoji}
                    </span>
                    <span className="text-sm font-semibold leading-5">
                      {point.labelHe && (
                        <strong className="font-black">
                          <bdi>{point.labelHe}</bdi>:{' '}
                        </strong>
                      )}
                      {point.textHe}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {slide.id === 'missions' && (
              <ol className="mt-3 flex flex-wrap gap-1.5">
                {slide.points.map((point, i) => (
                  <li key={point.emoji} className={`px-2.5 py-1 rounded-full text-xs font-extrabold animate-tour-rise ${theme.badgeClass}`} style={popDelay(i, 250)}>
                    {point.emoji} {point.textHe}
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        <div className="flex-1" />

        {/* Back and next */}
        <div className="flex gap-2">
          {slideIdx > 0 && (
            <Button theme={theme} variant="secondary" size="lg" onClick={() => goTo(slideIdx - 1)}>
              → הקודם
            </Button>
          )}
          <button
            ref={nextRef}
            type="button"
            onClick={goNext}
            className={`btn-chunky flex-1 py-3.5 rounded-2xl font-black text-lg ${theme.primaryBtnClass}`}
          >
            {isLast ? finishLabelHe : slideIdx === 0 ? 'יאללה, מתחילים ←' : 'הבא ←'}
          </button>
        </div>
      </div>
    </div>
  );
};
