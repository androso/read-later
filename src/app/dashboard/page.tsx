'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useBookmarks, useBookmarkCount, useDeleteBookmark, useBulkDeleteBookmarks, useMarkAsRead } from '@/lib/hooks/useBookmarks';
import { useDebounce } from '@/lib/hooks/useDebounce';
import AddBookmarkModal from '@/components/AddBookmarkModal';
import {
  DashboardHeader,
  DashboardControls,
  BookmarkGrid,
  SuccessNotification
} from '@/components/dashboard';

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
  const [successMessage, setSuccessMessage] = useState({ title: '', message: '' });
  
  // Selection state
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedBookmarks, setSelectedBookmarks] = useState(new Set<string>());
  
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
  
  // Mutations
  const deleteBookmarkMutation = useDeleteBookmark();
  const bulkDeleteMutation = useBulkDeleteBookmarks();
  const markAsReadMutation = useMarkAsRead();

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
    setSuccessMessage({
      title: 'Bookmark added successfully!',
      message: 'Your bookmark has been saved to your collection.'
    });
    setShowSuccessNotification(true);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
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
  const totalCount = countData?.count || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <DashboardHeader
        user={user}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onAddBookmark={handleAddBookmark}
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
      <main className="p-6">
        {/* Content Header with Controls */}
        <DashboardControls
          totalCount={totalCount}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          onSortChange={handleSortChange}
        />

        {/* Bookmarks Grid */}
        <BookmarkGrid
          bookmarks={bookmarks}
          isLoading={isLoadingBookmarks}
          viewMode={viewMode}
          searchQuery={searchQuery}
          isSelectionMode={isSelectionMode}
          selectedBookmarks={selectedBookmarks}
          onSelectionChange={handleSelectionChange}
          onDeleteBookmark={handleDeleteBookmark}
          onMarkAsRead={handleMarkAsRead}
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