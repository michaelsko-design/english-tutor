"""Turn AI-generated art in art-src/ into the WebP files the app shows from public/art/.

Cut-outs (drawn on a plain white background) become transparent squares, 512px and 256px:
    art-src/<theme>/companion-<pose>.jpg  -> public/art/<theme>/companion-<pose>.webp + @256
    art-src/common/<name>.jpg             -> public/art/common/<name>.webp + @256
    art-src/landmarks/g<grade>-u<unit>.jpg -> public/art/landmarks/g<grade>-u<unit>.webp + @256
    art-src/icons/<id>.png                -> public/art/icons/<id>.webp (256px) + @128  (from scripts/art/slice_icon_sheets.py)
Full-frame pictures are only resized (never enlarged):
    art-src/<theme>/map-bg.jpg      -> public/art/<theme>/map-bg.webp      (1080 wide)
    art-src/<theme>/home-scene.jpg  -> public/art/<theme>/home-scene.webp  (1200 wide)
    art-src/<theme>/room-bg.jpg     -> public/art/<theme>/room-bg.webp     (1600 wide)
    art-src/stories/<missionId>.jpg -> public/art/stories/<missionId>.webp (960 wide)

Sources may be .jpg, .jpeg, .png or .webp. Missing files are skipped, and the script reports
what it wrote and what it skipped. The app shows a fallback for any file that is not there.

The thick dark outline closes each cut-out, so a flood fill from the image edges removes the
white background. The soft ground shadow is removed too; the app draws its own shadow so the
companion can bob and jump. The five companion poses are scaled to the same height and placed
bottom-centred on the same square canvas, so poses swap in place.

Usage:  python scripts/process_art.py [only ...] [--src DIR] [--out DIR]
        only: theme ids (cozy-studio, neon-pop, starlight-rpg), common, landmarks, stories, icons
        (default: everything found in art-src/)
Needs:  Python 3.10+, Pillow and numpy  (pip install pillow numpy)
"""
import argparse
import sys
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
THEMES = ["cozy-studio", "neon-pop", "starlight-rpg"]
POSES = ["idle", "cheer", "think", "oops", "wave"]
CUTOUT_SIZES = (512, 256)
ICON_SIZES = (256, 128)
OPEN_SHAPE_ICONS = {"wear-necklace", "wear-scarf"}  # the white inside the loop is background too
ICON_MARGIN = 0.08  # free space around an icon, as a share of its longest side
SCENE_WIDTHS = {"map-bg": 1080, "home-scene": 1200, "room-bg": 1600}
STORY_WIDTH = 960
SOURCE_EXTENSIONS = (".jpg", ".jpeg", ".png", ".webp")

BACKGROUND_TOLERANCE = 22  # how far from pure white a background pixel may be
SHADOW_MAX_SATURATION = 40  # the ground shadow is a low-saturation grey-mauve
SHADOW_MIN_BRIGHTNESS = 150
CANVAS_MARGIN = 0.04  # free space around the tallest cut-out, as a share of its height
FLOOR_MARGIN = 0.02  # gap under the feet, as a share of the cut-out height
CUTOUT_QUALITY = 85
SCENE_QUALITY = 82


class Report:
    def __init__(self) -> None:
        self.written: list[Path] = []
        self.skipped: list[str] = []

    def wrote(self, path: Path) -> None:
        self.written.append(path)
        try:
            shown = path.relative_to(ROOT)
        except ValueError:
            shown = path
        print(f"wrote   {shown}")

    def skip(self, reason: str) -> None:
        self.skipped.append(reason)
        print(f"skipped {reason}")


def find_source(folder: Path, name: str) -> Path | None:
    for extension in SOURCE_EXTENSIONS:
        candidate = folder / f"{name}{extension}"
        if candidate.exists():
            return candidate
    return None


def list_sources(folder: Path) -> list[Path]:
    if not folder.is_dir():
        return []
    return sorted(p for p in folder.iterdir() if p.suffix.lower() in SOURCE_EXTENSIONS)


