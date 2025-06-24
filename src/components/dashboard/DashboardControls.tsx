import { Plus, Check } from 'lucide-react';

interface DashboardControlsProps {
  totalCount: number;
  onSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onAddBookmark?: () => void;
  sectionTitle?: string;
  isSelectionMode?: boolean;
  onToggleSelectionMode?: () => void;
}

export default function DashboardControls({
  totalCount,
  onSortChange,
  onAddBookmark,
  sectionTitle = 'All Bookmarks',
  isSelectionMode = false,
  onToggleSelectionMode
}: DashboardControlsProps) {
  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{sectionTitle}</h2>
        <p className="text-sm sm:text-base text-gray-600">{totalCount} items</p>
      </div>

      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3 sm:justify-end">
        {/* Sort Dropdown */}
        <select 
          onChange={onSortChange}
          className="p-3 sm:p-2 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white min-w-0 w-full sm:w-auto touch-target"
        >
          <option value="date-desc">Sort by Date Added (Newest)</option>
          <option value="date-asc">Sort by Date Added (Oldest)</option>
          <option value="title-asc">Sort by Title (A-Z)</option>
          <option value="title-desc">Sort by Title (Z-A)</option>
        </select>
        
        {/* Selection Mode Button */}
        {onToggleSelectionMode && (
          <button
            onClick={onToggleSelectionMode}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 sm:px-4 sm:py-2 rounded-lg flex items-center justify-center space-x-1.5 sm:space-x-2 transition-colors border border-gray-300 touch-target text-sm whitespace-nowrap"
          >
            <Check className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Select</span>
          </button>
        )}
        
        {/* Add Bookmark Button - Mobile Only */}
        {onAddBookmark && (
          <button
            onClick={onAddBookmark}
            className="sm:hidden w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors touch-target"
          >
            <Plus className="w-5 h-5" />
            <span>Add Bookmark</span>
          </button>
        )}
      </div>
    </div>
  );
} 