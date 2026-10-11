"""Pack public/icon-512.png (from render_icons.ts) into public/favicon.ico and remove it."""

from pathlib import Path

from PIL import Image

src = Path("public/icon-512.png")
Image.open(src).convert("RGBA").save("public/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
src.unlink()
print("wrote public/favicon.ico")
