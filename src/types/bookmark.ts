// Types for API responses and client-side usage
export interface BookmarkResponse {
  _id: string;
  title: string;
  description?: string;
  url: string;
  image?: string;
  readingTime?: string;
  isUnread: boolean;
  tags: TagResponse[];
  collections: CollectionResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface TagResponse {
  _id: string;
  name: string;
  color?: string;
  count?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CollectionResponse {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
  isSmartCollection: boolean;
  smartCollectionType?: 'all' | 'unread' | 'recent' | 'mostRead' | 'shortReads';
  bookmarkCount?: number;
  createdAt: string;
  updatedAt: string;
}

// Input types for creating/updating
export interface CreateBookmarkInput {
  title: string;
  url: string;
  description?: string;
  image?: string;
  readingTime?: string;
  tags?: string[]; // Tag IDs or names
  collections?: string[]; // Collection IDs
}

export interface UpdateBookmarkInput {
  title?: string;
  description?: string;
  image?: string;
  readingTime?: string;
  isUnread?: boolean;
  tags?: string[];
  collections?: string[];
}

export interface CreateTagInput {
  name: string;
  color?: string;
}

export interface CreateCollectionInput {
  name: string;
  description?: string;
  icon?: string;
}

export interface UpdateCollectionInput {
  name?: string;
  description?: string;
  icon?: string;
}

// Filter types for querying
export interface BookmarkFilters {
  search?: string;
  tags?: string[];
  collections?: string[];
  isUnread?: boolean;
  readingTime?: {
    min?: number;
    max?: number;
  };
  dateRange?: {
    from?: Date;
    to?: Date;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: 'createdAt' | '-createdAt' | 'title' | '-title';
} 