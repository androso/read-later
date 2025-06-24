

interface DashboardControlsProps {
  totalCount: number;
  onSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  sectionTitle?: string;
}

export default function DashboardControls({
  totalCount,
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