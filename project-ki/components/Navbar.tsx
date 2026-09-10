'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { LogOut, User as UserIcon } from 'lucide-react';

export default function Navbar() {
  const { data: session } = useSession();
  const [showMenu, setShowMenu] = useState(false);

  const userInitial = session?.user?.email
    ? session.user.email.charAt(0).toUpperCase()
    : 'U';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-black/80">
      <div className="mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 group-hover:text-orange-500 transition-colors">
            Wikid
          </span>
        </Link>

        <div className="relative flex items-center">
          {session ? (
            <>
              <button
                type="button"
                onClick={() => setShowMenu((prev) => !prev)}
                aria-label="Account menu"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-xs font-bold text-white shadow-xs transition hover:opacity-90"
              >
                {userInitial}
              </button>

              {showMenu && (
                <div className="absolute right-0 top-11 z-50 w-52 rounded-2xl border border-gray-200 bg-white py-2 shadow-xl dark:border-[#343536] dark:bg-[#1a1a1b] text-xs animate-in fade-in zoom-in-95 duration-150">
                  <div className="border-b border-gray-100 px-4 py-2 dark:border-[#27282a]">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {session.user?.email}
                    </p>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                      Active Account
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      signOut();
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#272729]"
                  >
                    <LogOut className="h-4 w-4 text-gray-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link
              href="/login"
              aria-label="Log in to Wikid"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            >
              <UserIcon className="h-5 w-5" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
