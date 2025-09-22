'use server';

/**
 * @fileOverview Task Prioritization AI agent.
 *
 * - prioritizeTasks - A function that prioritizes a list of tasks based on their descriptions.
 * - PrioritizeTasksInput - The input type for the prioritizeTasks function.
 * - PrioritizeTasksOutput - The return type for the prioritizeTasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PrioritizeTasksInputSchema = z.array(
  z.object({
    title: z.string().describe('The title of the task.'),
    description: z.string().describe('A detailed description of the task.'),
  })
);
export type PrioritizeTasksInput = z.infer<typeof PrioritizeTasksInputSchema>;

const PrioritizeTasksOutputSchema = z.array(
  z.object({
    title: z.string().describe('The title of the task.'),
    description: z.string().describe('A detailed description of the task.'),
    priority: z.number().describe('The priority of the task (1 being highest).'),
    reason: z.string().describe('The reason for the assigned priority.'),
  })
);
export type PrioritizeTasksOutput = z.infer<typeof PrioritizeTasksOutputSchema>;

export async function prioritizeTasks(input: PrioritizeTasksInput): Promise<PrioritizeTasksOutput> {
  return prioritizeTasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'prioritizeTasksPrompt',
  input: {schema: PrioritizeTasksInputSchema},
  output: {schema: PrioritizeTasksOutputSchema},
  prompt: `You are an AI task prioritization expert. Given a list of tasks with titles and descriptions, you will prioritize them based on importance and urgency. Return the tasks with an added "priority" field (1 being the highest priority) and a "reason" field explaining why that priority was assigned.

Tasks:
{{#each this}}
- Title: {{{title}}}
  Description: {{{description}}}
{{/each}}`,
});

const prioritizeTasksFlow = ai.defineFlow(
  {
    name: 'prioritizeTasksFlow',
    inputSchema: PrioritizeTasksInputSchema,
    outputSchema: PrioritizeTasksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
