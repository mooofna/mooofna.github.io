"""Draw the site icon: "MH" in Schibsted Grotesk Bold, white on ETH blue.

The letters are glyph outlines taken from the site's own font, so the icon does not
depend on fonts installed on the visitor's machine. Writes public/favicon.svg.
PNG and ICO versions follow from scripts/render_icons.ts and scripts/make_ico.py (npm run icons).
Usage: uv run --with fonttools --with brotli python scripts/make_icons.py
"""

from __future__ import annotations

from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

FONT = Path("node_modules/@fontsource-variable/schibsted-grotesk/files/schibsted-grotesk-latin-wght-normal.woff2")
OUT = Path("public/favicon.svg")
SIZE = 64
BLUE = "#215caf"
TEXT = "MH"
TRACKING = -0.02  # fraction of the em, like the site's headings
MARGIN = 7  # icon units on each side

font = instantiateVariableFont(TTFont(FONT), {"wght": 700})
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()
upm = font["head"].unitsPerEm

# Lay the glyphs out on one baseline, then measure the ink.
names = [cmap[ord(c)] for c in TEXT]
offsets, x = [], 0.0
for name in names:
    offsets.append(x)
    x += glyphs[name].width + TRACKING * upm
bounds = BoundsPen(glyphs)
for name, dx in zip(names, offsets):
    glyphs[name].draw(TransformPen(bounds, (1, 0, 0, 1, dx, 0)))
xmin, ymin, xmax, ymax = bounds.bounds

# Scale the ink to fit the tile and centre it; flip y for SVG.
scale = (SIZE - 2 * MARGIN) / (xmax - xmin)
height = (ymax - ymin) * scale
tx = MARGIN - xmin * scale
ty = (SIZE + height) / 2 + ymin * scale
pen = SVGPathPen(glyphs, ntos=lambda v: f"{v:.2f}".rstrip("0").rstrip("."))
for name, dx in zip(names, offsets):
    glyphs[name].draw(TransformPen(pen, (scale, 0, 0, -scale, tx + dx * scale, ty)))

OUT.write_text(
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {SIZE} {SIZE}">'
    f'<rect width="{SIZE}" height="{SIZE}" rx="12" fill="{BLUE}"/>'
    f'<path fill="#ffffff" d="{pen.getCommands()}"/></svg>\n'
)
print(f"wrote {OUT} ({OUT.stat().st_size} bytes)")
