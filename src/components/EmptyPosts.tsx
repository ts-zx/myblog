"use client";

import { useEffect, useState } from "react";
import { t as translate, subscribeLocale } from "@/lib/i18n-state";

export function EmptyPosts() {
  const [, force] = useState(0);
  useEffect(() => subscribeLocale(() => force((n) => n + 1)), []);
  const t = translate;

  return (
    <div className="py-10 text-center text-gray-500">
      <p className="font-medium">{t("home.emptyTitle")}</p>
      <p className="mt-1 text-sm">
        {t("home.emptyHint")}
      </p>
    </div>
  );
}
