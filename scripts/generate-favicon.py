#!/usr/bin/env python3
"""
生成 favicon 全套资源 - A4 墨底琥珀（优化版）
用法: python3 scripts/generate-favicon.py [v1|v2|v3]

v1 = 光晕层次（推荐）深墨底 + 琥珀星 + 径向光晕 + 亮芯
v2 = 细环徽章  深墨底 + 琥珀星 + 细圆环
v3 = 纯墨单星  深墨底 + 琥珀星（极简）
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

def radial_glow(size, center, radius, color, strength):
    ys, xs = np.mgrid[0:size, 0:size]
    d = np.sqrt((xs - center[0]) ** 2 + (ys - center[1]) ** 2) / radius
    falloff = np.clip(1 - d, 0, 1) ** 2.2
    return falloff[..., None] * np.array(color, np.float64)[None, None, :] * strength

def star_pts(cx, cy, ro, ri, n=4, rot=-90):
    p = []
    for i in range(n * 2):
        r = ro if i % 2 == 0 else ri
        ang = math.radians(rot + i * 180 / n)
        p.append((cx + r * math.cos(ang), cy + r * math.sin(ang)))
    return p

VARIANTS = {
    "v1": dict(bg1="#141B2D", bg2="#0A0E18", star="#FCD34D", core="#FEF3C7",
               glow=0.30, glow_r=0.62, ro=0.315, ri=0.108, core_ro=0.16, core_ri=0.055, ring=0),
    "v2": dict(bg1="#141B2D", bg2="#0A0E18", star="#FBBF24", core=None,
               glow=0.16, glow_r=0.70, ro=0.235, ri=0.082, core_ro=0, core_ri=0, ring=0.028),
    "v3": dict(bg1="#111827", bg2="#0B1220", star="#FBBF24", core=None,
               glow=0.0, glow_r=0.6, ro=0.30, ri=0.103, core_ro=0, core_ri=0, ring=0),
}


def build(size, v):
    c = VARIANTS[v]
    n = size * S
    bg = lin_grad(n, hx(c["bg1"]), hx(c["bg2"])).astype(np.float64)
    if c["glow"] > 0:
        g = radial_glow(n, (n / 2, n / 2), n * c["glow_r"], hx("#FBBF24"), c["glow"])
        bg = np.clip(bg + g, 0, 255).astype(np.uint8)
    img = Image.fromarray(bg, "RGB").convert("RGBA")

    mask = Image.new("L", (n, n), 0)
    dr = ImageDraw.Draw(mask)
    if c["ring"]:
        dr.ellipse([n * 0.16, n * 0.16, n * 0.84, n * 0.84],
                   outline=255, width=max(1, int(n * c["ring"])))
    dr.polygon(star_pts(n / 2, n / 2, n * c["ro"], n * c["ri"]), fill=255)
    img.paste(hx(c["star"]) + (255,), (0, 0), mask)

    if c["core"]:
        m2 = Image.new("L", (n, n), 0)
        ImageDraw.Draw(m2).polygon(star_pts(n / 2, n / 2, n * c["core_ro"], n * c["core_ri"]), fill=255)
        img.paste(hx(c["core"]) + (255,), (0, 0), m2)

    rm = Image.new("L", (n, n), 0)
    ImageDraw.Draw(rm).rounded_rectangle([0, 0, n - 1, n - 1], radius=int(n * 0.22), fill=255)
    img.putalpha(rm)
    return img.convert("RGB").resize((size, size), Image.LANCZOS)


def svg_of(v):
    c = VARIANTS[v]
    pts = star_pts(32, 32, 64 * c["ro"], 64 * c["ri"])
    path = "M" + " L".join(f"{x:.1f} {y:.1f}" for x, y in pts) + " Z"

    core = ""
    if c["core"]:
        cpts = star_pts(32, 32, 64 * c["core_ro"], 64 * c["core_ri"])
        core = f'\n  <path d="M' + " L".join(f"{x:.1f} {y:.1f}" for x, y in cpts) + ' Z" fill="' + c["core"] + '"/>'

    ring = ""
    if c["ring"]:
        w = round(64 * c["ring"], 1)
        ring = f'\n  <circle cx="32" cy="32" r="21.8" fill="none" stroke="{c["star"]}" stroke-width="{w}"/>'

    glow = ""
    if c["glow"] > 0:
        o1 = round(c["glow"], 3)
        o2 = round(c["glow"] * 0.22, 3)
        glow = f'''
  <radialGradient id="glow" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#FBBF24" stop-opacity="{o1}"/>
    <stop offset="55%" stop-color="#FBBF24" stop-opacity="{o2}"/>
    <stop offset="100%" stop-color="#FBBF24" stop-opacity="0"/>
  </radialGradient>'''

    glow_rect = ''
    if c["glow"] > 0:
        glow_rect = '\n  <rect width="64" height="64" fill="url(#glow)"/>'

    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="{c['bg1']}"/>
      <stop offset="100%" stop-color="{c['bg2']}"/>
    </linearGradient>{glow}
  </defs>
  <rect width="64" height="64" rx="14.1" fill="url(#bg)"/>{glow_rect}{ring}
  <path d="{path}" fill="{c['star']}"/>{core}
</svg>
'''


if __name__ == "__main__":
    pick = (sys.argv[1] if len(sys.argv) > 1 else "v1").lower()
    if pick not in VARIANTS:
        print(f"❌ 选项必须是 v1/v2/v3，收到 {pick}")
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
