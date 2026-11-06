"""Draws the owner mini-app icons into public/: a teal tile with an ascending bar chart.
Run: python scripts/owner/make_owner_icons.py   (needs Pillow)"""
from pathlib import Path
from PIL import Image, ImageDraw

PUBLIC = Path(__file__).resolve().parents[2] / "public"
SUPER = 1024
TEAL = (15, 118, 110)       # #0f766e, distinct from the learner app's purple
WHITE = (255, 255, 255)
AMBER = (251, 191, 36)      # the tallest bar: the "growth" accent


def draw(size_fraction: float, rounded: bool) -> Image.Image:
    img = Image.new("RGBA", (SUPER, SUPER), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    radius = int(SUPER * 0.22) if rounded else 0
    d.rounded_rectangle((0, 0, SUPER - 1, SUPER - 1), radius=radius, fill=TEAL)
    span = SUPER * size_fraction            # glyph box (maskable icons keep it inside the safe zone)
    left = (SUPER - span) / 2
    base = (SUPER + span) / 2
    bar_w = span * 0.24
    gap = span * 0.14
    heights = (0.42, 0.68, 1.0)
    colors = (WHITE, WHITE, AMBER)
    for i, (h, c) in enumerate(zip(heights, colors)):
        x0 = left + i * (bar_w + gap) + (span - 3 * bar_w - 2 * gap) / 2
        top = base - span * h
        d.rounded_rectangle((x0, top, x0 + bar_w, base), radius=int(bar_w * 0.22), fill=c)
    # baseline
    d.rounded_rectangle((left, base + span * 0.05, left + span, base + span * 0.09), radius=int(span * 0.02), fill=WHITE)
    return img


def save(name: str, size: int, fraction: float, rounded: bool) -> None:
    draw(fraction, rounded).resize((size, size), Image.LANCZOS).save(PUBLIC / name, optimize=True)


save("owner-icon-192.png", 192, 0.56, True)
save("owner-icon-512.png", 512, 0.56, True)
save("owner-icon-maskable-192.png", 192, 0.46, False)   # full-bleed, glyph inside the 80% safe zone
save("owner-icon-maskable-512.png", 512, 0.46, False)
save("owner-apple-touch-icon.png", 180, 0.56, False)    # iOS rounds the corners itself
save("owner-favicon-32.png", 32, 0.60, True)
print("ok")
