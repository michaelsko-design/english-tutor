import { describe, expect, it } from 'vitest';
import { buildWhatsAppChatUrl } from './proPlanParts';

describe('buildWhatsAppChatUrl', () => {
  it('opens a chat with our number, or the chat picker without one', () => {
    expect(buildWhatsAppChatUrl('+972 50-123-4567', 'שלום')).toBe(`https://wa.me/972501234567?text=${encodeURIComponent('שלום')}`);
    expect(buildWhatsAppChatUrl('', 'hi')).toBe('https://wa.me/?text=hi');
  });
});
