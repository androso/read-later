'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignInSchema, type SignInUser } from '@/lib/validations/user';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { isAuthenticated, isLoading, loginMutation } = useAuth();
  
  const form = useForm<SignInUser>({
    resolver: zodResolver(SignInSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    // Redirect to dashboard if user is already authenticated
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  const onSubmit = async (data: SignInUser) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        // Redirect to dashboard on successful login
        router.push('/dashboard');
      },
    });
  };

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

  // Don't render the signin form if user is authenticated (will redirect)
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f5f3f0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#4a3b2e] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#4a3b2e]">Already signed in. Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f3f0] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold text-[#4a3b2e] mb-8">
            Sign In To Read-later 
          </h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#4a3b2e]">Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        type="email"
                        placeholder="Enter your email..."
                        className="pl-10 rounded-xl border-gray-200 focus:ring-[#4a3b2e] focus:border-[#4a3b2e]"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#4a3b2e]">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password..."
                        className="pl-10 pr-12 rounded-xl border-gray-200 focus:ring-[#4a3b2e] focus:border-[#4a3b2e]"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sign In Button */}
            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                loginMutation.isPending
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed hover:bg-gray-400'
                  : 'bg-[#4a3b2e] text-white hover:bg-[#3d3024] hover:shadow-lg'
              }`}
            >
              {loginMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-200 border-t-transparent rounded-full animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </Button>

            {/* Display error message if login fails */}
            {loginMutation.isError && (
              <div className="text-red-600 text-center text-sm">
                {loginMutation.error?.message || 'Login failed. Please try again.'}
              </div>
            )}
          </form>
        </Form>

        {/* Links */}
        <div className="text-center">
          <p className="text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-[#e67e55] hover:text-[#d4663d] font-medium transition-colors">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 