'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Plus, Sparkles } from 'lucide-react';

import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

export function AddTask() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
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
    if (!user) {
      toast({ title: 'You must be logged in', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, 'tasks'), {
        ...data,
        ownerId: user.uid,
        completed: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      toast({ title: 'Task created!', description: 'Your new task has been added.' });
      form.reset();
      setSuggestions([]);
      setIsOpen(false);
    } catch (error) {
      toast({
        title: 'Error creating task',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a new task</DialogTitle>
          <DialogDescription>
            What do you need to get done?
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
                        Suggest Title
                      </Button>
                  </div>
                  <FormControl>
                    <Input placeholder="A short, clear title" {...field} />
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
                {loading ? <Spinner /> : 'Add Task'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
