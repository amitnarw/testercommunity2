"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useAllTestimonials,
  useDeleteTestimonial,
} from "@/hooks/useAdmin";
import { TestimonialsTable } from "@/components/admin/testimonials-table";
import { useToast } from "@/hooks/use-toast";

function AdminReviewsContent() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const { data: testimonials = [], isLoading, refetch } = useAllTestimonials();

  const deleteMutation = useDeleteTestimonial({
    onSuccess: () => {
      toast({ title: "Success", description: "Review deleted" });
      refetch();
    },
    onError: (err: any) =>
      toast({
        title: "Error",
        description: err.message || "Failed to delete",
        variant: "destructive",
      }),
  });

  const onDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this review?")) {
      deleteMutation.mutate(id);
    }
  };

  const filteredTestimonials = testimonials.filter(
    (t: any) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.comment.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex-1 space-y-6 container mx-auto px-4 md:px-6 py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-transparent leading-[unset]">
            Reviews Management
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage testimonials and success stories displayed on the website.
          </p>
        </div>
        <Button onClick={() => router.push("/admin/reviews/new")} className="gap-2">
          <Plus className="h-4 w-4" /> Create Review
        </Button>
      </div>

      <div className="relative w-full md:w-[300px]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search reviews..."
          className="pl-8 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <TestimonialsTable
        testimonials={filteredTestimonials}
        isLoading={isLoading}
        onDelete={onDelete}
      />
    </div>
  );
}

export default function AdminReviewsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <AdminReviewsContent />
    </Suspense>
  );
}
