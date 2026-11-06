"""
Turn the Ministry of Education's official Lexical Band and Grammar Band Excel files into clean
JSON lists, for scripts/review/curriculumCoverage.ts.

    python -I scripts/review/ministryWordLists.py

Reads  docs/ministry-sources/raw/LexicalBand{1,2,3}.xlsx, GrammarBand{I,II,III}.xlsx
       (see docs/ministry-sources/README.md)
Writes docs/ministry-sources/raw/parsed/wordLists.json and grammarLists.json
       (gitignored: derived from copyrighted files)

Standard library only (the .xlsx is a zip of XML).
"""
import json
import os
import re
import sys
import zipfile
from xml.etree import ElementTree as ET

ROOT = os.path.join(os.path.dirname(__file__), '..', '..', 'docs', 'ministry-sources', 'raw')
OUT = os.path.join(ROOT, 'parsed', 'wordLists.json')
GRAMMAR_OUT = os.path.join(ROOT, 'parsed', 'grammarLists.json')
GRAMMAR_FILES = {'GrammarBandI.xlsx': 'band-1', 'GrammarBandII.xlsx': 'band-2', 'GrammarBandIII.xlsx': 'band-3'}
NS = {
    'm': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
}
# Sheet name -> list id used by the coverage script
SHEETS = {
    'LexicalBand1.xlsx': {'Pre-Band I': 'pre-band-1', 'Band I Core I': 'band-1-core-1', 'Band I Core II': 'band-1-core-2'},
    'LexicalBand2.xlsx': {'Band II Core I': 'band-2-core-1', 'Band II Core II': 'band-2-core-2'},
    'LexicalBand3.xlsx': {'Band III Core I': 'band-3-core-1', 'Band III Core II': 'band-3-core-2'},
}


def column_index(ref):
    letters = re.match(r'[A-Z]+', ref).group()
    n = 0
    for ch in letters:
        n = n * 26 + ord(ch) - 64
    return n - 1


def read_workbook(path):
    z = zipfile.ZipFile(path)
    shared = []
    if 'xl/sharedStrings.xml' in z.namelist():
        for si in ET.fromstring(z.read('xl/sharedStrings.xml')).findall('m:si', NS):
            shared.append(''.join(t.text or '' for t in si.iter('{%s}t' % NS['m'])))
    workbook = ET.fromstring(z.read('xl/workbook.xml'))
    rels = ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))
    targets = {r.get('Id'): r.get('Target') for r in rels}
    sheets = {}
    for sheet in workbook.find('m:sheets', NS):
        target = targets[sheet.get('{%s}id' % NS['r'])].lstrip('/')
        target = target if target.startswith('xl/') else 'xl/' + target
        rows = []
        for row in ET.fromstring(z.read(target)).iter('{%s}row' % NS['m']):
            cells = {}
            for c in row.findall('m:c', NS):
                v = c.find('m:v', NS)
                kind = c.get('t')
                if kind == 's' and v is not None:
                    value = shared[int(v.text)]
                elif kind == 'inlineStr':
                    value = ''.join(x.text or '' for x in c.iter('{%s}t' % NS['m']))
                else:
                    value = v.text if v is not None else ''
                cells[column_index(c.get('r'))] = value
            if cells:
                rows.append([cells.get(i, '') for i in range(max(cells) + 1)])
        sheets[sheet.get('name')] = rows
    return sheets


def clean(text):
    return re.sub(r'\s+', ' ', (text or '').replace('\xa0', ' ')).strip()


