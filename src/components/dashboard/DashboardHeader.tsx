'use client';

import { Search, Plus } from 'lucide-react';

interface DashboardHeaderProps {
  user: { username: string } | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddBookmark: () => void;
  onLogout: () => void;
  isLoggingOut: boolean;
}

export default function DashboardHeader({
  user,
  searchQuery,
  onSearchChange,
  onAddBookmark,
  onLogout,
  isLoggingOut
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

          {/* Add Bookmark Button */}
          <button 
            onClick={onAddBookmark}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Bookmark</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            disabled={isLoggingOut}
            className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
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
        </div>
      </div>
    </header>
  );
} 