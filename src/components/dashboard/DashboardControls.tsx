import { Grid3X3, List } from 'lucide-react';

interface DashboardControlsProps {
  totalCount: number;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  sectionTitle?: string;
}

export default function DashboardControls({
  totalCount,
  viewMode,
  onViewModeChange,
  onSortChange,
  sectionTitle = 'All Bookmarks'
}: DashboardControlsProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{sectionTitle}</h2>
        <p className="text-gray-600">{totalCount} items</p>
      </div>

      <div className="flex items-center space-x-4">
        {/* View Mode Toggle */}
        <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 rounded-md transition-colors cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Grid3X3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 rounded-md transition-colors cursor-pointer ${
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
          onChange={onSortChange}
          className="p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="date-desc">Sort by Date Added (Newest)</option>
          <option value="date-asc">Sort by Date Added (Oldest)</option>
          <option value="title-asc">Sort by Title (A-Z)</option>
          <option value="title-desc">Sort by Title (Z-A)</option>
        </select>
      </div>
    </div>
  );
} 