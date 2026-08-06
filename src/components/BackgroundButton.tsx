"use client";

import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import { BackgroundSettings } from "@/components/BackgroundSettings";
import { useBackground } from "@/lib/useBackground";

export function BackgroundButton() {
  const [open, setOpen] = useState(false);
  const { bgUrl } = useBackground();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="自定义背景"
        title={bgUrl ? "已设置自定义背景" : "设置自定义背景"}
        className="inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
      >
        <ImageIcon className="w-4 h-4" />
        {bgUrl && (
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-indigo-500" />
        )}
      </button>
      <BackgroundSettings open={open} onClose={() => setOpen(false)} />
    </>
  );
}