'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  Eye,
  Send,
  Image as ImageIcon,
  Link as LinkIcon,
  Code,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Tag,
  X
} from 'lucide-react';

export default function NewPost() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/');
    }
  }, [status, router]);

  useEffect(() => {
    // Auto-save functionality
    const autoSave = async () => {
      if (title || content) {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLastSaved(new Date());
        setIsSaving(false);
      }
    };

    const timeoutId = setTimeout(autoSave, 2000);
    return () => clearTimeout(timeoutId);
  }, [title, content]);

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handlePublish = async () => {
    // Implement publish logic
    console.log('Publishing post...');
  };

  const handleSaveDraft = async () => {
    // Implement save draft logic
    console.log('Saving draft...');
  };

  // Show loading state while checking authentication
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

  // Don't render the editor if not authenticated
  if (status === 'unauthenticated') {
    return null;
  }

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
              Back
            </Button>
            <h1 className="text-xl font-semibold">New Post</h1>
          </div>
          <div className="flex items-center gap-4">
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
              Preview
            </Button>
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              className="gap-2"
            >
              <Save size={20} />
              Save Draft
            </Button>
            <Button
              onClick={handlePublish}
              className="gap-2 bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Send size={20} />
              Publish
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Title Input */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title..."
              className="w-full text-4xl font-bold bg-transparent border-none outline-none mb-8 dark:text-white"
            />

            {/* Tags */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Tag size={20} className="text-gray-500" />
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  placeholder="Add tags..."
                  className="flex-1 bg-transparent border-none outline-none dark:text-white"
                />
                <Button
                  variant="ghost"
                  onClick={handleAddTag}
                  className="text-blue-500"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Editor Toolbar */}
            <div className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-4">
              <Button variant="ghost" size="sm">
                <Bold size={16} />
              </Button>
              <Button variant="ghost" size="sm">
                <Italic size={16} />
              </Button>
              <Button variant="ghost" size="sm">
                <Heading1 size={16} />
              </Button>
              <Button variant="ghost" size="sm">
                <Heading2 size={16} />
              </Button>
              <Button variant="ghost" size="sm">
                <Heading3 size={16} />
              </Button>
              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2" />
              <Button variant="ghost" size="sm">
                <List size={16} />
              </Button>
              <Button variant="ghost" size="sm">
                <ListOrdered size={16} />
              </Button>
              <Button variant="ghost" size="sm">
                <Quote size={16} />
              </Button>
              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2" />
              <Button variant="ghost" size="sm">
                <AlignLeft size={16} />
              </Button>
              <Button variant="ghost" size="sm">
                <AlignCenter size={16} />
              </Button>
              <Button variant="ghost" size="sm">
                <AlignRight size={16} />
              </Button>
              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2" />
              <Button variant="ghost" size="sm">
                <ImageIcon size={16} />
              </Button>
              <Button variant="ghost" size="sm">
                <LinkIcon size={16} />
              </Button>
              <Button variant="ghost" size="sm">
                <Code size={16} />
              </Button>
              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2" />
              <Button variant="ghost" size="sm">
                <Undo size={16} />
              </Button>
              <Button variant="ghost" size="sm">
                <Redo size={16} />
              </Button>
            </div>

            {/* Content Editor */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 min-h-[500px]">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing your post..."
                className="w-full h-full min-h-[500px] bg-transparent border-none outline-none resize-none dark:text-white"
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
                      <h1 className="text-4xl font-bold">{title}</h1>
                      <Button
                        variant="ghost"
                        onClick={() => setShowPreview(false)}
                        className="gap-2"
                      >
                        <X size={20} />
                        Close Preview
                      </Button>
                    </div>
                    <div className="prose dark:prose-invert max-w-none">
                      {content}
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