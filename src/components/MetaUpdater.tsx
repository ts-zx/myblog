"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/app/site.config";
import { getLocale, subscribeLocale } from "@/lib/i18n-state";
import { translations } from "@/lib/i18n";

/**
 * 同步 SEO metadata 到当前语言
 *
 * 静态导出（output: "export"）下，metadata 只在构建时生成一份，
 * 所以用客户端脚本按当前语言实时更新 title / description / og / twitter。
 *
 * 文章详情页保留文章自己的标题（文章内容不翻译），只更新描述/站点信息。
 */
export function MetaUpdater() {
  const pathname = usePathname();

  useEffect(() => {
    const apply = () => {
      const locale = getLocale();
      const dict = translations[locale] as Record<string, string>;
      const isPost = pathname?.startsWith("/posts/") && pathname !== "/posts";

      // 页面标题
      let title = dict["meta.siteTitle"]
        .replace("{name}", siteConfig.name)
        .replace("{desc}", siteConfig.description);
      if (pathname === "/posts") {
        title = `${dict["posts.title"]} · ${siteConfig.name}`;
      } else if (pathname === "/about") {
        title = `${dict["about.title"]} · ${siteConfig.name}`;
      } else if (!isPost) {
        document.title = title;
      }

      const description = dict["meta.siteDescription"].replace(
        "{desc}",
        siteConfig.description
      );
      const keywords = dict["meta.keywords"];

      if (!isPost) {
        document.title = title;
      }

      const setMeta = (
        attr: "name" | "property",
        key: string,
        content: string
      ) => {
        let el = document.head.querySelector<HTMLMetaElement>(
          `meta[${attr}="${key}"]`
        );
        if (!el) {
          el = document.createElement("meta");
          el.setAttribute(attr, key);
          document.head.appendChild(el);
        }
        el.setAttribute("content", content);
      };

      setMeta("name", "description", description);
      setMeta("name", "keywords", keywords);
      setMeta("name", "author", siteConfig.author);

      setMeta("property", "og:title", document.title);
      setMeta("property", "og:description", description);
      setMeta("property", "og:site_name", siteConfig.name);
      setMeta("property", "og:locale", locale === "en" ? "en_US" : "zh_CN");

      setMeta("name", "twitter:title", document.title);
      setMeta("name", "twitter:description", description);

      document.documentElement.lang = locale;
    };

    apply();
    return subscribeLocale(apply);
  }, [pathname]);

  return null;
}
