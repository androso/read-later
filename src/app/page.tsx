'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Redirect to dashboard if user is already authenticated
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading while checking authentication status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f3f0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#4a3b2e] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#4a3b2e]">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render the landing page if user is authenticated (will redirect)
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f5f3f0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#4a3b2e] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#4a3b2e]">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f3f0] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* App Icon and Title */}
        <div className="text-center">
          <div className="w-16 h-16 bg-[#4a3b2e] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-2xl">📚</span>
          </div>

          <h1 className="text-4xl font-bold text-[#4a3b2e] mb-4">
            Read Later
          </h1>
          <p className="text-gray-600 mb-8">
            Save, organize, and read your favorite articles and content all in one place.
          </p>
        </div>

        {/* Features */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-[#4a3b2e] mb-4 text-center">
            Why Choose Read Later?
          </h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-[#e67e55] rounded-full flex-shrink-0"></div>
              <span className="text-gray-700 text-sm">Save articles with one click</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-[#8fb386] rounded-full flex-shrink-0"></div>
              <span className="text-gray-700 text-sm">Organize with smart collections</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-[#4a3b2e] rounded-full flex-shrink-0"></div>
              <span className="text-gray-700 text-sm">Search and filter your content</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-[#e67e55] rounded-full flex-shrink-0"></div>
              <span className="text-gray-700 text-sm">Access anywhere, anytime</span>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-4">
          <Link
            href="/auth/signin"
            className="w-full bg-[#4a3b2e] text-white py-3 px-6 rounded-xl font-medium hover:bg-[#3d3024] transition-colors duration-200 flex items-center justify-center gap-2"
          >
            Sign In
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          
          <Link
            href="/auth/signup"
            className="w-full bg-white border border-[#4a3b2e] text-[#4a3b2e] py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            Create Account
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Start organizing your reading list today
          </p>
          <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-400">
            <span>Free to use</span>
            <span>•</span>
            <span>No credit card required</span>
          </div>
        </div>
      </div>
    </div>
  );
}
