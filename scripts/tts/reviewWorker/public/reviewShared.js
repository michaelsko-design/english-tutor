/* Shared by the local review page (reviewPage.html) and the phone page (app.js): classic script, top-level names. */
/* exported SCOPES, isScope, matchesScope, REASON_LABELS */

// Which clips the list shows: what the first learners meet first; the Pro tail and the packs come later
const SCOPES = [
  ['opener', 'Openers only (מעולה, כל הכבוד…): check these first', ['opener']],
  ['cut', 'Cut line clips (shared endings split off): heard in the whole line', 'cut'],
  ['first', 'Core units + general lines', ['opener', 'general', 'core', 'other']],
  ['pro-tail', 'Pro: last 2 core units of each grade', ['pro-tail']],
  ['packs', 'Content packs (not released yet)', ['packs']],
  ['everything', 'Everything', null],
];
const isScope = (id) => SCOPES.some(([scopeId]) => scopeId === id);
// 'cut': the clips cut out of a whole line before its shared closer (they carry the lines they are heard in)
const matchesScope = (item, groups) => (groups === 'cut' ? Boolean(item.lines) : !groups || groups.includes(item.group));

const REASON_LABELS = {
  'wrong-gender': 'Wrong gender form', 'english-accent': 'English accent', mispronounced: 'Mispronounced word',
  'letter-name': 'Wrong letter name', 'cut-off': 'Cut off', 'too-fast': 'Too fast', 'too-slow': 'Too slow', noise: 'Noise / glitch',
  'bad-wording': 'Bad wording (text must change)',
};
