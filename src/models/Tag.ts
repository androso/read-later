import mongoose, { Document, Model, Schema, Types } from 'mongoose';

// Tag interface for TypeScript
export interface ITag extends Document {
  user: Types.ObjectId;
  name: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
  count?: number; // Virtual field for bookmark count
}

const TagSchema: Schema<ITag> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Tag name is required'],
      trim: true,
      lowercase: true,
      maxLength: [50, 'Tag name cannot be more than 50 characters'],
    },
    color: {
      type: String,
      default: '#6366f1', // Default indigo color
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please enter a valid hex color'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create compound index for user and name uniqueness
TagSchema.index({ user: 1, name: 1 }, { unique: true });

// Virtual field to get bookmark count (will be populated by aggregation)
TagSchema.virtual('count').get(function() {
  return this.count || 0;
});

// Set method for count (used in aggregation)
TagSchema.virtual('count').set(function(value: number) {
  this.count = value;
});

// Add a non-persisted field for count
TagSchema.add({ count: { type: Number, default: 0 } });

const Tag: Model<ITag> =
  mongoose.models.Tag || mongoose.model<ITag>('Tag', TagSchema);

export default Tag; 