"use client";

import Link from "next/link";
import { useTheme } from "@/lib/useTheme";
import { useEffect, useState } from "react";
import { Sun, Moon, Menu, X } from "lucide-react";
import { siteConfig } from "@/app/site.config";
import { Search } from "@/components/Search";
import { BackgroundButton } from "@/components/BackgroundButton";

export function Header() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => setMounted(true), []);
  const { resolvedTheme, toggle } = useTheme();

  // ESC 关闭移动菜单
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handler);
    // 锁定 body 滚动
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b backdrop-blur-md bg-white/80 dark:bg-gray-900/80">
        <div className="mx-auto max-w-4xl px-6 h-14 flex items-center justify-between gap-2">
          {/* Logo + 小字 */}
          <Link
            href="/"
            className="flex flex-col items-start leading-tight flex-shrink-0"
          >
            <span className="flex items-center gap-2 font-semibold tracking-tight whitespace-nowrap">
              <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
              <span>{siteConfig.name}</span>
            </span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 ml-4 mt-0.5">
              国际版
            </span>
          </Link>

          {/* PC 导航 - sm 以上才显示 */}
          <nav className="hidden sm:flex items-center gap-5 text-sm">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* 右侧按钮组 */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Search />
            <BackgroundButton />
            <button
              aria-label="切换主题"
              onClick={toggle}
              className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
            >
              {mounted && resolvedTheme === "dark" ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </button>

            {/* 汉堡按钮 - 仅移动端 */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="打开菜单"
              className="sm:hidden inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* 移动菜单抽屉 */}
      {mobileMenuOpen && (
        <div
          className="sm:hidden fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex justify-end"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-64 bg-white dark:bg-gray-900 h-full shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 h-14 border-b border-gray-200 dark:border-gray-700">
              <span className="font-semibold text-gray-900 dark:text-gray-100">菜单</span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="关闭菜单"
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 p-2">
              {siteConfig.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-4 py-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-base"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-400">
              按 ESC 关闭
            </div>
          </div>
        </div>
      )}
    </>
  );
}