"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ViewCounter } from "@/components/ViewCounter";
import {
  t as translate,
  subscribeLocale,
} from "@/lib/i18n-state";

function useTranslate() {
  const [, force] = useState(0);
  useEffect(() => subscribeLocale(() => force((n) => n + 1)), []);
  return translate;
}

export function PostMeta({
  frontmatter,
  readingMinutes,
  slug,
}: {
  frontmatter: { date: string; tags?: string[]; title: string };
  readingMinutes: number;
  slug: string;
}) {
  const t = useTranslate();
  return (
    <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <time dateTime={frontmatter.date}>
            {format(new Date(frontmatter.date), "yyyy-MM-dd")}
          </time>
          <span>·</span>
          <span>
            {readingMinutes} {t("post.minRead")}
          </span>
          <span>·</span>
          <ViewCounter slug={slug} />
        </div>
        {frontmatter.tags && frontmatter.tags.length > 0 && (
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="hidden sm:inline">·</span>
            {frontmatter.tags.map((tag) => (
              <span key={tag} className="text-indigo-600 dark:text-indigo-400">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function PostBackLink() {
  const t = useTranslate();
  return (
    <Link href="/posts" className="text-sm text-gray-500 hover:text-indigo-500">
      {t("post.backToList")}
    </Link>
  );
}

export function PostFooterLink() {
  const t = useTranslate();
  return (
    <Link href="/posts" className="hover:text-indigo-500">
      {t("post.backToPosts")}
    </Link>
  );
}

export function CommentsTitle() {
  const t = useTranslate();
  return (
    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
      {t("post.comments")}
    </h3>
  );
}
