// src/app/actions.ts
'use server';

import { generateBugInsights as genInsights, type GenerateBugInsightsInput, type GenerateBugInsightsOutput } from "@/ai/flows/bug-insight-panel";
import { z } from "zod";

const BugSchema = z.object({
    bugReports: z.string().min(50, "Please provide more detailed bug reports for a better analysis."),
});

export async function generateBugInsightsAction(prevState: any, formData: FormData): Promise<{ message: string; insights?: string; }> {
    const validatedFields = BugSchema.safeParse({
        bugReports: formData.get('bugReports'),
    });

    if (!validatedFields.success) {
        return {
            message: 'Error: ' + validatedFields.error.flatten().fieldErrors.bugReports?.join(', '),
        };
    }

    try {
        const input: GenerateBugInsightsInput = {
            bugReports: validatedFields.data.bugReports
        };
        const result: GenerateBugInsightsOutput = await genInsights(input);
        return {
            message: "Success",
            insights: result.insights,
        };
    } catch (error) {
        console.error(error);
        return {
            message: 'An unexpected error occurred. Please try again.',
        };
    }
}
