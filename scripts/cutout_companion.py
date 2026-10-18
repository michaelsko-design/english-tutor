"""Turn AI-generated companion poses into transparent WebP files for the app.

Kept for the old command; scripts/process_art.py now does this and every other kind of art.
Reads   art-src/<theme>/companion-<pose>.jpg  (poses drawn on a plain white background)
Writes  public/art/<theme>/companion-<pose>.webp      (512 x 512)
        public/art/<theme>/companion-<pose>@256.webp  (256 x 256)

Usage:  python scripts/cutout_companion.py [theme]      (default theme: cozy-studio)
Needs:  Pillow and numpy  (pip install pillow numpy)
"""
import sys

from process_art import ROOT, Report, process_companion

if __name__ == "__main__":
    theme = sys.argv[1] if len(sys.argv) > 1 else "cozy-studio"
    report = Report()
    process_companion(theme, ROOT / "art-src", ROOT / "public" / "art", report)
    print(f"\n{len(report.written)} file(s) written, {len(report.skipped)} skipped.")
