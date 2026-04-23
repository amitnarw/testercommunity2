"use client";

import { useState, Suspense } from "react";
import { Plus, Search, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useAllBlogs,
  useCreateBlog,
  useUpdateBlog,
  useDeleteBlog,
} from "@/hooks/useAdmin";
import { BlogTable } from "@/components/admin/blog-table";
import { useToast } from "@/hooks/use-toast";

const blogSchema = z.object({
  id: z.number().optional(),
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

type BlogFormValues = z.infer<typeof blogSchema>;

function AdminBlogManagementContent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogFormValues | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [tagInput, setTagInput] = useState("");
  const { toast } = useToast();

  const { data: blogs = [], isLoading, refetch } = useAllBlogs();

  const createMutation = useCreateBlog({
    onSuccess: () => {
      toast({ title: "Success", description: "Blog post created" });
      refetch();
      setIsDialogOpen(false);
    },
    onError: (err: any) =>
      toast({
        title: "Error",
        description: err.message || "Failed to create",
        variant: "destructive",
      }),
  });

  const updateMutation = useUpdateBlog({
    onSuccess: () => {
      toast({ title: "Success", description: "Blog post updated" });
      refetch();
      setIsDialogOpen(false);
    },
    onError: (err: any) =>
      toast({
        title: "Error",
        description: err.message || "Failed to update",
        variant: "destructive",
      }),
  });

  const deleteMutation = useDeleteBlog({
    onSuccess: () => {
      toast({ title: "Success", description: "Blog post deleted" });
      refetch();
    },
    onError: (err: any) =>
      toast({
        title: "Error",
        description: err.message || "Failed to delete",
        variant: "destructive",
      }),
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
      isActive: true,
      date: "",
    },
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const onOpenCreate = () => {
    setEditingBlog(null);
    setTagInput("");
    form.reset({
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
      isActive: true,
      date: new Date().toISOString().split("T")[0],
    });
    setIsDialogOpen(true);
  };

  const onEdit = (blog: any) => {
    setEditingBlog(blog);
    setTagInput("");
    form.reset({
      id: blog.id,
      title: blog.title || "",
      slug: blog.slug || "",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      authorName: blog.authorName || "",
      authorAvatarUrl: blog.authorAvatarUrl || "",
      authorDataAiHint: blog.authorDataAiHint || "",
      imageUrl: blog.imageUrl || "",
      dataAiHint: blog.dataAiHint || "",
      tags: blog.tags || [],
      isActive: blog.isActive ?? true,
      date: blog.date ? new Date(blog.date).toISOString().split("T")[0] : "",
    });
    setIsDialogOpen(true);
  };

  const onDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      deleteMutation.mutate(id);
    }
  };

  const onSubmit = (values: BlogFormValues) => {
    if (editingBlog?.id) {
      updateMutation.mutate({ ...values, id: editingBlog.id });
    } else {
      createMutation.mutate(values);
    }
  };

  const filteredBlogs = blogs.filter(
    (b: any) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.authorName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const currentTags = form.watch("tags") || [];

  const addTag = () => {
    if (tagInput.trim()) {
      const newTags = [...currentTags, tagInput.trim()];
      form.setValue("tags", newTags);
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    const newTags = currentTags.filter((_, i) => i !== index);
    form.setValue("tags", newTags);
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="flex-1 space-y-6 container mx-auto px-4 md:px-6 py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-transparent leading-[unset]">
            Blog Management
          </h2>
          <p className="text-sm text-muted-foreground">
            Create and manage blog posts for the inTesters Chronicles.
          </p>
        </div>
        <Button onClick={onOpenCreate} className="gap-2">
          <Plus className="h-4 w-4" /> Create Blog Post
        </Button>
      </div>

      <div className="relative w-full md:w-[300px]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search blogs..."
          className="pl-8 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <BlogTable
        blogs={filteredBlogs}
        isLoading={isLoading}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] p-3 sm:p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingBlog ? "Edit Blog Post" : "Create Blog Post"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Blog post title"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            if (!editingBlog) {
                              form.setValue("slug", generateSlug(e.target.value));
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="blog-url-slug" {...field} />
                      </FormControl>
                      <FormDescription>URL-friendly version</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description for listing page"
                        {...field}
                        rows={2}
                      />
                    </FormControl>
                    <FormDescription>
                      This will be shown as the excerpt on the blog listing.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Full blog content..."
                        {...field}
                        rows={6}
                        className="font-mono text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="authorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Author name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="authorAvatarUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author Avatar URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/avatar.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Featured Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dataAiHint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image AI Hint</FormLabel>
                    <FormControl>
                      <Input placeholder="Keywords for AI image generation" {...field} />
                    </FormControl>
                    <FormDescription>Optional hint for AI image generation</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {currentTags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-primary/10 text-primary px-2 py-1 rounded text-sm flex items-center gap-1"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a tag"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTag();
                          }
                        }}
                        className="flex-1"
                      />
                      <Button type="button" variant="outline" onClick={addTag}>
                        Add
                      </Button>
                    </div>
                  </div>
                </FormControl>
                <FormDescription>
                  Press Enter or click Add to add tags.
                </FormDescription>
              </FormItem>

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Published</FormLabel>
                      <FormDescription>
                        Make this post visible on the blog page.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingBlog ? "Update Post" : "Create Post"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AdminBlogManagementPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <AdminBlogManagementContent />
    </Suspense>
  );
}
