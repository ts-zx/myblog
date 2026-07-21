"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

export function ViewCounter({ slug }: { slug: string }) {
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
      title="阅读量（Cloudflare Workers + KV 统计）"
    >
      <Eye className="w-3.5 h-3.5" aria-hidden />
      <span>{count === null ? "…" : count.toLocaleString()}</span>
    </span>
  );
}