import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { HomeGreeting, HomeLatestSection } from "@/components/HomeContent";
import { EmptyPosts } from "@/components/EmptyPosts";

export default function HomePage() {
  const posts = getAllPosts().slice(0, 5);

  return (
    <div className="py-10">
      <HomeGreeting />

      <HomeLatestSection>
        {posts.length === 0 ? (
          <EmptyPosts />
        ) : (
          posts.map((post) => (
            <PostCard key={post.slug} post={post} headingLevel={3} />
          ))
        )}
      </HomeLatestSection>
    </div>
  );
}
