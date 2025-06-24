import { BookmarkResponse } from '@/types/bookmark';
import BookmarkCard from './BookmarkCard';

interface BookmarkGridProps {
  bookmarks: BookmarkResponse[];
  isLoading: boolean;
  searchQuery: string;
  isSelectionMode?: boolean;
  selectedBookmarks?: Set<string>;
  onSelectionChange?: (id: string, selected: boolean) => void;
  onDeleteBookmark?: (id: string) => void;
  onMarkAsRead?: (id: string) => void;
  onMarkAsUnread?: (id: string) => void;
}

export default function BookmarkGrid({ 
  bookmarks, 
  isLoading, 
  searchQuery,
  isSelectionMode = false,
  selectedBookmarks = new Set(),
  onSelectionChange,
  onDeleteBookmark,
  onMarkAsRead,
  onMarkAsUnread
}: BookmarkGridProps) {
  // Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8 sm:py-12">
        <div className="text-center">
          <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600">Loading bookmarks...</p>
        </div>
      </div>
    );
  }

  // Empty State
  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 px-4">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <span className="text-xl sm:text-2xl">📚</span>
        </div>
        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
          {searchQuery ? 'No bookmarks found' : 'No bookmarks yet'}
        </h3>
        <p className="text-sm sm:text-base text-gray-600 max-w-sm mx-auto">
          {searchQuery 
            ? 'Try adjusting your search terms' 
            : 'Start adding bookmarks to build your reading list'}
        </p>
      </div>
    );
  }

  // Bookmarks Grid - Mobile-first responsive grid
  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {bookmarks.map((bookmark) => (
        <BookmarkCard 
          key={bookmark._id} 
          bookmark={bookmark}
          isSelectionMode={isSelectionMode}
          isSelected={selectedBookmarks.has(bookmark._id)}
          onSelectionChange={onSelectionChange}
          onDelete={onDeleteBookmark}
          onMarkAsRead={onMarkAsRead}
          onMarkAsUnread={onMarkAsUnread}
        />
      ))}
    </div>
  );
} 