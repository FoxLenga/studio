'use client';

import { useState } from 'react';
import { Sparkles, ArrowDownUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import type { Task } from '@/lib/types';
import { prioritizeTasks, PrioritizeTasksOutput } from '@/ai/flows/task-prioritization';
import { Spinner } from '../ui/spinner';
import { Badge } from '../ui/badge';

interface AIPrioritizerProps {
  tasks: Task[];
}

export function AIPrioritizer({ tasks }: AIPrioritizerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prioritizedTasks, setPrioritizedTasks] = useState<PrioritizeTasksOutput>([]);
  const { toast } = useToast();

  const handlePrioritize = async () => {
    setLoading(true);
    setPrioritizedTasks([]);
    try {
      const tasksToPrioritize = tasks.map(({ title, description }) => ({ title, description }));
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
          onClick={handlePrioritize}
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
      </DialogContent>
    </Dialog>
  );
}
