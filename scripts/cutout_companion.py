"""Turn AI-generated companion poses into transparent WebP files for the app.

Reads   art-src/<theme>/companion-<pose>.jpg  (poses drawn on a plain white background)
Writes  public/art/<theme>/companion-<pose>.webp      (512 x 512)
        public/art/<theme>/companion-<pose>@256.webp  (256 x 256)

The thick dark outline closes the character, so a flood fill from the image edges
removes the white background. The soft ground shadow is removed too; the app draws
its own shadow so the companion can bob and jump. Every pose is scaled to the same
height and placed bottom-centred on the same square canvas, so poses swap in place.

Usage:  python scripts/cutout_companion.py [theme]      (default theme: cozy-studio)
Needs:  Pillow and numpy  (pip install pillow numpy)
"""
import sys
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
POSES = ["idle", "cheer", "think", "oops", "wave"]
OUTPUT_SIZES = (512, 256)

BACKGROUND_TOLERANCE = 22  # how far from pure white a background pixel may be
SHADOW_MAX_SATURATION = 40  # the ground shadow is a low-saturation grey-mauve
SHADOW_MIN_BRIGHTNESS = 150
CANVAS_MARGIN = 0.04  # free space around the tallest pose, as a share of its height
FLOOR_MARGIN = 0.02  # gap under the feet, as a share of the pose height


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


def cut_out(path: Path) -> Image.Image:
    """The pose on a transparent background, cropped to the character."""
    image = Image.open(path).convert("RGB")
    background = background_mask(np.asarray(image))
    alpha = Image.fromarray(np.where(background, 0, 255).astype("uint8"))
    # Shrink the edge by a pixel and soften it, so no white fringe is left.
    alpha = alpha.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
    rgba = image.copy()
    rgba.putalpha(alpha)
    return rgba.crop(rgba.getbbox())


def main(theme: str) -> None:
    source_dir = ROOT / "art-src" / theme
    output_dir = ROOT / "public" / "art" / theme
    output_dir.mkdir(parents=True, exist_ok=True)

    missing = [pose for pose in POSES if not (source_dir / f"companion-{pose}.jpg").exists()]
    if missing:
        sys.exit(f"Missing source poses in {source_dir}: {', '.join(missing)}")

    poses = {pose: cut_out(source_dir / f"companion-{pose}.jpg") for pose in POSES}

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
        canvas = Image.new("RGBA", (canvas_side, canvas_side), (0, 0, 0, 0))
        canvas.alpha_composite(cut, ((canvas_side - cut.width) // 2, canvas_side - cut.height - floor_gap))
        for size in OUTPUT_SIZES:
            suffix = "" if size == OUTPUT_SIZES[0] else f"@{size}"
            target = output_dir / f"companion-{pose}{suffix}.webp"
            canvas.resize((size, size), Image.LANCZOS).save(target, "WEBP", quality=85, method=6)
            print(f"wrote {target.relative_to(ROOT)}")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "cozy-studio")
