"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { Image as ImageIcon, X, Upload, Trash2, Info, Move, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { useBackground } from "@/lib/useBackground";

export function BackgroundSettings({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { bgUrl, settings, setImage, updateSettings, reset } = useBackground();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showRefreshTip, setShowRefreshTip] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFile = useCallback(
    async (file: File | null | undefined) => {
      if (!file) return;
      setError(null);
      setBusy(true);
      try {
        await setImage(file);
        setShowRefreshTip(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : "上传失败");
      }
      setBusy(false);
    },
    [setImage]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      handleFile(e.dataTransfer.files?.[0]);
    },
    [handleFile]
  );

  const handleReset = useCallback(async () => {
    if (!confirm("确定要清除背景吗？")) return;
    await reset();
    setShowRefreshTip(false);
  }, [reset]);

  if (!open) return null;

  const modal = (
    // 外层：fixed 全屏，移动端从顶部 8% 开始，PC 端居中
    <div
      className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 pt-[8vh] sm:pt-4 overflow-y-auto"
      onClick={onClose}
    >
      {/* 弹窗主体：固定最大高度，内部滚动 */}
      <div
        className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - sticky 钉在顶部 */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-900 rounded-t-xl">
          <ImageIcon className="w-5 h-5 text-indigo-500 flex-shrink-0" />
          <h2 className="flex-1 font-semibold text-gray-900 dark:text-gray-100">
            自定义背景
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭"
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body - 唯一可滚动区域 */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1 min-h-0">
          {/* 上传区 / 拖动定位区 */}
          <div
            onDragOver={(e) => {
              // 只有在没图片时才是文件拖拽
              if (!bgUrl) {
                e.preventDefault();
                setDragging(true);
              }
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              if (!bgUrl) onDrop(e);
            }}
            onClick={(e) => {
              // 有图时点击不触发上传（避免误触）
              if (!bgUrl) fileInputRef.current?.click();
            }}
            className={`relative border-2 border-dashed rounded-lg overflow-hidden transition-colors ${
              dragging
                ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30"
                : bgUrl
                ? "border-transparent"
                : "border-gray-200 dark:border-gray-700 hover:border-indigo-400 cursor-pointer"
            }`}
          >
            {bgUrl ? (
              <BackgroundPositionEditor
                bgUrl={bgUrl}
                position={settings.position}
                zoom={settings.zoom}
                onChange={(pos) => updateSettings({ position: pos })}
                onChangeZoom={(z) => updateSettings({ zoom: z })}
                onChangeImage={() => fileInputRef.current?.click()}
              />
            ) : (
              <div className="aspect-video flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                <Upload className="w-8 h-8 mb-2" />
                <p className="text-sm">
                  {busy ? "上传中..." : "点击或拖拽图片到此处"}
                </p>
                <p className="text-xs mt-1 text-gray-400">支持 jpg/png/webp，最大 5MB</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>

          {error && (
            <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded">
              {error}
            </div>
          )}

          {/* 设置 */}
          {bgUrl && (
            <div className="space-y-3">
              <div>
                <label className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300 mb-1">
                  <span>图片透明度</span>
                  <span className="text-gray-400">{Math.round(settings.opacity * 100)}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.opacity * 100}
                  onChange={(e) =>
                    updateSettings({ opacity: Number(e.target.value) / 100 })
                  }
                  className="w-full accent-indigo-500"
                />
              </div>

              <div>
                <label className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300 mb-1">
                  <span>模糊度</span>
                  <span className="text-gray-400">{settings.blur}px</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={settings.blur}
                  onChange={(e) =>
                    updateSettings({ blur: Number(e.target.value) })
                  }
                  className="w-full accent-indigo-500"
                />
              </div>

              <div>
                <label className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300 mb-1">
                  <span>蒙层（保证文字清晰）</span>
                  <span className="text-gray-400">{Math.round(settings.overlayOpacity * 100)}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={settings.overlayOpacity * 100}
                  onChange={(e) =>
                    updateSettings({ overlayOpacity: Number(e.target.value) / 100 })
                  }
                  className="w-full accent-indigo-500"
                />
              </div>
            </div>
          )}

          {/* 提示：刷新生效 */}
          {showRefreshTip && bgUrl && (
            <div className="flex items-start gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-3 py-2 rounded">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                背景已设置。如果没立刻看到效果，<strong>刷新一下页面</strong>（或按 <kbd className="px-1 py-0.5 rounded bg-amber-100 dark:bg-amber-900/50">F5</kbd>）。
              </span>
            </div>
          )}

          {/* 操作 */}
          <div className="flex items-center gap-2 pt-2">
            {bgUrl && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                清除背景
              </button>
            )}
            <div className="flex-1" />
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-md text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            >
              完成
            </button>
          </div>

          <p className="text-xs text-gray-400 text-center pt-2 border-t border-gray-100 dark:border-gray-800">
            🔒 图片只存在你的浏览器本地，不会上传到服务器
          </p>
        </div>
      </div>
    </div>
  );

  // 用 Portal 渲染到 body 层级，避免被 Header 的 backdrop-blur 限制
  if (!mounted) return null;
  return createPortal(modal, document.body);
}

