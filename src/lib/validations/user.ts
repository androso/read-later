import { z } from 'zod';

// Shared validation schemas for User
export const CreateUserSchema = z.object({
  username: z.string().min(1, 'Username is required').max(50, 'Username cannot exceed 50 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const SignInSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const UpdateUserSchema = z.object({
  username: z.string().min(1).max(50).optional(),
  email: z.string().email().optional(),
});

// Infer types from Zod schemas
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type SignInUser = z.infer<typeof SignInSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>; 