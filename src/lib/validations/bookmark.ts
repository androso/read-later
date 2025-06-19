import { z } from 'zod';

// Bookmark validation schemas
export const createBookmarkSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  url: z.string().url('Please enter a valid URL'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  image: z.string().url('Please enter a valid image URL').optional().or(z.literal('')),
  readingTime: z.string().optional(),
  tags: z.array(z.string()).optional(),
  collections: z.array(z.string()).optional(),
});

export const updateBookmarkSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(500).optional(),
  image: z.string().url().optional().or(z.literal('')),
  readingTime: z.string().optional(),
  isUnread: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  collections: z.array(z.string()).optional(),
});

// Tag validation schemas
export const createTagSchema = z.object({
  name: z.string()
    .min(1, 'Tag name is required')
    .max(50, 'Tag name must be less than 50 characters')
    .toLowerCase()
    .trim(),
  color: z.string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please enter a valid hex color')
    .optional(),
});

export const updateTagSchema = z.object({
  name: z.string()
    .min(1)
    .max(50)
    .toLowerCase()
    .trim()
    .optional(),
  color: z.string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please enter a valid hex color')
    .optional(),
});

// Collection validation schemas
export const createCollectionSchema = z.object({
  name: z.string()
    .min(1, 'Collection name is required')
    .max(100, 'Collection name must be less than 100 characters')
    .trim(),
  description: z.string()
    .max(300, 'Description must be less than 300 characters')
    .optional(),
  icon: z.string().emoji().optional().or(z.literal('')),
});

export const updateCollectionSchema = z.object({
  name: z.string()
    .min(1)
    .max(100)
    .trim()
    .optional(),
  description: z.string()
    .max(300)
    .optional(),
  icon: z.string().emoji().optional().or(z.literal('')),
});

// Query validation schemas
export const bookmarkQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  sort: z.enum(['createdAt', '-createdAt', 'title', '-title']).optional(),
  search: z.string().optional(),
  tags: z.union([z.string(), z.array(z.string())]).optional(),
  collections: z.union([z.string(), z.array(z.string())]).optional(),
  isUnread: z.string().transform(val => val === 'true').optional(),
  minReadingTime: z.string().regex(/^\d+$/).transform(Number).optional(),
  maxReadingTime: z.string().regex(/^\d+$/).transform(Number).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
});

export type CreateBookmarkInput = z.infer<typeof createBookmarkSchema>;
export type UpdateBookmarkInput = z.infer<typeof updateBookmarkSchema>;
export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
export type CreateCollectionInput = z.infer<typeof createCollectionSchema>;
export type UpdateCollectionInput = z.infer<typeof updateCollectionSchema>;
export type BookmarkQuery = z.infer<typeof bookmarkQuerySchema>; 