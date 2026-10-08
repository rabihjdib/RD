"""Generates public/brand/grunge.png: a transparent white speckle and scratch texture
laid over the charcoal areas to get the distressed print look of the campaign poster.

Usage: python3 scripts/make_textures.py
"""
import os

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

W, H = 1080, 1920
rng = np.random.default_rng(11)
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'brand', 'grunge.png')

# blotchy low-frequency mask so the speckle clumps like dry ink
low = Image.fromarray((rng.random((H // 40, W // 40)) * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC)
low = np.asarray(low.filter(ImageFilter.GaussianBlur(30)), dtype=float) / 255
speck = rng.random((H, W))
alpha = np.where(speck > 0.985 - 0.03 * low, 255 * (0.35 + 0.65 * low), 0)

img = Image.fromarray(alpha.astype(np.uint8))
draw = ImageDraw.Draw(img)
for _ in range(140):
	x, y = rng.random() * W, rng.random() * H
	length = 40 + rng.random() * 260
	angle = np.deg2rad(-20 + rng.random() * 40)
	draw.line([(x, y), (x + np.cos(angle) * length, y + np.sin(angle) * length)], fill=int(40 + rng.random() * 90), width=1 + int(rng.random() * 2))
img = img.filter(ImageFilter.GaussianBlur(0.6))

rgba = Image.new('RGBA', (W, H), (255, 255, 255, 0))
rgba.putalpha(img)
rgba.save(OUT, optimize=True)
print('wrote', OUT)