def background_mask(rgb: np.ndarray) -> np.ndarray:
    """True for background and shadow pixels reachable from the image edges."""
    height, width, _ = rgb.shape
    channels = rgb.astype(int)
    darkest = channels.min(axis=2)
    brightest = channels.max(axis=2)
    near_white = (255 - darkest) <= BACKGROUND_TOLERANCE
    shadow = ((brightest - darkest) <= SHADOW_MAX_SATURATION) & (darkest >= SHADOW_MIN_BRIGHTNESS)
    passable = near_white | shadow

    seen = np.zeros((height, width), dtype=bool)
    queue = deque()
    edge_points = [(y, x) for x in range(width) for y in (0, height - 1)]
    edge_points += [(y, x) for y in range(height) for x in (0, width - 1)]
    for y, x in edge_points:
        if passable[y, x] and not seen[y, x]:
            seen[y, x] = True
            queue.append((y, x))
    while queue:
        y, x = queue.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < height and 0 <= nx < width and passable[ny, nx] and not seen[ny, nx]:
                seen[ny, nx] = True
                queue.append((ny, nx))
    return seen


def cut_out(path: Path, clear_enclosed_white: bool = False) -> Image.Image:
    """The drawing on a transparent background, cropped to the drawing.

    clear_enclosed_white also removes near-white areas the outline closes off (the hole of a necklace)."""
    image = Image.open(path).convert("RGB")
    rgb = np.asarray(image)
    background = background_mask(rgb)
    if clear_enclosed_white:
        background = background | ((255 - rgb.astype(int).min(axis=2)) <= BACKGROUND_TOLERANCE)
    alpha = Image.fromarray(np.where(background, 0, 255).astype("uint8"))
    # Shrink the edge by a pixel and soften it, so no white fringe is left.
    alpha = alpha.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
    rgba = image.copy()
    rgba.putalpha(alpha)
    return rgba.crop(rgba.getbbox())


