import { blogDb } from '@/lib/mock-db';
import { Blog } from '@/types/blog';
import { format } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function BlogListPage() {
  const blogs = blogDb.getAll();
  const publishedBlogs = blogs.filter(blog => blog.status === 'published');
  const draftBlogs = blogs.filter(blog => blog.status === 'draft');

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Blogs</h1>
        <Link href="/dashboard/editor">
          <Button>New Blog</Button>
        </Link>
      </div>

      <div className="space-y-8">
        {/* Published Blogs */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Published</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {publishedBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
            {publishedBlogs.length === 0 && (
              <p className="text-muted-foreground">No published blogs yet.</p>
            )}
          </div>
        </section>

        {/* Draft Blogs */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Drafts</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {draftBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
            {draftBlogs.length === 0 && (
              <p className="text-muted-foreground">No draft blogs yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="line-clamp-2">{blog.title}</CardTitle>
        <div className="flex gap-2 flex-wrap">
          {blog.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Last updated: {format(new Date(blog.updatedAt), 'MMM d, yyyy')}
        </p>
      </CardContent>
      <CardFooter>
        <Link href={`/dashboard/editor?id=${blog.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            {blog.status === 'draft' ? 'Continue Editing' : 'Edit'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
} 