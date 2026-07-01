import { z } from "zod";

export const blogPublishSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200),
  excerpt: z.string().min(1, "Excerpt is required").max(500),
  content: z.string().min(1, "Content is required"),
  authorName: z.string().min(1, "Author name is required").max(100),
  authorAvatarUrl: z.string().min(1, "Author avatar URL is required"),
  authorDataAiHint: z.string().optional(),
  imageUrl: z.string().min(1, "Featured image URL is required"),
  dataAiHint: z.string().optional(),
  tags: z.array(z.string()).default([]),
  category: z.enum(["AUTOMATION", "UI_UX", "SECURITY", "AI", "MOBILE", "DEVOPS", "GENERAL"]).default("GENERAL"),
  isActive: z.boolean().default(true),
  date: z.string().optional(),
});

export const blogDraftSchema = z.object({
  title: z.string().max(200).optional().default(""),
  slug: z.string().max(200).optional().default(""),
  excerpt: z.string().max(500).optional().default(""),
  content: z.string().optional().default(""),
  authorName: z.string().max(100).optional().default(""),
  authorAvatarUrl: z.string().optional().default(""),
  authorDataAiHint: z.string().optional(),
  imageUrl: z.string().optional().default(""),
  dataAiHint: z.string().optional(),
  tags: z.array(z.string()).default([]),
  category: z.enum(["AUTOMATION", "UI_UX", "SECURITY", "AI", "MOBILE", "DEVOPS", "GENERAL"]).default("GENERAL"),
  isActive: z.boolean().default(false),
  date: z.string().optional(),
})
  .refine(
    (data) => data.title.trim() || data.content.trim(),
    {
      message: "Title or content is required to save a draft",
      path: ["title"],
    },
  );

export const blogSchema = blogPublishSchema;

export type BlogFormValues = z.infer<typeof blogSchema>;
