import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createWordList, type WordListAnswer } from '../../data/customWordLists';
import { makeProfile, TEST_THEME } from '../../test/fixtures';
import { WordListSessionResult } from './WordListSessionResult';

const profile = makeProfile({ name: 'נועה', gender: 'girl' });
const list = createWordList('רשימה', [{ textEn: 'cat', translationHe: 'חתול', kind: 'word' }], new Date('2026-11-23T10:00:00'));
const allRight: WordListAnswer[] = [{ type: 'meaning-match', itemId: 'cat', isCorrect: true, isSkipped: false }];

const renderResult = (greatHeadlineHe?: string) =>
  render(
    <WordListSessionResult
      list={list}
      profile={profile}
      answers={allRight}
      theme={TEST_THEME}
      greatHeadlineHe={greatHeadlineHe}
      onSave={() => {}}
      onSaveAndRetry={() => {}}
    />
  );

describe('WordListSessionResult headline', () => {
  it("praises a school list's high score", () => {
    renderResult();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('נועה, את שולטת ברשימה!');
  });

  it("uses the session's own line when one is given (the 1-minute review)", () => {
    renderResult('נועה, המילים האלה כבר יושבות טוב יותר! 🎉');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('המילים האלה כבר יושבות טוב יותר');
  });
});
