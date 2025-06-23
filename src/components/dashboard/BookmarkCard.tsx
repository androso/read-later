import { BookmarkResponse } from '@/types/bookmark';
import TagBadge from './TagBadge';

interface BookmarkCardProps {
  bookmark: BookmarkResponse;
}

export default function BookmarkCard({ bookmark }: BookmarkCardProps) {
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

  return (
    <a 
      href={bookmark.url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer block"
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
        
        {/* Unread Badge */}
        {bookmark.isUnread && (
          <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full px-2 py-1 text-xs font-medium text-indigo-600 backdrop-blur-sm">
            Unread
          </div>
        )}
      </div>

      {/* Bookmark Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-2 mb-2">
          {bookmark.title}
        </h3>
        {bookmark.description && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {bookmark.description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span>{domain}</span>
          {bookmark.readingTime && <span>{bookmark.readingTime}</span>}
        </div>

        {/* Tags */}
        {bookmark.tags && bookmark.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
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
  );
} 