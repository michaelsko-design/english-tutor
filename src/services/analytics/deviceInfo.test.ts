import { describe, expect, it } from 'vitest';
import { classifyDevice, DEVICE_PATTERN } from './deviceInfo';

const IPHONE_SAFARI =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';
const IPAD_AS_MAC =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15';
const ANDROID_CHROME =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36';
const ANDROID_TABLET =
  'Mozilla/5.0 (Linux; Android 13; SM-X710) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const WINDOWS_EDGE =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0';
const MAC_SAFARI = IPAD_AS_MAC;
const IPHONE_CHROME =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/126.0.0.0 Mobile/15E148 Safari/604.1';

const base = { maxTouchPoints: 0, shortSide: 1080, isStandalone: false };

describe('classifyDevice', () => {
  it('detects an iPhone in Safari', () => {
    expect(classifyDevice({ ...base, userAgent: IPHONE_SAFARI, maxTouchPoints: 5, shortSide: 390 })).toBe('ios-safari-phone');
  });

  it('marks an installed home-screen app', () => {
    expect(classifyDevice({ ...base, userAgent: IPHONE_SAFARI, maxTouchPoints: 5, shortSide: 390, isStandalone: true })).toBe(
      'ios-safari-phone-pwa'
    );
  });

  it('treats a touch Mac user-agent as an iPad', () => {
    expect(classifyDevice({ ...base, userAgent: IPAD_AS_MAC, maxTouchPoints: 5, shortSide: 820 })).toBe('ios-safari-tablet');
  });

  it('keeps a real Mac as desktop', () => {
    expect(classifyDevice({ ...base, userAgent: MAC_SAFARI })).toBe('mac-safari-desktop');
  });

  it('detects Chrome on an Android phone and tablet', () => {
    expect(classifyDevice({ ...base, userAgent: ANDROID_CHROME, maxTouchPoints: 5, shortSide: 412 })).toBe('android-chrome-phone');
    expect(classifyDevice({ ...base, userAgent: ANDROID_TABLET, maxTouchPoints: 5, shortSide: 800 })).toBe('android-chrome-tablet');
  });

  it('names Edge before Chrome and Chrome on iOS before Safari', () => {
    expect(classifyDevice({ ...base, userAgent: WINDOWS_EDGE })).toBe('windows-edge-desktop');
    expect(classifyDevice({ ...base, userAgent: IPHONE_CHROME, maxTouchPoints: 5, shortSide: 390 })).toBe('ios-chrome-phone');
  });

  it('falls back to "other" and still matches the allowed pattern', () => {
    const device = classifyDevice({ ...base, userAgent: 'SomeUnknownBot/1.0' });
    expect(device).toBe('other-other-desktop');
    expect(DEVICE_PATTERN.test(device)).toBe(true);
  });

  it('never leaks any part of the user-agent', () => {
    expect(classifyDevice({ ...base, userAgent: ANDROID_CHROME })).not.toMatch(/pixel|126|537/i);
  });
});
