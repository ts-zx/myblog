"use client";

import Link from "next/link";
import { useTheme } from "@/lib/useTheme";
import { useEffect, useState } from "react";
import { Sun, Moon, Menu, X } from "lucide-react";
import { siteConfig } from "@/app/site.config";
import { Search } from "@/components/Search";
import { BackgroundButton } from "@/components/BackgroundButton";
import { SiteSwitcher } from "@/components/SiteSwitcher";
import {
  t as translate,
  getLocale,
  subscribeLocale,
  type Locale,
} from "@/lib/i18n-state";

// 导航项 → 翻译 key
const NAV_KEYS: Record<string, string> = {
  "/": "nav.home",
  "/posts": "nav.posts",
  "/about": "nav.about",
};

export function Header() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locale, setLocaleState] = useState<Locale>("zh-CN");
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    setLocaleState(getLocale());
    return subscribeLocale(() => setLocaleState(getLocale()));
  }, []);
  const { resolvedTheme, toggle } = useTheme();
  const t = translate;

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

  const navLabel = (href: string, fallback: string) => {
    const key = NAV_KEYS[href];
    return key ? t(key) : fallback;
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b backdrop-blur-md bg-white/80 dark:bg-gray-900/80">
        <div className="mx-auto max-w-5xl px-6 h-14 flex items-center justify-between gap-4">
          {/* 左侧：Logo + 站点/语言切换 */}
          <div className="flex items-center gap-3 whitespace-nowrap">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-semibold tracking-tight"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
              <span>{siteConfig.name}</span>
            </Link>
            <SiteSwitcher />
          </div>

          {/* 右侧：导航 + 按钮组 */}
          <div className="flex items-center gap-4 sm:gap-6">
            <nav className="hidden sm:flex items-center gap-5 text-sm">
              {siteConfig.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap"
                >
                  {navLabel(item.href, item.label)}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1 sm:gap-2">
              <Search />
              <BackgroundButton />
              <button
                aria-label={
                  mounted && resolvedTheme === "dark"
                    ? t("theme.toggleLight")
                    : t("theme.toggleDark")
                }
                onClick={(e) => toggle(e)}
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
                aria-label={t("menu.open")}
                className="sm:hidden inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 移动端全屏菜单 - 滑入滑出动画 */}
      <div
        className={`sm:hidden fixed inset-0 z-[100] bg-white dark:bg-gray-900 flex flex-col transform transition-transform duration-300 ease-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="flex items-center justify-between px-6 h-14 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {t("menu.title")}
          </span>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            aria-label={t("menu.close")}
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
              {navLabel(item.href, item.label)}
            </Link>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-400">
          {t("menu.escClose")}
        </div>
      </div>
    </>
  );
}
