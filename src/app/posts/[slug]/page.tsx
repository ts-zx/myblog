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
import { TwikooComments } from "@/components/TwikooComments";
import {
  PostMeta,
  PostBackLink,
  PostFooterLink,
  CommentsTitle,
} from "@/components/PostMeta";

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
      // SEO: 显式声明索引策略
      robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-image-preview": "large" },
      },
      openGraph: {
        type: "article",
        title: frontmatter.title,
        description: frontmatter.description ?? "",
        url,
        siteName: siteConfig.name,
        locale: "zh_CN",
        publishedTime: new Date(frontmatter.date).toISOString(),
        modifiedTime: new Date(frontmatter.date).toISOString(),
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
  const url = `${siteConfig.url}/posts/${post.slug}`;

  // SEO: 文章级结构化数据 (BlogPosting)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#post`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: frontmatter.title,
    description: frontmatter.description ?? "",
    url,
    datePublished: new Date(frontmatter.date).toISOString(),
    dateModified: new Date(frontmatter.date).toISOString(),
    inLanguage: "zh-CN",
    wordCount: content.length,
    timeRequired: `PT${readingMinutes}M`,
    keywords: (frontmatter.tags ?? []).join(", "),
    author: { "@type": "Person", name: siteConfig.author, url: siteConfig.url },
    publisher: { "@type": "Person", name: siteConfig.author, url: siteConfig.url },
    image: `${siteConfig.url}/og-default.png`,
    ...(frontmatter.tags?.length
      ? {
          keywords: frontmatter.tags,
          articleSection: frontmatter.tags[0],
        }
      : {}),
  };

  return (
    <article className="py-10">
      <ReadingProgress />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PostBackLink />

      <header className="mt-6 pb-6 border-b">
        <h1 className="text-4xl font-bold tracking-tight leading-tight">{frontmatter.title}</h1>
        <PostMeta
          frontmatter={frontmatter}
          readingMinutes={readingMinutes}
          slug={post.slug}
        />
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
        <div className="mt-8 pt-6 border-t flex justify-center">
          <LikeButton slug={post.slug} />
        </div>
      )}

      {/* 评论系统：可在 site.config.ts 里切换 twikoo / giscus */}
      {siteConfig.commentSystem === "twikoo" ? (
        siteConfig.twikoo?.enabled && <TwikooComments />
      ) : (
        siteConfig.giscus?.enabled && <GiscusComments />
      )}

      <footer className="mt-8 pt-6 border-t text-sm text-gray-500">
        <PostFooterLink />
      </footer>
    </article>
  );
}

function GiscusComments() {
  const { repo, repoId, category, categoryId } = siteConfig.giscus;
  // 使用 dangerouslySetInnerHTML 而不是 next/script
  // 这样能保证 script 标签在 body 中正确渲染，giscus 才能找到容器
  const giscusScript = `
    (function() {
      var s = document.createElement('script');
      s.src = 'https://giscus.app/client.js';
      s.setAttribute('data-repo', '${repo}');
      s.setAttribute('data-repo-id', '${repoId}');
      s.setAttribute('data-category', '${category}');
      s.setAttribute('data-category-id', '${categoryId}');
      s.setAttribute('data-mapping', 'pathname');
      s.setAttribute('data-strict', '0');
      s.setAttribute('data-reactions-enabled', '1');
      s.setAttribute('data-emit-metadata', '0');
      s.setAttribute('data-input-position', 'top');
      s.setAttribute('data-theme', 'preferred_color_scheme');
      s.setAttribute('data-lang', 'zh-CN');
      s.setAttribute('crossOrigin', 'anonymous');
      s.async = true;
      // 把 script 插入到 .giscus 容器之前
      var target = document.currentScript.parentElement;
      target.insertBefore(s, target.lastChild);
    })();
  `;

  return (
    <div className="mt-8">
      <CommentsTitle />
      {/* giscus 会自动在这个 div 里渲染评论 iframe */}
      <div className="giscus" dangerouslySetInnerHTML={{ __html: '' }} />
      <script dangerouslySetInnerHTML={{ __html: giscusScript }} />
    </div>
  );
}