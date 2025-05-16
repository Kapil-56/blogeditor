import { Blog, CreateBlogInput, UpdateBlogInput } from '@/types/blog';

// Mock user ID for demo
export const DEMO_USER_ID = 'demo-user-123';

// In-memory storage
const blogs: Blog[] = [
  {
    id: '1',
    title: 'Getting Started with Next.js',
    content: 'This is a sample blog post about Next.js...',
    tags: ['nextjs', 'react', 'javascript'],
    status: 'published',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
    authorId: DEMO_USER_ID,
  },
  {
    id: '2',
    title: 'Understanding TypeScript',
    content: 'TypeScript is a typed superset of JavaScript...',
    tags: ['typescript', 'javascript'],
    status: 'draft',
    createdAt: new Date('2024-03-02'),
    updatedAt: new Date('2024-03-02'),
    authorId: DEMO_USER_ID,
  },
];

// Helper to generate new ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Blog operations
export const blogDb = {
  // Get all blogs for demo user
  getAll: () => blogs.filter(blog => blog.authorId === DEMO_USER_ID),

  // Get blog by ID
  getById: (id: string) => blogs.find(blog => blog.id === id && blog.authorId === DEMO_USER_ID),

  // Create new blog
  create: (input: CreateBlogInput): Blog => {
    const newBlog: Blog = {
      id: generateId(),
      ...input,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: DEMO_USER_ID,
    };
    blogs.push(newBlog);
    return newBlog;
  },

  // Update blog
  update: (id: string, input: UpdateBlogInput): Blog | null => {
    const index = blogs.findIndex(blog => blog.id === id && blog.authorId === DEMO_USER_ID);
    if (index === -1) return null;

    blogs[index] = {
      ...blogs[index],
      ...input,
      updatedAt: new Date(),
    };
    return blogs[index];
  },

  // Delete blog
  delete: (id: string): boolean => {
    const index = blogs.findIndex(blog => blog.id === id && blog.authorId === DEMO_USER_ID);
    if (index === -1) return false;
    blogs.splice(index, 1);
    return true;
  },
}; 