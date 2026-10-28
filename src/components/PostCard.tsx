"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import type { Post } from "@/lib/posts";
import {
  t as translate,
  subscribeLocale,
} from "@/lib/i18n-state";

export function PostCard({
  post,
  headingLevel = 2,
}: {
  post: Post;
  /** 标题层级：嵌套在某个 h2 区块内时传 3，独立列表传 2 */
  headingLevel?: 2 | 3;
}) {
  const { frontmatter, slug, readingMinutes } = post;
  const Heading = headingLevel === 3 ? "h3" : "h2";
  const [, force] = useState(0);
  useEffect(() => subscribeLocale(() => force((n) => n + 1)), []);
  const t = translate;

  return (
    <article className="group py-6 border-b last:border-b-0">
      <Link href={`/posts/${slug}`} className="block">
        <Heading className="text-xl font-semibold tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {frontmatter.title}
        </Heading>
      </Link>
      <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {/* 移动端：日期+阅读时间一行，#tags 单独一行；PC 端：原样一行 */}
        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
          <div className="flex items-center gap-3">
            <time dateTime={frontmatter.date}>
              {format(new Date(frontmatter.date), "yyyy-MM-dd")}
            </time>
            <span>·</span>
            <span>
              {readingMinutes} {t("post.minRead")}
            </span>
          </div>
          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <span className="hidden sm:inline">·</span>
              {frontmatter.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-indigo-600 dark:text-indigo-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      {frontmatter.description && (
        <p className="mt-2 text-gray-600 dark:text-gray-400 leading-relaxed">
          {frontmatter.description}
        </p>
      )}
    </article>
  );
}
