import { describe, expect, it } from 'vitest';
import { getTutorialSlides, TutorialInput, TutorialSlide } from './appTutorial';
import { THEME_REGISTRY } from '../themes/themeRegistry';
import { inflectHebrew } from '../utils/hebrewGender';

const input = (overrides: Partial<TutorialInput> = {}): TutorialInput => ({
  currencyNameHe: 'יהלומים',
  hasFriends: true,
  isShabbatObserver: true,
  ...overrides,
});

const textsOf = (slide: TutorialSlide): string[] => [
  slide.titleHe,
  slide.bodyHe,
  ...slide.points.flatMap((p) => [p.labelHe ?? '', p.textHe]),
];

describe('getTutorialSlides', () => {
  it('opens with the welcome, walks the loop and the dock, and ends with the finish slide', () => {
    const ids = getTutorialSlides(input()).map((s) => s.id);

    expect(ids).toEqual(['welcome', 'missions', 'map', 'economy', 'streak', 'dock', 'finish']);
  });

  it('lists the five mission steps', () => {
    const missions = getTutorialSlides(input()).find((s) => s.id === 'missions')!;

    expect(missions.points).toHaveLength(5);
  });

  it('shows the Friends tile only when the learner has it', () => {
    const dockEmojis = (hasFriends: boolean) =>
      getTutorialSlides(input({ hasFriends }))
        .find((s) => s.id === 'dock')!
        .points.map((p) => p.emoji);

    expect(dockEmojis(true)).toContain('👫');
    expect(dockEmojis(false)).not.toContain('👫');
    expect(dockEmojis(false)).toEqual(['🏠', '📅', '📝', '📊']);
  });

  it('mentions the Shabbat shield only for observers', () => {
    const streakEmojis = (isShabbatObserver: boolean) =>
      getTutorialSlides(input({ isShabbatObserver }))
        .find((s) => s.id === 'streak')!
        .points.map((p) => p.emoji);

    expect(streakEmojis(true)).toContain('🛡️');
    expect(streakEmojis(false)).not.toContain('🛡️');
  });

  it("names the diamonds with the theme's own word", () => {
    const economy = getTutorialSlides(input({ currencyNameHe: 'כוכבי זהב' })).find((s) => s.id === 'economy')!;

    expect(economy.titleHe).toContain('כוכבי זהב');
    expect(economy.points.some((p) => p.labelHe === 'כוכבי זהב')).toBe(true);
  });

  it('writes the Hebrew gender-neutral for every theme, so it reads the same for every learner', () => {
    for (const theme of Object.values(THEME_REGISTRY)) {
      for (const slide of getTutorialSlides(input({ currencyNameHe: theme.currencyNameHe }))) {
        for (const text of textsOf(slide)) {
          expect(inflectHebrew(text, 'boy'), `${theme.id}/${slide.id}`).toBe(text);
          expect(inflectHebrew(text, 'girl'), `${theme.id}/${slide.id}`).toBe(text);
        }
      }
    }
  });

  it('keeps every slide short', () => {
    for (const slide of getTutorialSlides(input())) {
      expect(slide.titleHe.length, slide.id).toBeLessThanOrEqual(30);
      expect(slide.bodyHe.length, slide.id).toBeLessThanOrEqual(70);
      expect(slide.points.length, slide.id).toBeLessThanOrEqual(5);
      for (const point of slide.points) expect(point.textHe.length, slide.id).toBeLessThanOrEqual(60);
    }
  });
});
