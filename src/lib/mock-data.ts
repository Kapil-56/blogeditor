export interface Blog {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export const mockBlogs: Blog[] = [
  {
    _id: '1',
    title: 'Getting Started with Next.js',
    content: '<p>Next.js is a powerful React framework that makes building full-stack applications easy...</p>',
    tags: ['nextjs', 'react', 'web development'],
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    _id: '2',
    title: 'The Future of Web Development',
    content: '<p>Web development is constantly evolving with new technologies and frameworks...</p>',
    tags: ['web development', 'technology'],
    status: 'draft',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    _id: '3',
    title: 'Building Modern UIs with Tailwind CSS',
    content: '<p>Tailwind CSS has revolutionized how we build user interfaces...</p>',
    tags: ['tailwind', 'css', 'design'],
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]; 