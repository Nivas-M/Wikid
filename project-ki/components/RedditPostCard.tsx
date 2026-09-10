'use client';

import React, { useState } from 'react';
import {
  ArrowBigUp,
  ArrowBigDown,
  MessageSquare,
  Share2,
  Bookmark,
  MoreHorizontal,
  ImageIcon,
  Check,
  Copy,
  ExternalLink,
} from 'lucide-react';

export interface RedditPostCardProps {
  /** Account display name, e.g. "James Webb Space Telescope" or "@username" */
  accountName?: string;
  /** Relative posted time */
  timeAgo?: string;
  /** Post heading text (e.g., short description/tagline) */
  title?: string;
  /** Intro paragraph / summary extract */
  extract?: string;
  /** Initial count of upvotes */
  initialScore?: number;
  /** Comment count displayed on action button */
  commentCount?: number;
  /** Optional custom image URL */
  imageUrl?: string;
  /** Optional image alt text */
  imageAlt?: string;
  /** Link to original article */
  articleUrl?: string;
  /** Custom callback when bookmark is toggled */
  onSaveToggle?: (isSaved: boolean) => void;
  /** Custom callback when voting occurs */
  onVoteChange?: (newScore: number, voteDirection: 'up' | 'down' | null) => void;
  /** Additional container classes */
  className?: string;
}

