import mongoose, { Document, Model, Schema, Types } from 'mongoose';

// Collection interface for TypeScript
export interface ICollection extends Document {
  user: Types.ObjectId;
  name: string;
  description?: string;
  icon?: string;
  isSmartCollection: boolean;
  smartCollectionType?: 'all' | 'unread' | 'recent' | 'mostRead' | 'shortReads';
  filterCriteria?: {
    tags?: string[];
    readingTime?: {
      min?: number;
      max?: number;
    };
    dateRange?: {
      from?: Date;
      to?: Date;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const CollectionSchema: Schema<ICollection> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Collection name is required'],
      trim: true,
      maxLength: [100, 'Collection name cannot be more than 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxLength: [300, 'Description cannot be more than 300 characters'],
    },
    icon: {
      type: String,
      default: '📁',
    },
    isSmartCollection: {
      type: Boolean,
      default: false,
    },
    smartCollectionType: {
      type: String,
      enum: ['all', 'unread', 'recent', 'mostRead', 'shortReads'],
    },
    filterCriteria: {
      tags: [String],
      readingTime: {
        min: Number,
        max: Number,
      },
      dateRange: {
        from: Date,
        to: Date,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for user and name uniqueness
CollectionSchema.index({ user: 1, name: 1 }, { unique: true });

const Collection: Model<ICollection> =
  mongoose.models.Collection || mongoose.model<ICollection>('Collection', CollectionSchema);

export default Collection; 