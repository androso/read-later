import mongoose, { Document, Model, Schema, Types } from 'mongoose';

// Bookmark interface for TypeScript
export interface IBookmark extends Document {
  user: Types.ObjectId;
  title: string;
  description?: string;
  url: string;
  image?: string;
  readingTime?: string;
  isUnread: boolean;
  tags: Types.ObjectId[];
  collections: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const BookmarkSchema: Schema<IBookmark> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxLength: [200, 'Title cannot be more than 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxLength: [500, 'Description cannot be more than 500 characters'],
    },
    url: {
      type: String,
      required: [true, 'URL is required'],
      trim: true,
      validate: {
        validator: function(v: string) {
          try {
            new URL(v);
            return true;
          } catch {
            return false;
          }
        },
        message: 'Please enter a valid URL',
      },
    },
    image: {
      type: String,
      trim: true,
    },
    readingTime: {
      type: String,
      trim: true,
    },
    isUnread: {
      type: Boolean,
      default: true,
    },
    tags: [{
      type: Schema.Types.ObjectId,
      ref: 'Tag',
    }],
    collections: [{
      type: Schema.Types.ObjectId,
      ref: 'Collection',
    }],
  },
  {
    timestamps: true,
  }
);

// Create compound indexes for better query performance
BookmarkSchema.index({ user: 1, createdAt: -1 });
BookmarkSchema.index({ user: 1, isUnread: 1 });
BookmarkSchema.index({ user: 1, tags: 1 });
BookmarkSchema.index({ user: 1, collections: 1 });

const Bookmark: Model<IBookmark> =
  mongoose.models.Bookmark || mongoose.model<IBookmark>('Bookmark', BookmarkSchema);

export default Bookmark; 