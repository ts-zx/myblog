#!/usr/bin/env python3
"""
生成 favicon 全套资源 - 墨底琥珀星
用法: python3 scripts/generate-favicon.py [grad|solid|solid-light]

grad        = 径向渐变星（中心亮 → 边缘深，宝石感）★ 默认
solid       = 纯色深琥珀 #FBBF24
solid-light = 纯色浅琥珀 #FCD34D
"""
from PIL import Image, ImageDraw
import numpy as np
import os, math, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
PUB = os.path.join(ROOT, "public")
os.makedirs(PUB, exist_ok=True)

S = 8

def hx(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))

def lin_grad(size, c1, c2, angle=45):
    rad = math.radians(angle)
    dx, dy = math.cos(rad), math.sin(rad)
    xs = np.arange(size, dtype=np.float64)
    ys = np.arange(size, dtype=np.float64)
    proj = (xs[:, None] * dx + ys[None, :] * dy)
    lo, hi = proj.min(), proj.max()
    t = ((proj - lo) / ((hi - lo) or 1))[..., None]
    a = np.array(c1, np.float64)
    b = np.array(c2, np.float64)
    return (a + (b - a) * t).astype(np.uint8)

def radial_multi(size, stops):
    ys, xs = np.mgrid[0:size, 0:size]
    d = np.sqrt((xs - size / 2) ** 2 + (ys - size / 2) ** 2) / (size / 2)
    t = np.clip(d, 0, 1)
    pos = np.array([s[0] for s in stops], np.float64)
    cols = np.array([hx(s[1]) for s in stops], np.float64)
    out = np.zeros((size, size, 3), np.float64)
    for ch in range(3):
        out[..., ch] = np.interp(t, pos, cols[:, ch])
    return out.astype(np.uint8)

def glow_layer(size, color, strength, radius=0.62):
    ys, xs = np.mgrid[0:size, 0:size]
    d = np.sqrt((xs - size / 2) ** 2 + (ys - size / 2) ** 2) / (size * radius)
    fall = np.clip(1 - d, 0, 1) ** 2.2
    return fall[..., None] * np.array(color, np.float64)[None, None, :] * strength

def star_pts(cx, cy, ro, ri, n=4, rot=-90):
    p = []
    for i in range(n * 2):
        r = ro if i % 2 == 0 else ri
        ang = math.radians(rot + i * 180 / n)
        p.append((cx + r * math.cos(ang), cy + r * math.sin(ang)))
    return p

# 配色方案
VARIANTS = {
    "grad":        dict(stops=[(0.0, "#FEF3C7"), (0.45, "#FCD34D"), (1.0, "#F59E0B")], solid=None),
    "solid":       dict(stops=None, solid="#FBBF24"),
    "solid-light": dict(stops=None, solid="#FCD34D"),
}

BG1, BG2 = "#141B2D", "#0A0E18"
STAR_RO, STAR_RI = 0.315, 0.108


def build(size, v):
    c = VARIANTS[v]
    n = size * S
    bg = lin_grad(n, hx(BG1), hx(BG2)).astype(np.float64)
    bg = np.clip(bg + glow_layer(n, hx("#FBBF24"), 0.28), 0, 255).astype(np.uint8)
    img = Image.fromarray(bg, "RGB").convert("RGBA")

    mask = Image.new("L", (n, n), 0)
    ImageDraw.Draw(mask).polygon(star_pts(n / 2, n / 2, n * STAR_RO, n * STAR_RI), fill=255)

    if c["stops"] is None:
        layer = Image.new("RGBA", (n, n), hx(c["solid"]) + (255,))
    else:
        g = radial_multi(n, c["stops"])
        layer = Image.fromarray(g, "RGB").convert("RGBA")

    img.paste(layer, (0, 0), mask)

    rm = Image.new("L", (n, n), 0)
    ImageDraw.Draw(rm).rounded_rectangle([0, 0, n - 1, n - 1], radius=int(n * 0.22), fill=255)
    img.putalpha(rm)
    return img.convert("RGB").resize((size, size), Image.LANCZOS)


def svg_of(v):
    c = VARIANTS[v]
    pts = star_pts(32, 32, 64 * STAR_RO, 64 * STAR_RI)
    path = "M" + " L".join(f"{x:.1f} {y:.1f}" for x, y in pts) + " Z"

    if c["stops"] is None:
        star_def = ""
        star_fill = c["solid"]
    else:
        stops = "\n".join(
            f'    <stop offset="{int(p*100)}%" stop-color="{col}"/>' for p, col in c["stops"]
        )
        star_def = f'''
  <radialGradient id="star" cx="50%" cy="50%" r="50%">
{stops}
  </radialGradient>'''
        star_fill = "url(#star)"

    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="{BG1}"/>
      <stop offset="100%" stop-color="{BG2}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FBBF24" stop-opacity="0.28"/>
      <stop offset="55%" stop-color="#FBBF24" stop-opacity="0.062"/>
      <stop offset="100%" stop-color="#FBBF24" stop-opacity="0"/>
    </radialGradient>{star_def}
  </defs>
  <rect width="64" height="64" rx="14.1" fill="url(#bg)"/>
  <rect width="64" height="64" fill="url(#glow)"/>
  <path d="{path}" fill="{star_fill}"/>
</svg>
'''


if __name__ == "__main__":
    pick = (sys.argv[1] if len(sys.argv) > 1 else "grad").lower()
    if pick not in VARIANTS:
        print(f"❌ 选项必须是 grad/solid/solid-light，收到 {pick}")
        sys.exit(1)

    print(f"🎨 使用方案 {pick}")
    fn = lambda sz: build(sz, pick)

    for sz, name in [
        (16, "favicon-16x16.png"),
        (32, "favicon-32x32.png"),
        (48, "favicon-48x48.png"),
        (64, "favicon-64x64.png"),
        (180, "apple-touch-icon.png"),
        (192, "android-chrome-192x192.png"),
        (512, "android-chrome-512x512.png"),
    ]:
        fn(sz).save(os.path.join(PUB, name), "PNG", optimize=True)
        print(f"  ✓ {name}")

    fn(256).save(os.path.join(PUB, "favicon.ico"), format="ICO",
                 sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
    print("  ✓ favicon.ico (6 尺寸)")

    with open(os.path.join(PUB, "favicon.svg"), "w", encoding="utf-8") as f:
        f.write(svg_of(pick))
    print("  ✓ favicon.svg")

    print(f"\n✅ 完成 · 方案 {pick}")
