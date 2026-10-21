"""Cut the 3 x 3 icon sheets into one picture per icon.

Reads   art-src/icon-sheets/sheet-<n>.png   (n = the "sheet" number in iconList.json, at most nine icons per sheet, in list order)
Writes  art-src/icons/<id>.png               (one icon on white, ready for scripts/process_art.py icons)

A cell that holds drawing on its outer rim means an icon spilled over a cell border; the script
warns, so that sheet can be drawn again.

Usage:  python scripts/art/slice_icon_sheets.py [sheetsDir] [outDir]
Needs:  Python 3.10+, Pillow and numpy
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent.parent
ICON_LIST = ROOT / "scripts" / "art" / "iconList.json"
COLUMNS = 3
ICONS_PER_SHEET = COLUMNS * COLUMNS
WHITE_TOLERANCE = 40  # a pixel this far from pure white counts as drawing
RIM_SHARE = 0.03  # outer rim of a cell that must stay empty, as a share of the cell side


def has_drawing_on_rim(cell: Image.Image) -> bool:
    pixels = np.asarray(cell.convert("RGB")).astype(int)
    rim = max(2, round(min(pixels.shape[:2]) * RIM_SHARE))
    drawing = (255 - pixels.min(axis=2)) > WHITE_TOLERANCE
    edges = (drawing[:rim], drawing[-rim:], drawing[:, :rim], drawing[:, -rim:])
    return any(edge.any() for edge in edges)


def slice_sheet(sheet_path: Path, icons: list[dict], out_dir: Path) -> int:
    sheet = Image.open(sheet_path).convert("RGB")
    cell_w, cell_h = sheet.width // COLUMNS, sheet.height // COLUMNS
    for index, icon in enumerate(icons):
        row, col = divmod(index, COLUMNS)
        cell = sheet.crop((col * cell_w, row * cell_h, (col + 1) * cell_w, (row + 1) * cell_h))
        if has_drawing_on_rim(cell):
            print(f"warning {icon['id']}: drawing touches the cell border in {sheet_path.name}")
        cell.save(out_dir / f"{icon['id']}.png")
    return len(icons)


def main() -> None:
    sheets_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "art-src" / "icon-sheets"
    out_dir = Path(sys.argv[2]) if len(sys.argv) > 2 else ROOT / "art-src" / "icons"
    icons = json.loads(ICON_LIST.read_text(encoding="utf-8"))
    out_dir.mkdir(parents=True, exist_ok=True)
    written = 0
    sheets: dict[int, list[dict]] = {}
    for icon in icons:
        sheets.setdefault(icon["sheet"], []).append(icon)
    for number in sorted(sheets):
        sheet_path = sheets_dir / f"sheet-{number}.png"
        if not sheet_path.exists():
            print(f"skip    sheet-{number}.png (not drawn yet)")
            continue
        written += slice_sheet(sheet_path, sheets[number][:ICONS_PER_SHEET], out_dir)
    print(f"{written} icon(s) written to {out_dir}")


if __name__ == "__main__":
    main()
