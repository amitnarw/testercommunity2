"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  useAllBlogs,
  useDeleteBlog,
  useAllAuthors,
  useCreateAuthor,
  useUpdateAuthor,
  useDeleteAuthor,
} from "@/hooks/useAdmin";
import { BlogTable } from "@/components/admin/blog-table";
import { BlogAuthorsTable } from "@/components/admin/blog-authors-table";
import { FeedbackModal } from "@/components/feedback-modal";
import { useToast } from "@/hooks/use-toast";

const authorSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required").max(100),
  avatarUrl: z.string().default(""),
  bio: z.string().optional().default(""),
  dataAiHint: z.string().optional(),
});

type AuthorFormValues = z.infer<typeof authorSchema>;

function BlogsTab() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModal, setDeleteModal] = useState<{ open: boolean }>({ open: false });
  const [deletingBlogId, setDeletingBlogId] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: blogs = [], isLoading, refetch } = useAllBlogs();

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

  const onEdit = (blog: any) => {
    router.push(`/admin/blog-management/${blog.id}`);
  };

  const onDelete = (id: number) => {
    setDeletingBlogId(id);
    setDeleteModal({ open: true });
  };

  const filteredBlogs = blogs.filter(
    (b: any) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.authorName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-transparent leading-[unset]">
            Blog Posts
          </h2>
          <p className="text-sm text-muted-foreground">
            Create and manage blog posts for the inTesters Blog.
          </p>
        </div>
        <Button onClick={() => router.push("/admin/blog-management/new")} className="gap-2">
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

      {deleteModal.open && (
        <FeedbackModal
          status="warning"
          title="Delete Blog Post?"
          description="Are you sure you want to delete this blog post? This action cannot be undone."
          open={deleteModal.open}
          onOpenChange={(open) => setDeleteModal({ open })}
          primaryAction={{
            label: deleteMutation.isPending ? "Deleting..." : "Delete",
            onClick: () => {
              setDeleteModal({ open: false });
              if (deletingBlogId) deleteMutation.mutate(deletingBlogId);
            },
          }}
          secondaryAction={{
            label: "Cancel",
            onClick: () => setDeleteModal({ open: false }),
          }}
        />
      )}
    </div>
  );
}

