'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useBookmarks, useBookmarkCount } from '@/lib/hooks/useBookmarks';
import { Search, Plus, Grid3X3, List, CheckCircle } from 'lucide-react';
import { BookmarkResponse } from '@/types/bookmark';
import { useDebounce } from '@/lib/hooks/useDebounce';
import AddBookmarkModal from '@/components/AddBookmarkModal';

// Removed fake data - now using real API

// Smart collections data - keeping for now as it's not in the API yet
const smartCollections = [
  { name: "All Bookmarks", count: 247, active: true, icon: "⭐" },
  { name: "Most Read This Month", count: 12, active: false, icon: "🔥" },
  { name: "Articles < 5 min", count: 89, active: false, icon: "⏱️" },
  { name: "AI Papers", count: 34, active: false, icon: "🤖" },
  { name: "Unread", count: 156, active: false, icon: "📖" }
];

// Popular tags data - keeping for now as it's not in the API yet
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
  const [sortBy, setSortBy] = useState('-createdAt');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  
  // Debounce search query for API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  // Fetch bookmarks from API
  const { data: bookmarksData, isLoading: isLoadingBookmarks } = useBookmarks({
    search: debouncedSearchQuery,
    sort: sortBy,
    limit: 20,
  });
  
  // Fetch bookmark count
  const { data: countData } = useBookmarkCount();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin');
    }
  }, [isAuthenticated, isLoading, router]);

  // Auto-hide success notification after 3 seconds
  useEffect(() => {
    if (showSuccessNotification) {
      const timer = setTimeout(() => {
        setShowSuccessNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessNotification]);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        router.push('/auth/signin');
      }
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortMap: Record<string, string> = {
      'date-desc': '-createdAt',
      'date-asc': 'createdAt',
      'title-asc': 'title',
      'title-desc': '-title',
    };
    setSortBy(sortMap[e.target.value] || '-createdAt');
  };

  const handleAddBookmark = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleBookmarkAdded = () => {
    setIsAddModalOpen(false);
    setShowSuccessNotification(true);
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

  const TagBadge = ({ tag }: { tag: { _id: string; name: string; color?: string } }) => {
    const defaultColors: Record<string, string> = {
      'react': 'bg-blue-100 text-blue-800',
      'typescript': 'bg-blue-100 text-blue-800',
      'javascript': 'bg-yellow-100 text-yellow-800',
      'ai': 'bg-purple-100 text-purple-800',
      'machine learning': 'bg-purple-100 text-purple-800',
      'design': 'bg-green-100 text-green-800',
      'ux': 'bg-green-100 text-green-800',
      'productivity': 'bg-pink-100 text-pink-800',
      'kubernetes': 'bg-cyan-100 text-cyan-800',
      'devops': 'bg-cyan-100 text-cyan-800',
      'performance': 'bg-orange-100 text-orange-800',
      'security': 'bg-red-100 text-red-800',
      'startup': 'bg-indigo-100 text-indigo-800',
    };

    const colorClass = tag.color || defaultColors[tag.name.toLowerCase()] || 'bg-gray-100 text-gray-800';

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
        {tag.name}
      </span>
    );
  };

  const bookmarks = bookmarksData?.data || [];
  const totalCount = countData?.count || 0;

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
            <button 
              onClick={handleAddBookmark}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors"
            >
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

      {/* Commented out sidebar for now */}
      {/* <div className="flex"> */}
        {/* Sidebar */}
        {/* <aside className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-73px)] overflow-y-auto">
          <div className="p-6">
            Smart Collections
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

            Popular Tags
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

            Filters
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
        </aside> */}

        {/* Main Content - Now takes full width */}
        <main className="p-6">
          {/* Content Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">All Bookmarks</h2>
              <p className="text-gray-600">{totalCount} items</p>
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
              <select 
                onChange={handleSortChange}
                className="p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="date-desc">Sort by Date Added (Newest)</option>
                <option value="date-asc">Sort by Date Added (Oldest)</option>
                <option value="title-asc">Sort by Title (A-Z)</option>
                <option value="title-desc">Sort by Title (Z-A)</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {isLoadingBookmarks && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading bookmarks...</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoadingBookmarks && bookmarks.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? 'No bookmarks found' : 'No bookmarks yet'}
              </h3>
              <p className="text-gray-600">
                {searchQuery 
                  ? 'Try adjusting your search terms' 
                  : 'Start adding bookmarks to build your reading list'}
              </p>
            </div>
          )}

          {/* Bookmarks Grid */}
          {!isLoadingBookmarks && bookmarks.length > 0 && (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
              {bookmarks.map((bookmark: BookmarkResponse) => {
                const createdDate = new Date(bookmark.createdAt);
                const daysAgo = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
                
                // Extract domain from URL
                let domain = '';
                try {
                  const url = new URL(bookmark.url);
                  domain = url.hostname.replace('www.', '');
                } catch {
                  domain = bookmark.url;
                }

                // Debug: Log bookmark data to see what's in the image field
                console.log('Bookmark:', bookmark._id, 'Image:', bookmark.image, 'Title:', bookmark.title);

                return (
                  <a 
                    key={bookmark._id} 
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer block"
                  >
                    {/* Bookmark Image */}
                    <div className="aspect-video relative overflow-hidden">
                      {/* Background Image */}
                      {bookmark.image ? (
                        <>
                          <div 
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat "
                            style={{ backgroundImage: `url("${bookmark.image}")` }}
                          />
                          {/* Fallback image element for better error handling */}
                          <img
                            src={bookmark.image}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover opacity-0"
                            onLoad={(e) => {
                              // Hide the gradient and show the background image
                              const target = e.target as HTMLImageElement;
                              const parent = target.parentElement;
                              const gradientDiv = parent?.querySelector('.gradient-fallback') as HTMLElement;
                              if (gradientDiv) gradientDiv.style.display = 'none';
                            }}
                            onError={(e) => {
                              console.error('Failed to load image:', bookmark.image);
                              // Show gradient fallback on error
                              const target = e.target as HTMLImageElement;
                              const parent = target.parentElement;
                              const gradientDiv = parent?.querySelector('.gradient-fallback') as HTMLElement;
                              if (gradientDiv) gradientDiv.style.display = 'block';
                            }}
                          />
                          {/* Gradient fallback that's initially hidden */}
                          <div className="gradient-fallback absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600" />
                        </>
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600" />
                      )}
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black opacity-5"></div>
                      
                      {/* Unread Badge */}
                      {bookmark.isUnread && (
                        <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full px-2 py-1 text-xs font-medium text-indigo-600 backdrop-blur-sm">
                          Unread
                        </div>
                      )}
                      
                      {/* Title Overlay */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg p-3 shadow-sm">
                          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
                            {bookmark.title}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Bookmark Content */}
                    <div className="p-4">
                      {bookmark.description && (
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {bookmark.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                        <span>{domain}</span>
                        {bookmark.readingTime && <span>{bookmark.readingTime}</span>}
                      </div>

                      {/* Tags */}
                      {bookmark.tags && bookmark.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {bookmark.tags.map((tag) => (
                            <TagBadge key={tag._id} tag={tag} />
                          ))}
                        </div>
                      )}

                      <div className="text-xs text-gray-500">
                        Added {daysAgo === 0 ? 'today' : `${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`}
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </main>
      {/* </div> */}

      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="fixed top-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg z-50 flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <div>
            <p className="text-green-800 font-medium">Bookmark added successfully!</p>
            <p className="text-green-600 text-sm">Your bookmark has been saved to your collection.</p>
          </div>
        </div>
      )}

      {/* Add Bookmark Modal */}
      <AddBookmarkModal 
        isOpen={isAddModalOpen} 
        onClose={handleCloseAddModal}
        onSuccess={handleBookmarkAdded}
      />
    </div>
  );
}