def entries_of(rows, list_id):
    header = next((i for i, r in enumerate(rows) if r and clean(r[0]) == 'Entry'), None)
    if header is None:
        raise ValueError(f'{list_id}: no "Entry" header row')
    names = [clean(c).lower() for c in rows[header]]
    col_pos = names.index('pos') if 'pos' in names else 1
    col_rp = next((i for i, n in enumerate(names) if n.startswith('rec')), None)
    col_family = next((i for i, n in enumerate(names) if n.startswith('family')), None)
    out = []
    for r in rows[header + 1:]:
        entry = clean(r[0]) if r else ''
        rest = [clean(c) for c in r[1:]]
        if not entry:
            continue
        if entry == 'Entry':
            continue  # second header row (single words after the chunks)
        if not any(rest) and entry.isupper():
            continue  # sheet title
        get = lambda i: clean(r[i]) if i is not None and i < len(r) else ''
        rec_prod = get(col_rp)
        if not any(rest) and not rec_prod and entry.lower().startswith('phrasal verbs'):
            continue  # section heading
        out.append({
            'list': list_id,
            'entry': entry,
            'pos': get(col_pos),
            'family': get(col_family),
            'recProd': 'prod' if rec_prod.lower().startswith('prod') else ('rec' if rec_prod.lower().startswith('rec') else ''),
        })
    return out


def grammar_of(rows, band):
    """Category headings ("VERBS: Present simple") with the first level (grade, or Bagrut points) that has a descriptor."""
    level_row = next((r for r in rows if r and re.match(r'(GRADE|\d+ POINTS)', clean(r[0]).upper())), None)
    if level_row is None:
        raise ValueError(f'{band}: no GRADE / POINTS header row')
    levels = [clean(c) for c in level_row]
    out = []
    current = None
    for r in rows:
        first = clean(r[0]) if r else ''
        rest = [clean(c) for c in r[1:]]
        if first and ':' in first and not first.startswith('[') and not any(rest) and len(first) < 70:
            current = {'band': band, 'heading': first, 'firstLevel': None, 'descriptors': []}
            out.append(current)
            continue
        if current is None:
            continue
        for i, cell in enumerate(r[:len(levels)]):
            text = cell.strip()
            match = re.match(r"([A-Z][A-Z /\-',()]+)\n(.+)", text, re.S)
            if not match or text.upper().startswith('NO DESCRIPTOR') or not levels[i]:
                continue
            if current['firstLevel'] is None:
                current['firstLevel'] = levels[i]  # columns run from the lowest level up
            descriptor = clean(match.group(2)).split('.')[0][:160]
            if descriptor not in current['descriptors']:
                current['descriptors'].append(descriptor)
    return out


def main():
    all_entries = []
    for file_name, sheets in SHEETS.items():
        path = os.path.join(ROOT, file_name)
        if not os.path.exists(path):
            sys.exit(f'Missing {path}: download it first (docs/ministry-sources/README.md)')
        workbook = read_workbook(path)
        for sheet_name, list_id in sheets.items():
            if sheet_name not in workbook:
                sys.exit(f'{file_name}: sheet "{sheet_name}" not found (got {list(workbook)})')
            entries = entries_of(workbook[sheet_name], list_id)
            print(f'{list_id}: {len(entries)} entries')
            all_entries.extend(entries)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf-8') as f:
        json.dump(all_entries, f, ensure_ascii=False, indent=1)
    print(f'wrote {OUT}')

    grammar = []
    for file_name, band in GRAMMAR_FILES.items():
        path = os.path.join(ROOT, file_name)
        if not os.path.exists(path):
            sys.exit(f'Missing {path}: download it first (docs/ministry-sources/README.md)')
        workbook = read_workbook(path)
        sheet = next((name for name in workbook if name.startswith('Band')), None)
        if sheet is None:
            sys.exit(f'{file_name}: no "Band" sheet (got {list(workbook)})')
        headings = grammar_of(workbook[sheet], band)
        print(f'{band}: {len(headings)} grammar headings')
        grammar.extend(headings)
    with open(GRAMMAR_OUT, 'w', encoding='utf-8') as f:
        json.dump(grammar, f, ensure_ascii=False, indent=1)
    print(f'wrote {GRAMMAR_OUT}')


if __name__ == '__main__':
    main()
