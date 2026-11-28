/* The phone page of the Hebrew clip review: marks only; new takes are compared on the PC. */
/* global SCOPES, isScope, matchesScope, REASON_LABELS */
'use strict';

const TABS = [['pending', 'To review'], ['regenerate', 'Regenerate'], ['good', 'Good'], ['all', 'All']];
const LISTENER_LABELS = { girl: 'to a girl', boy: 'to a boy', all: 'to everyone (plural)' };
const TOKEN_KEY = 'hebrewReviewToken';
const QUEUE_KEY = 'hebrewReviewQueue';
const TAB_KEY = 'hebrewReviewTab';
const SCOPE_KEY = 'hebrewReviewScope';
const SEND_BATCH = 100;
const RETRY_MS = 30000;

const $ = (id) => document.getElementById(id);
const el = (tag, props = {}, ...children) => {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...children);
  return node;
};
const button = (label, className, onclick, props = {}) => el('button', { type: 'button', className, onclick, ...props }, label);

const readStored = (key, fallback) => {
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
};
const store = (key, value) => {
  try { localStorage.setItem(key, value); return true; } catch { return false; }
};
const readQueue = () => {
  try { return JSON.parse(readStored(QUEUE_KEY, '[]')); } catch { return []; }
};

let token = '';
let snapshot = null;
let serverMarks = {};
/** Marks not saved online yet; kept on the device so closing the page loses nothing. */
let queue = readQueue();
let tab = readStored(TAB_KEY, 'pending');
let scope = readStored(SCOPE_KEY, 'first');
if (!isScope(scope)) scope = 'first';
let index = 0;
let draft = null;
let lastMarkedKey = null;
let isSending = false;
let syncProblem = '';

