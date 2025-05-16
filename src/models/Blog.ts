import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  content: string;
  tags: string[];
  status: 'draft' | 'published';
  created_at: Date;
  updated_at: Date;
  authorId: string;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    tags: [{
      type: String,
      trim: true,
    }],
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    authorId: {
      type: String,
      required: [true, 'Author ID is required'],
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

// Create indexes for better query performance
BlogSchema.index({ authorId: 1, status: 1 });
BlogSchema.index({ created_at: -1 });

export default mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema); 