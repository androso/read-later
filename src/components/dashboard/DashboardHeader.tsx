'use client';

import { Search, Plus, Trash2, Check, X } from 'lucide-react';

interface DashboardHeaderProps {
  user: { username: string } | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddBookmark: () => void;
  onLogout: () => void;
  isLoggingOut: boolean;
  isSelectionMode?: boolean;
  selectedCount?: number;
  onToggleSelectionMode?: () => void;
  onDeleteSelected?: () => void;
  onSelectAll?: () => void;
  onClearSelection?: () => void;
  isDeleting?: boolean;
}

export default function DashboardHeader({
  user,
  searchQuery,
  onSearchChange,
  onAddBookmark,
  onLogout,
  isLoggingOut,
  isSelectionMode = false,
  selectedCount = 0,
  onToggleSelectionMode,
  onDeleteSelected,
  onSelectAll,
  onClearSelection,
  isDeleting = false
}: DashboardHeaderProps) {
  return (
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
          {isSelectionMode ? (
            <>
              {/* Selection Mode Controls */}
              <div className="flex items-center space-x-3 bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-200">
                <span className="text-sm font-medium text-indigo-900">
                  {selectedCount} selected
                </span>
                
                {selectedCount > 0 && (
                  <>
                    <button
                      onClick={onDeleteSelected}
                      disabled={isDeleting}
                      className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-3 py-1 rounded text-sm flex items-center space-x-1 transition-colors cursor-pointer"
                    >
                      {isDeleting ? (
                        <>
                          <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Deleting...</span>
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={onClearSelection}
                      className="text-gray-500 hover:text-gray-700 px-2 py-1 rounded text-sm transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  </>
                )}
                
                <button
                  onClick={onSelectAll}
                  className="text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded text-sm transition-colors cursor-pointer"
                >
                  Select All
                </button>
              </div>

              {/* Exit Selection Mode */}
              <button
                onClick={onToggleSelectionMode}
                className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg flex items-center space-x-1 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </>
          ) : (
            <>
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
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Selection Mode Button */}
              <button
                onClick={onToggleSelectionMode}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors border border-gray-300 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Select</span>
              </button>

              {/* Add Bookmark Button */}
              <button 
                onClick={onAddBookmark}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                <span>Add Bookmark</span>
              </button>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                disabled={isLoggingOut}
                className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
              >
                {isLoggingOut ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Logging out...
                  </>
                ) : (
                  'Logout'
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
} 