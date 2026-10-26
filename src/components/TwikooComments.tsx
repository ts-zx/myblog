"use client";

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/app/site.config";

// 全局类型
declare global {
  interface Window {
    twikoo?: {
      init: (options: Record<string, unknown>) => void;
    };
  }
}

/**
 * Twikoo 评论系统
 * - 自托管，国内访问快
 * - 纯 Cloudflare 栈（Worker + D1 + R2），不依赖任何第三方
 * - 文档：https://twikoo.js.org/
 */
export function TwikooComments() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(false);

  useEffect(() => {
    // 防止 React StrictMode 重复初始化
    if (mounted.current) return;
    mounted.current = true;

    const cfg = siteConfig.twikoo;
    if (!cfg?.enabled || !cfg.envId) {
      setError("评论系统未配置");
      return;
    }

    // 1. 加载脚本（优先本地自托管，回退到 CDN）
    const loadScript = (src: string) =>
      new Promise<void>((resolve, reject) => {
        const existing = document.querySelector<HTMLScriptElement>(
          `script[src="${src}"]`
        );
        if (existing) {
          if (window.twikoo) return resolve();
          existing.addEventListener("load", () => resolve());
          existing.addEventListener("error", reject);
          return;
        }
        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        s.crossOrigin = "anonymous";
        s.onload = () => resolve();
        s.onerror = () => reject(new Error(`脚本加载失败: ${src}`));
        document.body.appendChild(s);
      });

    // 2. 本地脚本优先（国内更快），失败再用 CDN
    (async () => {
      const sources = ["/twikoo/twikoo.all.min.js"];
      if (cfg.jsUrl) sources.unshift(cfg.jsUrl);
      sources.push(
        "https://cdn.jsdelivr.net/npm/twikoo@1.6.45/dist/twikoo.all.min.js"
      );

      let lastErr: unknown = null;
      for (const src of sources) {
        try {
          await loadScript(src);
          if (!window.twikoo) throw new Error("twikoo 未定义");
          break;
        } catch (e) {
          lastErr = e;
        }
      }

      if (!window.twikoo) {
        setError(
          lastErr instanceof Error ? lastErr.message : "评论系统加载失败"
        );
        return;
      }

      // 3. 初始化
      window.twikoo.init({
        envId: cfg.envId,
        el: "#twikoo",
        lang: cfg.lang ?? "zh-CN",
        region: cfg.region ?? "ap-shanghai",
        path: typeof window !== "undefined" ? window.location.pathname : "/",
        // 页面标题，用于评论列表显示
        pageTitle: document.title,
      });

      setReady(true);
    })();
  }, []);

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
        评论
      </h3>

      {/* Twikoo 挂载点 */}
      <div id="twikoo" className="min-h-[120px]" />

      {!ready && !error && (
        <p className="text-sm text-gray-400 py-4">评论区加载中…</p>
      )}

      {error && (
        <div className="text-sm text-gray-500 bg-gray-50 dark:bg-gray-800/50 px-4 py-3 rounded">
          <p>评论区暂时无法加载：{error}</p>
          <p className="mt-1 text-xs text-gray-400">
            刷新页面重试，或通过 GitHub 联系我。
          </p>
        </div>
      )}
    </div>
  );
}
