import Navbar from "@/components/Navbar";
import RedditPostCard from "@/components/RedditPostCard";

interface WikiArticleResponse {
  title: string;
  description?: string;
  extract?: string;
  thumbnail?: { source: string };
  originalimage?: { source: string };
  content_urls?: {
    desktop?: { page?: string };
  };
}

async function fetchWikiPost(title: string): Promise<{ data?: WikiArticleResponse; error?: string }> {
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    const headers = { "User-Agent": "Wikid/1.0 (nivasm7958@gmail.com)" };

    const res = await fetch(url, {
      headers,
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return { error: `Wikipedia API returned error status: ${res.status} ${res.statusText}` };
    }

    const data: WikiArticleResponse = await res.json();
    return { data };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to connect to Wikipedia API" };
  }
}

export default async function Home() {
  const { data, error } = await fetchWikiPost("James_Webb_Space_Telescope");

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-[#0e1113]">
      <Navbar />
      <main className="flex justify-center px-4 py-8">
        {error ? (
          <div className="w-full max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
            <h3 className="mb-1 text-base font-semibold">Error Loading Post</h3>
            <p className="text-sm">{error}</p>
          </div>
        ) : data ? (
          <RedditPostCard
            accountName={data.title}
            title={data.description || "No short description"}
            extract={data.extract || "No summary available"}
            imageUrl={data.originalimage?.source || data.thumbnail?.source}
            articleUrl={data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/James_Webb_Space_Telescope`}
          />
        ) : null}
      </main>
    </div>
  );
}
