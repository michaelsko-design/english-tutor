"""Turn AI-generated companion poses into transparent WebP files for the app.

Kept for the old command; scripts/process_art.py now does this and every other kind of art.
Reads   art-src/<theme>/companion-<pose>.jpg  (poses drawn on a plain white background)
Writes  public/art/<theme>/companion-<pose>.webp      (512 x 512)
        public/art/<theme>/companion-<pose>@256.webp  (256 x 256)

Usage:  python scripts/cutout_companion.py [theme]      (default theme: cozy-studio)
Needs:  Pillow and numpy  (pip install pillow numpy)
"""
import sys

from process_art import POSES, ROOT, Report, find_source, process_companion

if __name__ == "__main__":
    theme = sys.argv[1] if len(sys.argv) > 1 else "cozy-studio"
    source_dir = ROOT / "art-src" / theme
    missing = [pose for pose in POSES if find_source(source_dir, f"companion-{pose}") is None]
    if missing:
        sys.exit(f"Missing source poses in {source_dir}: {', '.join(missing)}")
    report = Report()
    process_companion(theme, ROOT / "art-src", ROOT / "public" / "art", report)
    print(f"\n{len(report.written)} file(s) written, {len(report.skipped)} skipped.")
