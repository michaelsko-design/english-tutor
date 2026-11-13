"""Cut the 4 x 4 vocabulary sheets into one picture per word.

Reads   art-src/vocab-sheets/sheet-<n>.png         (from scripts/art/renderVocabPictures.mjs)
        scripts/art/vocabPictureList.json          (which word sits in which cell: `sheet` and `cell`, 0–15 in reading order)
Writes  art-src/vocab-icons/icons/<id>.png          (one picture on white)
        art-src/vocab-icons/review.html             (every picture with its word, to check by eye)
Then:   python scripts/process_art.py icons --src art-src/vocab-icons
        -> public/art/icons/<id>.webp (256px) + @128

The model sometimes writes the word above its picture although the prompt forbids text; a label
would give the answer away, so a one-line band of dense ink at the top of a cell, followed by a row
with almost no ink, is cut off. A cell with drawing on its outer rim spilled over a cell border and
is reported, so that sheet can be drawn again.

Usage:  python scripts/art/slice_vocab_sheets.py [--set map]   (map: unit and mission pictures, scripts/art/mapPictureList.json -> art-src/map-icons)
Needs:  Python 3.10+, Pillow and numpy
"""
import base64
import html
import io
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent.parent
# Picture sets drawn the same way: (list file, sheets folder, output folder, cut word labels)
# The map set keeps the top of every cell: its pictures carry no word labels, and the label cut
# took flags, hats and thought bubbles off them.
SETS = {
    "vocab": ("vocabPictureList.json", "vocab-sheets", "vocab-icons", True),
    "map": ("mapPictureList.json", "map-sheets", "map-icons", False),
}
COLUMNS = 4
WHITE_TOLERANCE = 40  # a pixel this far from pure white counts as drawing
# Pictures the label cut gets wrong (a two-line label, a label inside the picture's panel, a label
# below the picture): the band of the cell to keep, as fractions of its height, instead of the cut.
HAND_CROPS = {
    "vocab-cat-on-the-bed": (0.32, 1.0),
    "vocab-cloud": (0.24, 1.0),
    "vocab-oil": (0.0, 0.8),
    "vocab-sunburn": (0.22, 1.0),
    "vocab-heatwave": (0.0, 0.855),
    "vocab-bright": (0.24, 1.0),
}
LABEL_ZONE = 0.3  # a label starts in the top 30% of the cell
LABEL_MIN_HEIGHT = 25  # rows below the label's top before its bottom edge is looked for
LABEL_MAX_HEIGHT = 100
LABEL_GAP_INK = 12  # a row with at most this much ink ends the label
LABEL_TEXT_INK = 50  # a label row holds at least this much ink
RIM_SHARE = 0.02
GRID_BAND = 0.08  # grid lines the model sometimes draws sit in this outer band of a cell
GRID_LINE_SHARE = 0.6  # a row or column inked along this share of its length is a grid line


def ink_mask(img: Image.Image) -> np.ndarray:
    pixels = np.asarray(img.convert("RGB")).astype(int)
    return (255 - pixels.min(axis=2)) > WHITE_TOLERANCE


def strip_label(cell: Image.Image) -> tuple[Image.Image, bool]:
    ink = ink_mask(cell).sum(axis=1)
    rows = np.flatnonzero(ink > 3)
    if rows.size == 0 or rows[0] > cell.height * LABEL_ZONE:
        return cell, False
    top = rows[0]
    window = ink[top + LABEL_MIN_HEIGHT : top + LABEL_MAX_HEIGHT]
    if window.size == 0:
        return cell, False
    cut = top + LABEL_MIN_HEIGHT + int(window.argmin())
    if window.min() > LABEL_GAP_INK or ink[top:cut].max() < LABEL_TEXT_INK:
        return cell, False
    return cell.crop((0, cut, cell.width, cell.height)), True


def clear_grid_lines(cell: Image.Image) -> Image.Image:
    """Whitens the cell-border lines some sheets have, so they don't end up in the picture."""
    pixels = np.asarray(cell.convert("RGB")).copy()
    mask = (255 - pixels.astype(int).min(axis=2)) > WHITE_TOLERANCE // 2
    height, width = mask.shape
    band_y, band_x = round(height * GRID_BAND), round(width * GRID_BAND)
    for y in [*range(band_y), *range(height - band_y, height)]:
        if mask[y].mean() > GRID_LINE_SHARE:
            pixels[y] = 255
    for x in [*range(band_x), *range(width - band_x, width)]:
        if mask[:, x].mean() > GRID_LINE_SHARE:
            pixels[:, x] = 255
    return Image.fromarray(pixels)


def strip_labels(cell: Image.Image) -> tuple[Image.Image, bool]:
    """A label above the picture, then one below it (the same check on the cell turned upside down)."""
    cell, had_top = strip_label(cell)
    flipped, had_bottom = strip_label(cell.transpose(Image.FLIP_TOP_BOTTOM))
    return flipped.transpose(Image.FLIP_TOP_BOTTOM), had_top or had_bottom


