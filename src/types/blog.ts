export interface Blog {
  id: string;
  title: string;
  content: string;
  tags: string[];
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
}

export type CreateBlogInput = Omit<Blog, 'id' | 'createdAt' | 'updatedAt' | 'authorId' | 'status'>;

export type UpdateBlogInput = Partial<Omit<Blog, 'id' | 'createdAt' | 'updatedAt' | 'authorId'>>; 