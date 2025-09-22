'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { FilePlus2, Sparkles } from 'lucide-react';

import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import type { Task } from '@/lib/types';
import { TaskList } from '@/components/tasks/task-list';
import { AddTask } from '@/components/tasks/add-task';
import { AIPrioritizer } from '@/components/tasks/ai-prioritizer';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

export default function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const q = query(
      collection(db, 'tasks'),
      where('ownerId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksData: Task[] = [];
      querySnapshot.forEach((doc) => {
        tasksData.push({ id: doc.id, ...doc.data() } as Task);
      });
      setTasks(tasksData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching tasks:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const activeTasks = tasks.filter(task => !task.completed);

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
          <h1 className="font-headline text-3xl font-bold">My Tasks</h1>
          <p className="text-muted-foreground">Here's what you need to work on.</p>
        </div>
        <div className="flex gap-2">
          <AIPrioritizer tasks={activeTasks} />
          <AddTask />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="large" />
        </div>
      ) : tasks.length > 0 ? (
        <TaskList tasks={tasks} />
      ) : (
        <div className="text-center py-16 px-4 border-2 border-dashed rounded-lg">
          <FilePlus2 className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">No tasks yet</h2>
          <p className="mt-2 text-muted-foreground">
            Get started by adding your first task.
          </p>
          <div className="mt-6">
            <AddTask />
          </div>
        </div>
      )}
    </div>
  );
}
