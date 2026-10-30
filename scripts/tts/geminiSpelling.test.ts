import { describe, expect, it } from 'vitest';
import { LISTENER_GENDERED_WORDS } from '../../src/services/tts/ttsText';
import { GEMINI_BOY_FORMS, GEMINI_GIRL_FORMS, toGeminiText } from './geminiSpelling';
import { encodeMp3, readPcm } from './geminiTts';

describe('toGeminiText', () => {
  it("gives each clip the listener's form of a word that reads by gender", () => {
    expect(toGeminiText('[to:girl] מעולה! בנית את המילה cat')).toBe('מְעֻלָּה! בָּנִית את המילה cat');
    expect(toGeminiText('[to:boy] מעולה! בנית את המילה cat')).toBe('מְעֻלָּה! בָּנִיתָ את המילה cat');
  });

  it('says "אני רואה" in the learner\'s form only in a line said to them', () => {
    expect(toGeminiText('[to:boy] קראת משפט שלם: "אני רואה תרנגולת."')).toBe('קָרָאתָ משפט שלם: "אני רוֹאֶה תַּרְנְגֹלֶת."');
    expect(toGeminiText('[to:girl] קראת משפט שלם: "אני רואה תרנגולת."')).toBe('קָרָאתְ משפט שלם: "אני רוֹאָה תַּרְנְגֹלֶת."');
    expect(toGeminiText('כמה ברווזים נועה רואה?')).toBe('כמה ברווזים נועה רואה?');
  });

  it('spells out words Gemini misreads, for every listener, and leaves the rest as written', () => {
    expect(toGeminiText('הקשיבי ובחרי את האות:')).toBe('הקשיבי וּבִחְרִי את האות:');
    expect(toGeminiText('הבנית שלו')).toBe('הבנית שלו');
    expect(toGeminiText('זו האות Z. Z כמו zebra')).toBe('זוֹ האות Zed. Zed כמו zebra');
    expect(toGeminiText('האותיות X, Y, Z')).toBe('האותיות X, Y, Zed');
  });

  it('says "בבוס" as be-BOS', () => {
    expect(toGeminiText('בבוס נפגשים כל הנושאים של היחידה.')).toBe('בְּבּוֹס נפגשים כל הנושאים של היחידה.');
  });

  it('puts a line that comes out with an English accent fully in niqqud', () => {
    expect(toGeminiText('[to:boy] הקשב ואמור את המילה בקול:')).toBe('הַקְשֶׁב וֶאֱמוֹר אֶת הַמִּלָּה בְּקוֹל:');
    expect(toGeminiText('[to:girl] הקשיבי ואמרי את המילה בקול:')).toBe('הַקְשִׁיבִי וְאִמְרִי אֶת הַמִּלָּה בְּקוֹל:');
    expect(toGeminiText('הקשב ואמור את המילה cat בקול:')).toBe('הַקְשֶׁב ואמור את המילה cat בקול:');
  });

  it('has a girl and a boy form for every word that reads by gender', () => {
    for (const word of LISTENER_GENDERED_WORDS) {
      expect(GEMINI_GIRL_FORMS[word], word).toMatch(/[ְ-ּ]/);
      expect(GEMINI_BOY_FORMS[word], word).toMatch(/[ְ-ּ]/);
      expect(GEMINI_BOY_FORMS[word], word).not.toBe(GEMINI_GIRL_FORMS[word]);
    }
  });
});

describe('Gemini audio to MP3', () => {
  const wav = (samples: number, rate = 24000) => {
    const header = Buffer.alloc(44);
    header.write('RIFF', 0);
    header.writeUInt32LE(36 + samples * 2, 4);
    header.write('WAVEfmt ', 8);
    header.writeUInt32LE(16, 16);
    header.writeUInt16LE(1, 20);
    header.writeUInt16LE(1, 22);
    header.writeUInt32LE(rate, 24);
    header.writeUInt32LE(rate * 2, 28);
    header.writeUInt16LE(2, 32);
    header.writeUInt16LE(16, 34);
    header.write('data', 36);
    header.writeUInt32LE(samples * 2, 40);
    return Buffer.concat([header, Buffer.alloc(samples * 2)]);
  };

  it('reads the samples and rate of a WAV, or takes headerless PCM at the given rate', () => {
    expect(readPcm(wav(2400, 22050), 24000)).toMatchObject({ sampleRate: 22050, samples: { length: 2400 } });
    expect(readPcm(Buffer.alloc(100), 24000)).toMatchObject({ sampleRate: 24000, samples: { length: 50 } });
  });

  it('encodes one second as about 6 KB of 48 kbps MP3, with the leading silence', () => {
    const mp3 = encodeMp3(readPcm(wav(24000), 24000));
    expect(mp3.length).toBeGreaterThan(6000);
    expect(mp3.length).toBeLessThan(8500);
  });
});
