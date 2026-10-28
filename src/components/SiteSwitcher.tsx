"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  getCurrentSite,
  getLocale,
  setLocale,
  buildSiteUrl,
  subscribeLocale,
  type Locale,
  type SiteId,
} from "@/lib/i18n-state";
import { siteConfig } from "@/app/site.config";
import { LOCALE_LABELS, SUPPORTED_LOCALES } from "@/lib/i18n";

/**
 * 站点 + 语言 联合切换器
 *
 * - tszx.zh.kg      → 中国站   简体中文 / 繁體中文
 * - www.tszx.zh.kg  → 国际站   简体中文 / 繁體中文 / English
 *
 * 跨站点切换用 ?lang= 传语言（localStorage 跨域不共享）
 */
export function SiteSwitcher() {
  const [open, setOpen] = useState(false);
  const [site, setSite] = useState<SiteId>("cn");
  const [locale, setLocaleState] = useState<Locale>("zh-CN");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSite(getCurrentSite());
    setLocaleState(getLocale());
    return subscribeLocale(() => setLocaleState(getLocale()));
  }, []);

  // 点击外部关闭
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const currentSiteCfg = siteConfig.sites[site];
  const currentLabel = currentSiteCfg?.label ?? site;

  /** 切换站点（跨域，带 lang 参数） */
  const gotoSite = (targetSite: SiteId, targetLocale: Locale) => {
    // 目标站点是否支持这个语言，不支持就用它的默认语言
    const allowed = (siteConfig.sites[targetSite].locales as readonly Locale[]) ?? SUPPORTED_LOCALES;
    const finalLocale = allowed.includes(targetLocale)
      ? targetLocale
      : siteConfig.sites[targetSite].defaultLocale;
    window.location.href = buildSiteUrl(targetSite, finalLocale);
  };

  /** 同站点内切换语言 */
  const pickLocale = (next: Locale) => {
    setLocale(next);
    setOpen(false);
  };

  const siteEntries = Object.keys(siteConfig.sites) as SiteId[];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors whitespace-nowrap"
        aria-haspopup="menu"
        aria-expanded={open}
        title={currentSiteCfg?.description}
      >
        {currentLabel}
        <ChevronDown
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1.5 min-w-[190px] bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50"
          role="menu"
        >
          {/* 站点列表 */}
          {siteEntries.map((sid) => {
            const cfg = siteConfig.sites[sid];
            const isCurrent = sid === site;
            return (
              <button
                key={sid}
                type="button"
                onClick={() => (isCurrent ? setOpen(false) : gotoSite(sid, locale))}
                className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors"
                role="menuitem"
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    isCurrent ? "bg-indigo-500" : "bg-transparent"
                  }`}
                />
                <span className="flex-1">
                  {cfg.label}
                  {isCurrent && (
                    <span className="ml-1.5 text-[10px] text-indigo-600 dark:text-indigo-400">
                      当前
                    </span>
                  )}
                </span>
              </button>
            );
          })}

          {/* 分隔线 */}
          {siteEntries.length > 0 && (
            <div className="my-1 border-t border-gray-100 dark:border-gray-800" />
          )}

          {/* 当前站点支持的语言 */}
          {[...(currentSiteCfg?.locales ?? SUPPORTED_LOCALES)].map(
            (loc) => {
              const info = LOCALE_LABELS[loc];
              const isCurrent = loc === locale;
              return (
                <button
                  key={loc}
                  type="button"
                  onClick={() => pickLocale(loc)}
                  className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors"
                  role="menuitem"
                >
                  <span className="text-base leading-none flex-shrink-0">
                    {info.flag}
                  </span>
                  <span className="flex-1">
                    {currentSiteCfg?.label} - {info.native}
                  </span>
                  {isCurrent && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                  )}
                </button>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}
