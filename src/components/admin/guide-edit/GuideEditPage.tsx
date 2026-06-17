"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useAdminGuideById,
  useCreateAdminGuide,
  useUpdateAdminGuide,
  useAllAdminGuideCategories,
} from "@/hooks/useAdmin";
import { ROUTES } from "@/lib/routes";
import { guideSchema, type GuideFormValues } from "./types";

export default function GuideEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isNew = id === "new";
  const router = useRouter();
  const { toast } = useToast();

  const guideId = isNew ? 0 : parseInt(id, 10);
  const { data: guide, isLoading: guideLoading } = useAdminGuideById(guideId, {
    enabled: !isNew,
  });
  const { data: categories = [], isLoading: catsLoading } = useAllAdminGuideCategories();

  const createMutation = useCreateAdminGuide({
    onSuccess: (data: any) => {
      toast({ title: "Success", description: "Guide created successfully" });
      router.push(ROUTES.ADMIN.GUIDE_MANAGEMENT);
    },
    onError: (err: any) =>
      toast({
        title: "Error",
        description: err?.message || "Failed to create guide",
        variant: "destructive",
      }),
  });

  const updateMutation = useUpdateAdminGuide({
    onSuccess: () => {
      toast({ title: "Success", description: "Guide updated successfully" });
      router.push(ROUTES.ADMIN.GUIDE_MANAGEMENT);
    },
    onError: (err: any) =>
      toast({
        title: "Error",
        description: err?.message || "Failed to update guide",
        variant: "destructive",
      }),
  });

  const form = useForm<GuideFormValues>({
    resolver: zodResolver(guideSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      content: "",
      readTime: "5 min read",
      categoryId: 0,
      publishedAt: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (guide && !isNew) {
      form.reset({
        title: guide.title || "",
        slug: guide.slug || "",
        description: guide.description || "",
        content: guide.content || "",
        readTime: guide.readTime || "5 min read",
        categoryId: guide.categoryId || 0,
        publishedAt: guide.publishedAt
          ? new Date(guide.publishedAt).toISOString().split("T")[0]
          : "",
        isActive: guide.isActive ?? true,
      });
    }
  }, [guide, isNew, form]);

  if (guideLoading && !isNew) {
    return (
      <div className="flex-1 container mx-auto px-4 md:px-6 py-6 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full max-w-2xl" />
          <Skeleton className="h-10 w-full max-w-md" />
          <Skeleton className="h-24 w-full max-w-2xl" />
          <Skeleton className="h-96 w-full max-w-3xl" />
        </div>
      </div>
    );
  }

  if (!isNew && !guide) {
    return (
      <div className="flex-1 container mx-auto px-4 md:px-6 py-6">
        <Button variant="ghost" onClick={() => router.push(ROUTES.ADMIN.GUIDE_MANAGEMENT)} className="mb-4 gap-2">
          Back to Guide Management
        </Button>
        <div className="text-center py-12 text-muted-foreground">Guide not found.</div>
      </div>
    );
  }

  const onSubmit = (values: GuideFormValues) => {
    if (isNew) {
      createMutation.mutate(values);
    } else {
      updateMutation.mutate({ ...values, id: guideId });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="flex-1 container mx-auto px-4 md:px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Button
            variant="ghost"
            onClick={() => router.push(ROUTES.ADMIN.GUIDE_MANAGEMENT)}
            className="mb-1 -ml-2 gap-1 text-muted-foreground"
          >
            Guide Management
          </Button>
          <h1 className="text-2xl font-bold">{isNew ? "Create Guide" : "Edit Guide"}</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(ROUTES.ADMIN.GUIDE_MANAGEMENT)}
          >
            Cancel
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
            {isPending ? "Saving..." : isNew ? "Create Guide" : "Save Changes"}
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Guide title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="guide-slug" {...field} className="font-mono" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="readTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Read Time</FormLabel>
                  <FormControl>
                    <Input placeholder="5 min read" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Brief description..." rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content (Markdown)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write guide content in markdown..."
                    rows={20}
                    className="font-mono text-sm leading-relaxed"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(parseInt(val, 10))}
                    value={field.value ? String(field.value) : undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {catsLoading ? (
                        <SelectItem value="0" disabled>
                          Loading...
                        </SelectItem>
                      ) : categories.length === 0 ? (
                        <SelectItem value="0" disabled>
                          No categories available
                        </SelectItem>
                      ) : (
                        categories.map((cat: any) => (
                          <SelectItem key={cat.id} value={String(cat.id)}>
                            {cat.title}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="publishedAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Publish Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value ?? true}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="h-4 w-4"
                  />
                </FormControl>
                <FormLabel className="mb-0">Active</FormLabel>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
