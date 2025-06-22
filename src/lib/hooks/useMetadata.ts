'use client';

import { useState } from 'react';

interface MetadataResult {
  title: string;
  description: string;
  image: string;
  siteName: string;
  type: string;
  url: string;
}

export function useMetadata() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetadata = async (url: string): Promise<MetadataResult | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate URL first
      new URL(url);

      const response = await fetch('/api/metadata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch metadata');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch metadata');
      }

      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch metadata';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchMetadata,
    isLoading,
    error,
  };
} 