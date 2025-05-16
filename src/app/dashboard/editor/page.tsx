'use client';

import { BlogEditor } from '@/components/blog-editor';
import { blogDb } from '@/lib/mock-db';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Blog } from '@/types/blog';
import {
  ArrowLeft,
  Save,
  Eye,
  Send,
  X,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function EditorPage() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const blogId = searchParams.get('id') || undefined;
  const blog = blogId ? blogDb.getById(blogId) : undefined;

  // UI/UX state
  const [showPreview, setShowPreview] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Save handler
  const handleSave = async (updatedBlog: Partial<Blog>) => {
    if (!updatedBlog) return;
    setIsSaving(true);

    if (blogId && blog) {
      // Only update if we have a valid blog
      blogDb.update(blogId, {
        title: updatedBlog.title || '',
        content: updatedBlog.content || blog.content || '',
        tags: updatedBlog.tags || [],
        status: updatedBlog.status || blog.status || 'draft'
      });
    } else {
      // Create new blog
      blogDb.create({
        title: updatedBlog.title || '',
        tags: updatedBlog.tags || [],
        content: updatedBlog.content || '',
      });
    }

    setLastSaved(new Date());
    setIsSaving(false);
    if (updatedBlog.status === 'published') {
      router.push('/dashboard');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }
  if (status === 'unauthenticated') return null;
  if (blogId && !blog) notFound();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-50">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <h1 className="text-xl font-semibold hidden sm:block">Edit Post</h1>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {lastSaved && (
              <span className="text-sm text-gray-500">
                {isSaving ? 'Saving...' : `Saved ${lastSaved.toLocaleTimeString()}`}
              </span>
            )}
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              className="gap-2"
            >
              <Eye size={20} />
              <span className="hidden sm:inline">Preview</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSave({ status: 'draft' })}
              className="gap-2"
            >
              <Save size={20} />
              <span className="hidden sm:inline">Save Draft</span>
            </Button>
            <Button
              onClick={() => handleSave({ status: 'published' })}
              className="gap-2 bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Send size={20} />
              <span className="hidden sm:inline">Publish</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden"
          >
            <Menu size={20} />
          </Button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4"
          >
            <div className="flex flex-col gap-4">
              {lastSaved && (
                <span className="text-sm text-gray-500">
                  {isSaving ? 'Saving...' : `Saved ${lastSaved.toLocaleTimeString()}`}
                </span>
              )}
              <Button
                variant="outline"
                onClick={() => {
                  setShowPreview(!showPreview);
                  setShowMobileMenu(false);
                }}
                className="gap-2 w-full justify-start"
              >
                <Eye size={20} />
                Preview
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  handleSave({ status: 'draft' });
                  setShowMobileMenu(false);
                }}
                className="gap-2 w-full justify-start"
              >
                <Save size={20} />
                Save Draft
              </Button>
              <Button
                onClick={() => {
                  handleSave({ status: 'published' });
                  setShowMobileMenu(false);
                }}
                className="gap-2 w-full justify-start bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Send size={20} />
                Publish
              </Button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Content Editor */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 min-h-[500px]">
              <BlogEditor
                initialBlog={blog}
                onSave={handleSave}
              />
            </div>

            {/* Preview Mode */}
            {showPreview && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed inset-0 bg-white dark:bg-gray-900 z-50 overflow-y-auto"
              >
                <div className="container mx-auto px-4 py-8">
                  <div className="max-w-3xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                      <h1 className="text-2xl sm:text-4xl font-bold">{blog?.title}</h1>
                      <Button
                        variant="ghost"
                        onClick={() => setShowPreview(false)}
                        className="gap-2"
                      >
                        <X size={20} />
                        <span className="hidden sm:inline">Close Preview</span>
                      </Button>
                    </div>
                    <div className="prose dark:prose-invert max-w-none">
                      {blog?.content}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 