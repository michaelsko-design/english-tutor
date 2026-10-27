import { describe, expect, it } from 'vitest';
import { isIosDevice, urlBase64ToUint8Array } from './pushSubscription';

describe('urlBase64ToUint8Array', () => {
  it('decodes URL-safe base64 without padding', () => {
    // "hi?>" in standard base64 is "aGk/Pg==", URL-safe without padding "aGk_Pg"
    expect(Array.from(urlBase64ToUint8Array('aGk_Pg'))).toEqual([104, 105, 63, 62]);
  });
});

describe('isIosDevice', () => {
  it('recognises iPhone and iPad but not Android or desktop', () => {
    expect(isIosDevice('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)')).toBe(true);
    expect(isIosDevice('Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)')).toBe(true);
    expect(isIosDevice('Mozilla/5.0 (Linux; Android 14)')).toBe(false);
    expect(isIosDevice('Mozilla/5.0 (Windows NT 10.0; Win64; x64)')).toBe(false);
  });
});
