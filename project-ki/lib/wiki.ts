import { WikiArticleItem, WikiFeaturedFeedResponse, WikiPost } from '@/types/wiki';

const WIKIPEDIA_USER_AGENT = 'Wikid/1.0 (contact: nivasm7958@gmail.com)';

function getDateParts(daysAgo: number = 1): { year: string; month: string; day: string; formatted: string } {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysAgo);
  const year = d.getUTCFullYear().toString();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return { year, month, day, formatted: `${year}/${month}/${day}` };
}

function isValidArticle(article: WikiArticleItem): boolean {
  if (!article.title || !article.extract) return false;
  if (article.type === 'disambiguation') return false;

  const normalized = article.title.toLowerCase();
  if (normalized === 'main_page' || normalized.startsWith('special:')) return false;

  return true;
}

function mapToWikiPost(article: WikiArticleItem): WikiPost {
  const fallbackName = article.title.replace(/_/g, ' ');
  return {
    id: String(article.pageid || article.title),
    accountName: article.normalizedtitle || fallbackName,
    title: article.description || article.normalizedtitle || fallbackName,
    extract: article.extract || '',
    imageUrl: article.originalimage?.source || article.thumbnail?.source,
    articleUrl: article.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(article.title)}`,
    views: article.views,
    rank: article.rank,
  };
}

export async function fetchTrendingArticles(): Promise<{ posts: WikiPost[]; date?: string; error?: string }> {
  // Try yesterday first (usually final pageviews are compiled), fallback to 2 days ago if needed
  const attempts = [1, 2];

  for (const daysAgo of attempts) {
    const { year, month, day, formatted } = getDateParts(daysAgo);
    const url = `https://en.wikipedia.org/api/rest_v1/feed/featured/${year}/${month}/${day}`;

    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': WIKIPEDIA_USER_AGENT,
        },
        next: { revalidate: 3600 },
      });

      if (!res.ok) {
        continue; // Try previous day
      }

      const data: WikiFeaturedFeedResponse = await res.json();
      const rawArticles = data.mostread?.articles || [];

      const posts = rawArticles
        .filter(isValidArticle)
        .map(mapToWikiPost);

      if (posts.length > 0) {
        return { posts, date: formatted };
      }
    } catch (err) {
      // Continue to next attempt on network issue
      if (daysAgo === attempts[attempts.length - 1]) {
        return {
          posts: [],
          error: err instanceof Error ? err.message : 'Network error connecting to Wikipedia API',
        };
      }
    }
  }

  return {
    posts: [],
    error: 'No trending articles found for recent dates from Wikipedia.',
  };
}

