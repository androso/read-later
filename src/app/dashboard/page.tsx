'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// import { Plus } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useBookmarks, useBookmarkCount, useBookmarkCountWithFilter, useDeleteBookmark, useBulkDeleteBookmarks, useMarkAsRead, useMarkAsUnread } from '@/lib/hooks/useBookmarks';
import { useDebounce } from '@/lib/hooks/useDebounce';
import AddBookmarkModal from '@/components/AddBookmarkModal';
import {
  DashboardHeader,
  DashboardControls,
  BookmarkGrid,
  SuccessNotification
} from '@/components/dashboard';

// Smart collections data - keeping for now as it's not in the API yet
// const smartCollections = [
//   { name: "All Bookmarks", count: 247, active: true, icon: "⭐" },
//   { name: "Most Read This Month", count: 12, active: false, icon: "🔥" },
//   { name: "Articles < 5 min", count: 89, active: false, icon: "⏱️" },
//   { name: "AI Papers", count: 34, active: false, icon: "🤖" },
//   { name: "Unread", count: 156, active: false, icon: "📖" }
// ];

// Popular tags data - keeping for now as it's not in the API yet
// const popularTags = [
//   { name: "JavaScript", count: 42 },
//   { name: "Design", count: 38 },
//   { name: "Machine Learning", count: 29 },
//   { name: "React", count: 24 },
//   { name: "Productivity", count: 19 }
// ];

