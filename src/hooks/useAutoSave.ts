import { useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface AutoSaveOptions {
  data: any;
  onSave: (data: any) => Promise<void>;
  debounceMs?: number;
  autoSaveIntervalMs?: number;
}

export function useAutoSave({
  data,
  onSave,
  debounceMs = 5000,
  autoSaveIntervalMs = 30000,
}: AutoSaveOptions) {
  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const intervalRef = useRef<NodeJS.Timeout>();
  const lastSavedDataRef = useRef(JSON.stringify(data));

  // Debounced save on data change
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      const currentData = JSON.stringify(data);
      if (currentData !== lastSavedDataRef.current) {
        try {
          await onSave(data);
          lastSavedDataRef.current = currentData;
          toast({
            title: 'Draft saved',
            description: 'Your changes have been saved automatically.',
          });
        } catch (error) {
          console.error('Error auto-saving:', error);
          toast({
            title: 'Error',
            description: 'Failed to save your changes automatically.',
            variant: 'destructive',
          });
        }
      }
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, onSave, debounceMs, toast]);

  // Periodic auto-save
  useEffect(() => {
    intervalRef.current = setInterval(async () => {
      const currentData = JSON.stringify(data);
      if (currentData !== lastSavedDataRef.current) {
        try {
          await onSave(data);
          lastSavedDataRef.current = currentData;
          toast({
            title: 'Draft saved',
            description: 'Your changes have been saved automatically.',
          });
        } catch (error) {
          console.error('Error auto-saving:', error);
          toast({
            title: 'Error',
            description: 'Failed to save your changes automatically.',
            variant: 'destructive',
          });
        }
      }
    }, autoSaveIntervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [data, onSave, autoSaveIntervalMs, toast]);
} 