import { describe, expect, it } from 'vitest';
import { cleanFeedbackText, MAX_FEEDBACK_LENGTH, sendFeedback } from './feedbackService';

describe('feedbackService', () => {
  it('trims the note and drops an empty one', () => {
    expect(cleanFeedbackText('  hi  ')).toBe('hi');
    expect(cleanFeedbackText('   ')).toBeNull();
  });

  it('cuts a note to the length the rules allow', () => {
    expect(cleanFeedbackText('x'.repeat(MAX_FEEDBACK_LENGTH + 50))).toHaveLength(MAX_FEEDBACK_LENGTH);
  });

  it('refuses an empty note and a send without a signed-in account', async () => {
    expect((await sendFeedback({ kind: 'idea', text: ' ', gradeId: '3', screen: 'settings' })).ok).toBe(false);
    expect((await sendFeedback({ kind: 'idea', text: 'ok', gradeId: '3', screen: 'settings' })).ok).toBe(false);
  });
});
