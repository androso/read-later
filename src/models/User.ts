import mongoose, { Document, Model, Schema } from 'mongoose';
import { z } from 'zod';

export const CreateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name cannot exceed 50 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['user', 'admin']).optional(),
});

export const UpdateUserSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  email: z.string().email().optional(),
  avatar: z.string().url().optional(),
  role: z.enum(['user', 'admin']).optional(),
  isEmailVerified: z.boolean().optional(),
});

// Infer types from Zod schemas
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;

// ✅ Mongoose interface & schema for server-side DB operations
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  role: 'user' | 'admin';
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxLength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email',
      ],
    },
    password: {
      type: String,
      minLength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't include password in queries by default
    },
    avatar: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Create indexes for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ createdAt: 1 });

// Prevent duplicate compilation in development
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User; 