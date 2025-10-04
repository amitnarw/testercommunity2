'use server';

import { generateConciseSummary } from '@/ai/flows/generate-concise-summary';

export async function generateSummary(
  url: string
): Promise<{ success: true; summary: string } | { success: false; error: string }> {
  try {
    const result = await generateConciseSummary({ url });
    if (result && result.summary) {
      return { success: true, summary: result.summary };
    }
    return { success: false, error: 'Failed to generate summary. The URL might be inaccessible or invalid.' };
  } catch (error) {
    console.error('Error generating summary:', error);
    return { success: false, error: 'An unexpected error occurred while generating the summary.' };
  }
}
