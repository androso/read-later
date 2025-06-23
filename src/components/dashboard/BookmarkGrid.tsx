import { BookmarkResponse } from '@/types/bookmark';
import BookmarkCard from './BookmarkCard';

interface BookmarkGridProps {
  bookmarks: BookmarkResponse[];
  isLoading: boolean;
  viewMode: 'grid' | 'list';
  searchQuery: string;
  isSelectionMode?: boolean;
  selectedBookmarks?: Set<string>;
  onSelectionChange?: (id: string, selected: boolean) => void;
  onDeleteBookmark?: (id: string) => void;
}

export default function BookmarkGrid({ 
  bookmarks, 
  isLoading, 
  viewMode, 
  searchQuery,
  isSelectionMode = false,
  selectedBookmarks = new Set(),
  onSelectionChange,
  onDeleteBookmark
}: BookmarkGridProps) {
  // Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bookmarks...</p>
        </div>
      </div>
    );
  }

  // Empty State
  if (bookmarks.length === 0) {
    return (
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
    );
  }

  // Bookmarks Grid
  return (
    <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
      {bookmarks.map((bookmark) => (
        <BookmarkCard 
          key={bookmark._id} 
          bookmark={bookmark}
          isSelectionMode={isSelectionMode}
          isSelected={selectedBookmarks.has(bookmark._id)}
          onSelectionChange={onSelectionChange}
          onDelete={onDeleteBookmark}
        />
      ))}
    </div>
  );
} 