"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useBlogById, useCreateBlog, useUpdateBlog, useAllBlogs } from "@/hooks/useAdmin";
import { blogSchema, BlogFormValues } from "./types";

interface BlogFormContextValue {
  form: UseFormReturn<BlogFormValues>;
  isNew: boolean;
  blogId: number;
  isPending: boolean;
  isSaving: boolean;
  setIsSaving: (v: boolean) => void;
  currentTags: string[];
  addTag: (tag: string) => void;
  removeTag: (index: number) => void;
  onPublish: (values: BlogFormValues, onSuccess?: (slug: string) => void) => void;
  onSaveDraft: (values: BlogFormValues, onSuccess?: (slug: string) => void) => void;
}

const BlogFormContext = createContext<BlogFormContextValue | null>(null);

export function useBlogFormContext() {
  const ctx = useContext(BlogFormContext);
  if (!ctx) throw new Error("useBlogFormContext must be used within BlogFormProvider");
  return ctx;
}

interface BlogFormProviderProps {
  children: React.ReactNode;
  id: string;
}

export function BlogFormProvider({ children, id }: BlogFormProviderProps) {
  const blogId = parseInt(id, 10);
  const isNew = id === "new";
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const { data: blog, refetch } = useBlogById(blogId, { enabled: !isNew });
  const { refetch: refetchAll } = useAllBlogs();

  const createMutation = useCreateBlog({
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err.message || "Failed to create",
        variant: "destructive",
      });
      setIsSaving(false);
    },
  });

  const updateMutation = useUpdateBlog({
    onSuccess: () => {
      toast({ title: "Success", description: "Blog post updated" });
      refetch();
      refetchAll();
      setIsSaving(false);
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err.message || "Failed to update",
        variant: "destructive",
      });
      setIsSaving(false);
    },
  });

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      authorName: "",
      authorAvatarUrl: "",
      authorDataAiHint: "",
      imageUrl: "",
      dataAiHint: "",
      tags: [],
      isActive: false,
      date: "",
    },
  });

  const onPublish = useCallback(
    (values: BlogFormValues, onSuccess?: (slug: string) => void) => {
      setIsSaving(true);
      const publishedValues = { ...values, isActive: true };
      if (isNew) {
        createMutation.mutate(publishedValues, {
          onSuccess: (data: any) => {
            refetchAll();
            setIsSaving(false);
            if (onSuccess) onSuccess(data?.slug);
          },
        });
      } else {
        updateMutation.mutate({ ...publishedValues, id: blogId }, {
          onSuccess: (data: any) => {
            refetch();
            refetchAll();
            setIsSaving(false);
            if (onSuccess) onSuccess(data?.slug);
          },
        });
      }
    },
    [isNew, blogId, createMutation, updateMutation, refetch, refetchAll]
  );

  const onSaveDraft = useCallback(
    (values: BlogFormValues, onSuccess?: (slug: string) => void) => {
      setIsSaving(true);
      const draftValues = { ...values, isActive: false };
      if (isNew) {
        createMutation.mutate(draftValues, {
          onSuccess: (data: any) => {
            refetchAll();
            setIsSaving(false);
            if (onSuccess) onSuccess(data?.slug);
          },
        });
      } else {
        updateMutation.mutate({ ...draftValues, id: blogId }, {
          onSuccess: (data: any) => {
            refetch();
            refetchAll();
            setIsSaving(false);
            if (onSuccess) onSuccess(data?.slug);
          },
        });
      }
    },
    [isNew, blogId, createMutation, updateMutation, refetch, refetchAll]
  );

  const currentTags = form.watch("tags") || [];

  const addTag = useCallback(
    (tag: string) => {
      if (tag.trim()) {
        const newTags = [...currentTags, tag.trim()];
        form.setValue("tags", newTags, { shouldDirty: true });
      }
    },
    [currentTags, form]
  );

  const removeTag = useCallback(
    (index: number) => {
      const newTags = currentTags.filter((_, i) => i !== index);
      form.setValue("tags", newTags, { shouldDirty: true });
    },
    [currentTags, form]
  );

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <BlogFormContext.Provider
      value={{
        form,
        isNew,
        blogId,
        isPending,
        isSaving,
        setIsSaving,
        currentTags,
        addTag,
        removeTag,
        onPublish,
        onSaveDraft,
      }}
    >
      {children}
    </BlogFormContext.Provider>
  );
}
