'use server';
/**
 * @fileOverview A flow for generating a concise summary of a given URL.
 *
 * - generateConciseSummary - A function that generates a concise summary of a URL.
 * - GenerateConciseSummaryInput - The input type for the generateConciseSummary function.
 * - GenerateConciseSummaryOutput - The return type for the generateConciseSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateConciseSummaryInputSchema = z.object({
  url: z.string().url().describe('The URL to summarize.'),
});
export type GenerateConciseSummaryInput = z.infer<
  typeof GenerateConciseSummaryInputSchema
>;

const GenerateConciseSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the URL content.'),
});
export type GenerateConciseSummaryOutput = z.infer<
  typeof GenerateConciseSummaryOutputSchema
>;

export async function generateConciseSummary(
  input: GenerateConciseSummaryInput
): Promise<GenerateConciseSummaryOutput> {
  return generateConciseSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateConciseSummaryPrompt',
  input: {schema: GenerateConciseSummaryInputSchema},
  output: {schema: GenerateConciseSummaryOutputSchema},
  prompt: `You are an AI expert in generating concise summaries of web pages.  

  Generate a concise summary of the content found at the following URL:
  
  URL: {{{url}}}
  
  Summary:`,
});

const generateConciseSummaryFlow = ai.defineFlow(
  {
    name: 'generateConciseSummaryFlow',
    inputSchema: GenerateConciseSummaryInputSchema,
    outputSchema: GenerateConciseSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
