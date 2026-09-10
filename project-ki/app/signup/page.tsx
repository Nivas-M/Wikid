'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your password.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Call registration endpoint with username and confirmPassword
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create account.');
        setIsLoading(false);
        return;
      }

      // 2. Automatically log the user in
      const loginRes = await signIn('credentials', {
        email: username,
        password,
        redirect: false,
      });

      if (loginRes?.error) {
        setError('Account created, but could not sign in automatically. Please log in.');
        setIsLoading(false);
        router.push('/login');
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
      {/* Left Column: Pure Thematic Visual with "Wikid" on the top left */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-zinc-950">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70 mix-blend-luminosity scale-105 transition-transform duration-1000 ease-out hover:scale-100"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1600&auto=format&fit=crop')`,
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

      {/* Right Column: Registration Form */}
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
            href="/login"
            className="text-xs font-semibold text-orange-600 hover:text-orange-500 dark:text-orange-400 transition-colors"
          >
            Already have an account?
          </Link>
        </div>

        {/* Form Container */}
        <div className="mx-auto w-full max-w-sm py-8 sm:py-12">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
              Create your account
            </h1>
            <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
              Join Wikid to save articles and shape your learning feed.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} suppressHydrationWarning className="space-y-3.5">
            <div>
              <label className="mb-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Username
              </label>
              <input
                type="text"
                required
                pattern="^[a-zA-Z0-9_]{3,20}$"
                autoComplete="username"
                suppressHydrationWarning
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="curious_mind"
                className="w-full rounded-xl border border-zinc-200 bg-transparent px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-zinc-800 dark:text-white"
              />
              <p className="mt-1 text-[11px] text-zinc-400 dark:text-zinc-500">
                3-20 letters, numbers, or underscores.
              </p>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Email Address
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                suppressHydrationWarning
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-zinc-200 bg-transparent px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-zinc-800 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                suppressHydrationWarning
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-zinc-200 bg-transparent px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-zinc-800 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Confirm Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                suppressHydrationWarning
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-zinc-200 bg-transparent px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-zinc-800 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-95 disabled:opacity-50"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>Create Account</span>
            </button>
          </form>
        </div>

        {/* Empty bottom spacer for layout alignment */}
        <div />
      </div>
    </div>
  );
}
