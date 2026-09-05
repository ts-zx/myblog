"use client";

import Link from "next/link";
import { useTheme } from "@/lib/useTheme";
import { useEffect, useState, useRef } from "react";
import { Sun, Moon, Menu, X, ChevronDown } from "lucide-react";
import { siteConfig } from "@/app/site.config";
import { Search } from "@/components/Search";
import { BackgroundButton } from "@/components/BackgroundButton";

const SITE_OPTIONS = [
  { id: "intl", label: "国际站", hint: "International" },
  { id: "cn", label: "中国站", hint: "China" },
  { id: "en", label: "Global - English", hint: "EN" },
];

export function Header() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [siteMenuOpen, setSiteMenuOpen] = useState(false);
  const siteMenuRef = useRef<HTMLDivElement>(null);
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

  // 点击外部关闭站点下拉
  useEffect(() => {
    if (!siteMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (siteMenuRef.current && !siteMenuRef.current.contains(e.target as Node)) {
        setSiteMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [siteMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b backdrop-blur-md bg-white/80 dark:bg-gray-900/80">
        <div className="mx-auto max-w-5xl px-6 h-14 flex items-center justify-between gap-4">
          {/* 左侧：Logo + 站点切换下拉 */}
          <div className="flex items-baseline gap-3 whitespace-nowrap">
            <Link
              href="/"
              className="inline-flex items-baseline gap-2 font-semibold tracking-tight"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0 self-center" />
              <span>{siteConfig.name}</span>
            </Link>
            {/* 站点切换下拉 */}
            <div className="relative" ref={siteMenuRef}>
              <button
                type="button"
                onClick={() => setSiteMenuOpen(!siteMenuOpen)}
                className="inline-flex items-center gap-0.5 text-[10px] text-gray-400 dark:text-gray-500 font-normal tracking-normal hover:text-gray-600 dark:hover:text-gray-300 transition-colors translate-y-0.5"
                aria-haspopup="menu"
                aria-expanded={siteMenuOpen}
              >
                国际站
                <ChevronDown className={`w-2.5 h-2.5 transition-transform ${siteMenuOpen ? "rotate-180" : ""}`} />
              </button>
              {siteMenuOpen && (
                <div
                  className="absolute left-0 top-full mt-1.5 min-w-[160px] bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50"
                  role="menu"
                >
                  {SITE_OPTIONS.map((opt, i) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSiteMenuOpen(false)}
                      className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors"
                      role="menuitem"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${i === 0 ? "bg-indigo-500" : "bg-transparent"}`} />
                      <span className="flex-1">{opt.label}</span>
                      {i === 0 && (
                        <span className="text-[10px] text-indigo-600 dark:text-indigo-400">当前</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 右侧：导航 + 按钮组 */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* PC 导航 - 跟按钮一起在右侧 */}
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

            {/* 按钮组 */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Search />
              <BackgroundButton />
              <button
                aria-label="切换主题"
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
                aria-label="打开菜单"
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
    </>
  );
}
