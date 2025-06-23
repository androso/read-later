'use client';

import { useState, useCallback } from 'react';

interface MetadataResult {
  title: string;
  description: string;
  image: string;
  siteName: string;
  type: string;
  url: string;
}

// Helper function to make authenticated requests (same as in useBookmarks)
const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('auth-token');
  
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
};

export function useMetadata() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetadata = useCallback(async (url: string): Promise<MetadataResult | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate URL first
      new URL(url);

      const response = await makeAuthenticatedRequest('/api/metadata', {
        method: 'POST',
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Metadata fetch failed:', response.status, errorText);
        throw new Error(`Failed to fetch metadata: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        console.error('Metadata API returned error:', result);
        throw new Error(result.message || 'Failed to fetch metadata');
      }

      console.log('Metadata fetched successfully:', result.data);
      return result.data;
    } catch (err) {
      console.error('Metadata fetch error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch metadata';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    fetchMetadata,
    isLoading,
    error,
  };
} 