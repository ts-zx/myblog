"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

const STORAGE_KEY_PREFIX = "liked:";

export function LikeButton({ slug }: { slug: string }) {
  const [count, setCount] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(false);

  // Load initial state
  useEffect(() => {
    if (typeof window === "undefined") return;
    setLiked(localStorage.getItem(STORAGE_KEY_PREFIX + slug) === "1");
    fetch(`/api/likes/${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && typeof d.count === "number") setCount(d.count);
      })
      .catch(() => setCount(0));
  }, [slug]);

  const toggle = async () => {
    if (busy) return;
    if (liked) return; // already liked, don't allow un-like for simplicity
    setBusy(true);
    try {
      const r = await fetch(`/api/likes/${encodeURIComponent(slug)}`, { method: "POST" });
      if (r.ok) {
        const d = await r.json();
        if (typeof d.count === "number") setCount(d.count);
        setLiked(true);
        localStorage.setItem(STORAGE_KEY_PREFIX + slug, "1");
      }
    } catch {
      /* ignore */
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={liked || busy}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all
        ${liked
          ? "border-pink-300 bg-pink-50 text-pink-600 dark:border-pink-800 dark:bg-pink-950/40 dark:text-pink-400 cursor-default"
          : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-pink-300 hover:text-pink-500 hover:bg-pink-50/50 dark:hover:bg-pink-950/20"
        }`}
      aria-label={liked ? "已点赞" : "点赞"}
    >
      <Heart
        className={`w-4 h-4 transition-transform ${liked ? "fill-pink-500 scale-110" : ""}`}
      />
      <span>{count === null ? "…" : count.toLocaleString()}</span>
    </button>
  );
}