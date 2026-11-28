import { describe, expect, it } from 'vitest';
import { LISTENER_GENDERED_WORDS } from '../../src/services/tts/ttsText';
import { GEMINI_BOY_FORMS, GEMINI_GIRL_FORMS, toGeminiText } from './geminiSpelling';
import { encodeMp3, readPcm, trimTrailingSilence } from './geminiTts';

describe('toGeminiText', () => {
  it('ends a sentence with a full stop so it does not sound like a question, but not a word or a line that has a mark', () => {
    expect(toGeminiText('שבועות וכיף של קיץ')).toBe('שבועות וכיף של קיץ.');
    expect(toGeminiText('cat')).toBe('cat');
    expect(toGeminiText('כמה ברווזים רואה?')).toBe('כמה ברווזים רואה?');
    expect(toGeminiText('לא בדיוק —')).toBe('לא בדיוק —');
  });

  it('sends an English lead word as it is, with no full stop (the owner picked the bare takes by ear)', () => {
    expect(toGeminiText('happy birthday')).toBe('happy birthday');
    expect(toGeminiText('Of course!')).toBe('Of course!');
  });

  it('spells a lead word Gemini acts out by its sound ("yawn" came out as a yawn)', () => {
    expect(toGeminiText('yawn')).toBe('yon');
  });

  it('says a capital and its small letter once, not "bee bee"', () => {
    expect(toGeminiText('B b: אותה אות, גדולה וקטנה.')).toBe('Bee: אותה אות, גדולה וקטנה.');
    expect(toGeminiText('M m: אותה אות, גדולה וקטנה.')).toBe('Em: אותה אות, גדולה וקטנה.');
    expect(toGeminiText('The cat is big. חתול')).toBe('The cat is big. חתול.');
  });

  it('says a number word once when the numeral comes before it', () => {
    expect(toGeminiText('6 six מסתיים באות X. נסו שוב!')).toBe('six מסתיים באות Ex. נסו שוב!');
    expect(toGeminiText('יש 3 cats כאן')).toBe('יש 3 cats כאן.');
  });

  it('reads the lone letters of a line about letters by name, but not "I" or "a" in other lines', () => {
    expect(toGeminiText('לא הפעם: c היא האות הקטנה של C, לא של A. נסו שוב!')).toBe('לא הפעם: Cee היא האות הקטנה של Cee, לא של Ay. נסו שוב!');
    expect(toGeminiText('לפני דבר אחד אומרים a: a book')).toBe('לפני דבר אחד אומרים a: a book.');
    expect(toGeminiText("fox מתחילה באות F, כמו it's")).toBe("fox מתחילה באות Eff, כמו it's.");
  });

  it("gives each clip the listener's form of a word that reads by gender", () => {
    expect(toGeminiText('[to:girl] מעולה! בנית את המילה cat')).toBe('מְעֻלָּה! בָּנִיתְּ את המילה cat.');
    expect(toGeminiText('[to:boy] מעולה! בנית את המילה cat')).toBe('מְעֻלֶּה! בָּנִיתָ את המילה cat.');
  });

  it('says "אני רואה" in the learner\'s form only in a line said to them', () => {
    expect(toGeminiText('[to:boy] קראת משפט שלם: "אני רואה תרנגולת."')).toBe('קָרָאתָ משפט שלם: "אני רוֹאֶה תַּרְנְגֹלֶת."');
    expect(toGeminiText('[to:girl] קראת משפט שלם: "אני רואה תרנגולת."')).toBe('קָרָאתְ משפט שלם: "אני רוֹאָה תַּרְנְגֹלֶת."');
    expect(toGeminiText('כמה ברווזים נועה רואה?')).toBe('כמה ברווזים נועה רואה?');
  });

  it('says the verb after "אני" in the learner\'s form, and leaves it after a name', () => {
    expect(toGeminiText('[to:girl] אני שותה חלב.')).toBe('אני שׁוֹתָה חלב.');
    expect(toGeminiText('[to:boy] אני רואה שעון.')).toBe('אני רוֹאֶה שעון.');
    expect(toGeminiText('[to:boy] אני לא רוצה לישון.')).toBe('אני לא רוֹצֶה לישון.');
    expect(toGeminiText('[to:girl] נועה רואה כלב.')).toBe('נועה רואה כלב.');
  });

  it('says a count of letters in the feminine form (אות is feminine)', () => {
    expect(toGeminiText('בתשובה הנכונה יש 8 אותיות. כדאי לספור את האותיות בכל תשובה.')).toBe(
      'בתשובה הנכונה יש שְׁמוֹנֶה אותיות. כדאי לספור את האותיות בכל תשובה.',
    );
    expect(toGeminiText('המילה מתחילה באות "c" ויש בה 11 אותיות.')).toBe('המילה מתחילה באות "Cee" ויש בה אַחַת עֶשְׂרֵה אותיות.');
  });

  it('says ביצה, צדף, פה, עז and אמור as the review asked', () => {
    expect(toGeminiText('יש לי פה אחד.')).toBe('יש לי פֶּה אחד.');
    expect(toGeminiText('עז')).toBe('עֵז');
  });

  it('says the lone word "ו" as "ve", but keeps ו inside a line', () => {
    expect(toGeminiText('ו')).toBe('ve');
    expect(toGeminiText('Hello ו-Goodbye')).toBe('Hello ו-Goodbye.');
  });

  it('sends the lines the 2026-11-28 review asked for rewritten', () => {
    expect(toGeminiText('זה pot.')).toBe('זה paht.');
    expect(toGeminiText('הוא / היא (נמצא)')).toBe('הוא או היא.');
    expect(toGeminiText('קראי את הסיפור וחשבי: מה התשובה הנכונה?')).toBe('קִרְאִי את הסיפור וְחִשְׁבִי: מה התשובה הנכונה?');
  });

  it('says zebra as "zeebra" and puts a comma after the letter R', () => {
    expect(toGeminiText('זו האות Z. Z כמו zebra')).toBe('זוֹ האות Zed. Zed כמו zeebra.');
    expect(toGeminiText('robot מתחיל באות R.')).toBe('robot מתחיל באות Ar,');
    expect(toGeminiText('המילה מתחילה באות "r" ויש בה 5 אותיות.')).toBe('המילה מתחילה באות "Ar," ויש בה חָמֵשׁ אותיות.');
  });

  it('says "מחבט" with niqqud', () => {
    expect(toGeminiText('איזו מילה באנגלית פירושה "מחבט"?')).toBe('איזו מילה באנגלית פירושה "מַחְבֵּט"?');
  });

  it('spells out words Gemini misreads, for every listener, and leaves the rest as written', () => {
    expect(toGeminiText('הקשיבי ובחרי את האות:')).toBe('הקשיבי וּבִחְרִי את האות:');
    expect(toGeminiText('הבנית שלו')).toBe('הבנית שלו.');
    expect(toGeminiText('זו האות Z. Z כמו zebra')).toBe('זוֹ האות Zed. Zed כמו zeebra.');
    expect(toGeminiText('האותיות X, Y, Z')).toBe('האותיות X, Y, Zed.');
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

  it('trims the silence after the speech to a short tail, keeping the silence before it', () => {
    const samples = new Int16Array(24000);
    samples.fill(8000, 6000, 12000);
    const trimmed = trimTrailingSilence({ samples, sampleRate: 24000 }, 80);
    expect(trimmed.samples.length).toBe(12000 + 1920);
    expect(trimmed.samples[6000]).toBe(8000);
    const silent = { samples: new Int16Array(2400), sampleRate: 24000 };
    expect(trimTrailingSilence(silent, 80)).toBe(silent);
  });

  it('encodes one second as about 6 KB of 48 kbps MP3, with the leading silence', () => {
    const mp3 = encodeMp3(readPcm(wav(24000), 24000));
    expect(mp3.length).toBeGreaterThan(6000);
    expect(mp3.length).toBeLessThan(8500);
  });
});