type BookmarkSection = 'all' | 'unread' | 'read';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading, logoutMutation } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('-createdAt');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState({ title: '', message: '' });
  const [currentSection, setCurrentSection] = useState<BookmarkSection>('all');
  
  // Selection state
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedBookmarks, setSelectedBookmarks] = useState(new Set<string>());
  
  // Debounce search query for API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  // Determine filter based on current section
  const bookmarkFilter: { isUnread?: boolean } = {};
  if (currentSection === 'unread') {
    bookmarkFilter.isUnread = true;
  } else if (currentSection === 'read') {
    bookmarkFilter.isUnread = false;
  }
  
  // Fetch bookmarks from API with section filter
  const { data: bookmarksData, isLoading: isLoadingBookmarks } = useBookmarks({
    search: debouncedSearchQuery,
    sort: sortBy,
    limit: 20,
    ...bookmarkFilter,
  });
  
  // Fetch separate counts for each section
  const { data: allCountData } = useBookmarkCount();
  const { data: unreadCountData } = useBookmarkCountWithFilter({ isUnread: true });
  const { data: readCountData } = useBookmarkCountWithFilter({ isUnread: false });
  
  // Mutations
  const deleteBookmarkMutation = useDeleteBookmark();
  const bulkDeleteMutation = useBulkDeleteBookmarks();
  const markAsReadMutation = useMarkAsRead();
  const markAsUnreadMutation = useMarkAsUnread();

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

  // Clear selection when switching sections
  useEffect(() => {
    setSelectedBookmarks(new Set());
    setIsSelectionMode(false);
  }, [currentSection]);

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
    setSuccessMessage({
      title: 'Bookmark added successfully!',
      message: 'Your bookmark has been saved to your collection.'
    });
    setShowSuccessNotification(true);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleToggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedBookmarks(new Set());
  };

  const handleSelectionChange = (id: string, selected: boolean) => {
    setSelectedBookmarks(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (bookmarks.length > 0) {
      setSelectedBookmarks(new Set(bookmarks.map(b => b._id)));
    }
  };

  const handleClearSelection = () => {
    setSelectedBookmarks(new Set());
  };

  const handleDeleteSelected = () => {
    if (selectedBookmarks.size === 0) return;

    if (confirm(`Are you sure you want to delete ${selectedBookmarks.size} bookmark(s)? This action cannot be undone.`)) {
      bulkDeleteMutation.mutate(Array.from(selectedBookmarks), {
        onSuccess: (response) => {
          const deletedCount = response.data.deletedCount;
          setSelectedBookmarks(new Set());
          setIsSelectionMode(false);
          setSuccessMessage({
            title: `${deletedCount} bookmark(s) deleted successfully!`,
            message: 'The selected bookmarks have been removed from your collection.'
          });
          setShowSuccessNotification(true);
        },
        onError: (error) => {
          alert(`Failed to delete bookmarks: ${error.message}`);
        }
      });
    }
  };

  const handleDeleteBookmark = (id: string) => {
    if (confirm('Are you sure you want to delete this bookmark? This action cannot be undone.')) {
      deleteBookmarkMutation.mutate(id, {
        onSuccess: () => {
          setSuccessMessage({
            title: 'Bookmark deleted successfully!',
            message: 'The bookmark has been removed from your collection.'
          });
          setShowSuccessNotification(true);
        },
        onError: (error) => {
          alert(`Failed to delete bookmark: ${error.message}`);
        }
      });
    }
  };

  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate(id, {
      onSuccess: () => {
        setSuccessMessage({
          title: 'Bookmark marked as read!',
          message: 'The bookmark has been moved to your read collection.'
        });
        setShowSuccessNotification(true);
      },
      onError: (error) => {
        alert(`Failed to mark bookmark as read: ${error.message}`);
      }
    });
  };

  const handleMarkAsUnread = (id: string) => {
    markAsUnreadMutation.mutate(id, {
      onSuccess: () => {
        setSuccessMessage({
          title: 'Bookmark marked as unread!',
          message: 'The bookmark has been moved back to your unread collection.'
        });
        setShowSuccessNotification(true);
      },
      onError: (error) => {
        alert(`Failed to mark bookmark as unread: ${error.message}`);
      }
    });
  };

  const handleSectionChange = (section: BookmarkSection) => {
    setCurrentSection(section);
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

  const bookmarks = bookmarksData?.data || [];
  const allCount = allCountData?.count || 0;
  const unreadCount = unreadCountData?.count || 0;
  const readCount = readCountData?.count || 0;

  // Calculate current section count
  let currentCount = 0;
  if (currentSection === 'all') {
    currentCount = allCount;
  } else if (currentSection === 'unread') {
    currentCount = unreadCount;
  } else if (currentSection === 'read') {
    currentCount = readCount;
  }

  const getSectionTitle = () => {
    switch (currentSection) {
      case 'unread':
        return 'Unread Bookmarks';
      case 'read':
        return 'Read Bookmarks';
      default:
        return 'All Bookmarks';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <DashboardHeader
        user={user}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onLogout={handleLogout}
        isLoggingOut={logoutMutation.isPending}
        isSelectionMode={isSelectionMode}
        selectedCount={selectedBookmarks.size}
        onToggleSelectionMode={handleToggleSelectionMode}
        onDeleteSelected={handleDeleteSelected}
        onSelectAll={handleSelectAll}
        onClearSelection={handleClearSelection}
        isDeleting={bulkDeleteMutation.isPending}
      />

      {/* Main Content */}
      <main className="px-3 sm:px-4 lg:px-6 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Navigation */}
          <div className="mb-6">
            <nav className="flex space-x-8 border-b border-gray-200">
              <button
                onClick={() => handleSectionChange('all')}
                className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors touch-target flex items-center space-x-2 ${
                  currentSection === 'all'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>All</span>
                <span className="bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                  {allCount}
                </span>
              </button>
              
              <button
                onClick={() => handleSectionChange('unread')}
                className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors touch-target flex items-center space-x-2 ${
                  currentSection === 'unread'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>Unread</span>
                <span className="bg-yellow-100 text-yellow-900 py-0.5 px-2 rounded-full text-xs">
                  {unreadCount}
                </span>
              </button>
              
              <button
                onClick={() => handleSectionChange('read')}
                className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors touch-target flex items-center space-x-2 ${
                  currentSection === 'read'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>Read</span>
                <span className="bg-green-100 text-green-900 py-0.5 px-2 rounded-full text-xs">
                  {readCount}
                </span>
              </button>
            </nav>
          </div>
        </div>

        {/* Content Header with Controls */}
        <DashboardControls
          totalCount={currentCount}
          sectionTitle={getSectionTitle()}
          onSortChange={handleSortChange}
          onAddBookmark={handleAddBookmark}
        />

        {/* Bookmarks Grid */}
        <BookmarkGrid
          bookmarks={bookmarks}
          isLoading={isLoadingBookmarks}
          searchQuery={searchQuery}
          isSelectionMode={isSelectionMode}
          selectedBookmarks={selectedBookmarks}
          onSelectionChange={handleSelectionChange}
          onDeleteBookmark={handleDeleteBookmark}
          onMarkAsRead={handleMarkAsRead}
          onMarkAsUnread={handleMarkAsUnread}
        />
      </main>

      {/* Success Notification */}
      <SuccessNotification 
        show={showSuccessNotification} 
        title={successMessage.title}
        message={successMessage.message}
      />

      {/* Add Bookmark Modal */}
      <AddBookmarkModal 
        isOpen={isAddModalOpen} 
        onClose={handleCloseAddModal}
        onSuccess={handleBookmarkAdded}
      />
    </div>
  );
}