"""
Cuts art-src/room-furniture/sheet.png (3 x 3, see renderRoomFurniture.mjs) into transparent,
tightly cropped pieces at public/art/room/<id>.webp (480px wide at most).

Usage: python scripts/art/process_room_furniture.py
"""
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
SHEET = ROOT / 'art-src' / 'room-furniture' / 'sheet.png'
OUT = ROOT / 'public' / 'art' / 'room'
# Reading order of the sheet: row by row.
PIECES = ['shelf-long', 'shelf-short', 'shelf-float', 'sill', 'desk', 'cubby', 'rug', 'board', 'side-table']
KEEP = {'shelf-long', 'shelf-short', 'sill', 'desk', 'board'}  # the others on the sheet are not used by the scene
MAX_WIDTH = 480
WHITE_LEVEL = 236


def clear_background(rgb: np.ndarray) -> np.ndarray:
    """Alpha channel: 0 for near-white pixels reachable from the cell edge, 255 elsewhere."""
    height, width, _ = rgb.shape
    is_white = (rgb >= WHITE_LEVEL).all(axis=2)
    seen = np.zeros((height, width), dtype=bool)
    queue = deque()
    for x in range(width):
        queue.extend([(0, x), (height - 1, x)])
    for y in range(height):
        queue.extend([(y, 0), (y, width - 1)])
    while queue:
        y, x = queue.popleft()
        if not (0 <= y < height and 0 <= x < width) or seen[y, x] or not is_white[y, x]:
            continue
        seen[y, x] = True
        queue.extend([(y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)])
    return np.where(seen, 0, 255).astype(np.uint8)


def main() -> None:
    sheet = Image.open(SHEET).convert('RGB')
    cell = sheet.width // 3
    OUT.mkdir(parents=True, exist_ok=True)
    for index, piece_id in enumerate(PIECES):
        if piece_id not in KEEP:
            continue
        row, col = divmod(index, 3)
        tile = sheet.crop((col * cell, row * cell, (col + 1) * cell, (row + 1) * cell))
        rgb = np.asarray(tile)
        rgba = Image.fromarray(np.dstack([rgb, clear_background(rgb)]), 'RGBA')
        rgba = rgba.crop(rgba.getbbox())
        if rgba.width > MAX_WIDTH:
            rgba = rgba.resize((MAX_WIDTH, round(rgba.height * MAX_WIDTH / rgba.width)), Image.LANCZOS)
        rgba.save(OUT / f'{piece_id}.webp', quality=90)
        print(f'{piece_id}: {rgba.width}x{rgba.height}')


if __name__ == '__main__':
    main()
