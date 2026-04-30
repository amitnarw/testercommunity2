"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBlogById } from "@/hooks/useAdmin";
import { BlogFormProvider, useBlogFormContext } from "./useBlogForm";
import { TopBar } from "./TopBar";
import { PreviewModal } from "./PreviewModal";
import { MainEditor } from "./MainEditor";
import { Sidebar } from "./Sidebar";
import { useState, useEffect } from "react";

function BlogEditContent({ id }: { id: string }) {
  const { form, isNew, onSubmit, onDelete } = useBlogFormContext();
  const router = useRouter();
  const [showPreview, setShowPreview] = useState(false);

  const blogId = parseInt(id, 10);
  const { data: blog, isLoading } = useBlogById(blogId, { enabled: !isNew });

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
          Back to Blog Management
        </Button>
        <div className="text-center py-12 text-muted-foreground">
          Blog post not found.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <TopBar blogSlug={blog?.slug} onPreviewClick={() => setShowPreview(true)} onDelete={!isNew ? onDelete : undefined} />
      <PreviewModal open={showPreview} onOpenChange={setShowPreview} />
      <div className="flex flex-col lg:flex-row">
        <MainEditor />
        <Sidebar blog={blog} />
      </div>
    </div>
  );
}

export default function BlogEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <BlogFormProvider id={id}>
      <BlogEditContent id={id} />
    </BlogFormProvider>
  );
}
