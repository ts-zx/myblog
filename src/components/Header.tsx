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
          {/* 左侧：Logo + 角标 + PC 导航（聚在一起） */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="relative inline-flex items-center gap-2 font-semibold tracking-tight whitespace-nowrap"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
              <span className="relative">
                {siteConfig.name}
                {/* "国际版" 角标 - 贴在站名右下方 */}
                <span className="absolute left-full ml-1 top-full -translate-y-0.5 text-[9px] text-gray-400 dark:text-gray-500 font-normal whitespace-nowrap leading-none">
                  国际版
                </span>
              </span>
            </Link>

            {/* PC 导航 - sm 以上才显示，跟 Logo 在一起 */}
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
          </div>

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

      {/* 移动端全屏菜单 */}
      {mobileMenuOpen && (
        <div className="sm:hidden fixed inset-0 z-[100] bg-white dark:bg-gray-900 flex flex-col">
          <div className="flex items-center justify-between px-6 h-14 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
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
          <nav className="flex-1 px-6 py-6 flex flex-col gap-2">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-4 py-4 rounded-md text-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
