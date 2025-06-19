'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Search, Plus, Grid3X3, List } from 'lucide-react';

// Fake data for bookmarks
const fakeBookmarks = [
  {
    id: 1,
    title: "Building Modern React Applications with TypeScript",
    description: "A comprehensive guide to building scalable React applications using TypeScript best practices and modern development workflows.",
    url: "https://medium.com",
    domain: "medium.com",
    image: "/api/placeholder/400/200",
    readingTime: "8 min read",
    tags: ["React", "TypeScript", "JavaScript"],
    addedDays: 2,
    isUnread: false
  },
  {
    id: 2,
    title: "Attention Is All You Need: Transformer Architecture Explained",
    description: "Deep dive into the groundbreaking transformer architecture that revolutionized machine learning and natural language processing.",
    url: "https://arxiv.org",
    domain: "arxiv.org",
    image: "/api/placeholder/400/200",
    readingTime: "15 min read",
    tags: ["AI", "Machine Learning", "Research"],
    addedDays: 7,
    isUnread: true
  },
  {
    id: 3,
    title: "Design Systems: Building Consistent User Experiences",
    description: "Learn how to create and maintain design systems that scale across teams and products for better user experience.",
    url: "https://uxdesign.cc",
    domain: "uxdesign.cc",
    image: "/api/placeholder/400/200",
    readingTime: "6 min read",
    tags: ["Design", "UX", "Systems"],
    addedDays: 3,
    isUnread: false
  },
  {
    id: 4,
    title: "The Ultimate Productivity Setup for Developers in 2024",
    description: "Discover the tools, techniques, and workflows that top developers use to maximize their productivity and efficiency.",
    url: "https://hashnode.com",
    domain: "hashnode.com",
    image: "/api/placeholder/400/200",
    readingTime: "4 min read",
    tags: ["Productivity", "Tools", "Workflow"],
    addedDays: 5,
    isUnread: false
  },
  {
    id: 5,
    title: "Kubernetes Best Practices: Scaling Applications in Production",
    description: "Essential strategies and patterns for deploying and scaling containerized applications using Kubernetes in production environments.",
    url: "https://k8s.io",
    domain: "k8s.io",
    image: "/api/placeholder/400/200",
    readingTime: "12 min read",
    tags: ["Kubernetes", "DevOps", "Production"],
    addedDays: 1,
    isUnread: true
  },
  {
    id: 6,
    title: "Web Performance Optimization: Core Web Vitals Guide",
    description: "Complete guide to optimizing web performance metrics, improving Core Web Vitals, and delivering faster user experiences.",
    url: "https://web.dev",
    domain: "web.dev",
    image: "/api/placeholder/400/200",
    readingTime: "10 min read",
    tags: ["Performance", "Web", "Optimization"],
    addedDays: 4,
    isUnread: false
  },
  {
    id: 7,
    title: "Zero Trust Security: Modern Approach to Cybersecurity",
    description: "Understanding zero trust architecture and how to implement security best practices in modern distributed systems.",
    url: "https://security.com",
    domain: "security.com",
    image: "/api/placeholder/400/200",
    readingTime: "8 min read",
    tags: ["Security", "Architecture", "Best Practices"],
    addedDays: 2,
    isUnread: true
  },
  {
    id: 8,
    title: "From Idea to Product: A Startup's Journey",
    description: "Real-world insights into building a successful startup from initial concept to market launch and beyond.",
    url: "https://startup.com",
    domain: "startup.com",
    image: "/api/placeholder/400/200",
    readingTime: "7 min read",
    tags: ["Startup", "Entrepreneurship", "Product"],
    addedDays: 6,
    isUnread: false
  }
];

// Smart collections data
const smartCollections = [
  { name: "All Bookmarks", count: 247, active: true, icon: "⭐" },
  { name: "Most Read This Month", count: 12, active: false, icon: "🔥" },
  { name: "Articles < 5 min", count: 89, active: false, icon: "⏱️" },
  { name: "AI Papers", count: 34, active: false, icon: "🤖" },
  { name: "Unread", count: 156, active: false, icon: "📖" }
];

