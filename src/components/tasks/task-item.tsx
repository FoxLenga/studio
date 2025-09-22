'use client';

import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { MoreHorizontal, Calendar, Trash2, Edit } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

import { db } from '@/lib/firebase';
import type { Task } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { DeleteTaskAlert } from './delete-task-alert';
import { EditTask } from './edit-task';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleToggleComplete = async () => {
    const taskRef = doc(db, 'tasks', task.id);
    try {
      await updateDoc(taskRef, { completed: !task.completed });
      toast({
        title: `Task ${!task.completed ? 'completed' : 'marked as active'}`,
      });
    } catch (error) {
      toast({
        title: 'Error updating task',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    const taskRef = doc(db, 'tasks', task.id);
    try {
      await deleteDoc(taskRef);
      toast({
        title: 'Task deleted',
        description: 'The task has been successfully removed.',
      });
    } catch (error) {
       toast({
        title: 'Error deleting task',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const getPriorityBadgeVariant = (priority: number) => {
    if (priority === 1) return 'destructive';
    if (priority === 2) return 'default';
    return 'secondary';
  }

  return (
    <>
      <Card className={cn("transition-all animate-fade-in-up", task.completed && "bg-muted/50")}>
        <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4">
          <div className="flex items-center h-full pt-1">
            <Checkbox
              id={`task-${task.id}`}
              checked={task.completed}
              onCheckedChange={handleToggleComplete}
              aria-label="Mark task as complete"
            />
          </div>
          <div className="grid gap-1 flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className={cn("text-lg", task.completed && "line-through text-muted-foreground")}>
                {task.title}
              </CardTitle>
              {task.priority && !task.completed && (
                <Badge variant={getPriorityBadgeVariant(task.priority)}>
                  Priority {task.priority}
                </Badge>
              )}
            </div>
            {task.description && (
              <CardDescription className={cn(task.completed && "line-through text-muted-foreground/80")}>
                {task.description}
              </CardDescription>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        {task.createdAt && (
          <CardContent className="p-4 pt-0">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Created {formatDistanceToNow(task.createdAt.toDate(), { addSuffix: true })}
              </span>
            </div>
          </CardContent>
        )}
      </Card>

      <EditTask
        task={task}
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
      />
      <DeleteTaskAlert
        onDelete={handleDelete}
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
      />
    </>
  );
}
