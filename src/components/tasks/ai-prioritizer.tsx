'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { writeBatch, doc } from 'firebase/firestore';

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
import { useToast } from '@/hooks/use-toast';
import type { Task } from '@/lib/types';
import { prioritizeTasks, PrioritizeTasksOutput } from '@/ai/flows/task-prioritization';
import { Spinner } from '../ui/spinner';
import { Badge } from '../ui/badge';
import { db } from '@/lib/firebase';

interface AIPrioritizerProps {
  tasks: Task[];
}

export function AIPrioritizer({ tasks }: AIPrioritizerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [prioritizedTasks, setPrioritizedTasks] = useState<PrioritizeTasksOutput>([]);
  const { toast } = useToast();

  const handleOpenAndPrioritize = async () => {
    if (tasks.length < 2) {
      toast({
        title: 'Not enough tasks',
        description: 'You need at least two active tasks to use the AI Prioritizer.',
      });
      return;
    }
    setIsOpen(true);
    setLoading(true);
    setPrioritizedTasks([]);
    try {
      const tasksToPrioritize = tasks.map(({ title, description }) => ({ title, description: description || '' }));
      const result = await prioritizeTasks(tasksToPrioritize);
      setPrioritizedTasks(result);
    } catch (error) {
      console.error(error);
      toast({
        title: 'AI Prioritization Failed',
        description: 'Could not prioritize tasks. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePriorities = async () => {
    if (!prioritizedTasks.length) return;
    setIsSaving(true);
    const batch = writeBatch(db);
    const taskMap = new Map(tasks.map(t => [t.title, t.id]));

    prioritizedTasks.forEach(pTask => {
        const taskId = taskMap.get(pTask.title);
        if (taskId) {
            const taskRef = doc(db, 'tasks', taskId);
            batch.update(taskRef, { 
                priority: pTask.priority,
                reason: pTask.reason
            });
        }
    });

    try {
        await batch.commit();
        toast({ title: 'Priorities saved!', description: 'Your task list has been updated.' });
        setIsOpen(false);
    } catch (error) {
        console.error(error);
        toast({ title: 'Error saving priorities', description: 'Please try again later.', variant: 'destructive' });
    } finally {
        setIsSaving(false);
    }
  };


  const getPriorityBadgeVariant = (priority: number) => {
    if (priority === 1) return 'destructive';
    if (priority === 2) return 'default';
    return 'secondary';
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          disabled={tasks.length < 2}
          onClick={handleOpenAndPrioritize}
        >
          <Sparkles className="-ml-1 mr-2 h-5 w-5" />
          AI Prioritize
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>AI Prioritized Tasks</DialogTitle>
          <DialogDescription>
            Here's the suggested order for your tasks based on importance and urgency.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto p-1 pr-4">
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <Spinner size="large" />
            </div>
          ) : (
            <div className="space-y-4">
              {prioritizedTasks.map((task, index) => (
                <div key={index} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold">{task.title}</h3>
                    <Badge variant={getPriorityBadgeVariant(task.priority)}>
                      Priority: {task.priority}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Reason:</span> {task.reason}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)} variant="ghost">Cancel</Button>
          <Button onClick={handleSavePriorities} disabled={isSaving || loading || !prioritizedTasks.length}>
            {isSaving ? <Spinner /> : 'Save Priorities'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
