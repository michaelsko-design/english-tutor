"""
Turns the sliced themed room art (art-src/room-art/<theme>/<id>.png, drawn on white by
renderRoomArt.mjs and cut by slice_mission_sheet.py) into transparent, tightly cropped WebP at
public/art/room/<theme>/<id>.webp, and writes src/data/roomArtManifest.ts: for every picture its
width/height ratio and the bounds of the object's BODY (without its baked shadow), because the room
scene anchors an item's feet and size on the body.

Per picture:
  1. stray lines (grid lines on an edge, drawn corner lines) are erased: thin, long pieces of ink
  2. no baked shadow: white connected to the edge becomes transparent
  3. baked shadow: the dark outline closes the body, so everything outside it that is not white is
     the cast shadow and becomes a translucent violet layer; the body stays opaque
  4. trimmed to what is left, at most MAX_WIDTH wide

Usage: python scripts/art/process_room_art.py [--contact DIR]   (DIR: contact sheets to look at)
"""
import json
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

from process_room_furniture import clear_background

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'art-src' / 'room-art'
OUT = ROOT / 'public' / 'art' / 'room'
MANIFEST = ROOT / 'src' / 'data' / 'roomArtManifest.ts'

MAX_WIDTH = 512
WEBP_QUALITY = 88
WHITE_LEVEL = 236
OUTLINE_GAP_CLOSE = 2  # pixels: closes tiny gaps in an outline before looking for what is outside it
SHADOW_MIN_LUMINANCE = 45  # darker than this is the outline of the object, never shadow
SHADOW_MAX_LUMINANCE = 170  # a pale grey-violet body or outline must not count as shadow; only the soft edge may be this light
PALE_SHADOW_MAX_LUMINANCE = 215  # big furniture has a thick, closed outline, so its (paler) shadow may be lighter than other pictures'
PALE_SHADOW_IDS = {'object-bed', 'object-wardrobe', 'object-desk', 'room-sofa', 'room-chair', 'room-plant', 'room-ball', 'room-drum'}  # ... and the second view (-b) of each
SHADOW_FRINGE = 6 # pixels: the light soft edge of the shadow, taken only next to the shadow itself
SPECK_SHARE = 0.002  # a piece of ink smaller than this share of the picture, far from the object, is a stray mark
SPECK_DISTANCE = 0.08  # ... when it is farther than this share of the short side from the object's box
SHADOW_MAX_SATURATION = 0.38  # a cast shadow is a grey with a violet tint; the object's colours are more saturated
SHADOW_BLUE_SLACK = 8  # ... and its blue is not below its red
THIN_THICKNESS = 14  # a piece of ink whose area / length is below this (pixels) is a line
SPARSE_FILL = 0.06  # ... or whose ink fills less of its box than this (a frame loop, a corner)
LINE_MIN_SHARE = 0.22  # a stray line is at least this share of the picture's short side long
MAX_SHADOW_SHARE = 0.6  # more "shadow" than this of what is drawn means the outline leaked: warn
LINE_MARGIN = 3  # pixels erased around a removed line (its soft edge)
AXIS_LINE_SHARE = 0.5  # a straight line is a run of ink this share of the picture long
AXIS_EDGE_BAND = 0.08  # ... and only the outer band of the picture is searched (that is where the grid lines are)
AXIS_LINE_THICKNESS = 7  # ... and narrower than this many pixels
SHADOW_COLOR = (28, 14, 52)
SHADOW_ALPHA_MAX = 0.62
SHADOW_GAIN = 2.2  # darker grey, more opaque shadow
ALPHA_VISIBLE = 8
OPEN_SPACE_IDS = {'object-desk', 'object-desk-b'}  # furniture with open space between its legs: enclosed white there is clear
OPEN_SPACE_WHITE = 225  # the gap between legs is off-white (pale shadow edge), not always pure white
SLOPE_MARGIN = 0.1  # the top edge's slope is read between these shares of the body's width
SLOPE_MIN_COLUMNS = 8
OPEN_SPACE_MIN_AREA = 100
SOLID_BODY_SIZE = 9  # furniture pieces are thick: anything thinner than this many pixels is a stray line
SOLID_BODY_REGROW = 8  # pixels kept around the thick body, which is its outline and soft edge


def luminance(rgb: np.ndarray) -> np.ndarray:
    return rgb[..., 0] * 0.299 + rgb[..., 1] * 0.587 + rgb[..., 2] * 0.114


