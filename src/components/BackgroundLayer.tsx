"use client";

import { useBackground } from "@/lib/useBackground";

// 全屏背景层 + 蒙层 + 内容
// 必须在 layout.tsx 里放在 <body> 最前面
export function BackgroundLayer() {
  const { bgUrl, settings } = useBackground();

  if (!bgUrl) return null;

  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none"
      aria-hidden
    >
      {/* 背景图 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${bgUrl})`,
          opacity: settings.opacity,
          filter: settings.blur > 0 ? `blur(${settings.blur}px)` : undefined,
          transform: settings.blur > 0 ? "scale(1.05)" : undefined, // 模糊时轻微放大避免边缘白边
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