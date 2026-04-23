"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Loader2, X, Pencil, Save, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useBlogById,
  useUpdateBlog,
  useAllBlogs,
} from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import { SafeImage } from "@/components/safe-image";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const blogSchema = z.object({
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

export default function BlogEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const { toast } = useToast();

  const blogId = parseInt(id, 10);
  const isNew = id === "new";

  const { data: blog, isLoading, refetch } = useBlogById(blogId, { enabled: !isNew });
  const { refetch: refetchAll } = useAllBlogs();

  const updateMutation = useUpdateBlog({
    onSuccess: () => {
      toast({ title: "Success", description: "Blog post updated" });
      refetch();
      refetchAll();
      setIsEditing(false);
    },
    onError: (err: any) =>
      toast({
        title: "Error",
        description: err.message || "Failed to update",
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

  useEffect(() => {
    if (blog && !isNew) {
      form.reset({
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
    }
  }, [blog, isNew, form]);

  const onSubmit = (values: BlogFormValues) => {
    updateMutation.mutate({ ...values, id: blogId });
  };

  const onCancel = () => {
    if (blog) {
      form.reset({
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
    }
    setIsEditing(false);
    setTagInput("");
  };

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

  const isPending = updateMutation.isPending;

  if (isLoading) {
    return (
      <div className="flex-1 container mx-auto px-4 md:px-6 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full max-w-2xl" />
          <Skeleton className="h-64 w-full max-w-2xl" />
          <Skeleton className="h-32 w-full max-w-2xl" />
        </div>
      </div>
    );
  }

  if (!isNew && !blog) {
    return (
      <div className="flex-1 container mx-auto px-4 md:px-6 py-6">
        <Button variant="ghost" onClick={() => router.push("/admin/blog-management")} className="mb-4 gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Blog Management
        </Button>
        <div className="text-center py-12 text-muted-foreground">
          Blog post not found.
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 container mx-auto px-4 md:px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/blog-management")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-transparent leading-[unset]">
              {isEditing ? "Edit Blog Post" : isNew ? "Create Blog Post" : "Blog Details"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isEditing ? "Update blog post details" : isNew ? "Fill in the blog details" : `Viewing "${blog?.title}"`}
            </p>
          </div>
        </div>
        {!isNew && !isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="gap-2">
            <Pencil className="h-4 w-4" /> Edit
          </Button>
        ) : !isNew ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel} disabled={isPending}>
              Cancel
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending} className="gap-2">
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              <Save className="h-4 w-4" /> Save Changes
            </Button>
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {isEditing || isNew ? (
            /* Edit/Create Form */
            <Card className="border border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle>Blog Content</CardTitle>
              </CardHeader>
              <CardContent>
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
                              <Input placeholder="Blog post title" {...field} />
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
                            <FormDescription>URL-friendly version of the title</FormDescription>
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
                              rows={10}
                              className="font-mono text-sm"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Featured Image URL</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input placeholder="https://example.com/image.jpg" {...field} className="pr-10" />
                              {field.value && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                  <SafeImage
                                    src={field.value}
                                    alt="Preview"
                                    width={24}
                                    height={24}
                                    className="rounded-sm"
                                  />
                                </div>
                              )}
                            </div>
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
                  </form>
                </Form>
              </CardContent>
            </Card>
          ) : (
            /* View Mode */
            <>
              {/* Featured Image */}
              {blog?.imageUrl && (
                <Card className="border border-border/50 shadow-sm overflow-hidden">
                  <div className="relative h-64 w-full">
                    <SafeImage
                      src={blog.imageUrl}
                      alt={blog.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Card>
              )}

              <Card className="border border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">{blog?.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {(blog?.tags || []).map((tag: string) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Excerpt */}
                  <p className="text-muted-foreground font-medium">{blog?.excerpt}</p>

                  {/* Content */}
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap">{blog?.content}</p>
                  </div>

                  {/* Status */}
                  <div className="pt-4 border-t">
                    <Badge
                      variant={blog?.isActive ? "default" : "secondary"}
                      className={blog?.isActive ? "bg-green-500/20 text-green-700" : ""}
                    >
                      {blog?.isActive ? "Active" : "Draft"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Author Card */}
          <Card className="border border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Author</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing || isNew ? (
                <>
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
                  <FormField
                    control={form.control}
                    name="authorDataAiHint"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author Avatar AI Hint</FormLabel>
                        <FormControl>
                          <Input placeholder="Keywords for AI" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-border shadow-sm">
                    <AvatarImage src={blog?.authorAvatarUrl || ""} />
                    <AvatarFallback className="bg-secondary text-primary font-bold">
                      {blog?.authorName?.slice(0, 2)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{blog?.authorName}</p>
                    <p className="text-sm text-muted-foreground">
                      {blog?.createdAt
                        ? format(new Date(blog.createdAt), "MMM dd, yyyy")
                        : "Unknown date"}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Blog ID</span>
                <span className="font-mono font-medium">#{blog?.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Slug</span>
                <span className="font-mono text-xs">{blog?.slug}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <Badge
                  variant={blog?.isActive ? "default" : "secondary"}
                  className={blog?.isActive ? "bg-green-500/20 text-green-700" : ""}
                >
                  {blog?.isActive ? "Active" : "Draft"}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tags</span>
                <span className="font-medium">{(blog?.tags || []).length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Created</span>
                <span className="text-xs">
                  {blog?.createdAt
                    ? format(new Date(blog.createdAt), "MMM dd, yyyy")
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Updated</span>
                <span className="text-xs">
                  {blog?.updatedAt
                    ? format(new Date(blog.updatedAt), "MMM dd, yyyy")
                    : "-"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
