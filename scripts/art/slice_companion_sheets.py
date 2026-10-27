"""Cut each mascot's five-pose sheet into one picture per pose.

Reads   art-src/companion-sheets/<id>.png          (five poses in one row: idle, cheer, think, oops, wave;
                                                     drawn by scripts/art/renderThemeArt.mjs)
Writes  art-src/companions/<id>/companion-<pose>.png (one pose on white, ready for scripts/process_art.py companions)

Each pose is one connected drawing, so the poses are told apart as the five largest connected
shapes, ordered left to right; a tail or skateboard that reaches under a neighbour stays with its
own pose. Small loose marks (a sweat drop, a motion line) go to the nearest pose. Each pose is
cropped with the other poses painted white. When the sheet has fewer than five shapes (two poses
touch), the script warns and skips it, so that sheet can be drawn again.

Usage:  python scripts/art/slice_companion_sheets.py [id ...] [--src DIR] [--out DIR]
Needs:  Python 3.10+, Pillow, numpy and scipy
"""
import argparse
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent.parent
POSES = ["idle", "cheer", "think", "oops", "wave"]
WHITE_TOLERANCE = 40  # a pixel this far from pure white counts as drawing
JOIN_RADIUS = 3  # pixels: closes hairline breaks in an outline so a pose stays one shape
PADDING_SHARE = 0.04  # white kept around each pose, as a share of the sheet height
WHITE = 255


def pose_labels(pixels: np.ndarray, sheet_name: str) -> np.ndarray | None:
    """Per pixel, the pose (1-5, left to right) its drawing belongs to; 0 for white. None if poses touch."""
    drawing = (WHITE - pixels.min(axis=2)) > WHITE_TOLERANCE
    joined = ndimage.binary_dilation(drawing, iterations=JOIN_RADIUS)
    labels, count = ndimage.label(joined)
    if count < len(POSES):
        print(f"warning {sheet_name}: only {count} separate shape(s), the poses touch; draw this sheet again")
        return None
    sizes = ndimage.sum(joined, labels, range(1, count + 1))
    largest = np.argsort(sizes)[::-1][: len(POSES)] + 1
    centres = ndimage.center_of_mass(joined, labels, largest)
    left_to_right = [label for _, label in sorted(zip((c[1] for c in centres), largest))]
    poses = np.zeros_like(labels)
    for pose_number, label in enumerate(left_to_right, start=1):
        poses[labels == label] = pose_number
    # Loose marks join the nearest pose.
    _, (near_y, near_x) = ndimage.distance_transform_edt(poses == 0, return_indices=True)
    return np.where(drawing, poses[near_y, near_x], 0)


def slice_sheet(sheet_path: Path, out_dir: Path) -> None:
    pixels = np.asarray(Image.open(sheet_path).convert("RGB"))
    poses = pose_labels(pixels, sheet_path.name)
    if poses is None:
        return
    padding = round(pixels.shape[0] * PADDING_SHARE)
    out_dir.mkdir(parents=True, exist_ok=True)
    for pose_number, pose in enumerate(POSES, start=1):
        rows, cols = np.nonzero(poses == pose_number)
        y0, y1, x0, x1 = rows.min(), rows.max() + 1, cols.min(), cols.max() + 1
        # Paint the neighbours' drawing white, so only this pose is left in its box.
        crop = np.where((poses[y0:y1, x0:x1] > 0)[..., None] & (poses[y0:y1, x0:x1] != pose_number)[..., None],
                        WHITE, pixels[y0:y1, x0:x1]).astype(np.uint8)
        padded = np.pad(crop, ((padding, padding), (padding, padding), (0, 0)), constant_values=WHITE)
        target = out_dir / f"companion-{pose}.png"
        Image.fromarray(padded).save(target)
        print(f"wrote   {target.relative_to(ROOT) if target.is_relative_to(ROOT) else target}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Cut the mascot sheets into single poses.")
    parser.add_argument("ids", nargs="*", help="mascot ids (default: every sheet found)")
    parser.add_argument("--src", type=Path, default=ROOT / "art-src" / "companion-sheets")
    parser.add_argument("--out", type=Path, default=ROOT / "art-src" / "companions")
    args = parser.parse_args()
    sheets = [args.src / f"{i}.png" for i in args.ids] if args.ids else sorted(args.src.glob("*.png"))
    if not sheets:
        print(f"no sheets in {args.src}")
    for sheet_path in sheets:
        if not sheet_path.exists():
            print(f"skip    {sheet_path.name} (not drawn yet)")
            continue
        slice_sheet(sheet_path, args.out / sheet_path.stem)


if __name__ == "__main__":
    main()
