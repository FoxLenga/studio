'use server';

/**
 * @fileOverview AI-powered task title suggestion flow.
 *
 * - suggestTaskTitles - A function that suggests task titles based on a description.
 * - SuggestTaskTitlesInput - The input type for the suggestTaskTitles function.
 * - SuggestTaskTitlesOutput - The return type for the suggestTaskTitles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTaskTitlesInputSchema = z.object({
  taskDescription: z
    .string()
    .describe('A description of the task for which titles are to be suggested.'),
});
export type SuggestTaskTitlesInput = z.infer<typeof SuggestTaskTitlesInputSchema>;

const SuggestTaskTitlesOutputSchema = z.object({
  suggestedTitles: z
    .array(z.string())
    .describe('An array of suggested task titles based on the description.'),
});
export type SuggestTaskTitlesOutput = z.infer<typeof SuggestTaskTitlesOutputSchema>;

export async function suggestTaskTitles(input: SuggestTaskTitlesInput): Promise<SuggestTaskTitlesOutput> {
  return suggestTaskTitlesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTaskTitlesPrompt',
  input: {schema: SuggestTaskTitlesInputSchema},
  output: {schema: SuggestTaskTitlesOutputSchema},
  prompt: `You are a helpful assistant that suggests creative and concise task titles based on a given task description.

  Task Description: {{{taskDescription}}}

  Please suggest 5 different task titles that accurately reflect the task description. Return the titles as a JSON array of strings.`,
});

const suggestTaskTitlesFlow = ai.defineFlow(
  {
    name: 'suggestTaskTitlesFlow',
    inputSchema: SuggestTaskTitlesInputSchema,
    outputSchema: SuggestTaskTitlesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