/** The token comes once, in the link's fragment (never sent to a server), and leaves the address bar. */
function takeToken(text) {
  const match = /(?:#token=)?([A-Za-z0-9_-]{32,})\s*$/.exec(text || '');
  if (!match) return false;
  token = match[1];
  store(TOKEN_KEY, token);
  return true;
}

async function api(path, options = {}) {
  const response = await fetch(path, { ...options, headers: { Authorization: `Bearer ${token}`, ...(options.body && { 'Content-Type': 'application/json' }) } });
  if (response.status === 401) showSignIn();
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw Object.assign(new Error(data.error || `Error ${response.status}`), { status: response.status });
  return data;
}

function showSignIn() {
  $('signin').hidden = false;
  $('controls').hidden = true;
  $('actions').hidden = true;
  $('view').replaceChildren();
  $('summary').textContent = '';
}

const queued = (key) => queue.find((item) => item.key === key);
const markOf = (key) => {
  const waiting = queued(key);
  return waiting ? waiting.entry : serverMarks[key];
};
const phaseOf = (item) => {
  const mark = markOf(item.key);
  return !mark || mark.fp !== item.fp ? 'pending' : mark.status;
};
const inScope = (item) => matchesScope(item, (SCOPES.find(([id]) => id === scope) || SCOPES[0])[2]);
const visible = () => {
  const query = $('search').value.trim();
  return snapshot.items.filter((item) => inScope(item)
    && (tab === 'all' || phaseOf(item) === tab)
    && (!query || item.spoken.includes(query) || (item.plain || '').includes(query)));
};
const current = () => (snapshot ? visible()[index] : undefined);

// One audio element for everything: phones allow sound once a tap has used it
const player = new Audio();
let upNext = [];
const clipUrl = (path) => `${snapshot.clipBaseUrl}/${path}`;
function play(paths) {
  const [first, ...rest] = paths;
  upNext = rest;
  player.src = clipUrl(first);
  player.play().catch((error) => {
    if (error.name !== 'AbortError') $('sync').textContent = 'Could not play the clip: check the connection and tap Replay.';
  });
}
player.addEventListener('ended', () => { if (upNext.length) play(upNext); });
const playCurrent = () => { const item = current(); if (item) play([item.path]); };

/** A new mark of a clip, never timed before the one it replaces (the phone's clock may run behind the PC's). */
function enqueue(item, status, detail) {
  const previous = markOf(item.key);
  const times = [Date.now()];
  const previousTime = previous?.markedAt || queued(item.key)?.markedAt;
  if (previousTime) times.push(Date.parse(previousTime) + 1);
  const markedAt = new Date(Math.max(...times)).toISOString();
  const note = detail?.note.trim() || '';
  const entry = status && {
    status,
    ...(detail?.reasons.length && { reasons: detail.reasons }),
    ...(note && { note }),
    fp: item.fp,
    at: markedAt.slice(0, 10),
    markedAt,
  };
  queue = [...queue.filter((other) => other.key !== item.key), { key: item.key, entry, fp: item.fp, markedAt }];
  if (!store(QUEUE_KEY, JSON.stringify(queue))) syncProblem = 'This browser cannot keep marks: stay online until all are saved.';
  void send();
}

async function send() {
  if (isSending || queue.length === 0 || !token) return renderSync();
  isSending = true;
  renderSync();
  try {
    while (queue.length) {
      const batch = queue.slice(0, SEND_BATCH);
      await api('/api/inbox', { method: 'PUT', body: JSON.stringify({ items: batch }) });
      serverMarks = batch.reduce((marks, { key, entry }) => {
        const rest = Object.fromEntries(Object.entries(marks).filter(([other]) => other !== key));
        return entry ? { ...rest, [key]: entry } : rest;
      }, serverMarks);
      // A mark changed while this batch was on its way stays in the queue
      queue = queue.filter((item) => !batch.some((sent) => sent.key === item.key && sent.markedAt === item.markedAt));
      store(QUEUE_KEY, JSON.stringify(queue));
    }
    syncProblem = '';
  } catch (error) {
    syncProblem = error.status ? error.message : 'Offline: marks are kept on this device and sent later.';
  } finally {
    isSending = false;
    renderSync();
  }
}

/** Marks made on other devices, or on the PC since the last look. */
async function refresh() {
  if (!snapshot || !token) return;
  await send();
  try {
    serverMarks = (await api('/api/marks')).marks;
    const note = document.activeElement?.id === 'note';
    if (!note && !draft) render();
  } catch { /* offline: what is shown stays */ }
}

function renderSync() {
  const waiting = queue.length ? `${queue.length} mark${queue.length === 1 ? '' : 's'} not saved online yet${isSending ? ' (sending…)' : ''}.` : 'All marks saved.';
  $('sync').textContent = [waiting, syncProblem].filter(Boolean).join(' ');
}

function renderChrome() {
  const scoped = snapshot.items.filter(inScope);
  const count = (id) => (id === 'all' ? scoped.length : scoped.filter((item) => phaseOf(item) === id).length);
  const reviewed = scoped.length - count('pending');
  $('bar').value = scoped.length ? reviewed / scoped.length : 0;
  $('summary').textContent = `${reviewed.toLocaleString()} / ${scoped.length.toLocaleString()} reviewed · lines from ${new Date(snapshot.generatedAt).toLocaleDateString()}`;
  $('scope').replaceChildren(...SCOPES.map(([id, label, groups]) => {
    const waiting = snapshot.items.filter((item) => matchesScope(item, groups) && phaseOf(item) === 'pending').length;
    return el('option', { value: id, textContent: `${label} (${waiting} to review)`, selected: id === scope });
  }));
  $('tabs').replaceChildren(...TABS.map(([id, label]) => button(`${label} (${count(id)})`, '', () => {
    tab = id;
    index = 0;
    draft = null;
    store(TAB_KEY, id);
    render();
  }, { ariaPressed: String(tab === id) })));
  renderSync();
}

function itemCard(item, position, total) {
  const tags = [
    ...(item.gender ? [el('span', { className: `tag gender-${item.gender}`, textContent: item.gender === 'girl' ? 'female form (to a girl)' : 'male form (to a boy)' })] : []),
    el('span', { className: 'tag', textContent: item.speed }),
    ...(item.where ? [el('span', { className: 'tag', textContent: item.where })] : []),
  ];
  const card = el('div', { className: 'card' },
    el('div', { className: 'muted', textContent: `${position} of ${total} in this list` }),
    el('div', {}, ...tags),
    el('div', { className: 'text', dir: 'rtl', lang: 'he', textContent: item.spoken }));
  const phase = phaseOf(item);
  const mark = markOf(item.key);
  if (phase === 'good') card.append(el('div', { className: 'muted', textContent: 'Marked good.' }));
  if (phase === 'regenerate') {
    const why = [(mark.reasons || []).map((reason) => REASON_LABELS[reason] || reason).join(' · '), mark.note].filter(Boolean).join(' — ');
    card.append(el('div', { className: 'why', textContent: `Marked for regenerate${why ? `: ${why}` : '.'}` }));
    if (item.hasTake) card.append(el('div', { className: 'muted', textContent: 'A new take is waiting: compare it on the PC.' }));
  }
  if (item.lines?.length) {
    card.append(el('div', { className: 'muted', textContent: 'Heard in the app as (opener and ending are shared clips):' }),
      ...item.lines.map((line) => el('div', { className: 'line' },
        el('span', { className: `tag gender-${line.listener}`, textContent: LISTENER_LABELS[line.listener] }),
        el('div', { className: 'text', dir: 'rtl', lang: 'he', textContent: line.spoken }),
        button('▶ Play the full line', '', () => play(line.parts)))));
  }
  return card;
}

function draftPanel() {
  const chips = el('div', { className: 'chips' }, ...snapshot.reasons.map((reason) => button(REASON_LABELS[reason] || reason, '', (event) => {
    const isOn = draft.reasons.includes(reason);
    draft.reasons = isOn ? draft.reasons.filter((other) => other !== reason) : [...draft.reasons, reason];
    event.currentTarget.ariaPressed = String(!isOn);
  }, { ariaPressed: String(draft.reasons.includes(reason)) })));
  const note = el('input', { id: 'note', type: 'text', maxLength: snapshot.maxNote, placeholder: 'What is wrong? (optional)', dir: 'auto', value: draft.note });
  note.setAttribute('aria-label', 'What is wrong');
  note.addEventListener('input', () => { draft.note = note.value; });
  return el('div', { className: 'card' }, el('div', { textContent: 'What is wrong with this clip?' }), chips, note);
}

function renderActions(item) {
  const footer = $('actions');
  footer.hidden = !snapshot;
  if (draft) {
    footer.replaceChildren(el('div', { className: 'row main' },
      button('Cancel', '', () => { draft = null; render(); }),
      button('Mark for regenerate', 'bad', () => mark('regenerate', draft))));
    return;
  }
  footer.replaceChildren(
    el('div', { className: 'row main' },
      button('Good', 'good', () => mark('good'), { disabled: !item }),
      button('Regenerate', 'bad', openDraft, { disabled: !item })),
    el('div', { className: 'row' },
      button('←', '', () => move(-1), { disabled: !item, ariaLabel: 'Previous' }),
      button('▶ Replay', 'info', playCurrent, { disabled: !item }),
      button('Undo', '', undo, { disabled: !lastMarkedKey }),
      button('→', '', () => move(1), { disabled: !item, ariaLabel: 'Next' })));
}

function render() {
  renderChrome();
  const list = visible();
  index = Math.min(Math.max(index, 0), Math.max(list.length - 1, 0));
  const item = list[index];
  $('view').replaceChildren(...(item
    ? [itemCard(item, index + 1, list.length), ...(draft ? [draftPanel()] : [])]
    : [el('div', { className: 'card empty', textContent: tab === 'pending' ? 'Nothing left to review. 🎉' : 'Nothing here.' })]));
  renderActions(item);
}

function move(step) {
  index += step;
  draft = null;
  render();
  window.scrollTo(0, 0);
  playCurrent();
}

function openDraft() {
  const item = current();
  if (!item) return;
  const marked = phaseOf(item) === 'regenerate' ? markOf(item.key) : null;
  draft = { reasons: [...(marked?.reasons || [])], note: marked?.note || '' };
  render();
  $('view').lastElementChild.scrollIntoView({ block: 'nearest' });
}

/** Marks the clip and goes straight to the next one, playing it within the same tap. */
function mark(status, detail) {
  const item = current();
  if (!item) return;
  enqueue(item, status, detail);
  lastMarkedKey = item.key;
  draft = null;
  // The clip stays in the list (the All tab, or the same status): step past it
  if (visible()[index]?.key === item.key) index += 1;
  render();
  window.scrollTo(0, 0);
  playCurrent();
}

function undo() {
  const item = snapshot.items.find((other) => other.key === lastMarkedKey);
  if (!item) return;
  lastMarkedKey = null;
  enqueue(item, null);
  tab = 'pending';
  index = Math.max(visible().findIndex((other) => other.key === item.key), 0);
  draft = null;
  render();
  playCurrent();
}

async function start() {
  if (!token) return showSignIn();
  $('signin').hidden = true;
  $('summary').textContent = 'Loading…';
  try {
    const [lines, marks] = await Promise.all([api('/api/snapshot'), api('/api/marks')]);
    snapshot = lines;
    serverMarks = marks.marks;
  } catch (error) {
    if (error.status === 401) return;
    $('summary').textContent = '';
    $('view').replaceChildren(el('div', { className: 'card' }, el('p', { textContent: error.status ? error.message : 'No connection.' }), button('Try again', 'info', start)));
    return;
  }
  $('controls').hidden = false;
  render();
  void send();
}

$('signin').addEventListener('submit', (event) => {
  event.preventDefault();
  if (takeToken($('token').value)) {
    $('token').value = '';
    void start();
  }
});
$('search').addEventListener('input', () => { index = 0; draft = null; render(); });
$('scope').addEventListener('change', () => {
  if (!isScope($('scope').value)) return;
  scope = $('scope').value;
  store(SCOPE_KEY, scope);
  index = 0;
  draft = null;
  render();
});
window.addEventListener('online', () => void send());
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') void refresh(); });
window.addEventListener('hashchange', () => { if (takeFromAddress()) void start(); });
setInterval(() => void send(), RETRY_MS);

function takeFromAddress() {
  if (!location.hash.startsWith('#token=') || !takeToken(location.hash)) return false;
  history.replaceState(null, '', location.pathname);
  return true;
}

if (!takeFromAddress()) token = readStored(TOKEN_KEY, '');
void start();
