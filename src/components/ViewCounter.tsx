"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { t as translate, subscribeLocale } from "@/lib/i18n-state";

export function ViewCounter({ slug }: { slug: string }) {
  const [, force] = useState(0);
  useEffect(() => subscribeLocale(() => force((n) => n + 1)), []);
  const t = translate;
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/views/${encodeURIComponent(slug)}`, { method: "POST" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && d && typeof d.count === "number") setCount(d.count);
      })
      .catch(() => {
        if (!cancelled) setCount(0);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <span
      className="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400"
      title={t("post.views")}
    >
      <Eye className="w-3.5 h-3.5" aria-hidden />
      <span>{count === null ? "…" : count.toLocaleString()}</span>
    </span>
  );
}