export const RedditPostCard: React.FC<RedditPostCardProps> = ({
  accountName = 'Wikipedia',
  timeAgo = 'Featured',
  title = '',
  extract,
  initialScore = 4821,
  commentCount = 142,
  imageUrl,
  imageAlt = 'Post visual content',
  articleUrl,
  onSaveToggle,
  onVoteChange,
  className = '',
}) => {
  const [vote, setVote] = useState<'up' | 'down' | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Calculate current display score based on vote state
  const currentScore = initialScore + (vote === 'up' ? 1 : vote === 'down' ? -1 : 0);

  const formatNumber = (num: number): string => {
    if (Math.abs(num) >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const handleVote = (type: 'up' | 'down') => {
    const nextVote = vote === type ? null : type;
    setVote(nextVote);
    const updatedScore = initialScore + (nextVote === 'up' ? 1 : nextVote === 'down' ? -1 : 0);
    onVoteChange?.(updatedScore, nextVote);
  };

  const handleSaveToggle = () => {
    const nextState = !isSaved;
    setIsSaved(nextState);
    onSaveToggle?.(nextState);
    triggerToast(nextState ? 'Post saved to your profile' : 'Post unsaved');
    setShowMenu(false);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2400);
  };

  const handleCopyLink = () => {
    const linkToCopy = articleUrl || (typeof window !== 'undefined' ? window.location.href : '');
    if (typeof window !== 'undefined' && navigator.clipboard && linkToCopy) {
      navigator.clipboard.writeText(linkToCopy);
      triggerToast('Link copied to clipboard!');
    }
    setShowMenu(false);
  };

  const avatarLetter = (accountName.replace(/^[@/]/, '').trim().charAt(0) || 'W').toUpperCase();

  return (
    <div
      className={`relative w-full max-w-2xl bg-white dark:bg-[#1a1a1b] border border-gray-200 dark:border-[#343536] rounded-2xl shadow-sm hover:border-gray-300 dark:hover:border-[#4e5052] transition-colors duration-150 overflow-hidden ${className}`}
    >
      {/* Post Header: Account metadata & overflow actions */}
      <div className="p-3 sm:p-4 pb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Account Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-bold flex items-center justify-center text-xs flex-shrink-0 shadow-xs select-none">
            {avatarLetter}
          </div>

          {/* Account name & timestamp */}
          <div className="flex items-center gap-1.5 text-xs truncate">
            {articleUrl ? (
              <a
                href={articleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-gray-900 dark:text-gray-100 hover:underline cursor-pointer truncate"
              >
                {accountName}
              </a>
            ) : (
              <span className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                {accountName}
              </span>
            )}
            <span className="text-gray-400 dark:text-[#818384] select-none">•</span>
            <span className="text-gray-500 dark:text-[#818384] flex-shrink-0">{timeAgo}</span>
          </div>
        </div>

        {/* Header Actions */}
        <div className="relative flex items-center">
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            aria-label="Post actions"
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 dark:text-[#818384] hover:bg-gray-100 dark:hover:bg-[#272729] hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-9 w-48 bg-white dark:bg-[#202225] border border-gray-200 dark:border-[#343536] rounded-xl shadow-xl py-1.5 z-20 text-xs text-gray-700 dark:text-gray-200">
              <button
                onClick={handleCopyLink}
                className="w-full text-left px-3.5 py-2 hover:bg-gray-100 dark:hover:bg-[#272729] flex items-center gap-2"
              >
                <Copy className="w-3.5 h-3.5 text-gray-500" />
                <span>Copy link</span>
              </button>
              {articleUrl && (
                <a
                  href={articleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowMenu(false)}
                  className="w-full text-left px-3.5 py-2 hover:bg-gray-100 dark:hover:bg-[#272729] flex items-center gap-2"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                  <span>Open on Wikipedia</span>
                </a>
              )}
              <button
                onClick={handleSaveToggle}
                className="w-full text-left px-3.5 py-2 hover:bg-gray-100 dark:hover:bg-[#272729] flex items-center gap-2"
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'text-amber-500 fill-amber-500' : 'text-gray-500'}`} />
                <span>{isSaved ? 'Unsave post' : 'Save post'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Post Title (Short Description / Tagline) */}
      <div className="px-3 sm:px-4 pt-1">
        {articleUrl ? (
          <a
            href={articleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-block"
          >
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 leading-snug tracking-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
              {title}
            </h2>
          </a>
        ) : (
          <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 leading-snug tracking-tight">
            {title}
          </h2>
        )}
      </div>

      {/* Intro Extract Paragraph */}
      {extract && (
        <div className="px-3 sm:px-4 pt-2">
          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {extract}
          </p>
        </div>
      )}

      {/* Image Container Slot */}
      <div className="mt-3 px-3 sm:px-4">
        {imageUrl ? (
          <div className="w-full rounded-xl overflow-hidden border border-gray-200 dark:border-[#343536] bg-gray-50 dark:bg-[#121314]">
            <img
              src={imageUrl}
              alt={imageAlt}
              className="w-full h-auto max-h-[500px] object-cover"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="w-full aspect-[16/9] sm:aspect-[21/9] rounded-xl border-2 border-dashed border-gray-300 dark:border-[#383a3c] bg-gray-50/70 dark:bg-[#131517] flex flex-col items-center justify-center p-6 text-center transition-colors group">
            <div className="w-12 h-12 rounded-full bg-gray-200/80 dark:bg-[#222426] flex items-center justify-center text-gray-400 dark:text-gray-500 group-hover:scale-105 transition-transform mb-2.5">
              <ImageIcon className="w-6 h-6" />
            </div>
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
              No image available
            </p>
          </div>
        )}
      </div>

      {/* Post Footer: Upvote Capsule & Clean Actions */}
      <div className="p-3 sm:p-4 pt-3 mt-1 flex items-center justify-between border-t border-gray-100 dark:border-[#27282a]">
        <div className="flex items-center gap-2">
          {/* Voting Capsule */}
          <div className="inline-flex items-center bg-gray-100 dark:bg-[#272729] hover:bg-gray-200/80 dark:hover:bg-[#323335] rounded-full p-0.5 transition-colors">
            <button
              onClick={() => handleVote('up')}
              aria-label="Upvote"
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                vote === 'up'
                  ? 'text-[#FF4500] bg-orange-500/10'
                  : 'text-gray-600 dark:text-[#818384] hover:text-[#FF4500] hover:bg-orange-500/10'
              }`}
            >
              <ArrowBigUp className={`w-5 h-5 ${vote === 'up' ? 'fill-[#FF4500]' : ''}`} />
            </button>

            <span
              className={`text-xs font-bold px-1 min-w-[28px] text-center select-none ${
                vote === 'up'
                  ? 'text-[#FF4500]'
                  : vote === 'down'
                  ? 'text-[#7193FF]'
                  : 'text-gray-800 dark:text-[#D7DADC]'
              }`}
            >
              {formatNumber(currentScore)}
            </span>

            <button
              onClick={() => handleVote('down')}
              aria-label="Downvote"
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                vote === 'down'
                  ? 'text-[#7193FF] bg-blue-500/10'
                  : 'text-gray-600 dark:text-[#818384] hover:text-[#7193FF] hover:bg-blue-500/10'
              }`}
            >
              <ArrowBigDown className={`w-5 h-5 ${vote === 'down' ? 'fill-[#7193FF]' : ''}`} />
            </button>
          </div>

          {/* Comments Count Display */}
          <button
            onClick={() => triggerToast(`${commentCount} comments available`)}
            aria-label="View comments"
            className="h-8 px-3 rounded-full bg-gray-100 dark:bg-[#272729] hover:bg-gray-200/80 dark:hover:bg-[#323335] text-gray-700 dark:text-[#D7DADC] text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{formatNumber(commentCount)}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleCopyLink}
            aria-label="Share post"
            className="h-8 px-3 rounded-full bg-gray-100 dark:bg-[#272729] hover:bg-gray-200/80 dark:hover:bg-[#323335] text-gray-700 dark:text-[#D7DADC] text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>

        {/* Quick Save Bookmark */}
        <button
          onClick={handleSaveToggle}
          aria-label={isSaved ? 'Saved' : 'Save'}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            isSaved
              ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30'
              : 'text-gray-500 dark:text-[#818384] hover:bg-gray-100 dark:hover:bg-[#272729] hover:text-gray-800 dark:hover:text-white'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500' : ''}`} />
        </button>
      </div>

      {/* Floating Action Feedback Toast */}
      {toastMessage && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 px-3.5 py-1.5 rounded-full bg-gray-900/95 dark:bg-white/95 text-white dark:text-gray-900 text-xs font-medium shadow-lg flex items-center gap-2 backdrop-blur-xs animate-in fade-in duration-200">
          <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default RedditPostCard;
