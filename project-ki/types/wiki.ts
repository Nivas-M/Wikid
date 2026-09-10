export interface WikiImage {
  source: string;
  width?: number;
  height?: number;
}

export interface WikiArticleItem {
  pageid?: number;
  title: string;
  normalizedtitle?: string;
  displaytitle?: string;
  description?: string;
  extract?: string;
  type?: string;
  thumbnail?: WikiImage;
  originalimage?: WikiImage;
  content_urls?: {
    desktop?: { page?: string };
    mobile?: { page?: string };
  };
  views?: number;
  rank?: number;
}

export interface WikiFeaturedFeedResponse {
  tfa?: WikiArticleItem;
  mostread?: {
    date: string;
    articles: WikiArticleItem[];
  };
}

export interface WikiPost {
  id: string;
  accountName: string;
  title: string;
  extract: string;
  imageUrl?: string;
  articleUrl?: string;
  views?: number;
  rank?: number;
}

