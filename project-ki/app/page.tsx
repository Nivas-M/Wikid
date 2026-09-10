import Navbar from "@/components/Navbar";
import Feed from "@/components/Feed";
import { fetchTrendingArticles } from "@/lib/wiki";

export default async function Home() {
  const { posts, error } = await fetchTrendingArticles();

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-[#0e1113]">
      <Navbar />
      <main>
        <Feed posts={posts} error={error} />
      </main>
    </div>
  );
}
