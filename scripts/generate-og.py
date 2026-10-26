#!/usr/bin/env python3
"""生成 OG 图 (1200x630) 和 favicon (多尺寸 PNG)"""
from PIL import Image, ImageDraw, ImageFont
import os

OUT = os.path.join(os.path.dirname(__file__), "..", "public")
os.makedirs(OUT, exist_ok=True)

CJK_BOLD = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"
CJK_REG = "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc"

SITE_NAME = "天寿的小站"
SITE_DESC = "记录、思考、分享"
SITE_URL = "tszx.zh.kg"

# ---------- OG 图 1200x630 ----------
W, H = 1200, 630

def make_og(path):
    img = Image.new("RGB", (W, H), (17, 24, 39))
    d = ImageDraw.Draw(img)

    # 渐变背景 (深蓝 -> 深紫)
    for y in range(H):
        r = int(17 + (49 - 17) * y / H)
        g = int(24 + (46 - 24) * y / H)
        b = int(39 + (129 - 39) * y / H)
        d.line([(0, y), (W, y)], fill=(r, g, b))

    # 装饰光晕
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    od.ellipse([-200, -260, 520, 460], fill=(99, 102, 241, 55))
    od.ellipse([760, 250, 1420, 910], fill=(168, 85, 247, 45))
    od.ellipse([420, -320, 1080, 340], fill=(236, 72, 153, 30))
    img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    d = ImageDraw.Draw(img)

    # 顶部小圆点 + 站名
    f_small = ImageFont.truetype(CJK_BOLD, 34)
    f_desc = ImageFont.truetype(CJK_REG, 44)
    f_big = ImageFont.truetype(CJK_BOLD, 92)
    f_url = ImageFont.truetype(CJK_REG, 30)

    d.ellipse([100, 92, 122, 114], fill=(129, 140, 248))
    d.text((144, 80), SITE_NAME, font=f_small, fill=(243, 244, 246))

    # 主标题
    d.text((100, 210), SITE_NAME, font=f_big, fill=(255, 255, 255))

    # 副标题
    d.text((100, 340), SITE_DESC, font=f_desc, fill=(199, 210, 254))

    # 分隔线
    d.rectangle([100, 430, 100 + 120, 430 + 5], fill=(129, 140, 248))

    # URL
    d.text((100, 490), SITE_URL, font=f_url, fill=(156, 163, 175))

    # 右下角小标签
    label = "Next.js + MDX"
    tw = d.textlength(label, font=f_url)
    bx1, bx2 = 1100 - tw - 36, 1100
    d.rounded_rectangle([bx1, 492, bx2, 546], radius=27,
                        fill=(31, 41, 55), outline=(75, 85, 99), width=2)
    d.text((bx1 + 18, 506), label, font=f_url, fill=(203, 213, 225))

    img.save(path, "PNG", optimize=True)
    print(f"✓ {path}")

# ---------- favicon ----------
def make_favicon_svg(path):
    svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#a855f7"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="url(#g)"/>
  <text x="32" y="45" font-family="system-ui,-apple-system,Segoe UI,Roboto,sans-serif"
        font-size="36" font-weight="700" fill="#ffffff" text-anchor="middle">TS</text>
</svg>
'''
    with open(path, "w", encoding="utf-8") as f:
        f.write(svg)
    print(f"✓ {path}")

def make_favicon_ico(path):
    """多尺寸 ICO"""
    sizes = [16, 32, 48, 64, 128, 256]
    imgs = []
    for s in sizes:
        im = Image.new("RGBA", (s, s), (0, 0, 0, 0))
        dr = ImageDraw.Draw(im)
        # 圆角渐变底
        for y in range(s):
            t = y / max(s - 1, 1)
            r = int(99 + (168 - 99) * t)
            g = int(102 + (85 - 102) * t)
            b = int(241 + (247 - 241) * t)
            dr.line([(0, y), (s, y)], fill=(r, g, b, 255))
        # 圆角遮罩
        mask = Image.new("L", (s, s), 0)
        ImageDraw.Draw(mask).rounded_rectangle([0, 0, s - 1, s - 1],
                                              radius=max(2, s // 4), fill=255)
        im.putalpha(mask)
        # "TS"
        try:
            f = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
                                   max(8, int(s * 0.52)))
        except Exception:
            f = ImageFont.load_default()
        tw = dr.textlength("TS", font=f)
        dr.text(((s - tw) / 2, s * 0.22), "TS", font=f, fill=(255, 255, 255, 255))
        imgs.append(im)
    imgs[-1].save(path, format="ICO", sizes=[(s, s) for s in sizes])
    print(f"✓ {path}")

def make_apple_touch(path):
    s = 180
    im = Image.new("RGB", (s, s), (17, 24, 39))
    d = ImageDraw.Draw(im)
    for y in range(s):
        t = y / (s - 1)
        d.line([(0, y), (s, y)], fill=(int(99 + 69 * t), int(102 - 17 * t), int(241 + 6 * t)))
    try:
        f = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 92)
    except Exception:
        f = ImageFont.load_default()
    tw = d.textlength("TS", font=f)
    d.text(((s - tw) / 2, s * 0.24), "TS", font=f, fill=(255, 255, 255))
    im.save(path, "PNG", optimize=True)
    print(f"✓ {path}")


if __name__ == "__main__":
    make_og(os.path.join(OUT, "og-default.png"))
    make_favicon_svg(os.path.join(OUT, "favicon.svg"))
    make_favicon_ico(os.path.join(OUT, "favicon.ico"))
    make_apple_touch(os.path.join(OUT, "apple-touch-icon.png"))
    # og 图的方形版本
    make_og(os.path.join(OUT, "og-square.png"))
