import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  PARENT_INFO_BODY_HE,
  PARENT_INFO_SPOKEN_HE,
  PARENT_INFO_TITLE_HE,
  buildParentsAreaMessageHe,
  buildProAskUrl,
} from './proAsk';
import { isHebrewSpeakable } from '../services/tts/ttsText';

describe('buildProAskUrl', () => {
  it('carries a new pairing code, or only opens the portal for a paired parent', () => {
    expect(buildProAskUrl('https://app.example/', 'ABCD2345')).toBe('https://app.example/?parent=ABCD2345&pro=1');
    expect(buildProAskUrl('https://app.example', null)).toBe('https://app.example/?parent&pro=1');
  });
});

describe('buildParentsAreaMessageHe', () => {
  it('is an informational hand-off with the link last, not a request to upgrade', () => {
    const message = buildParentsAreaMessageHe('https://x');
    expect(message).toContain('קישור לאזור ההורים');
    expect(message.endsWith('https://x')).toBe(true);
    expect(message).not.toMatch(/לשדרג|לבקש|רוצה/);
  });
});

describe('the parents info copy', () => {
  it('is factual and has a speakable read-aloud line', () => {
    expect(PARENT_INFO_TITLE_HE).toContain('מידע להורים');
    expect(PARENT_INFO_BODY_HE).toContain('כלול במסלול Pro');
    expect(isHebrewSpeakable(PARENT_INFO_SPOKEN_HE)).toBe(true);
  });
});

/**
 * Marketing to minors (Consumer Protection regulations, 1991, s.3(4)-(6)): nothing a learner sees may
 * urge them to buy or to get a parent to buy. Parent-only screens (src/components/parent) are exempt.
 */
describe('child-facing Pro copy', () => {
  const CHILD_FACING_FILES = [
    'src/data/proAsk.ts',
    'src/data/contentPacks.ts',
    'src/components/pro/ParentInfoSheet.tsx',
    'src/components/pro/FreeMissionsDoneCard.tsx',
    'src/components/pro/ProWeekCards.tsx',
    'src/components/worldMap/MissionSheet.tsx',
    'src/components/wordLists/WordListsCard.tsx',
    'src/components/settings/ThemePreviewSheet.tsx',
  ];
  const BANNED = [/לבקש מהורה/, /לבקש מההורים/, /לשדרג/, /לקנות/, /בקשי? מהורה/, /לפתוח אות[םן]/];

  it.each(CHILD_FACING_FILES)('%s has no ask-a-parent or buy wording', (file) => {
    const text = readFileSync(path.resolve(file), 'utf8');
    for (const pattern of BANNED) expect(text).not.toMatch(pattern);
  });
});
