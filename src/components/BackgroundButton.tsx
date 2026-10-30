"use client";

import { useEffect, useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import { BackgroundSettings } from "@/components/BackgroundSettings";
import { useBackground } from "@/lib/useBackground";
import { t as translate, subscribeLocale } from "@/lib/i18n-state";

export function BackgroundButton() {
  const [open, setOpen] = useState(false);
  const { bgUrl } = useBackground();
  const [, force] = useState(0);
  useEffect(() => subscribeLocale(() => force((n) => n + 1)), []);
  const t = translate;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("bg.title")}
        title={bgUrl ? t("bg.hasTitle") : t("bg.setTitle")}
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