def touches_rim(cell: Image.Image) -> bool:
    mask = ink_mask(cell)
    rim = max(2, round(min(mask.shape) * RIM_SHARE))
    return bool(mask[:, :rim].any() or mask[:, -rim:].any() or mask[-rim:].any())


SPECK_MAX_INK = 400  # a separate band of ink this small above or below the picture is a leftover speck
SPECK_MIN_GAP = 8  # rows of white between the speck and the picture


def drop_specks(img: Image.Image) -> Image.Image:
    """Whitens small separate bands of ink at the top or bottom (bits of a cut label, a stray dot)."""
    pixels = np.asarray(img.convert("RGB")).copy()
    mask = ink_mask(img)
    rows = mask.sum(axis=1)
    runs, start = [], None
    for y, count in enumerate(rows):
        if count and start is None:
            start = y
        elif not count and start is not None:
            runs.append((start, y))
            start = None
    if start is not None:
        runs.append((start, len(rows)))
    for edge in (0, -1):
        while len(runs) > 1:
            run, neighbour = runs[edge], runs[1 if edge == 0 else -2]
            gap = neighbour[0] - run[1] if edge == 0 else run[0] - neighbour[1]
            if rows[run[0] : run[1]].sum() > SPECK_MAX_INK or gap < SPECK_MIN_GAP:
                break
            pixels[run[0] : run[1]] = 255
            runs.pop(edge)
    return Image.fromarray(pixels)


def trim(img: Image.Image) -> Image.Image:
    ys, xs = np.nonzero(ink_mask(img))
    if ys.size == 0:
        return img
    return img.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))


def thumb_uri(img: Image.Image) -> str:
    small = img.copy()
    small.thumbnail((160, 160))
    buf = io.BytesIO()
    small.save(buf, "WEBP", quality=80)
    return "data:image/webp;base64," + base64.b64encode(buf.getvalue()).decode()


def main() -> None:
    set_name = sys.argv[sys.argv.index("--set") + 1] if "--set" in sys.argv else "vocab"
    list_name, sheets_name, out_name, cuts_labels = SETS[set_name]
    sheets_dir = ROOT / "art-src" / sheets_name
    out_root = ROOT / "art-src" / out_name
    entries = json.loads((ROOT / "scripts" / "art" / list_name).read_text(encoding="utf-8"))
    out_dir = out_root / "icons"
    out_dir.mkdir(parents=True, exist_ok=True)
    sheets: dict[int, list[dict]] = {}
    for entry in entries:
        sheets.setdefault(entry["sheet"], []).append(entry)
    tiles, written = [], 0
    for number in sorted(sheets):
        path = sheets_dir / f"sheet-{number}.png"
        if not path.exists():
            print(f"skip    sheet-{number}.png (not drawn yet)")
            continue
        sheet = Image.open(path).convert("RGB")
        cw, ch = sheet.width // COLUMNS, sheet.height // COLUMNS
        for entry in sheets[number]:
            row, col = divmod(entry["cell"], COLUMNS)
            cell = clear_grid_lines(sheet.crop((col * cw, row * ch, (col + 1) * cw, (row + 1) * ch)))
            if entry["id"] in HAND_CROPS:
                top, bottom = HAND_CROPS[entry["id"]]
                cell, had_label = cell.crop((0, round(top * ch), cw, round(bottom * ch))), True
            else:
                cell, had_label = strip_labels(cell) if cuts_labels else (cell, False)
            if touches_rim(cell):
                print(f"warning {entry['id']}: drawing touches the cell border in sheet-{number}")
            picture = trim(drop_specks(cell))
            picture.save(out_dir / f"{entry['id']}.png")
            written += 1
            flag = " (label cut)" if had_label else ""
            tiles.append(
                f'<figure><img src="{thumb_uri(picture)}" alt=""><figcaption><b>{html.escape(entry["word"])}</b> '
                f'{html.escape(entry["he"])}<br><small>sheet {number}{flag}</small></figcaption></figure>'
            )
    page = (
        '<!doctype html><meta charset="utf-8"><title>Vocabulary pictures</title>'
        "<style>body{font:14px system-ui;margin:16px;background:#fafafa}main{display:grid;"
        "grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}figure{margin:0;background:#fff;"
        "border:1px solid #ddd;border-radius:10px;padding:8px;text-align:center}img{width:120px;height:120px;"
        "object-fit:contain}small{color:#777}</style>"
        f"<h1>Vocabulary pictures ({written})</h1><main>{''.join(tiles)}</main>"
    )
    (out_root / "review.html").write_text(page, encoding="utf-8")
    print(f"{written} picture(s) written to {out_dir}")


if __name__ == "__main__":
    main()
