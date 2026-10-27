"""Cut a mission-art sheet (scripts/art/missionArtSheets.mjs) back into one picture per subject.

Reads   <sheet>.png and its layout <sheet>.json: {"columns": 3, "cells": [{"path", "row", "col", "span"}]}
Writes  each cell to its "path" (a pair, span 2, keeps both cells as one wide "<left>+<right>" picture),
        ready for scripts/process_art.py. The cuts go through the emptiest line near each third,
        since the drawn grid is never exactly even.

A picture whose edge holds drawing was cut through (two pictures overlap); the script warns, so that
picture can be drawn again.

Usage:  python scripts/art/slice_mission_sheet.py <sheet.png> [layout.json]
Needs:  Python 3.10+, Pillow and numpy
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

from slice_icon_sheets import WHITE_TOLERANCE

SEARCH_SHARE = 0.12  # how far from a nominal cell edge to look for the emptiest cut line, as a share of the sheet
NOISE_PIXELS = 4  # a line with this many drawing pixels or fewer is empty: the white has faint specks


def drawing_mask(sheet: Image.Image) -> np.ndarray:
    pixels = np.asarray(sheet).astype(int)
    return (255 - pixels.min(axis=2)) > WHITE_TOLERANCE


def empty_runs(profile: np.ndarray, lo: int, hi: int) -> list[tuple[int, int]]:
    """Runs of empty lines (only a few specks of noise) between lo and hi, as (first, last)."""
    runs, start = [], None
    for y in range(lo, hi + 1):
        if profile[y] <= NOISE_PIXELS:
            start = y if start is None else start
        elif start is not None:
            runs.append((start, y - 1))
            start = None
    return runs if start is None else [*runs, (start, hi)]


def cut_lines(profile: np.ndarray, parts: int) -> list[int]:
    """Where to cut a strip into `parts`: near each nominal edge, through the middle of the nearest empty
    gap (or the emptiest line if there is none), because the model never puts its grid exactly on thirds."""
    size = len(profile)
    window = round(size * SEARCH_SHARE)
    lines = [0]
    for index in range(1, parts):
        nominal = round(size * index / parts)
        lo, hi = max(lines[-1] + 1, nominal - window), min(size - 1, nominal + window)
        runs = empty_runs(profile, lo, hi)
        if runs:
            first, last = min(runs, key=lambda run: abs((run[0] + run[1]) / 2 - nominal))
            lines.append((first + last) // 2)
        else:
            lines.append(min(range(lo, hi + 1), key=lambda y: (profile[y], abs(y - nominal))))
    return [*lines, size]


def cell_boxes(sheet: Image.Image, columns: int) -> dict[tuple[int, int], tuple[int, int, int, int]]:
    """The box of every grid cell, (row, col) -> (left, top, right, bottom). Row cuts are found within
    each column's band and column cuts within each row's band, so a picture reaching past its third
    in one column doesn't move the cut for its neighbours."""
    mask = drawing_mask(sheet)

    def band(size: int, index: int) -> slice:
        return slice(round(size * index / columns), round(size * (index + 1) / columns))

    rows_by_col = [cut_lines(mask[:, band(sheet.width, c)].sum(axis=1), columns) for c in range(columns)]
    cols_by_row = [cut_lines(mask[band(sheet.height, r)].sum(axis=0), columns) for r in range(columns)]
    return {
        (r, c): (cols_by_row[r][c], rows_by_col[c][r], cols_by_row[r][c + 1], rows_by_col[c][r + 1])
        for r in range(columns)
        for c in range(columns)
    }


def is_cut_through_drawing(picture: Image.Image) -> bool:
    """True when drawing reaches the picture's outer edge: a cut went through a picture, not a gap."""
    mask = drawing_mask(picture)
    edges = (mask[0], mask[-1], mask[:, 0], mask[:, -1])
    return any(edge.sum() > NOISE_PIXELS for edge in edges)


def crop_cells(sheet: Image.Image, cell_box_list: list[tuple[int, int, int, int]]) -> Image.Image:
    """The cells' bounding box on white, holding only each cell's own box: the row cuts of a pair's two
    columns differ, so a plain bounding box would take in a piece of the picture below the higher cut."""
    left, top = min(box[0] for box in cell_box_list), min(box[1] for box in cell_box_list)
    right, bottom = max(box[2] for box in cell_box_list), max(box[3] for box in cell_box_list)
    picture = Image.new("RGB", (right - left, bottom - top), "white")
    for box in cell_box_list:
        picture.paste(sheet.crop(box), (box[0] - left, box[1] - top))
    return picture


def slice_sheet(sheet_path: Path, layout: dict) -> int:
    sheet = Image.open(sheet_path).convert("RGB")
    boxes = cell_boxes(sheet, layout["columns"])
    for cell in layout["cells"]:
        span = range(cell["col"], cell["col"] + cell["span"])
        picture = crop_cells(sheet, [boxes[(cell["row"], col)] for col in span])
        out = Path(cell["path"])
        if is_cut_through_drawing(picture):
            print(f"warning {out.stem}: the cut runs through drawing in {sheet_path.name}; draw it again")
        out.parent.mkdir(parents=True, exist_ok=True)
        picture.save(out)
        print(f"sliced  {out}")
    return len(layout["cells"])


def main() -> None:
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    sheet_path = Path(sys.argv[1])
    layout_path = Path(sys.argv[2]) if len(sys.argv) > 2 else sheet_path.with_suffix(".json")
    layout = json.loads(layout_path.read_text(encoding="utf-8"))
    print(f"{slice_sheet(sheet_path, layout)} picture(s) cut from {sheet_path.name}")


if __name__ == "__main__":
    main()
