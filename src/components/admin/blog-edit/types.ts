import { z } from "zod";

export const blogSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200),
  excerpt: z.string().min(1, "Excerpt is required").max(500),
  content: z.string().min(1, "Content is required"),
  authorName: z.string().min(1, "Author name is required").max(100),
  authorAvatarUrl: z.string().default(""),
  authorDataAiHint: z.string().optional(),
  imageUrl: z.string().default(""),
  dataAiHint: z.string().optional(),
  tags: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  date: z.string().optional(),
});

export type BlogFormValues = z.infer<typeof blogSchema>;
