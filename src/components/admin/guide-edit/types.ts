import { z } from "zod";

export const guideSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200),
  description: z.string().min(1, "Description is required").max(500),
  content: z.string().min(1, "Content is required"),
  readTime: z.string().optional().default("5 min read"),
  categoryId: z.coerce.number().min(1, "Category is required"),
  publishedAt: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type GuideFormValues = z.infer<typeof guideSchema>;