def remove_stray_lines(rgb: np.ndarray) -> np.ndarray:
    """The picture with thin, long pieces of ink (grid lines, drawn corner lines) painted white."""
    ink = (rgb < WHITE_LEVEL).any(axis=2)
    labels, count = ndimage.label(ink, structure=np.ones((3, 3)))
    if count == 0:
        return rgb
    areas = ndimage.sum(ink, labels, range(1, count + 1))
    short_side = min(ink.shape)
    lines = np.zeros(ink.shape, dtype=bool)
    boxes = ndimage.find_objects(labels)
    main = boxes[int(np.argmax(areas))]
    for index, box in enumerate(boxes, start=1):
        height, width = box[0].stop - box[0].start, box[1].stop - box[1].start
        length = max(height, width)
        is_line = areas[index - 1] / length < THIN_THICKNESS or areas[index - 1] / (height * width) < SPARSE_FILL
        gap_y = max(main[0].start - box[0].stop, box[0].start - main[0].stop, 0)
        gap_x = max(main[1].start - box[1].stop, box[1].start - main[1].stop, 0)
        is_speck = areas[index - 1] < SPECK_SHARE * ink.size and max(gap_y, gap_x) > SPECK_DISTANCE * short_side
        if (length >= LINE_MIN_SHARE * short_side and is_line) or is_speck:
            lines |= labels == index
    if not lines.any():
        return rgb
    cleaned = rgb.copy()
    cleaned[ndimage.binary_dilation(lines, iterations=LINE_MARGIN)] = 255
    return cleaned


def remove_axis_lines(rgb: np.ndarray) -> np.ndarray:
    """Erases thin straight grid lines along the picture's edges even when they touch something (a line
    that runs into a shadow): a long run of ink narrower than a stroke of the drawing, in the edge band."""
    ink = (rgb < WHITE_LEVEL).any(axis=2)
    height, width = ink.shape
    band = np.zeros(ink.shape, dtype=bool)
    band_rows, band_cols = int(AXIS_EDGE_BAND * height), int(AXIS_EDGE_BAND * width)
    band[:band_rows] = band[-band_rows:] = True
    band[:, :band_cols] = band[:, -band_cols:] = True
    erase = np.zeros(ink.shape, dtype=bool)
    for line, wide in (
        ((int(AXIS_LINE_SHARE * height), 1), (int(AXIS_LINE_SHARE * height), AXIS_LINE_THICKNESS)),
        ((1, int(AXIS_LINE_SHARE * width)), (AXIS_LINE_THICKNESS, int(AXIS_LINE_SHARE * width))),
    ):
        long_runs = ndimage.binary_opening(ink, structure=np.ones(line, dtype=bool))
        wide_runs = ndimage.binary_dilation(ndimage.binary_opening(ink, structure=np.ones(wide, dtype=bool)), iterations=2)
        erase |= long_runs & ~wide_runs
    erase &= band
    if not erase.any():
        return rgb
    cleaned = rgb.copy()
    cleaned[ndimage.binary_dilation(erase, iterations=LINE_MARGIN) & band] = 255
    return cleaned


def alpha_with_shadow(rgb: np.ndarray, max_luminance: int = SHADOW_MAX_LUMINANCE) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """(rgb, alpha, body): shadow and white are what can be reached from the edge without crossing the
    object's own colours; the outline closes the object. Outside it, white is clear and the rest is shadow."""
    lum = luminance(rgb)
    spread = rgb.max(axis=2) - rgb.min(axis=2)
    saturation = spread / np.maximum(rgb.max(axis=2), 1)
    is_white = (rgb >= WHITE_LEVEL).all(axis=2)
    greyish = (saturation < SHADOW_MAX_SATURATION) & (rgb[..., 2] >= rgb[..., 0] - SHADOW_BLUE_SLACK)
    is_shadow = greyish & (lum > SHADOW_MIN_LUMINANCE) & (lum <= max_luminance)
    passable = is_white | is_shadow
    walls = ndimage.binary_dilation(~passable, iterations=OUTLINE_GAP_CLOSE)
    regions, _ = ndimage.label(~walls)
    on_edge = np.concatenate([regions[0], regions[-1], regions[:, 0], regions[:, -1]])
    touches_edge = np.zeros(regions.max() + 1, dtype=bool)
    touches_edge[np.unique(on_edge)] = True
    touches_edge[0] = False
    reached = touches_edge[regions]
    # take back the soft pixels next to the outline that the gap closing walled in
    outside = ndimage.binary_dilation(reached, iterations=OUTLINE_GAP_CLOSE) & passable
    fringe = ndimage.binary_dilation(outside & is_shadow, iterations=SHADOW_FRINGE) & greyish & ~is_white
    outside |= fringe & (lum > max_luminance)
    shadow_alpha = np.clip((255.0 - rgb.max(axis=2)) / 255.0 * SHADOW_GAIN, 0.0, SHADOW_ALPHA_MAX) * 255.0
    alpha = np.where(outside, np.where(is_white, 0.0, shadow_alpha), 255.0)
    out = rgb.copy()
    out[outside & ~is_white] = SHADOW_COLOR
    return out, alpha.astype(np.uint8), ~outside


