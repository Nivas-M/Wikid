'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, MailCheck } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to send reset link. Please try again.');
        setIsLoading(false);
        return;
      }

      setIsSubmitted(true);
    } catch {
      setError('A connection error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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

      {/* Right Column: Request Form */}
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

        {/* Content Container */}
        <div className="mx-auto w-full max-w-sm py-12">
          {isSubmitted ? (
            <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-150">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
                <MailCheck className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  Check your inbox
                </h1>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  If an account is associated with <span className="font-semibold text-zinc-900 dark:text-white">{email}</span>, you will receive a password reset link shortly.
                </p>
                <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
                  The link will expire in 10 minutes for your security.
                </p>
              </div>

              <Link
                href="/login"
                className="inline-flex w-full items-center justify-center rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
              >
                Return to login
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
                  Reset your password
                </h1>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Enter your registered email and we’ll send you a password reset link.
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-95 disabled:opacity-50"
                >
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>Send Reset Link</span>
                </button>
              </form>
            </>
          )}
        </div>

        <div />
      </div>
    </div>
  );
}

