// i18n state - 模块级共享，避开 useT 的 proxy 问题
import { translations, DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from "./i18n";
import { siteConfig } from "@/app/site.config";

export type { Locale };

const STORAGE_KEY = "blog-locale";

let _currentLocale: Locale = DEFAULT_LOCALE;
const _listeners = new Set<() => void>();

/** 当前访问的是哪个站点（按域名判断） */
export type SiteId = keyof typeof siteConfig.sites;

export function getCurrentSite(): SiteId {
  if (typeof window === "undefined") return siteConfig.defaultSite;
  const host = window.location.hostname.toLowerCase();
  const sites = siteConfig.sites as Record<string, { hosts: string[] }>;
  for (const [id, cfg] of Object.entries(sites)) {
    if (cfg.hosts.some((h) => host === h || host.endsWith(`.${h}`))) {
      return id as SiteId;
    }
  }
  return siteConfig.defaultSite;
}

/** 当前站点的默认语言 */
export function getSiteDefaultLocale(): Locale {
  const site = siteConfig.sites[getCurrentSite()];
  return site?.defaultLocale ?? DEFAULT_LOCALE;
}

/** 当前站点允许的语言列表 */
export function getSiteLocales(): readonly Locale[] {
  const site = siteConfig.sites[getCurrentSite()];
  return (site?.locales as readonly Locale[]) ?? SUPPORTED_LOCALES;
}

/** 站点切换时用的 URL（带 ?lang= 传语言，因为跨域 localStorage 不共享） */
export function buildSiteUrl(siteId: SiteId, locale: Locale): string {
  const site = siteConfig.sites[siteId];
  const url = new URL(site.url);
  url.searchParams.set("lang", locale);
  return url.toString();
}

// 客户端初始化
if (typeof window !== "undefined") {
  try {
    // 1. URL 参数优先（跨站点切换时传过来的）
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("lang");

    // 2. 其次 localStorage（同站点内切换记忆）
    const stored = localStorage.getItem(STORAGE_KEY);

    // 3. 最后按站点默认语言
    const siteDefault = getSiteDefaultLocale();

    if (fromUrl && SUPPORTED_LOCALES.includes(fromUrl as Locale)) {
      _currentLocale = fromUrl as Locale;
    } else if (stored && SUPPORTED_LOCALES.includes(stored as Locale)) {
      _currentLocale = stored as Locale;
    } else {
      _currentLocale = siteDefault;
    }

    document.documentElement.lang = _currentLocale;

    // 清理 URL 上的 ?lang= 参数（用 replaceState，不留历史记录）
    if (fromUrl) {
      const clean = new URL(window.location.href);
      clean.searchParams.delete("lang");
      window.history.replaceState({}, "", clean.toString());
    }
  } catch {
    _currentLocale = getSiteDefaultLocale();
  }
}

export function getLocale(): Locale {
  return _currentLocale;
}

export function setLocale(newLocale: Locale) {
  if (_currentLocale === newLocale) return;
  _currentLocale = newLocale;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
      document.documentElement.lang = newLocale;
    } catch {}
  }
  _listeners.forEach((cb) => cb());
}

export function subscribeLocale(cb: () => void): () => void {
  _listeners.add(cb);
  return () => _listeners.delete(cb);
}

export function t(
  key: string,
  vars?: Record<string, string | number>
): string {
  const dict = translations[_currentLocale] as Record<string, string>;
  let str = (dict && dict[key]) || key;
  if (vars && typeof str === "string") {
    Object.entries(vars).forEach(([k, v]) => {
      str = str.replace(`{${k}}`, String(v));
    });
  }
  return str;
}