def clear_open_space(rgb: np.ndarray, alpha: np.ndarray) -> np.ndarray:
    """Alpha with the enclosed pure-white gaps (between a desk's legs) made clear."""
    white = (rgb >= OPEN_SPACE_WHITE).all(axis=2) & (alpha == 255)
    gaps, count = ndimage.label(white)
    if count == 0:
        return alpha
    sizes = ndimage.sum(white, gaps, range(1, count + 1))
    big = np.isin(gaps, [i + 1 for i, size in enumerate(sizes) if size >= OPEN_SPACE_MIN_AREA])
    return np.where(big, 0, alpha).astype(np.uint8)


def keep_solid_body(alpha: np.ndarray) -> np.ndarray:
    """Alpha with everything away from the thick body erased: lines drawn onto a shelf or board."""
    solid = ndimage.binary_opening(alpha > ALPHA_VISIBLE, structure=np.ones((SOLID_BODY_SIZE, SOLID_BODY_SIZE), dtype=bool))
    keep = ndimage.binary_dilation(solid, iterations=SOLID_BODY_REGROW)
    return np.where(keep, alpha, 0).astype(np.uint8)


def top_edge_slope(alpha: np.ndarray, body: np.ndarray) -> float:
    """How the body's top edge runs: pixels down per pixel to the right (positive: lower on the right).
    The room scene mirrors flat wall pictures whose slope disagrees with the wall they hang on."""
    columns = np.flatnonzero((body & (alpha > ALPHA_VISIBLE)).any(axis=0))
    if columns.size < SLOPE_MIN_COLUMNS:
        return 0.0
    first, last = columns.min(), columns.max()
    span = last - first
    xs = np.arange(int(first + SLOPE_MARGIN * span), int(last - SLOPE_MARGIN * span) + 1)
    tops = np.array([np.argmax(body[:, x] & (alpha[:, x] > ALPHA_VISIBLE)) for x in xs])
    if xs.size < SLOPE_MIN_COLUMNS:
        return 0.0
    return float(np.polyfit(xs, tops, 1)[0])


def process(path: Path, has_shadow: bool) -> tuple[Image.Image, tuple[float, float, float, float], float]:
    """The transparent picture, the body's (left, right, top, bottom) as shares of it, and its top edge's slope."""
    rgb = remove_axis_lines(remove_stray_lines(np.asarray(Image.open(path).convert('RGB'))))
    if has_shadow:
        rgb, alpha, body = alpha_with_shadow(rgb, PALE_SHADOW_MAX_LUMINANCE if path.stem.removesuffix('-b') in PALE_SHADOW_IDS else SHADOW_MAX_LUMINANCE)
        drawn = int((alpha > ALPHA_VISIBLE).sum())
        if drawn and 1 - body[alpha > ALPHA_VISIBLE].sum() / drawn > MAX_SHADOW_SHARE:
            print(f'warning {path.parent.name}/{path.stem}: mostly shadow, the outline may have leaked')
    else:
        alpha = clear_background(rgb)
        body = alpha > 0
    if path.stem.startswith('furniture-'):
        alpha = keep_solid_body(alpha)
        body = body & (alpha > 0)
    if path.stem in OPEN_SPACE_IDS:
        alpha = clear_open_space(rgb, alpha)
        body = body & (alpha > 0)
    rgba = np.dstack([rgb, alpha])
    visible = np.argwhere(alpha > ALPHA_VISIBLE)
    top, left = visible.min(axis=0)
    bottom, right = visible.max(axis=0) + 1
    body_cells = np.argwhere(body & (alpha > ALPHA_VISIBLE))
    body_top, body_left = body_cells.min(axis=0)
    body_bottom, body_right = body_cells.max(axis=0) + 1
    width, height = right - left, bottom - top
    bounds = (
        (body_left - left) / width,
        (body_right - left) / width,
        (body_top - top) / height,
        (body_bottom - top) / height,
    )
    slope = top_edge_slope(alpha, body)
    picture = Image.fromarray(rgba[top:bottom, left:right], 'RGBA')
    if picture.width > MAX_WIDTH:
        picture = picture.resize((MAX_WIDTH, round(picture.height * MAX_WIDTH / picture.width)), Image.LANCZOS)
    return picture, bounds, slope


