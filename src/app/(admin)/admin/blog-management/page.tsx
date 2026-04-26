"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useAllBlogs,
  useDeleteBlog,
} from "@/hooks/useAdmin";
import { BlogTable } from "@/components/admin/blog-table";
import { useToast } from "@/hooks/use-toast";

function AdminBlogManagementContent() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
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
    if (confirm("Are you sure you want to delete this blog post?")) {
      deleteMutation.mutate(id);
    }
  };

  const filteredBlogs = blogs.filter(
    (b: any) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.authorName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
