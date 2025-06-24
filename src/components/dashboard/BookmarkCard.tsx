import { BookmarkResponse } from '@/types/bookmark';
import TagBadge from './TagBadge';
import { Trash2, BookOpen, AlertTriangle, X, BookmarkCheck } from 'lucide-react';
import { useState } from 'react';

interface BookmarkCardProps {
  bookmark: BookmarkResponse;
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onSelectionChange?: (id: string, selected: boolean) => void;
  onDelete?: (id: string) => void;
  onMarkAsRead?: (id: string) => void;
  onMarkAsUnread?: (id: string) => void;
}

export default function BookmarkCard({ 
  bookmark, 
  isSelectionMode = false, 
  isSelected = false, 
  onSelectionChange, 
  onDelete,
  onMarkAsRead,
  onMarkAsUnread
}: BookmarkCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const createdDate = new Date(bookmark.createdAt);
  const daysAgo = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Extract domain from URL
  let domain = '';
  try {
    const url = new URL(bookmark.url);
    domain = url.hostname.replace('www.', '');
  } catch {
    domain = bookmark.url;
  }

  // Debug: Log bookmark data to see what's in the image field
  console.log('Bookmark:', bookmark._id, 'Image:', bookmark.image, 'Title:', bookmark.title);

  const handleSelectionClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelectionChange?.(bookmark._id, !isSelected);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    onDelete?.(bookmark._id);
    setShowDeleteDialog(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
  };

  const handleMarkAsReadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onMarkAsRead?.(bookmark._id);
  };

  const handleMarkAsUnreadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onMarkAsUnread?.(bookmark._id);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (isSelectionMode) {
      e.preventDefault();
      onSelectionChange?.(bookmark._id, !isSelected);
    }
  };

  return (
    <>
      <div 
        className={`bg-white rounded-xl shadow-sm border-2 overflow-hidden hover:shadow-md transition-all cursor-pointer relative group ${
          isSelectionMode 
            ? isSelected 
              ? 'border-indigo-500 ring-2 ring-indigo-200' 
              : 'border-gray-200 hover:border-gray-300'
            : 'border-gray-200'
        }`}
        onClick={handleCardClick}
      >
        {/* Selection Checkbox */}
        {isSelectionMode && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
            <div 
              className={`w-6 h-6 sm:w-5 sm:h-5 rounded border-2 flex items-center justify-center cursor-pointer touch-target ${
                isSelected 
                  ? 'bg-indigo-600 border-indigo-600' 
                  : 'bg-white border-gray-300 hover:border-indigo-400'
              }`}
              onClick={handleSelectionClick}
            >
              {isSelected && (
                <svg className="w-4 h-4 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons (visible when not in selection mode) */}
        {!isSelectionMode && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex gap-1 sm:gap-2">
            {/* Mark as Read Button (only show for unread bookmarks) */}
            {bookmark.isUnread && onMarkAsRead && (
              <button
                onClick={handleMarkAsReadClick}
                className="w-8 h-8 sm:w-8 sm:h-8 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors touch-target"
                title="Mark as read"
              >
                <BookOpen className="w-4 h-4" />
              </button>
            )}
            
            {/* Mark as Unread Button (only show for read bookmarks) */}
            {!bookmark.isUnread && onMarkAsUnread && (
              <button
                onClick={handleMarkAsUnreadClick}
                className="w-8 h-8 sm:w-8 sm:h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors touch-target"
                title="Mark as unread"
              >
                <BookmarkCheck className="w-4 h-4" />
              </button>
            )}
            
            {/* Delete Button */}
            {onDelete && (
              <button
                onClick={handleDeleteClick}
                className="w-8 h-8 sm:w-8 sm:h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors touch-target"
                title="Delete bookmark"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Main Content - Link or div based on selection mode */}
        {!isSelectionMode ? (
          <a 
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
        {/* Bookmark Image */}
        <div className="aspect-video relative overflow-hidden">
          {/* Background Image */}
          {bookmark.image ? (
            <>
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url("${bookmark.image}")` }}
              />
              {/* Fallback image element for better error handling */}
              <img
                src={bookmark.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-0"
                onLoad={(e) => {
                  // Hide the gradient and show the background image
                  const target = e.target as HTMLImageElement;
                  const parent = target.parentElement;
                  const gradientDiv = parent?.querySelector('.gradient-fallback') as HTMLElement;
                  if (gradientDiv) gradientDiv.style.display = 'none';
                }}
                onError={(e) => {
                  console.error('Failed to load image:', bookmark.image);
                  // Show gradient fallback on error
                  const target = e.target as HTMLImageElement;
                  const parent = target.parentElement;
                  const gradientDiv = parent?.querySelector('.gradient-fallback') as HTMLElement;
                  if (gradientDiv) gradientDiv.style.display = 'block';
                }}
              />
              {/* Gradient fallback that's initially hidden */}
              <div className="gradient-fallback absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600" />
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black opacity-5"></div>
        </div>

        {/* Bookmark Content */}
        <div className="p-3 sm:p-4">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 text-base sm:text-lg leading-tight line-clamp-2 mb-2">
            {bookmark.title}
          </h3>
          {bookmark.description && (
            <p className="text-gray-600 text-sm line-clamp-2 mb-2 sm:mb-3">
              {bookmark.description}
            </p>
          )}

          <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
            <span className="truncate mr-2">{domain}</span>
            {bookmark.readingTime && <span className="whitespace-nowrap">{bookmark.readingTime}</span>}
          </div>

          {/* Tags */}
          {bookmark.tags && bookmark.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
              {bookmark.tags.map((tag) => (
                <TagBadge key={tag._id} tag={tag} />
              ))}
            </div>
          )}

          <div className="text-xs text-gray-500">
            Added {daysAgo === 0 ? 'today' : `${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`}
          </div>
        </div>
          </a>
        ) : (
          <div className="block">
            {/* Bookmark Image */}
            <div className="aspect-video relative overflow-hidden">
              {/* Background Image */}
              {bookmark.image ? (
                <>
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url("${bookmark.image}")` }}
                  />
                  {/* Fallback image element for better error handling */}
                  <img
                    src={bookmark.image}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover opacity-0"
                    onLoad={(e) => {
                      // Hide the gradient and show the background image
                      const target = e.target as HTMLImageElement;
                      const parent = target.parentElement;
                      const gradientDiv = parent?.querySelector('.gradient-fallback') as HTMLElement;
                      if (gradientDiv) gradientDiv.style.display = 'none';
                    }}
                    onError={(e) => {
                      console.error('Failed to load image:', bookmark.image);
                      // Show gradient fallback on error
                      const target = e.target as HTMLImageElement;
                      const parent = target.parentElement;
                      const gradientDiv = parent?.querySelector('.gradient-fallback') as HTMLElement;
                      if (gradientDiv) gradientDiv.style.display = 'block';
                    }}
                  />
                  {/* Gradient fallback that's initially hidden */}
                  <div className="gradient-fallback absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600" />
                </>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600" />
              )}
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black opacity-5"></div>
            </div>

            {/* Bookmark Content */}
            <div className="p-3 sm:p-4">
              {/* Title */}
              <h3 className="font-semibold text-gray-900 text-base sm:text-lg leading-tight line-clamp-2 mb-2">
                {bookmark.title}
              </h3>
              {bookmark.description && (
                <p className="text-gray-600 text-sm line-clamp-2 mb-2 sm:mb-3">
                  {bookmark.description}
                </p>
              )}

              <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
                <span className="truncate mr-2">{domain}</span>
                {bookmark.readingTime && <span className="whitespace-nowrap">{bookmark.readingTime}</span>}
              </div>

              {/* Tags */}
              {bookmark.tags && bookmark.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
                  {bookmark.tags.map((tag) => (
                    <TagBadge key={tag._id} tag={tag} />
                  ))}
                </div>
              )}

              <div className="text-xs text-gray-500">
                Added {daysAgo === 0 ? 'today' : `${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog - Mobile optimized */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full mx-4">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                </div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Delete Bookmark</h2>
              </div>
              <button
                onClick={handleCancelDelete}
                className="text-gray-400 hover:text-gray-600 transition-colors touch-target p-1"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                Are you sure you want to delete <span className="font-medium">"{bookmark.title}"</span>? 
                This action cannot be undone.
              </p>
              
              {/* Bookmark Preview */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4 sm:mb-6">
                <div className="flex items-start gap-3">
                  {bookmark.image ? (
                    <img
                      src={bookmark.image}
                      alt=""
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {bookmark.title}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {domain}
                    </p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleCancelDelete}
                  className="flex-1 px-4 py-3 sm:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors touch-target text-center"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 bg-red-600 text-white px-4 py-3 sm:py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 touch-target"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 