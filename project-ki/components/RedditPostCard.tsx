'use client';

import React, { useState } from 'react';
import {
  Share2,
  Bookmark,
  MoreHorizontal,
  ImageIcon,
  Check,
  Copy,
  ExternalLink,
} from 'lucide-react';

export interface RedditPostCardProps {
  /** Article name or entity, e.g. "James Webb Space Telescope" */
  accountName: string;
  /** Short description / hook title */
  title: string;
  /** Intro paragraph / summary extract */
  extract: string;
  /** Optional featured image URL */
  imageUrl?: string;
  /** Optional image alt text */
  imageAlt?: string;
  /** Link to original Wikipedia article */
  articleUrl?: string;
  /** Additional container classes */
  className?: string;
}

export const RedditPostCard: React.FC<RedditPostCardProps> = ({
  accountName,
  title,
  extract,
  imageUrl,
  imageAlt,
  articleUrl,
  className = '',
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSaveToggle = () => {
    const nextState = !isSaved;
    setIsSaved(nextState);
    triggerToast(nextState ? 'Post saved to your bookmarks' : 'Post unsaved');
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

  const avatarLetter = (accountName?.replace(/^[@/]/, '').trim().charAt(0) || 'W').toUpperCase();
  const altText = imageAlt || title || 'Wikipedia article image';

  return (
    <div
      className={`relative w-full max-w-3xl md:max-w-5xl bg-white dark:bg-[#1a1a1b] border border-gray-200 dark:border-[#343536] rounded-2xl shadow-sm hover:border-gray-300 dark:hover:border-[#4e5052] transition-colors duration-150 overflow-hidden ${className}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 md:min-h-[550px]">
        {/* Left Column (Top): Header, Title, Extract */}
        <div className="col-start-1 row-start-1 flex flex-col p-5 sm:p-6 md:pr-6">
          {/* Post Header: Account metadata & overflow actions */}
          <div className="flex items-center justify-between gap-3 pb-2">
            <div className="flex items-center gap-3 min-w-0">
              {/* Account Avatar */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-bold flex items-center justify-center text-sm flex-shrink-0 shadow-xs select-none">
                {avatarLetter}
              </div>

              {/* Account name */}
              <div className="flex items-center text-xs truncate">
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
          <div className="pt-1">
            {articleUrl ? (
              <a
                href={articleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-block"
              >
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 leading-snug tracking-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  {title}
                </h2>
              </a>
            ) : (
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 leading-snug tracking-tight">
                {title}
              </h2>
            )}
          </div>

          {/* Intro Extract Paragraph */}
          {extract && (
            <div className="pt-3 flex-1">
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                {extract}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Image Container Slot */}
        <div className="col-start-1 row-start-2 md:col-start-2 md:row-start-1 md:row-span-2 relative flex items-center justify-center bg-gray-50 dark:bg-[#121314] overflow-hidden md:border-l border-gray-100 dark:border-[#27282a]">
          <div className="w-full h-full p-3 sm:p-4 md:p-0 flex items-center justify-center">
            {imageUrl ? (
              articleUrl ? (
                <a
                  href={articleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open Wikipedia article"
                  className="group/img block w-full h-full max-h-[550px] md:max-h-none rounded-xl md:rounded-none overflow-hidden cursor-pointer"
                >
                  <img
                    src={imageUrl}
                    alt={altText}
                    className="w-full h-full min-h-[310px] md:min-h-full max-h-[550px] md:max-h-none object-cover transition-transform duration-200 group-hover/img:scale-[1.02]"
                    loading="lazy"
                  />
                </a>
              ) : (
                <div className="w-full h-full max-h-[550px] md:max-h-none rounded-xl md:rounded-none overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={altText}
                    className="w-full h-full min-h-[310px] md:min-h-full max-h-[550px] md:max-h-none object-cover"
                    loading="lazy"
                  />
                </div>
              )
            ) : (
              <div className="w-full aspect-[16/9] md:aspect-auto md:h-full rounded-xl md:rounded-none border-2 border-dashed border-gray-300 dark:border-[#383a3c] bg-gray-50/70 dark:bg-[#131517] flex flex-col items-center justify-center p-6 text-center transition-colors group">
                <div className="w-12 h-12 rounded-full bg-gray-200/80 dark:bg-[#222426] flex items-center justify-center text-gray-400 dark:text-gray-500 group-hover:scale-105 transition-transform mb-2.5">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                  No image available
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Left Column (Bottom): Actions Footer */}
        <div className="col-start-1 row-start-3 md:col-start-1 md:row-start-2 self-end p-4 sm:p-5 border-t border-gray-100 dark:border-[#27282a]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Share Button */}
              <button
                onClick={handleCopyLink}
                aria-label="Share post"
                className="h-9 px-3.5 rounded-full bg-gray-100 dark:bg-[#272729] hover:bg-gray-200/80 dark:hover:bg-[#323335] text-gray-700 dark:text-[#D7DADC] text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>

              {/* Open on Wikipedia */}
              {articleUrl && (
                <a
                  href={articleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 px-3.5 rounded-full bg-gray-100 dark:bg-[#272729] hover:bg-gray-200/80 dark:hover:bg-[#323335] text-gray-700 dark:text-[#D7DADC] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Wikipedia</span>
                </a>
              )}
            </div>

            {/* Quick Save Bookmark */}
            <button
              onClick={handleSaveToggle}
              aria-label={isSaved ? 'Saved' : 'Save'}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                isSaved
                  ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/30'
                  : 'text-gray-500 dark:text-[#818384] hover:bg-gray-100 dark:hover:bg-[#272729] hover:text-gray-800 dark:hover:text-white'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500' : ''}`} />
            </button>
          </div>
        </div>
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
