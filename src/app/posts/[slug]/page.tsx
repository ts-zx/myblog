import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { siteConfig } from "@/app/site.config";
import { ViewCounter } from "@/components/ViewCounter";
import { LikeButton } from "@/components/LikeButton";
import { ReadingProgress } from "@/components/ReadingProgress";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const post = getPostBySlug(params.slug);
    const { frontmatter, slug } = post;
    const url = `${siteConfig.url}/posts/${slug}`;
    const ogImage = frontmatter.cover
      ? (frontmatter.cover.startsWith("http") ? frontmatter.cover : `${siteConfig.url}${frontmatter.cover}`)
      : `${siteConfig.url}/og-default.png`;

    return {
      title: frontmatter.title,
      description: frontmatter.description,
      authors: [{ name: siteConfig.author }],
      keywords: frontmatter.tags,
      alternates: { canonical: url },
      openGraph: {
        type: "article",
        title: frontmatter.title,
        description: frontmatter.description ?? "",
        url,
        siteName: siteConfig.name,
        locale: "zh_CN",
        publishedTime: new Date(frontmatter.date).toISOString(),
        authors: [siteConfig.author],
        tags: frontmatter.tags,
        images: [{ url: ogImage, width: 1200, height: 630, alt: frontmatter.title }],
      },
      twitter: {
        card: "summary_large_image",
        title: frontmatter.title,
        description: frontmatter.description ?? "",
        images: [ogImage],
      },
    };
  } catch {
    return { title: "Not Found" };
  }
}

export default function PostPage({ params }: { params: { slug: string } }) {
  let post;
  try {
    post = getPostBySlug(params.slug);
  } catch {
    notFound();
  }
  const { frontmatter, content, readingMinutes } = post;

  return (
    <article className="py-10">
      <ReadingProgress />
      <Link href="/posts" className="text-sm text-gray-500 hover:text-indigo-500">
        ← 返回所有文章
      </Link>

      <header className="mt-6 pb-6 border-b">
        <h1 className="text-4xl font-bold tracking-tight leading-tight">{frontmatter.title}</h1>
        <div className="mt-3 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <time dateTime={frontmatter.date}>{format(new Date(frontmatter.date), "yyyy-MM-dd")}</time>
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
          <span>·</span>
          <ViewCounter slug={post.slug} />
        </div>
        {frontmatter.description && (
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            {frontmatter.description}
          </p>
        )}
      </header>

      <div className="prose dark:prose-invert mt-8 max-w-none">
        <MDXRemote
          source={content}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [
                rehypeSlug,
                [rehypeAutolinkHeadings, { behavior: "wrap" }],
              ],
            },
          }}
        />
      </div>

      {siteConfig.likes?.enabled && (
        <div className="mt-10 pt-6 border-t flex justify-center">
          <LikeButton slug={post.slug} />
        </div>
      )}

      {siteConfig.giscus?.enabled && <GiscusComments />}

      <footer className="mt-12 pt-6 border-t text-sm text-gray-500">
        <Link href="/posts" className="hover:text-indigo-500">
          ← 回到文章列表
        </Link>
      </footer>
    </article>
  );
}

function GiscusComments() {
  const { repo, repoId, category, categoryId } = siteConfig.giscus;
  // 使用 dangerouslySetInnerHTML 而不是 next/script
  // 这样能保证 script 标签在 body 中正确渲染，giscus 才能找到容器
  const giscusScript = `
    const giscusScript = document.createElement('script');
    giscusScript.src = 'https://giscus.app/client.js';
    giscusScript.setAttribute('data-repo', '${repo}');
    giscusScript.setAttribute('data-repo-id', '${repoId}');
    giscusScript.setAttribute('data-category', '${category}');
    giscusScript.setAttribute('data-category-id', '${categoryId}');
    giscusScript.setAttribute('data-mapping', 'pathname');
    giscusScript.setAttribute('data-strict', '0');
    giscusScript.setAttribute('data-reactions-enabled', '1');
    giscusScript.setAttribute('data-emit-metadata', '0');
    giscusScript.setAttribute('data-input-position', 'top');
    giscusScript.setAttribute('data-theme', 'preferred_color_scheme');
    giscusScript.setAttribute('data-lang', 'zh-CN');
    giscusScript.setAttribute('crossOrigin', 'anonymous');
    giscusScript.async = true;
    document.currentScript.parentElement.appendChild(giscusScript);
  `;

  return (
    <div className="mt-12">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">评论</h3>
      {/* giscus 会自动在这个 div 里渲染评论 iframe */}
      <div className="giscus" dangerouslySetInnerHTML={{ __html: '' }} />
      <script dangerouslySetInnerHTML={{ __html: giscusScript }} />
    </div>
  );
}