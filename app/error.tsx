'use client';

/**
 * Global Error Boundary Component
 * 
 * Catches errors in the React component tree and displays a user-friendly error page.
 * This prevents the entire app from crashing and provides a way to recover.
 * 
 * In production, this component:
 * - Hides technical error details from users
 * - Provides a "Try again" button to reset the error state
 * - Logs errors for debugging (in development)
 */

import { useEffect } from 'react';
import { Home, RefreshCw, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Log error in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error boundary caught:', error);
    }
    // In production, you could send to error tracking service:
    // if (process.env.NODE_ENV === 'production') {
    //   // Send to Sentry, LogRocket, etc.
    // }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Something went wrong!
          </h1>
          <p className="text-gray-600 mb-6">
            We encountered an unexpected error. Don't worry, our team has been notified.
          </p>
        </div>

        {/* Show error details only in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
            <p className="text-sm font-semibold text-red-900 mb-2">Error Details (Dev Only):</p>
            <p className="text-xs text-red-700 font-mono break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-red-600 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          If this problem persists, please{' '}
          <Link href="/contact" className="text-primary hover:underline">
            contact us
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

