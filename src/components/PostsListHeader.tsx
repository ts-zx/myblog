"use client";

import { useEffect, useState } from "react";
import { t as translate, subscribeLocale } from "@/lib/i18n-state";

export function PostsListHeader({
  count,
  tagsCount,
}: {
  count: number;
  tagsCount: number;
}) {
  const [, force] = useState(0);
  useEffect(() => subscribeLocale(() => force((n) => n + 1)), []);
  const t = translate;

  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight">{t("posts.title")}</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        {tagsCount > 0
          ? t("posts.tagsCount", { count, tags: tagsCount })
          : t("posts.count", { count })}
      </p>
    </header>
  );
}
