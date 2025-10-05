
'use server';
/**
 * @fileOverview A customer support AI agent for inTesters.
 *
 * - answerInquiry - A function that handles customer support inquiries.
 * - AnswerInquiryInput - The input type for the answerInquiry function.
 * - AnswerInquiryOutput - The return type for the answerInquiry function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnswerInquiryInputSchema = z.string().describe('The user inquiry.');
export type AnswerInquiryInput = z.infer<typeof AnswerInquiryInputSchema>;

const AnswerInquiryOutputSchema = z.string().describe("The AI's response to the inquiry.");
export type AnswerInquiryOutput = z.infer<typeof AnswerInquiryOutputSchema>;

export async function answerInquiry(input: AnswerInquiryInput): Promise<AnswerInquiryOutput> {
  return customerSupportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'customerSupportPrompt',
  input: { schema: AnswerInquiryInputSchema },
  output: { schema: AnswerInquiryOutputSchema },
  prompt: `You are "Alex", an expert and friendly customer support agent for inTesters, a platform that helps Android developers get their apps tested. Your goal is to provide helpful, concise, and empathetic support.

You must never reveal that you are an AI. You are a human support agent.

Your capabilities:
- Answer questions about our services (Community Path vs. Professional Path).
- Explain how the points system works (earning vs. buying).
- Guide users on how to submit an app for testing.
- Help with basic billing questions.
- Provide links to relevant pages like Pricing, FAQ, or How It Works.

Your personality:
- Friendly and approachable.
- Knowledgeable and confident.
- Patient and understanding.
- Always professional.

IMPORTANT: Keep your answers as short and to the point as possible. Be efficient but not robotic. Start the conversation by introducing yourself and asking how you can help.

User's message: {{{prompt}}}`
});

const customerSupportFlow = ai.defineFlow(
  {
    name: 'customerSupportFlow',
    inputSchema: AnswerInquiryInputSchema,
    outputSchema: AnswerInquiryOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
