'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!token) {
    return (
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Invalid Link
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          This password reset link is missing a valid token.
        </p>
        <Link
          href="/forgot-password"
          className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-orange-500"
        >
          Request new reset link
        </Link>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-150">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Password reset complete
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Your password has been successfully updated. You can now sign in with your new credentials.
          </p>
        </div>

        <Link
          href="/login"
          className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to reset password. The link may have expired.');
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
    } catch {
      setError('A connection error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
          Set new password
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Enter your new password below. Must be at least 8 characters.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} suppressHydrationWarning className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            New Password
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
          <label className="mb-1.5 block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Confirm New Password
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
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-95 disabled:opacity-50"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>Update Password</span>
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-[#0e1113]">
      {/* Left Column: Pure Thematic Visual with "Wikid" on top left */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-zinc-950">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70 mix-blend-luminosity scale-105 transition-transform duration-1000 ease-out hover:scale-100"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30" />

        {/* Top Left: Just the word Wikid */}
        <div className="relative z-10">
          <Link href="/" className="text-3xl font-black tracking-tight text-white hover:text-orange-400 transition-colors">
            Wikid
          </Link>
        </div>

        <div />
      </div>

      {/* Right Column: Reset Form */}
      <div className="flex flex-col justify-between p-6 sm:p-12 lg:p-16">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to login</span>
          </Link>

          <Link
            href="/signup"
            className="text-xs font-semibold text-orange-600 hover:text-orange-500 dark:text-orange-400 transition-colors"
          >
            Create an account
          </Link>
        </div>

        <div className="mx-auto w-full max-w-sm py-12">
          <Suspense fallback={<div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-orange-500" /></div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>

        <div />
      </div>
    </div>
  );
}

