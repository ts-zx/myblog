"use client";

import { useEffect, useState, useCallback } from "react";

export type Theme = "light" | "dark" | "system";

// 圆形展开主题切换：捕获点击位置，用 View Transitions API 动画
export function useTheme() {
  const [theme, setTheme] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem("theme")) as Theme | null;
    if (stored === "light" || stored === "dark" || stored === "system") {
      setTheme(stored);
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    const apply = () => {
      const isDark = theme === "dark" || (theme === "system" && mq.matches);
      root.classList.toggle("dark", isDark);
      setResolvedTheme(isDark ? "dark" : "light");
    };

    apply();
    const handler = () => theme === "system" && apply();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  // 带动画的切换：从点击位置圆形展开/收缩
  const toggleWithTransition = useCallback(
    (event?: React.MouseEvent | MouseEvent) => {
      const next: Theme = resolvedTheme === "dark" ? "light" : "dark";

      // 捕获点击位置（用于圆形展开动画中心）
      if (event && typeof event.clientX === "number") {
        document.documentElement.style.setProperty("--theme-x", `${event.clientX}px`);
        document.documentElement.style.setProperty("--theme-y", `${event.clientY}px`);
      } else {
        // 降级：屏幕中心
        document.documentElement.style.setProperty("--theme-x", "50%");
        document.documentElement.style.setProperty("--theme-y", "50%");
      }

      // 应用 View Transitions API
      const applyTheme = () => {
        setTheme(next);
        localStorage.setItem("theme", next);
      };

      // 记录切换方向，供 CSS 判断该动 old 还是 new
      const root = document.documentElement;
      root.dataset.themeTransition = next === "dark" ? "to-dark" : "to-light";

      // 检查浏览器是否支持 View Transitions
      const doc = document as Document & {
        startViewTransition?: (cb: () => void) => {
          finished?: Promise<unknown>;
        };
      };

      if (typeof doc.startViewTransition === "function") {
        const transition = doc.startViewTransition(applyTheme);
        // 动画结束后清理标记
        if (transition?.finished) {
          transition.finished
            .catch(() => {})
            .finally(() => {
              delete root.dataset.themeTransition;
            });
        }
        // 兜底：2 秒后无论如何清掉
        setTimeout(() => {
          delete root.dataset.themeTransition;
        }, 1200);
      } else {
        applyTheme();
        delete root.dataset.themeTransition;
      }
    },
    [resolvedTheme]
  );

  return { theme, resolvedTheme, toggle: toggleWithTransition, setTheme };
}
