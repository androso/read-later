'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuth();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin');
    }
  }, [isAuthenticated, isLoading, router]);


  // Show loading if checking authentication status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f3f0] flex items-center justify-center">
        <div className="text-[#4a3b2e]">Loading...</div>
      </div>
    );
  }

  // Show loading if not authenticated (will redirect)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f5f3f0] flex items-center justify-center">
        <div className="text-[#4a3b2e]">Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f3f0] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-green-800 mb-2">
              🎉 Authentication Successful!
            </h2>
            <p className="text-green-700">
              You are now logged in and can access protected content.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-[#4a3b2e] mb-2">Authentication Status</h3>
              <p className="text-gray-700">
                Status: <span className="text-green-600 font-medium">Authenticated</span>
              </p>
                              <p className="text-gray-700">
                  User: <span className="text-green-600 font-medium">{user?.username || 'Unknown'}</span>
                </p>
                <p className="text-gray-700">
                  Email: <span className="text-green-600 font-medium">{user?.email || 'Unknown'}</span>
                </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-[#4a3b2e] mb-2">What you can do now:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Access protected routes</li>
                <li>Make authenticated API calls</li>
                <li>View user-specific content</li>
                <li>Manage your account</li>
              </ul>
            </div>

            {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">useAuth Hook Features</h3>
              <ul className="list-disc list-inside text-blue-700 space-y-1">
                <li><code className="bg-blue-100 px-1 rounded">signInMutation</code> - Handle user login with React Query</li>
                <li><code className="bg-blue-100 px-1 rounded">signUpMutation</code> - Handle user registration with React Query</li>
                <li><code className="bg-blue-100 px-1 rounded">logout()</code> - Clear user session</li>
                <li><code className="bg-blue-100 px-1 rounded">isAuthenticated()</code> - Check authentication status</li>
                <li><code className="bg-blue-100 px-1 rounded">getToken()</code> - Get stored auth token</li>
                <li>Automatic token storage in localStorage</li>
                <li>Zod validation for form data</li>
                <li>Error handling and loading states</li>
              </ul>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
} 