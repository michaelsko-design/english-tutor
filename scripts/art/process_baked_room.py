"""
Turns an approved room picture with its furniture drawn in (art-src/room-baked/<theme>.png, from
renderBakedRoom.mjs) into the scene picture public/art/<theme>/room-baked.webp: cropped to exactly
4:3 about its middle and scaled to the size of the other room pictures.

Usage: python scripts/art/process_baked_room.py <theme> [<theme> ...]
"""
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
SOURCE_DIR = ROOT / 'art-src' / 'room-baked'
OUT_ROOT = ROOT / 'public' / 'art'
SIZE = (1280, 960)
WEBP_QUALITY = 88


def crop_to_aspect(image: Image.Image, aspect: float) -> Image.Image:
    width, height = image.size
    if width / height > aspect:
        new_width = round(height * aspect)
        left = (width - new_width) // 2
        return image.crop((left, 0, left + new_width, height))
    new_height = round(width / aspect)
    top = (height - new_height) // 2
    return image.crop((0, top, width, top + new_height))


def process(theme: str) -> None:
    source = SOURCE_DIR / f'{theme}.png'
    if not source.exists():
        raise SystemExit(f'Missing {source}')
    image = Image.open(source).convert('RGB')
    room = crop_to_aspect(image, SIZE[0] / SIZE[1]).resize(SIZE, Image.LANCZOS)
    out = OUT_ROOT / theme / 'room-baked.webp'
    out.parent.mkdir(parents=True, exist_ok=True)
    room.save(out, 'WEBP', quality=WEBP_QUALITY, method=6)
    print(f'{source.name} {image.size} -> {out.relative_to(ROOT)} {room.size}')


if __name__ == '__main__':
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    for name in sys.argv[1:]:
        process(name)
