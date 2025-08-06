'use server';

/**
 * @fileOverview A bug insight panel AI agent.
 *
 * - generateBugInsights - A function that handles the generation of bug insights.
 * - GenerateBugInsightsInput - The input type for the generateBugInsights function.
 * - GenerateBugInsightsOutput - The return type for the generateBugInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBugInsightsInputSchema = z.object({
  bugReports: z
    .string()
    .describe('A list of bug reports to generate insights from.'),
});
export type GenerateBugInsightsInput = z.infer<typeof GenerateBugInsightsInputSchema>;

const GenerateBugInsightsOutputSchema = z.object({
  insights: z.string().describe('The generated insights from the bug reports.'),
});
export type GenerateBugInsightsOutput = z.infer<typeof GenerateBugInsightsOutputSchema>;

export async function generateBugInsights(input: GenerateBugInsightsInput): Promise<GenerateBugInsightsOutput> {
  return generateBugInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBugInsightsPrompt',
  input: {schema: GenerateBugInsightsInputSchema},
  output: {schema: GenerateBugInsightsOutputSchema},
  prompt: `You are an AI assistant that provides insights from bug reports.

  Analyze the following bug reports and provide a summary of the trends and insights.

  Bug Reports: {{{bugReports}}}`,
});

const generateBugInsightsFlow = ai.defineFlow(
  {
    name: 'generateBugInsightsFlow',
    inputSchema: GenerateBugInsightsInputSchema,
    outputSchema: GenerateBugInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
