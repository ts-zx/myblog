"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import {
  t as translate,
  getLocale,
  subscribeLocale,
  type Locale,
} from "@/lib/i18n-state";
import { siteConfig } from "@/app/site.config";

function useTranslate() {
  const [, force] = useState(0);
  useEffect(() => subscribeLocale(() => force((n) => n + 1)), []);
  return translate;
}

export function HomeGreeting() {
  const t = useTranslate();
  return (
    <section className="py-12">
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
        {t("home.greeting")}{" "}
        <span className="text-indigo-600 dark:text-indigo-400">
          {siteConfig.author}
        </span>
        .
      </h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
        {siteConfig.description}。
        <Sparkles
          className="inline w-5 h-5 text-indigo-500 align-middle ml-1"
          aria-hidden
        />
      </p>
      <div className="mt-6 flex gap-3 flex-wrap">
        <Link
          href="/posts"
          className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition-colors"
        >
          {t("home.browseAll")} →
        </Link>
        <Link
          href="/about"
          className="inline-flex items-center px-4 py-2 rounded-md border text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {t("home.aboutMe")}
        </Link>
      </div>
    </section>
  );
}

export function HomeLatestSection({ children }: { children: React.ReactNode }) {
  const t = useTranslate();
  return (
    <section className="mt-10">
      <div className="flex items-baseline justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">
          {t("home.latestPosts")}
        </h2>
        <Link
          href="/posts"
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          {t("home.viewAll")} →
        </Link>
      </div>
      <div className="mt-2">{children}</div>
    </section>
  );
}
