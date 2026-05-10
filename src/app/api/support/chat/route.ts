import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { SUPPORT_SYSTEM_PROMPT, OPENROUTER_MODEL } from "@/lib/support-config";
import { z } from "zod";
import axios from "axios";

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const runtime = "edge";

const ticketSchema = z.object({
  subject: z.string().describe("Short summary of the issue"),
  description: z.string().describe("Detailed explanation of the issue"),
  category: z.enum(["GENERAL", "TECHNICAL", "BILLING", "BUG_REPORT"]).default("GENERAL"),
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const cookieHeader = req.headers.get("cookie") || "";

    const result = streamText({
      model: openrouter(OPENROUTER_MODEL),
      system: SUPPORT_SYSTEM_PROMPT,
      messages,
      tools: {
        create_ticket: {
          description: "Create a formal support ticket for complex issues or complaints",
          parameters: ticketSchema,
          execute: async ({ subject, description, category }: any) => {
            try {
              const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/support/tickets`,
                { subject, description, category },
                { headers: { Cookie: cookieHeader } }
              );
              return { 
                success: true, 
                ticketId: response.data.data.id,
                message: `Ticket #${response.data.data.id} has been created.` 
              };
            } catch (err) {
              return { success: false, message: "Failed to create ticket." };
            }
          },
        } as any,
      },
      temperature: 0.5,
      maxOutputTokens: 500,
      onFinish: async ({ text }) => {
         try {
           await axios.post(
             `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/support/chat/message`,
             { message: text, role: "assistant" },
             { headers: { Cookie: cookieHeader } }
           );
         } catch (e) {
           console.error("Failed to save AI message:", e);
         }
      }
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Support API Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process chat request" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