// 可拖动的背景定位编辑器
function BackgroundPositionEditor({
  bgUrl,
  position,
  zoom,
  onChange,
  onChangeZoom,
  onChangeImage,
}: {
  bgUrl: string;
  position: { x: number; y: number };
  zoom: number;
  onChange: (pos: { x: number; y: number }) => void;
  onChangeZoom: (zoom: number) => void;
  onChangeImage: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const updateFromEvent = useCallback(
    (clientX: number, clientY: number) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;
      onChange({
        x: Math.max(0, Math.min(100, x)),
        y: Math.max(0, Math.min(100, y)),
      });
    },
    [onChange]
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateFromEvent(e.clientX, e.clientY);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updateFromEvent(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const reset = () => {
    onChange({ x: 50, y: 50 });
    onChangeZoom(1);
  };

  // 滚轮缩放
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    const newZoom = Math.max(0.5, Math.min(3, zoom + delta));
    onChangeZoom(newZoom);
  };

  const focalPoint = `${position.x}% ${position.y}%`;

  return (
    <div className="space-y-2">
      <div
        ref={ref}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        className="relative aspect-video rounded-lg select-none touch-none overflow-hidden bg-gray-200 dark:bg-gray-800"
        style={{ cursor: isDragging ? "grabbing" : "move" }}
      >
        {/* 预览图 - 用 img + object-fit cover，跟实际背景同款逻辑 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bgUrl}
          alt=""
          className="absolute inset-0 w-full h-full"
          draggable={false}
          style={{
            objectFit: "cover",
            objectPosition: focalPoint,
            transform: `scale(${zoom})`,
            transformOrigin: focalPoint,
          }}
        />

        {/* 网格辅助线 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-y-0 left-1/3 w-px bg-white/30" />
          <div className="absolute inset-y-0 left-2/3 w-px bg-white/30" />
          <div className="absolute inset-x-0 top-1/3 h-px bg-white/30" />
          <div className="absolute inset-x-0 top-2/3 h-px bg-white/30" />
        </div>

        {/* 焦点准星（始终在固定位置，不随缩放移动） */}
        <div
          className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2"
          style={{ left: focalPoint, top: focalPoint.split(" ")[1] }}
        >
          <div className="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center bg-black/30">
            <Move className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* 提示文字 */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          <span className="px-2 py-1 rounded bg-black/60 text-white text-xs flex items-center gap-1">
            <Move className="w-3 h-3" />
            拖动定位 / 滚轮缩放
          </span>
        </div>
      </div>

      {/* 缩放控制 */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-gray-500 dark:text-gray-400 flex-shrink-0 w-12">缩放</span>
        <button
          type="button"
          onClick={() => onChangeZoom(Math.max(0.5, zoom - 0.1))}
          className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300"
          aria-label="缩小"
        >
          <ZoomOut className="w-3 h-3" />
        </button>
        <input
          type="range"
          min="50"
          max="300"
          value={Math.round(zoom * 100)}
          onChange={(e) => onChangeZoom(Number(e.target.value) / 100)}
          className="flex-1 accent-indigo-500"
        />
        <button
          type="button"
          onClick={() => onChangeZoom(Math.min(3, zoom + 0.1))}
          className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300"
          aria-label="放大"
        >
          <ZoomIn className="w-3 h-3" />
        </button>
        <span className="text-gray-500 dark:text-gray-400 w-10 text-right tabular-nums">
          {Math.round(zoom * 100)}%
        </span>
      </div>

      {/* 控制按钮 */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500 dark:text-gray-400">
          焦点: {Math.round(position.x)}%, {Math.round(position.y)}%
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1 px-2 py-1 rounded text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <RotateCcw className="w-3 h-3" />
            重置
          </button>
          <button
            type="button"
            onClick={onChangeImage}
            className="inline-flex items-center gap-1 px-2 py-1 rounded text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30"
          >
            <Upload className="w-3 h-3" />
            更换
          </button>
        </div>
      </div>
    </div>
  );
}