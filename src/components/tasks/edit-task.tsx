'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Sparkles } from 'lucide-react';

import { db } from '@/lib/firebase';
import type { Task } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import { suggestTaskTitles } from '@/ai/flows/suggest-task-titles';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface EditTaskProps {
  task: Task;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function EditTask({ task, isOpen, setIsOpen }: EditTaskProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task.title,
      description: task.description || '',
    },
  });

  const descriptionValue = form.watch('description');

  const handleSuggestTitles = async () => {
    if (!descriptionValue) return;
    setIsSuggesting(true);
    setSuggestions([]);
    try {
      const result = await suggestTaskTitles({ taskDescription: descriptionValue });
      setSuggestions(result.suggestedTitles);
    } catch (error) {
      toast({
        title: 'AI Suggestion Failed',
        description: 'Could not generate titles. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  const onSubmit = async (data: TaskFormValues) => {
    setLoading(true);
    const taskRef = doc(db, 'tasks', task.id);
    try {
      await updateDoc(taskRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
      toast({ title: 'Task updated successfully' });
      setSuggestions([]);
      setIsOpen(false);
    } catch (error) {
      toast({
        title: 'Error updating task',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit task</DialogTitle>
          <DialogDescription>
            Make changes to your task here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Finalize the quarterly report for the client meeting on Friday."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Title</FormLabel>
                     <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleSuggestTitles}
                        disabled={!descriptionValue || isSuggesting}
                      >
                       {isSuggesting ? <Spinner size="small" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        AI Suggest
                      </Button>
                  </div>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {suggestions.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((s, i) => (
                    <Button
                      key={i}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => form.setValue('title', s, { shouldValidate: true })}
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? <Spinner /> : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
