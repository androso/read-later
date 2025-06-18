import Link from 'next/link';

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-[#f5f3f0] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold text-[#4a3b2e] mb-8">
            Welcome to Mentarie
          </h1>
          <p className="text-gray-600 mb-8">
            Choose an option to continue
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/auth/signin"
            className="w-full bg-[#4a3b2e] text-white py-3 px-6 rounded-xl font-medium hover:bg-[#3d3024] transition-colors duration-200 block"
          >
            Sign In
          </Link>
          
          <Link
            href="/auth/signup"
            className="w-full bg-white border border-[#4a3b2e] text-[#4a3b2e] py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200 block"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
} 