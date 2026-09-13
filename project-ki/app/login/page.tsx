'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await signIn('credentials', {
        email: identifier,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError('Invalid email, username, or password.');
        setIsLoading(false);
        return;
      }

      router.push('/');
      router.refresh();
    } catch {
      setError('A connection error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-[#0e1113]">
      {/* Left Column: Pure Artistic Visual with "Wikid" on the top left */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-zinc-950">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70 mix-blend-luminosity scale-105 transition-transform duration-1000 ease-out hover:scale-100"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30" />

        {/* Top Left: Just the word Wikid, no logo */}
        <div className="relative z-10">
          <Link href="/" className="text-3xl font-black tracking-tight text-white hover:text-orange-400 transition-colors">
            Wikid
          </Link>
        </div>

        {/* Empty bottom spacer for layout balance */}
        <div />
      </div>

      {/* Right Column: Actual Login Form */}
      <div className="flex flex-col justify-between p-6 sm:p-12 lg:p-16">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to feed</span>
          </Link>

          <Link
            href="/signup"
            className="text-xs font-semibold text-orange-600 hover:text-orange-500 dark:text-orange-400 transition-colors"
          >
            Create an account
          </Link>
        </div>

        {/* Form Container */}
        <div className="mx-auto w-full max-w-sm py-12">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Sign in with your email or username.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} suppressHydrationWarning className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Email or Username
              </label>
              <input
                type="text"
                required
                autoComplete="username"
                suppressHydrationWarning
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="you@example.com or username"
                className="w-full rounded-xl border border-zinc-200 bg-transparent px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-zinc-800 dark:text-white"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-orange-600 hover:text-orange-500 dark:text-orange-400 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                autoComplete="current-password"
                suppressHydrationWarning
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-zinc-200 bg-transparent px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-zinc-800 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-95 disabled:opacity-50"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>Sign In</span>
            </button>
          </form>
        </div>

        {/* Empty bottom spacer for layout alignment */}
        <div />
      </div>
    </div>
  );
}
