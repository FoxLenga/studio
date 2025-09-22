import type { Task } from '@/lib/types';
import { TaskItem } from './task-item';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '../ui/separator';

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="font-headline text-xl font-semibold">Active</h2>
        {activeTasks.length > 0 ? (
          <div className="space-y-3">
            {activeTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground pt-2">
            No active tasks. Great job!
          </p>
        )}
      </div>

      {completedTasks.length > 0 && (
        <>
        <Separator className="my-6"/>
        <Accordion type="single" collapsible>
          <AccordionItem value="completed-tasks">
            <AccordionTrigger className="font-headline text-xl font-semibold">
              Completed ({completedTasks.length})
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2">
                {completedTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        </>
      )}
    </div>
  );
}
