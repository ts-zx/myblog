import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { HomeGreeting, HomeLatestSection } from "@/components/HomeContent";

export default function HomePage() {
  const posts = getAllPosts().slice(0, 5);

  return (
    <div className="py-10">
      <HomeGreeting />

      <HomeLatestSection>
        {posts.length === 0 ? (
          <p className="py-10 text-center text-gray-500">
            还没有文章，去{" "}
            <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800">
              content/posts
            </code>{" "}
            写第一篇吧～
          </p>
        ) : (
          posts.map((post) => (
            <PostCard key={post.slug} post={post} headingLevel={3} />
          ))
        )}
      </HomeLatestSection>
    </div>
  );
}