def load_jobs() -> dict[str, bool]:
    """Picture key -> has a baked shadow, from the same spec the drawing script uses."""
    run = subprocess.run(
        ['node', str(ROOT / 'scripts' / 'art' / 'renderRoomArt.mjs'), 'jobs'],
        capture_output=True, text=True, check=True, cwd=ROOT,
    )
    return {job['key']: job['hasShadow'] for job in json.loads(run.stdout)}


def write_manifest(sprites: dict[str, dict[str, dict[str, float]]]) -> None:
    lines = [
        '// Generated by scripts/art/process_room_art.py: do not edit.',
        '// The themed room pictures in public/art/room/<theme>/<id>.webp: their width/height ratio and the',
        '// bounds of the body (without its baked shadow) as shares of the picture (feet = bottom).',
        '',
        'export interface RoomArtSprite {',
        '  aspect: number;',
        '  left: number;',
        '  right: number;',
        '  top: number;',
        '  bottom: number;',
        '  /** Top edge of the body: pixels down per pixel to the right (in the picture as drawn) */',
        '  slope: number;',
        '}',
        '',
        'export const ROOM_ART: Record<string, Record<string, RoomArtSprite>> = {',
    ]
    for theme, pictures in sprites.items():
        lines.append(f"  '{theme}': {{")
        for picture_id, sprite in pictures.items():
            fields = ', '.join(f'{name}: {value}' for name, value in sprite.items())
            lines.append(f"    '{picture_id}': {{ {fields} }},")
        lines.append('  },')
    lines.append('};')
    MANIFEST.write_text('\n'.join(lines) + '\n', encoding='utf-8')


def contact_sheet(theme: str, pictures: dict[str, Image.Image], folder: Path) -> None:
    """The theme's pictures on mid grey, so halos, leaks and stray lines show."""
    cell, columns = 250, 7
    rows = -(-len(pictures) // columns)
    sheet = Image.new('RGB', (columns * cell, rows * (cell + 16)), (150, 150, 165))
    draw = ImageDraw.Draw(sheet)
    for index, (name, picture) in enumerate(pictures.items()):
        thumb = picture.copy()
        thumb.thumbnail((cell - 6, cell - 6))
        x, y = (index % columns) * cell, (index // columns) * (cell + 16)
        sheet.paste(thumb, (x + 3, y + 16), thumb)
        draw.text((x + 3, y + 2), name, fill=(255, 255, 255))
    folder.mkdir(parents=True, exist_ok=True)
    sheet.save(folder / f'processed_{theme}.png')


def main() -> None:
    contact_dir = Path(sys.argv[sys.argv.index('--contact') + 1]) if '--contact' in sys.argv else None
    jobs = load_jobs()
    sprites: dict[str, dict[str, dict[str, float]]] = {}
    contact_pictures: dict[str, dict[str, Image.Image]] = {}
    missing: list[str] = []
    for key, has_shadow in jobs.items():
        theme, picture_id = key.split('/')
        source = SOURCE / theme / f'{picture_id}.png'
        if not source.exists():
            missing.append(key)
            continue
        picture, (left, right, top, bottom), slope = process(source, has_shadow)
        target = OUT / theme / f'{picture_id}.webp'
        target.parent.mkdir(parents=True, exist_ok=True)
        picture.save(target, 'WEBP', quality=WEBP_QUALITY, method=6)
        sprites.setdefault(theme, {})[picture_id] = {
            'aspect': round(picture.width / picture.height, 4),
            'left': round(left, 4),
            'right': round(right, 4),
            'top': round(top, 4),
            'bottom': round(bottom, 4),
            'slope': round(slope, 3),
        }
        if contact_dir:
            contact_pictures.setdefault(theme, {})[picture_id] = picture
    write_manifest(sprites)
    total = sum(len(pictures) for pictures in sprites.values())
    print(f'{total} picture(s) processed, {len(missing)} missing {missing[:5]}')
    if contact_dir:
        for theme, pictures in contact_pictures.items():
            contact_sheet(theme, pictures, contact_dir)


if __name__ == '__main__':
    main()
