import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { siteConfig } from "@/app/site.config";

export default function HomePage() {
  const posts = getAllPosts().slice(0, 5);

  return (
    <div className="py-10">
      <section className="py-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          你好，我是 <span className="text-indigo-600 dark:text-indigo-400">{siteConfig.author}</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
          {siteConfig.description}。这里记录我的学习、生活和思考，欢迎常来逛逛 ✨
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/posts"
            className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition-colors"
          >
            浏览所有文章 →
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center px-4 py-2 rounded-md border text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            关于我
          </Link>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">最新文章</h2>
          <Link href="/posts" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
            全部 →
          </Link>
        </div>
        <div className="mt-2">
          {posts.length === 0 ? (
            <p className="py-10 text-center text-gray-500">还没有文章，去 <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800">content/posts</code> 写第一篇吧～</p>
          ) : (
            posts.map((post) => <PostCard key={post.slug} post={post} />)
          )}
        </div>
      </section>
    </div>
  );
}