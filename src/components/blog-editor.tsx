'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useCallback, useEffect, useState, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { Blog } from '@/types/blog';
import {
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
  Tag
} from 'lucide-react';

interface BlogEditorProps {
  initialBlog?: Blog;
  onSave?: (blog: Partial<Blog>) => void;
}

export function BlogEditor({ initialBlog, onSave }: BlogEditorProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState(initialBlog?.title || '');
  const [tags, setTags] = useState<string[]>(initialBlog?.tags || []);
  const [newTag, setNewTag] = useState('');
  const isInitialMount = useRef(true);
  const hasUserEdited = useRef(false);
  const lastSavedContent = useRef(initialBlog?.content || '');
  const autoSaveTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleAutoSave = useCallback(
    async (content: string, showToast = true) => {
      if (!title.trim() && !content.trim()) return;
      
      try {
        const blogData = {
          title,
          content,
          tags,
          status: 'draft' as const
        };
        
        onSave?.(blogData);

        if (showToast) {
          toast({
            title: 'Draft saved',
            description: 'Your changes have been saved automatically.',
          });
        }
      } catch (error) {
        console.error('Auto-save error:', error);
        if (showToast) {
          toast({
            title: 'Error',
            description: 'Failed to save draft. Please try again.',
            variant: 'destructive',
          });
        }
      }
    },
    [title, tags, toast, onSave]
  );

  const scheduleAutoSave = useCallback((content: string) => {
    if (autoSaveTimeout.current) {
      clearTimeout(autoSaveTimeout.current);
    }
    autoSaveTimeout.current = setTimeout(() => {
      handleAutoSave(content, false);
    }, 2000);
  }, [handleAutoSave]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: 'Start writing your post...',
      }),
    ],
    content: initialBlog?.content || '',
    onUpdate: ({ editor }) => {
      hasUserEdited.current = true;
      const content = editor.getHTML();
      if (content !== lastSavedContent.current) {
        lastSavedContent.current = content;
        scheduleAutoSave(content);
      }
    },
  });

  const debouncedTitle = useDebounce(title, 2000);

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      const newTags = [...tags, newTag];
      setTags(newTags);
      setNewTag('');
      scheduleAutoSave(editor?.getHTML() || '');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    scheduleAutoSave(editor?.getHTML() || '');
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (hasUserEdited.current && debouncedTitle) {
      scheduleAutoSave(editor?.getHTML() || '');
    }
  }, [debouncedTitle, scheduleAutoSave, editor]);

  useEffect(() => {
    return () => {
      if (autoSaveTimeout.current) {
        clearTimeout(autoSaveTimeout.current);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Title Input */}
      <input
        type="text"
        value={title}
        onChange={(e) => {
          hasUserEdited.current = true;
          setTitle(e.target.value);
        }}
        placeholder="Post title..."
        className="w-full text-2xl sm:text-4xl font-bold bg-transparent border-none outline-none dark:text-white"
      />

      {/* Tags */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Tag size={20} className="text-gray-500" />
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              placeholder="Add tags..."
              className="flex-1 bg-transparent border-none outline-none dark:text-white"
            />
          </div>
          <Button
            variant="ghost"
            onClick={handleAddTag}
            className="text-blue-500 w-full sm:w-auto"
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
      <div className="flex flex-wrap items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-4 overflow-x-auto">
        <div className="flex items-center gap-2">
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
        </div>
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2" />
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <List size={16} />
          </Button>
          <Button variant="ghost" size="sm">
            <ListOrdered size={16} />
          </Button>
          <Button variant="ghost" size="sm">
            <Quote size={16} />
          </Button>
        </div>
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2" />
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <AlignLeft size={16} />
          </Button>
          <Button variant="ghost" size="sm">
            <AlignCenter size={16} />
          </Button>
          <Button variant="ghost" size="sm">
            <AlignRight size={16} />
          </Button>
        </div>
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2" />
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <ImageIcon size={16} />
          </Button>
          <Button variant="ghost" size="sm">
            <LinkIcon size={16} />
          </Button>
          <Button variant="ghost" size="sm">
            <Code size={16} />
          </Button>
        </div>
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2" />
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Undo size={16} />
          </Button>
          <Button variant="ghost" size="sm">
            <Redo size={16} />
          </Button>
        </div>
      </div>

      {/* Content Editor */}
      <div className="prose dark:prose-invert max-w-none">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
} 