def place_on_square(cut: Image.Image, canvas_side: int, floor_gap: int) -> Image.Image:
    """The cut-out bottom-centred on a transparent square."""
    canvas = Image.new("RGBA", (canvas_side, canvas_side), (0, 0, 0, 0))
    canvas.alpha_composite(cut, ((canvas_side - cut.width) // 2, canvas_side - cut.height - floor_gap))
    return canvas


def save_cutout_sizes(
    canvas: Image.Image, output_dir: Path, name: str, report: Report, sizes: tuple[int, ...] = CUTOUT_SIZES
) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    for size in sizes:
        suffix = "" if size == sizes[0] else f"@{size}"
        target = output_dir / f"{name}{suffix}.webp"
        canvas.resize((size, size), Image.LANCZOS).save(target, "WEBP", quality=CUTOUT_QUALITY, method=6)
        report.wrote(target)


def process_companion(theme: str, src_root: Path, out_root: Path, report: Report) -> None:
    source_dir = src_root / theme
    sources = {pose: find_source(source_dir, f"companion-{pose}") for pose in POSES}
    missing = [pose for pose, path in sources.items() if path is None]
    for pose in missing:
        report.skip(f"{theme}/companion-{pose} (no source file)")
    present = {pose: path for pose, path in sources.items() if path is not None}
    if not present:
        return
    if missing:
        print(f"note    {theme}: sizes are evened out over the {len(present)} poses present; "
              "run again when all five exist")

    poses = {pose: cut_out(path) for pose, path in present.items()}
    # Even out the sizes: scale every pose down to the shortest pose's height.
    pose_height = min(cut.height for cut in poses.values())
    scaled = {
        pose: cut.resize((round(cut.width * pose_height / cut.height), pose_height), Image.LANCZOS)
        for pose, cut in poses.items()
    }
    widest = max(cut.width for cut in scaled.values())
    canvas_side = round(max(pose_height, widest) * (1 + CANVAS_MARGIN))
    floor_gap = round(pose_height * FLOOR_MARGIN)
    for pose, cut in scaled.items():
        canvas = place_on_square(cut, canvas_side, floor_gap)
        save_cutout_sizes(canvas, out_root / theme, f"companion-{pose}", report)


def process_single_cutouts(folder_name: str, src_root: Path, out_root: Path, report: Report) -> None:
    """Every picture in the folder on its own square (chests, Boss castles, landmarks)."""
    sources = list_sources(src_root / folder_name)
    if not sources:
        report.skip(f"{folder_name}/ (no source files)")
        return
    for path in sources:
        cut = cut_out(path)
        canvas_side = round(max(cut.width, cut.height) * (1 + CANVAS_MARGIN))
        canvas = place_on_square(cut, canvas_side, round(cut.height * FLOOR_MARGIN))
        save_cutout_sizes(canvas, out_root / folder_name, path.stem, report)


def save_resized(path: Path, target: Path, width: int, report: Report) -> None:
    image = Image.open(path).convert("RGB")
    if image.width > width:
        image = image.resize((width, round(image.height * width / image.width)), Image.LANCZOS)
    target.parent.mkdir(parents=True, exist_ok=True)
    image.save(target, "WEBP", quality=SCENE_QUALITY, method=6)
    report.wrote(target)


def process_scenes(theme: str, src_root: Path, out_root: Path, report: Report) -> None:
    for name, width in SCENE_WIDTHS.items():
        path = find_source(src_root / theme, name)
        if path is None:
            report.skip(f"{theme}/{name} (no source file)")
            continue
        save_resized(path, out_root / theme / f"{name}.webp", width, report)


def process_icons(src_root: Path, out_root: Path, report: Report) -> None:
    """Every icon centred on its own square, 256px and 128px (room items, shop, wardrobe, dock)."""
    sources = list_sources(src_root / "icons")
    if not sources:
        report.skip("icons/ (no source files)")
        return
    for path in sources:
        cut = cut_out(path, clear_enclosed_white=path.stem in OPEN_SHAPE_ICONS)
        side = round(max(cut.width, cut.height) * (1 + 2 * ICON_MARGIN))
        canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
        canvas.alpha_composite(cut, ((side - cut.width) // 2, (side - cut.height) // 2))
        save_cutout_sizes(canvas, out_root / "icons", path.stem, report, ICON_SIZES)


def process_stories(src_root: Path, out_root: Path, report: Report) -> None:
    sources = list_sources(src_root / "stories")
    if not sources:
        report.skip("stories/ (no source files)")
        return
    for path in sources:
        save_resized(path, out_root / "stories" / f"{path.stem}.webp", STORY_WIDTH, report)


def run(only: list[str], src_root: Path, out_root: Path) -> Report:
    report = Report()
    groups = only or THEMES + ["common", "landmarks", "stories", "icons"]
    unknown = [group for group in groups if group not in THEMES + ["common", "landmarks", "stories", "icons"]]
    if unknown:
        sys.exit(f"Unknown group(s): {', '.join(unknown)}")
    if not src_root.is_dir():
        sys.exit(f"No art sources folder: {src_root}")

    for group in groups:
        if group in THEMES:
            process_companion(group, src_root, out_root, report)
            process_scenes(group, src_root, out_root, report)
        elif group == "stories":
            process_stories(src_root, out_root, report)
        elif group == "icons":
            process_icons(src_root, out_root, report)
        else:
            process_single_cutouts(group, src_root, out_root, report)

    print(f"\n{len(report.written)} file(s) written, {len(report.skipped)} skipped.")
    return report


def main() -> None:
    parser = argparse.ArgumentParser(description="Make the app's WebP art from art-src/.")
    parser.add_argument("only", nargs="*", help="theme ids, common, landmarks, stories or icons (default: all)")
    parser.add_argument("--src", type=Path, default=ROOT / "art-src", help="sources folder (default: art-src)")
    parser.add_argument("--out", type=Path, default=ROOT / "public" / "art", help="output folder (default: public/art)")
    args = parser.parse_args()
    run(args.only, args.src.resolve(), args.out.resolve())


if __name__ == "__main__":
    main()