function AuthorsTab() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<AuthorFormValues | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModal, setDeleteModal] = useState<{ open: boolean }>({ open: false });
  const [deletingAuthorId, setDeletingAuthorId] = useState<number | null>(null);
  const [feedbackModal, setFeedbackModal] = useState<{
    open: boolean;
    status: "success" | "error" | "warning" | "info";
    title: string;
    description: string;
    primaryAction?: { label: string; onClick: () => void };
    secondaryAction?: { label: string; onClick: () => void };
  } | null>(null);

  const { data: authors = [], isLoading, refetch } = useAllAuthors();
  const createMutation = useCreateAuthor({
    onSuccess: () => {
      setFeedbackModal({
        open: true,
        status: "success",
        title: "Author Created",
        description: "The author has been created successfully.",
        primaryAction: {
          label: "Continue",
          onClick: () => setFeedbackModal(null),
        },
      });
      refetch();
      setIsDialogOpen(false);
    },
    onError: (err: any) => {
      setFeedbackModal({
        open: true,
        status: "error",
        title: "Error",
        description: err?.message || "Failed to create author",
        primaryAction: {
          label: "Try Again",
          onClick: () => setFeedbackModal(null),
        },
      });
    },
  });

  const updateMutation = useUpdateAuthor({
    onSuccess: () => {
      setFeedbackModal({
        open: true,
        status: "success",
        title: "Author Updated",
        description: "The author has been updated successfully.",
        primaryAction: {
          label: "Continue",
          onClick: () => setFeedbackModal(null),
        },
      });
      refetch();
      setIsDialogOpen(false);
    },
    onError: (err: any) => {
      setFeedbackModal({
        open: true,
        status: "error",
        title: "Error",
        description: err?.message || "Failed to update author",
        primaryAction: {
          label: "Try Again",
          onClick: () => setFeedbackModal(null),
        },
      });
    },
  });

  const deleteMutation = useDeleteAuthor({
    onSuccess: () => {
      setFeedbackModal({
        open: true,
        status: "success",
        title: "Author Deleted",
        description: "The author has been deleted successfully.",
        primaryAction: {
          label: "Continue",
          onClick: () => setFeedbackModal(null),
        },
      });
      refetch();
    },
    onError: (err: any) => {
      setFeedbackModal({
        open: true,
        status: "error",
        title: "Error",
        description: err?.message || "Failed to delete author",
        primaryAction: {
          label: "Close",
          onClick: () => setFeedbackModal(null),
        },
      });
    },
  });

  const form = useForm<AuthorFormValues>({
    resolver: zodResolver(authorSchema),
    defaultValues: {
      name: "",
      avatarUrl: "",
      bio: "",
      dataAiHint: "",
    },
  });

  const watchAvatarUrl = form.watch("avatarUrl");
  const watchName = form.watch("name");

  const onOpenCreate = () => {
    setEditingAuthor(null);
    form.reset({
      name: "",
      avatarUrl: "",
      bio: "",
      dataAiHint: "",
    });
    setIsDialogOpen(true);
  };

  const onEdit = (author: any) => {
    setEditingAuthor(author);
    form.reset({
      id: author.id,
      name: author.name ?? "",
      avatarUrl: author.avatarUrl ?? "",
      bio: author.bio ?? "",
      dataAiHint: author.dataAiHint ?? "",
    });
    setIsDialogOpen(true);
  };

  const onDelete = (id: number) => {
    setDeletingAuthorId(id);
    setDeleteModal({ open: true });
  };

  const onSubmit = (values: AuthorFormValues) => {
    if (editingAuthor) {
      updateMutation.mutate({ ...values, id: editingAuthor.id! });
    } else {
      createMutation.mutate(values);
    }
  };

  const filteredAuthors = authors.filter((a: any) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {feedbackModal && (
        <FeedbackModal
          open={feedbackModal.open}
          onOpenChange={(open) => {
            setFeedbackModal((prev) => (prev ? { ...prev, open } : null));
          }}
          status={feedbackModal.status}
          title={feedbackModal.title}
          description={feedbackModal.description}
          primaryAction={feedbackModal.primaryAction}
          secondaryAction={feedbackModal.secondaryAction}
        />
      )}

      {deleteModal.open && (
        <FeedbackModal
          status="warning"
          title="Delete Author?"
          description="Are you sure you want to delete this author? This action cannot be undone."
          open={deleteModal.open}
          onOpenChange={(open) => setDeleteModal({ open })}
          primaryAction={{
            label: deleteMutation.isPending ? "Deleting..." : "Delete",
            onClick: () => {
              setDeleteModal({ open: false });
              if (deletingAuthorId) deleteMutation.mutate(deletingAuthorId);
            },
          }}
          secondaryAction={{
            label: "Cancel",
            onClick: () => setDeleteModal({ open: false }),
          }}
        />
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-transparent leading-[unset]">
            Authors
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage authors for your blog posts. Authors can be selected when
            editing or creating blog posts.
          </p>
        </div>
        <Button onClick={onOpenCreate} className="gap-2">
          <Plus className="h-4 w-4" /> Add Author
        </Button>
      </div>

      <div className="relative w-full md:w-[300px]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search authors..."
          className="pl-8 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <BlogAuthorsTable
        authors={filteredAuthors}
        isLoading={isLoading}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] p-3 sm:p-6">
          <DialogHeader>
            <DialogTitle>
              {editingAuthor ? "Edit Author" : "Add Author"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Author name"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="avatarUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://...avatar.jpg"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {watchAvatarUrl && (
                <div className="flex items-center gap-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={watchAvatarUrl} />
                    <AvatarFallback>
                      {watchName?.slice(0, 2)?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">
                    Avatar preview
                  </span>
                </div>
              )}
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Short bio about the author..."
                        rows={3}
                        {...field}
                        value={field.value ?? ""}
                      />
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
                    <FormLabel>AI Image Hint (optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. professional headshot"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingAuthor ? "Update Author" : "Add Author"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AdminBlogManagementContent() {
  return (
    <div className="flex-1 space-y-6 container mx-auto px-4 md:px-6 py-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-transparent leading-[unset]">
          Blog Management
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage blog posts and authors for the inTesters Blog.
        </p>
      </div>

      <Tabs defaultValue="blogs">
        <TabsList>
          <TabsTrigger value="blogs">Blogs</TabsTrigger>
          <TabsTrigger value="authors">Authors</TabsTrigger>
        </TabsList>
        <TabsContent value="blogs">
          <BlogsTab />
        </TabsContent>
        <TabsContent value="authors">
          <AuthorsTab />
        </TabsContent>
      </Tabs>
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
