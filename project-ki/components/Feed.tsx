'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp, Sparkles } from 'lucide-react';
import { WikiPost } from '@/types/wiki';
import RedditPostCard from '@/components/RedditPostCard';
import CardSkeleton from '@/components/CardSkeleton';

interface FeedProps {
  posts: WikiPost[];
  error?: string;
  date?: string;
}

const BATCH_SIZE = 5;

export default function Feed({ posts, error }: FeedProps) {
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Monitor scroll depth for floating "Back to top" button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Progressive batch loading when scrolling near sentinel
  useEffect(() => {
    if (visibleCount >= posts.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, posts.length));
            setIsLoadingMore(false);
          }, 250);
        }
      },
      { rootMargin: '300px' }
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) observer.observe(currentSentinel);

    return () => {
      if (currentSentinel) observer.unobserve(currentSentinel);
    };
  }, [visibleCount, posts.length, isLoadingMore]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const visiblePosts = posts.slice(0, visibleCount);
  const isAllLoaded = visibleCount >= posts.length && posts.length > 0;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-8 md:max-w-5xl">
      {/* Trending Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
          Trending
        </h1>
      </div>

      {/* Error Alert */}
      {error ? (
        <div className="w-full rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
          <h2 className="mb-1 text-base font-semibold">Unable to load trending feed</h2>
          <p className="text-sm">{error}</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="w-full rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500 dark:border-[#343536] dark:bg-[#1a1a1b] dark:text-gray-400">
          <p className="text-sm">No trending articles available at the moment.</p>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-6 sm:space-y-8">
          {/* Rendered Visible Posts */}
          {visiblePosts.map((post) => (
            <RedditPostCard
              key={post.id}
              accountName={post.accountName}
              title={post.title}
              extract={post.extract}
              imageUrl={post.imageUrl}
              articleUrl={post.articleUrl}
            />
          ))}

          {/* Skeleton placeholder during next batch load */}
          {isLoadingMore && <CardSkeleton />}

          {/* Observer Sentinel */}
          {!isAllLoaded && <div ref={sentinelRef} className="h-10 w-full" />}

          {/* End-of-Feed State */}
          {isAllLoaded && (
            <div className="my-8 flex w-full max-w-3xl flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-300 bg-white/50 p-8 text-center dark:border-[#343536] dark:bg-[#1a1a1b]/50 md:max-w-5xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                You&apos;re all caught up!
              </h3>
              <p className="max-w-md text-sm text-gray-500 dark:text-gray-400">
                That&apos;s all the top trending topics from Wikipedia for today. Come back tomorrow for fresh knowledge!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Floating "Back to Top" Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2.5 text-xs font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95 dark:bg-white dark:text-gray-900"
        >
          <ArrowUp className="h-4 w-4" />
          <span>Back to top</span>
        </button>
      )}
    </div>
  );
}
