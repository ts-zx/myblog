import { getAllPosts, getAllTags } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";

export const metadata = { title: "所有文章" };

export default function PostsPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <div className="py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">所有文章</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          共 {posts.length} 篇 {tags.length > 0 && `· ${tags.length} 个标签`}
        </p>
      </header>

      {tags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {tags.map(({ tag, count }) => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              #{tag} <span className="ml-1.5 text-xs text-gray-500">{count}</span>
            </span>
          ))}
        </div>
      )}

      <div>
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}