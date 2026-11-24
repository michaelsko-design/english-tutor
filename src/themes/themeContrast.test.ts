import colors from 'tailwindcss/colors';
import { describe, expect, it } from 'vitest';
import { THEME_BASES, THEME_IDS } from './themeRegistry';

/** WCAG 2.x AA for normal-size text (Israeli accessibility regulations follow it) */
const MIN_TEXT_CONTRAST = 4.5;

const TAILWIND = colors as unknown as Record<string, Record<string, string> | string>;

/** A Tailwind colour token ("purple-600", "white", "[#1e3a5f]") as a hex colour */
function tokenToHex(token: string): string {
  const arbitrary = token.match(/^\[(#[0-9a-fA-F]{6})\]$/);
  if (arbitrary) return arbitrary[1];
  const named = TAILWIND[token];
  if (typeof named === 'string') return named;
  const match = token.match(/^([a-z]+)-(\d{2,3})$/);
  const shade = match ? TAILWIND[match[1]] : undefined;
  if (!match || typeof shade !== 'object' || !shade[match[2]]) throw new Error(`Unknown colour token: ${token}`);
  return shade[match[2]];
}

/** "#fff" → "#ffffff" (Tailwind writes white and black short) */
const fullHex = (hex: string): string => (hex.length === 4 ? `#${[...hex.slice(1)].map((d) => d + d).join('')}` : hex);

function luminance(hex: string): number {
  const full = fullHex(hex);
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(full.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** The base classes only: the hover/active variants are checked separately */
const baseClasses = (classes: string): string[] => classes.split(/\s+/).filter((c) => c && !c.includes(':'));

/** Every background colour the button can show (gradient stops or a plain bg) and its text colour */
function readButtonColours(classes: string): { backgrounds: string[]; text: string } {
  const base = baseClasses(classes);
  const backgrounds = base
    .map((c) => c.match(/^(?:from|via|to|bg)-(.+)$/)?.[1])
    .filter((t): t is string => !!t && !t.startsWith('gradient'))
    .map(tokenToHex);
  const textToken = base.map((c) => c.match(/^text-((?:\[#[0-9a-fA-F]{6}\])|(?:[a-z]+(?:-\d{2,3})?))$/)?.[1]).find(Boolean);
  if (!textToken || backgrounds.length === 0) throw new Error(`Can't read the button colours: ${classes}`);
  return { backgrounds, text: tokenToHex(textToken) };
}

describe('primary button contrast in every theme', () => {
  it.each(THEME_IDS)('%s: the text reads at 4.5:1 or more on every part of the button', (themeId) => {
    const { backgrounds, text } = readButtonColours(THEME_BASES[themeId].primaryBtnClass);
    backgrounds.forEach((bg) => expect(contrast(bg, text), `${themeId} ${bg}`).toBeGreaterThanOrEqual(MIN_TEXT_CONTRAST));
  });

  it.each(THEME_IDS)('%s: hover never lightens a gradient button', (themeId) => {
    const classes = THEME_BASES[themeId].primaryBtnClass;
    if (!classes.includes('bg-gradient')) return;
    expect(classes).not.toMatch(/hover:brightness-1\d\d/);
  });
});
