/**
 * Mission art is drawn several pictures to a sheet, to save cost: always a 3 x 3 grid of square
 * cells at 2K, so a cell is about 680px.
 * A pair (closed and open) takes two cells side by side in one row. renderMissionArt.mjs sends
 * the sheet prompts, and scripts/art/slice_mission_sheet.py cuts a sheet back into pictures.
 */

const MAX_COLUMNS = 3;
const LANDMARK_VIEW =
  'Every landmark is seen from a slight three-quarter angle from the front and a little above, about as wide as it is tall, and must read clearly when shown 90 pixels wide: a few large, simple shapes, no tiny details.';

/** How many cells a job takes: a pair takes two, side by side. */
function spanOf(job) {
  return job.kind === 'pair' ? 2 : 1;
}

/** The first free spot in reading order with `span` free cells in one row, or -1. */
function firstFreeSpot(taken, columns, span) {
  for (let position = 0; position < columns * columns; position++) {
    const fitsRow = (position % columns) + span <= columns;
    const isFree = Array.from({ length: span }, (_, i) => position + i).every((p) => !taken.has(p));
    if (fitsRow && isFree) return position;
  }
  return -1;
}

/** Places jobs in a columns x columns grid, each in the first free spot (so a single fills the gap a pair leaves); null when they don't all fit. */
function placeAll(jobs, columns) {
  const taken = new Set();
  const cells = [];
  for (const job of jobs) {
    const span = spanOf(job);
    const position = firstFreeSpot(taken, columns, span);
    if (position === -1) return null;
    Array.from({ length: span }, (_, i) => taken.add(position + i));
    cells.push({ job, row: Math.floor(position / columns), col: position % columns, span });
  }
  return cells;
}

/** The longest run of jobs, from the start, that fits one 3 x 3 sheet. */
function takeOneSheet(jobs) {
  let count = jobs.length;
  while (count > 1 && placeAll(jobs.slice(0, count), MAX_COLUMNS) === null) count--;
  return jobs.slice(0, count);
}

/** Groups jobs into 3 x 3 sheets: { columns, cells: [{ job, row, col, span }] }; a short last sheet leaves cells empty. */
export function packSheets(jobs) {
  const sheets = [];
  let remaining = [...jobs];
  while (remaining.length > 0) {
    const sheetJobs = takeOneSheet(remaining);
    sheets.push({ columns: MAX_COLUMNS, cells: placeAll(sheetJobs, MAX_COLUMNS) });
    remaining = remaining.slice(sheetJobs.length);
  }
  return sheets;
}

/** Every sheet is drawn at 2K, so each of its cells is about 680px. */
export function sheetImageSize() {
  return '2K';
}

function cellName(cell) {
  const where = `Row ${cell.row + 1}, column`;
  return cell.span === 2 ? `${where}s ${cell.col + 1} and ${cell.col + 2}` : `${where} ${cell.col + 1}`;
}

function cellLine(cell) {
  const name = cellName(cell);
  if (cell.job.kind === 'pair') {
    const [left, right] = [cell.col + 1, cell.col + 2];
    return `${name} (one pair: two pictures of the same object, one centred in each cell, the same size, the same angle and the same colours, on the same baseline; "Left" is column ${left}, "Right" is column ${right}): ${cell.job.subject}`;
  }
  if (cell.job.kind === 'landmark') return `${name} (a landmark): ${sceneOnly(cell.job.subject)}`;
  return `${name} (a single picture): ${cell.job.subject}`;
}

/**
 * A landmark subject without its unit name ("Global Youth Summit & Environment: a building..."):
 * a unit name in the prompt tempts the model to letter it onto a sign.
 */
function sceneOnly(subject) {
  const colon = subject.indexOf(': ');
  return colon === -1 ? subject : subject.slice(colon + 2);
}

function emptyCells(sheet) {
  const used = new Set(sheet.cells.flatMap((c) => Array.from({ length: c.span }, (_, i) => c.row * sheet.columns + c.col + i)));
  return Array.from({ length: sheet.columns * sheet.columns }, (_, i) => i)
    .filter((i) => !used.has(i))
    .map((i) => `Row ${Math.floor(i / sheet.columns) + 1}, column ${(i % sheet.columns) + 1}: empty, plain white.`);
}

function layoutRules(columns) {
  return [
    `Layout: a sheet of separate pictures in a strict ${columns} × ${columns} grid of equal square cells (${columns} rows, ${columns} columns) on a plain pure white background, placed exactly as listed below.`,
    'Every picture is centred in its own cell, filling about 75% of it, with a wide empty white margin on all sides, so that no picture touches or overlaps another picture or the edge of the image. No grid lines, no cell borders, no frames, no labels, no numbers for the cells.',
    'All the pictures share the same line weight, lighting and level of detail, as one matching set.',
  ].join('\n');
}

/** The prompt of one sheet: style, layout, what each cell holds, then the cut-out rules. */
export function sheetPrompt(spec, sheet, { noText, cutoutRules }) {
  const hasLandmark = sheet.cells.some((c) => c.job.kind === 'landmark');
  return [
    spec.style,
    noText,
    '',
    layoutRules(sheet.columns),
    hasLandmark ? `Landmarks: ${spec.landmarkIdea}\n${LANDMARK_VIEW}` : '',
    '',
    ...sheet.cells.map(cellLine),
    ...emptyCells(sheet),
    '',
    cutoutRules,
  ]
    .filter((line, i, lines) => line !== '' || lines[i - 1] !== '')
    .join('\n');
}

/** What slice_mission_sheet.py needs: where each cell's picture goes. */
export function sheetLayout(sheet) {
  return {
    columns: sheet.columns,
    cells: sheet.cells.map(({ job, row, col, span }) => ({ path: job.path, row, col, span })),
  };
}
