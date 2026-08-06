"use client";

import { useRef, useState, useCallback } from "react";
import { Image as ImageIcon, X, Upload, Trash2, Info } from "lucide-react";
import { useBackground, backgroundActions } from "@/lib/useBackground";

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

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 sm:pt-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
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

        {/* Scrollable body */}
        <div className="p-4 space-y-4 max-h-[calc(100vh-12rem)] sm:max-h-[60vh] overflow-y-auto">
          {/* 上传区 */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-lg overflow-hidden cursor-pointer transition-colors ${
              dragging
                ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30"
                : "border-gray-200 dark:border-gray-700 hover:border-indigo-400"
            }`}
          >
            {bgUrl ? (
              <div
                className="aspect-video bg-cover bg-center"
                style={{ backgroundImage: `url(${bgUrl})` }}
              >
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/30 transition-colors">
                  <div className="opacity-0 hover:opacity-100 transition-opacity flex items-center gap-2 text-white text-sm font-medium">
                    <Upload className="w-4 h-4" />
                    更换图片
                  </div>
                </div>
              </div>
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

          {/* 提示：刷新生效 */}
          {showRefreshTip && bgUrl && (
            <div className="flex items-start gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-3 py-2 rounded">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                背景已设置。如果没立刻看到效果，<strong>刷新一下页面</strong>（或按 <kbd className="px-1 py-0.5 rounded bg-amber-100 dark:bg-amber-900/50">F5</kbd>）。
              </span>
            </div>
          )}

          <p className="text-xs text-gray-400 text-center pt-2 border-t border-gray-100 dark:border-gray-800">
            🔒 图片只存在你的浏览器本地，不会上传到服务器
          </p>
        </div>
      </div>
    </div>
  );
}