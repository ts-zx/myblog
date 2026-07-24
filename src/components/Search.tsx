"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Search as SearchIcon, X, FileText } from "lucide-react";
import Link from "next/link";

type PagefindResult = {
  id: string;
  data: () => Promise<{
    url: string;
    meta: { title: string };
    excerpt: string;
  }>;
};

type PagefindSearch = {
  search: (q: string) => Promise<{ results: PagefindResult[] }>;
};

declare global {
  interface Window {
    __pagefind?: PagefindSearch;
  }
}

let pagefindPromise: Promise<PagefindSearch | null> | null = null;

function loadPagefindScript(): Promise<PagefindSearch | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.__pagefind) return Promise.resolve(window.__pagefind);
  if (pagefindPromise) return pagefindPromise;

  pagefindPromise = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "/pagefind/pagefind.js";
    script.async = true;
    script.onload = () => {
      // pagefind.js exposes itself via `window.pagefind`
      const pf = (window as unknown as { pagefind?: PagefindSearch }).pagefind;
      if (pf) {
        // pagefind needs init() to load its index
        // @ts-expect-error - pagefind's init signature varies
        pf.init?.().then(() => {
          window.__pagefind = pf;
          resolve(pf);
        });
      } else {
        resolve(null);
      }
    };
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });
  return pagefindPromise;
}

export function Search() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PagefindResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Open with ⌘K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  const runSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const pf = await loadPagefindScript();
    if (!pf) {
      setLoading(false);
      return;
    }
    try {
      const out = await pf.search(q);
      setResults(out.results.slice(0, 8));
    } catch (e) {
      console.error("search failed", e);
    }
    setLoading(false);
  }, []);

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => runSearch(query), 200);
    return () => clearTimeout(t);
  }, [query, runSearch]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="搜索"
        className="inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <SearchIcon className="w-4 h-4" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-start justify-center pt-[10vh] px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <SearchIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索文章... (Ctrl+K)"
                className="flex-1 bg-transparent outline-none text-base text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="关闭"
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {!query && (
                <div className="px-4 py-8 text-center text-sm text-gray-500">
                  输入关键词开始搜索
                </div>
              )}
              {query && loading && (
                <div className="px-4 py-8 text-center text-sm text-gray-500">
                  搜索中...
                </div>
              )}
              {query && !loading && results.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-gray-500">
                  没有找到相关文章
                </div>
              )}
              {results.length > 0 && (
                <ul className="py-2">
                  {results.map((r) => (
                    <SearchResult key={r.id} result={r} onClick={() => setOpen(false)} />
                  ))}
                </ul>
              )}
            </div>

            <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 flex items-center gap-3">
              <span>esc 关闭</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SearchResult({ result, onClick }: { result: PagefindResult; onClick: () => void }) {
  const [data, setData] = useState<{ url: string; meta: { title: string }; excerpt: string } | null>(null);
  useEffect(() => {
    result.data().then(setData);
  }, [result]);
  if (!data) return null;
  return (
    <li>
      <Link
        href={data.url}
        onClick={onClick}
        className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <FileText className="w-4 h-4 mt-1 text-gray-400 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
            {data.meta.title}
          </div>
          <div
            className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5"
            dangerouslySetInnerHTML={{ __html: data.excerpt }}
          />
        </div>
      </Link>
    </li>
  );
}