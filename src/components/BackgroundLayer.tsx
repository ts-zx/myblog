"use client";

import { useBackground } from "@/lib/useBackground";

// 全屏背景层 + 蒙层 + 内容
// 必须在 layout.tsx 里放在 <body> 最前面
// 使用 <img> + object-fit: cover 自适应任何设备长宽比
export function BackgroundLayer() {
  const { bgUrl, settings } = useBackground();

  if (!bgUrl) return null;

  const { position, zoom, opacity, blur, overlayOpacity } = settings;
  const focalPoint = `${position.x}% ${position.y}%`;

  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
      aria-hidden
    >
      {/* 背景图 - 用 img + object-fit cover，自动适配任何长宽比 */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={bgUrl}
        alt=""
        className="absolute inset-0 w-full h-full select-none"
        draggable={false}
        style={{
          objectFit: "cover",
          objectPosition: focalPoint,
          // 缩放以焦点为中心，避免图片偏移
          transform: `scale(${zoom})`,
          transformOrigin: focalPoint,
          opacity,
          filter: blur > 0 ? `blur(${blur}px)` : undefined,
        }}
      />
      {/* 蒙层 - 保证文字可读 */}
      <div
        className="absolute inset-0 bg-white dark:bg-gray-950"
        style={{ opacity: overlayOpacity }}
      />
    </div>
  );
}