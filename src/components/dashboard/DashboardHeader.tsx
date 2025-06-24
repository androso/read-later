'use client';

import { Search, Plus, Trash2, Check, X, Menu, User } from 'lucide-react';
import { useState } from 'react';

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
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleSearchFocus = () => {
    setIsSearchExpanded(true);
  };

  const handleSearchBlur = () => {
    if (!searchQuery) {
      setIsSearchExpanded(false);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200">
      {/* Main Header */}
      <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        {/* Mobile Compact Header */}
        <div className="block sm:hidden">
          <div className="flex items-center justify-between mb-3">
            {/* Logo and Title */}
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">📚</span>
              </div>
              <h1 className="text-lg font-semibold text-gray-900 truncate">Bookmarks</h1>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center space-x-1">
              {!isSelectionMode && !isSearchExpanded && (
                <>
                  {/* Search Toggle */}
                  <button
                    onClick={() => setIsSearchExpanded(true)}
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-lg touch-target"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                  
                  {/* Mobile Menu Toggle */}
                  <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-lg touch-target"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                </>
              )}

              {isSearchExpanded && !isSelectionMode && (
                <button
                  onClick={() => {
                    setIsSearchExpanded(false);
                    onSearchChange('');
                  }}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-lg touch-target"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Expanded Search on Mobile */}
          {isSearchExpanded && !isSelectionMode && (
            <div className="mb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search bookmarks..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Selection Mode on Mobile */}
          {isSelectionMode && (
            <div className="mb-3">
              <div className="bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-indigo-900">
                    {selectedCount} selected
                  </span>
                  <button
                    onClick={onToggleSelectionMode}
                    className="text-gray-500 hover:text-gray-700 p-1 touch-target"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onSelectAll?.()}
                    className="text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded text-sm transition-colors touch-target flex-1 text-center border border-indigo-200"
                  >
                    Select All
                  </button>
                  
                  {selectedCount > 0 && (
                    <>
                      <button
                        onClick={() => onClearSelection?.()}
                        className="text-gray-500 hover:text-gray-700 px-2 py-1 rounded text-sm transition-colors touch-target flex-1 text-center border border-gray-300"
                      >
                        Clear
                      </button>
                      <button
                        onClick={() => onDeleteSelected?.()}
                        disabled={isDeleting}
                        className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-2 py-1 rounded text-sm flex items-center justify-center space-x-1 transition-colors touch-target flex-1"
                      >
                        {isDeleting ? (
                          <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Mobile Menu Dropdown */}
          {showMobileMenu && !isSelectionMode && (
            <div className="mb-3 bg-gray-50 rounded-lg border border-gray-200 p-3 space-y-2">
              {/* User Info */}
              <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <span className="text-sm font-medium text-gray-900">{user?.username}</span>
              </div>
              
              {/* Quick Actions */}
                              <button
                onClick={() => {
                  onToggleSelectionMode?.();
                  setShowMobileMenu(false);
                }}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors touch-target"
              >
                <Check className="w-4 h-4" />
                <span>Select Mode</span>
              </button>
              
              <button 
                onClick={() => {
                  onAddBookmark();
                  setShowMobileMenu(false);
                }}
                className="w-full bg-indigo-600 text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors touch-target"
              >
                <Plus className="w-4 h-4" />
                <span>Add Bookmark</span>
              </button>
              
              <button
                onClick={() => {
                  onLogout();
                  setShowMobileMenu(false);
                }}
                disabled={isLoggingOut}
                className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 touch-target"
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
          )}
        </div>

        {/* Desktop/Tablet Header */}
        <div className="hidden sm:block">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            
            {/* Top row: Logo + User/Logout */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">📚</span>
                </div>
                <h1 className="text-xl font-semibold text-gray-900">Bookmarks</h1>
              </div>

              {/* User info - visible on tablet, hidden on larger screens when not in selection mode */}
              {!isSelectionMode && (
                <div className="flex items-center space-x-3 lg:hidden">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{user?.username}</span>
                  </div>
                  <button
                    onClick={onLogout}
                    disabled={isLoggingOut}
                    className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-3 py-2 rounded-lg transition-colors flex items-center gap-1 text-sm touch-target"
                  >
                    {isLoggingOut ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="hidden md:inline">Logging out...</span>
                      </>
                    ) : (
                      <span>Logout</span>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Second row: Search + Actions */}
            <div className="flex flex-col space-y-3 md:flex-row md:items-center md:space-y-0 md:space-x-4 lg:flex-row">
              {isSelectionMode ? (
                <>
                  {/* Selection Mode Controls */}
                  <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-3 bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-200">
                    <span className="text-sm font-medium text-indigo-900 text-center md:text-left">
                      {selectedCount} selected
                    </span>
                    
                    <div className="flex items-center justify-center space-x-3">
                      {selectedCount > 0 && (
                        <>
                          <button
                            onClick={() => onDeleteSelected?.()}
                            disabled={isDeleting}
                            className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-3 py-2 rounded text-sm flex items-center space-x-1 transition-colors touch-target"
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
                            onClick={() => onClearSelection?.()}
                            className="text-gray-500 hover:text-gray-700 px-2 py-2 rounded text-sm transition-colors touch-target"
                          >
                            Clear
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => onSelectAll?.()}
                        className="text-indigo-600 hover:text-indigo-800 px-2 py-2 rounded text-sm transition-colors touch-target"
                      >
                        Select All
                      </button>
                    </div>
                  </div>

                  {/* Exit Selection Mode */}
                  <button
                    onClick={() => onToggleSelectionMode?.()}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-1 transition-colors touch-target"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Search Bar */}
                  <div className="relative flex-1 max-w-none md:max-w-sm lg:max-w-md xl:max-w-lg">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search bookmarks..."
                      value={searchQuery}
                      onChange={(e) => onSearchChange(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base"
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2 lg:space-x-3">
                    {/* Selection Mode Button */}
                    <button
                      onClick={() => onToggleSelectionMode?.()}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors border border-gray-300 touch-target"
                    >
                      <Check className="w-4 h-4" />
                      <span>Select</span>
                    </button>

                    {/* Add Bookmark Button */}
                    <button 
                      onClick={onAddBookmark}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-indigo-700 transition-colors touch-target"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Add Bookmark</span>
                    </button>

                    {/* User info and Logout - hidden on mobile/tablet, visible on desktop */}
                    <div className="hidden lg:flex lg:items-center lg:space-x-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <span>Welcome, <span className="font-medium text-gray-900">{user?.username}</span></span>
                      </div>
                      
                      <button
                        onClick={onLogout}
                        disabled={isLoggingOut}
                        className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 touch-target"
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 