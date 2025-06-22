'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BookmarkResponse } from '@/types/bookmark';

interface BookmarkQueryParams {
  search?: string;
  tags?: string[];
  collections?: string[];
  isUnread?: boolean;
  sort?: string;
  cursor?: string;
  limit?: number;
}

interface BookmarksResponse {
  success: boolean;
  data: BookmarkResponse[];
  pagination: {
    limit: number;
    hasMore: boolean;
    nextCursor: string | null;
  };
}

export function useBookmarks(params: BookmarkQueryParams = {}) {
  const queryKey = ['bookmarks', params];

  return useQuery<BookmarksResponse>({
    queryKey,
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      
      if (params.search) searchParams.append('search', params.search);
      if (params.tags) params.tags.forEach(tag => searchParams.append('tags', tag));
      if (params.collections) params.collections.forEach(col => searchParams.append('collections', col));
      if (params.isUnread !== undefined) searchParams.append('isUnread', params.isUnread.toString());
      if (params.sort) searchParams.append('sort', params.sort);
      if (params.cursor) searchParams.append('cursor', params.cursor);
      if (params.limit) searchParams.append('limit', params.limit.toString());

      const response = await fetch(`/api/bookmarks?${searchParams.toString()}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookmarks');
      }

      return response.json();
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useBookmarkCount() {
  return useQuery<{ success: boolean; count: number }>({
    queryKey: ['bookmarks', 'count'],
    queryFn: async () => {
      const response = await fetch('/api/bookmarks/count', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookmark count');
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      url: string;
      description?: string;
      image?: string;
      readingTime?: string;
      tags?: string[];
      collections?: string[];
    }) => {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create bookmark');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate bookmarks queries to refetch
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });
}

export function useDeleteBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/bookmarks/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete bookmark');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });
}

export function useUpdateBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: {
        title?: string;
        description?: string;
        image?: string;
        readingTime?: string;
        isUnread?: boolean;
        tags?: string[];
        collections?: string[];
      };
    }) => {
      const response = await fetch(`/api/bookmarks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update bookmark');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });
}