// Popular tags data
const popularTags = [
  { name: "JavaScript", count: 42 },
  { name: "Design", count: 38 },
  { name: "Machine Learning", count: 29 },
  { name: "React", count: 24 },
  { name: "Productivity", count: 19 }
];

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading, logoutMutation } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        router.push('/auth/signin');
      }
    });
  };

  // Show loading if checking authentication status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  // Show loading if not authenticated (will redirect)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Redirecting to login...</div>
      </div>
    );
  }

  const TagBadge = ({ tag }: { tag: string }) => {
    const tagColors: Record<string, string> = {
      'React': 'bg-blue-100 text-blue-800',
      'TypeScript': 'bg-blue-100 text-blue-800',
      'JavaScript': 'bg-yellow-100 text-yellow-800',
      'AI': 'bg-purple-100 text-purple-800',
      'Machine Learning': 'bg-purple-100 text-purple-800',
      'Research': 'bg-gray-100 text-gray-800',
      'Design': 'bg-green-100 text-green-800',
      'UX': 'bg-green-100 text-green-800',
      'Systems': 'bg-green-100 text-green-800',
      'Productivity': 'bg-pink-100 text-pink-800',
      'Tools': 'bg-pink-100 text-pink-800',
      'Workflow': 'bg-pink-100 text-pink-800',
      'Kubernetes': 'bg-cyan-100 text-cyan-800',
      'DevOps': 'bg-cyan-100 text-cyan-800',
      'Production': 'bg-cyan-100 text-cyan-800',
      'Performance': 'bg-orange-100 text-orange-800',
      'Web': 'bg-orange-100 text-orange-800',
      'Optimization': 'bg-orange-100 text-orange-800',
      'Security': 'bg-red-100 text-red-800',
      'Architecture': 'bg-red-100 text-red-800',
      'Best Practices': 'bg-red-100 text-red-800',
      'Startup': 'bg-indigo-100 text-indigo-800',
      'Entrepreneurship': 'bg-indigo-100 text-indigo-800',
      'Product': 'bg-indigo-100 text-indigo-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tagColors[tag] || 'bg-gray-100 text-gray-800'}`}>
        {tag}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">📚</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Bookmarks</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="text-sm text-gray-600">
              Welcome, <span className="font-medium text-gray-900">{user?.username}</span>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search bookmarks, tags, or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Add Bookmark Button */}
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors">
              <Plus className="w-5 h-5" />
              <span>Add Bookmark</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              {logoutMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Logging out...
                </>
              ) : (
                'Logout'
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-73px)] overflow-y-auto">
          <div className="p-6">
            {/* Smart Collections */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Smart Collections
              </h3>
              <div className="space-y-2">
                {smartCollections.map((collection) => (
                  <div
                    key={collection.name}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                      collection.active
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{collection.icon}</span>
                      <span className="text-sm font-medium">{collection.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">{collection.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Tags */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Popular Tags
              </h3>
              <div className="space-y-2">
                {popularTags.map((tag) => (
                  <div
                    key={tag.name}
                    className="flex items-center justify-between p-2 rounded-lg cursor-pointer text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className="text-sm font-medium">{tag.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">{tag.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Filters
              </h3>
              <div className="space-y-3">
                <select className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>All Types</option>
                  <option>Articles</option>
                  <option>Videos</option>
                  <option>Papers</option>
                </select>
                <select className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>Any Reading Time</option>
                  <option> 5 minutes</option>
                  <option>5-15 minutes</option>
                  <option> 15 minutes</option>
                </select>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Content Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">All Bookmarks</h2>
              <p className="text-gray-600">247 items</p>
            </div>

            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <select className="p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Sort by Date Added</option>
                <option>Sort by Title</option>
                <option>Sort by Reading Time</option>
                <option>Sort by Domain</option>
              </select>
            </div>
          </div>

          {/* Bookmarks Grid */}
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {fakeBookmarks.map((bookmark) => (
              <div key={bookmark.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Bookmark Image */}
                <div className="aspect-video bg-gradient-to-br from-indigo-500 to-purple-600 relative">
                  <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-3">
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
                        {bookmark.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Bookmark Content */}
                <div className="p-4">
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {bookmark.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span>{bookmark.domain}</span>
                    <span>{bookmark.readingTime}</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {bookmark.tags.map((tag) => (
                      <TagBadge key={tag} tag={tag} />
                    ))}
                  </div>

                  <div className="text-xs text-gray-500">
                    Added {bookmark.addedDays} day{bookmark.addedDays !== 1 ? 's' : ''} ago
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
} 