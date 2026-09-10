'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { X, Loader2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signup' | 'login';
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'signup' }: AuthModalProps) {
  const [mode, setMode] = useState<'signup' | 'login'>(defaultMode);
  const [username, setUsername] = useState('');
  const [emailOrUser, setEmailOrUser] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username,
            email: emailOrUser,
            password,
            confirmPassword,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Failed to create account.');
          setIsLoading(false);
          return;
        }

        const loginRes = await signIn('credentials', {
          email: username,
          password,
          redirect: false,
        });

        if (loginRes?.error) {
          setError('Account created, please sign in.');
          setMode('login');
          setIsLoading(false);
          return;
        }

        onClose();
      } else {
        const loginRes = await signIn('credentials', {
          email: emailOrUser,
          password,
          redirect: false,
        });

        if (loginRes?.error) {
          setError('Invalid email, username, or password.');
          setIsLoading(false);
          return;
        }

        onClose();
      }
    } catch {
      setError('A connection error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl transition-all dark:border-[#343536] dark:bg-[#1a1a1b] sm:p-8 animate-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-[#272729] dark:hover:text-gray-200"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Tabs */}
        <div className="mb-6">
          <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-2xl">
            {mode === 'signup' ? 'Join Wikid' : 'Welcome back'}
          </h2>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {mode === 'signup'
              ? 'Create an account to save articles and track what you learn.'
              : 'Sign in to access your saved articles.'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="mb-6 flex rounded-xl bg-gray-100 p-1 dark:bg-[#272729]">
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
              mode === 'signup'
                ? 'bg-white text-gray-900 shadow-xs dark:bg-[#1a1a1b] dark:text-gray-100'
                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
              mode === 'login'
                ? 'bg-white text-gray-900 shadow-xs dark:bg-[#1a1a1b] dark:text-gray-100'
                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            Log In
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="curious_mind"
                className="w-full rounded-xl border border-gray-200 bg-transparent px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-[#343536] dark:text-white"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
              {mode === 'signup' ? 'Email Address' : 'Email or Username'}
            </label>
            <input
              type={mode === 'signup' ? 'email' : 'text'}
              required
              value={emailOrUser}
              onChange={(e) => setEmailOrUser(e.target.value)}
              placeholder={mode === 'signup' ? 'you@example.com' : 'you@example.com or username'}
              className="w-full rounded-xl border border-gray-200 bg-transparent px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-[#343536] dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-gray-200 bg-transparent px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-[#343536] dark:text-white"
            />
          </div>

          {mode === 'signup' && (
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Confirm Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 bg-transparent px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-[#343536] dark:text-white"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-95 disabled:opacity-50 mt-2"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>{mode === 'signup' ? 'Create Account' : 'Sign In'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
