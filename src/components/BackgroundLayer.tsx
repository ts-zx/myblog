"use client";

import { useBackground } from "@/lib/useBackground";

// 全屏背景层 + 蒙层 + 内容
// 必须在 layout.tsx 里放在 <body> 最前面
export function BackgroundLayer() {
  const { bgUrl, settings } = useBackground();

  if (!bgUrl) return null;

  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
      aria-hidden
    >
      {/* 背景图 - 铺满整个屏幕 */}
      <div
        className="absolute inset-0 bg-no-repeat"
        style={{
          backgroundImage: `url(${bgUrl})`,
          backgroundPosition: `${settings.position.x}% ${settings.position.y}%`,
          backgroundSize: `${settings.zoom * 100}%`,
          opacity: settings.opacity,
          filter: settings.blur > 0 ? `blur(${settings.blur}px)` : undefined,
        }}
      />
      {/* 蒙层 - 保证文字可读 */}
      <div
        className="absolute inset-0 bg-white dark:bg-gray-950"
        style={{ opacity: settings.overlayOpacity }}
      />
    </div>
  );
}