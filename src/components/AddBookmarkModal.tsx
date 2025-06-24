'use client';

import { useState, useEffect } from 'react';
import { X, Link, Tag, FileText, Clock, Loader2 } from 'lucide-react';
import { useCreateBookmark } from '@/lib/hooks/useBookmarks';
import { useMetadata } from '@/lib/hooks/useMetadata';
import { useDebounce } from '@/lib/hooks/useDebounce';

interface AddBookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddBookmarkModal({ isOpen, onClose, onSuccess }: AddBookmarkModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    readingTime: '',
    tags: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [metadataPreview, setMetadataPreview] = useState<{
    title?: string;
    description?: string;
    image?: string;
  } | null>(null);
  const [lastFetchedUrl, setLastFetchedUrl] = useState<string>('');

  const createBookmarkMutation = useCreateBookmark();
  const { fetchMetadata, isLoading: isLoadingMetadata, error: metadataError } = useMetadata();
  
  // Debounce URL input for metadata fetching
  const debouncedUrl = useDebounce(formData.url, 1000);

  // Fetch metadata when URL changes
  useEffect(() => {
    const fetchUrlMetadata = async () => {
      // Skip if we already fetched this URL or if it's empty
      if (!debouncedUrl || !debouncedUrl.trim() || debouncedUrl === lastFetchedUrl) {
        if (!debouncedUrl || !debouncedUrl.trim()) {
          setMetadataPreview(null);
        }
        return;
      }

      try {
        new URL(debouncedUrl);
        setLastFetchedUrl(debouncedUrl);
        const metadata = await fetchMetadata(debouncedUrl);
        if (metadata) {
          setMetadataPreview(metadata);
          
          // Auto-populate fields if they're empty
          setFormData(prev => ({
            ...prev,
            title: prev.title || metadata.title || '',
            description: prev.description || metadata.description || '',
          }));
        }
      } catch (_error) {
        // Invalid URL, do nothing
        setMetadataPreview(null);
      }
    };

    fetchUrlMetadata();
  }, [debouncedUrl, fetchMetadata, lastFetchedUrl]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.url.trim()) {
      newErrors.url = 'URL is required';
    } else {
      try {
        new URL(formData.url);
      } catch {
        newErrors.url = 'Please enter a valid URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const tags = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const bookmarkData = {
      title: formData.title.trim(),
      url: formData.url.trim(),
      description: formData.description.trim() || undefined,
      readingTime: formData.readingTime.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined,
    };

    createBookmarkMutation.mutate(bookmarkData, {
      onSuccess: () => {
        // Reset form
        setFormData({
          title: '',
          url: '',
          description: '',
          readingTime: '',
          tags: '',
        });
        setErrors({});
        setMetadataPreview(null);
        // Call onSuccess if provided, otherwise just close
        if (onSuccess) {
          onSuccess();
        } else {
          onClose();
        }
      },
      onError: (error) => {
        setErrors({
          submit: error.message || 'Failed to create bookmark',
        });
      },
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      url: '',
      description: '',
      readingTime: '',
      tags: '',
    });
    setErrors({});
    setMetadataPreview(null);
    setLastFetchedUrl('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Add Bookmark</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors touch-target p-1"
            disabled={createBookmarkMutation.isPending}
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* URL Field */}
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              <Link className="w-4 h-4 inline mr-2" />
              URL *
            </label>
            <div className="relative">
              <input
                type="url"
                id="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                placeholder="https://example.com/article"
                className={`w-full px-3 py-3 sm:py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base sm:text-sm ${
                  errors.url ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={createBookmarkMutation.isPending}
              />
              {isLoadingMetadata && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                </div>
              )}
            </div>
            {errors.url && <p className="text-red-500 text-sm mt-1">{errors.url}</p>}
            {metadataError && <p className="text-orange-500 text-sm mt-1">Could not fetch page info</p>}
            
            {/* Metadata Preview */}
            {metadataPreview && metadataPreview.image && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-start space-x-3">
                  <img
                    src={metadataPreview.image}
                    alt="Preview"
                    className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {metadataPreview.title}
                    </p>
                    {metadataPreview.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                        {metadataPreview.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Article title"
              className={`w-full px-3 py-3 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base sm:text-sm ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={createBookmarkMutation.isPending}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Brief description of the content..."
              rows={3}
              className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base sm:text-sm resize-none"
              disabled={createBookmarkMutation.isPending}
            />
          </div>

          {/* Reading Time Field */}
          <div>
            <label htmlFor="readingTime" className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-2" />
              Reading Time (Optional)
            </label>
            <input
              type="text"
              id="readingTime"
              name="readingTime"
              value={formData.readingTime}
              onChange={handleInputChange}
              placeholder="5 min read"
              className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base sm:text-sm"
              disabled={createBookmarkMutation.isPending}
            />
          </div>

          {/* Tags Field */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="w-4 h-4 inline mr-2" />
              Tags (Optional)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="javascript, react, tutorial"
              className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base sm:text-sm"
              disabled={createBookmarkMutation.isPending}
            />
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Separate tags with commas</p>
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 sm:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors touch-target text-center"
              disabled={createBookmarkMutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createBookmarkMutation.isPending}
              className="flex-1 bg-indigo-600 text-white px-4 py-3 sm:py-2 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors flex items-center justify-center gap-2 touch-target"
            >
              {createBookmarkMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding...
                </>
              ) : (
                'Add Bookmark'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 