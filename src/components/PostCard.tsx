import Link from "next/link";
import { format } from "date-fns";
import type { Post } from "@/lib/posts";

export function PostCard({ post }: { post: Post }) {
  const { frontmatter, slug, readingMinutes } = post;
  return (
    <article className="group py-6 border-b last:border-b-0">
      <Link href={`/posts/${slug}`} className="block">
        <h2 className="text-xl font-semibold tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {frontmatter.title}
        </h2>
      </Link>
      <div className="mt-1 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
        <time dateTime={frontmatter.date}>
          {format(new Date(frontmatter.date), "yyyy-MM-dd")}
        </time>
        <span>·</span>
        <span>{readingMinutes} 分钟阅读</span>
        {frontmatter.tags && frontmatter.tags.length > 0 && (
          <>
            <span>·</span>
            <div className="flex gap-2">
              {frontmatter.tags.map((tag) => (
                <span key={tag} className="text-indigo-600 dark:text-indigo-400">
                  #{tag}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
      {frontmatter.description && (
        <p className="mt-2 text-gray-600 dark:text-gray-400 leading-relaxed">
          {frontmatter.description}
        </p>
      )}
    </article>
  );
}