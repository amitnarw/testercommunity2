"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useAllAdminGuides,
  useDeleteAdminGuide,
  useAllAdminGuideCategories,
  useCreateAdminGuideCategory,
  useUpdateAdminGuideCategory,
  useDeleteAdminGuideCategory,
} from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import { FeedbackModal } from "@/components/feedback-modal";

const categorySchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().default(""),
  iconName: z.string().optional().default("FileText"),
  colorKey: z.string().optional().default("text-blue-500"),
  bgColorKey: z.string().optional().default("bg-blue-500/10"),
  sortOrder: z.coerce.number().optional().default(0),
  isActive: z.boolean().optional().default(true),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

function GuidesTab() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const { data: guides = [], isLoading, refetch } = useAllAdminGuides();

  const deleteMutation = useDeleteAdminGuide({
    onSuccess: () => {
      toast({ title: "Success", description: "Guide deleted" });
      refetch();
    },
    onError: (err: any) =>
      toast({
        title: "Error",
        description: err.message || "Failed to delete",
        variant: "destructive",
      }),
  });

  const onEdit = (guide: any) => {
    router.push(`/admin/guide-management/${guide.id}`);
  };

  const onDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this guide?")) {
      deleteMutation.mutate(id);
    }
  };

  const filteredGuides = guides.filter(
    (b: any) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-transparent leading-[unset]">
            Guides
          </h2>
          <p className="text-sm text-muted-foreground">
            Create and manage guides for the public guides section.
          </p>
        </div>
        <Button onClick={() => router.push("/admin/guide-management/new")} className="gap-2">
          <Plus className="h-4 w-4" /> Create Guide
        </Button>
      </div>

      <div className="relative w-full md:w-[300px]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search guides..."
          className="pl-8 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredGuides.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No guides found.
                </TableCell>
              </TableRow>
            ) : (
              filteredGuides.map((guide: any) => (
                <TableRow
                  key={guide.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/admin/guide-management/${guide.id}`)}
                >
                  <TableCell className="font-medium max-w-[300px] truncate">
                    {guide.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {guide.category?.title || "Uncategorized"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{guide.views ?? 0}</span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={guide.isActive ? "default" : "secondary"}
                      className={cn(
                        guide.isActive
                          ? "bg-green-500/20 text-green-700 hover:bg-green-500/30 border-green-500/30"
                          : "",
                      )}
                    >
                      {guide.isActive ? "Active" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {format(new Date(guide.createdAt), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(guide.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function CategoriesTab() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [feedbackModal, setFeedbackModal] = useState<{
    open: boolean;
    status: "success" | "error" | "warning" | "info";
    title: string;
    description: string;
    primaryAction?: { label: string; onClick: () => void };
    secondaryAction?: { label: string; onClick: () => void };
  } | null>(null);

  const { data: categories = [], isLoading, refetch } = useAllAdminGuideCategories();
  const createMutation = useCreateAdminGuideCategory({
    onSuccess: () => {
      showFeedback("success", "Category Created", "The category has been created successfully.");
      refetch();
      setIsDialogOpen(false);
    },
    onError: (err: any) => {
      showFeedback("error", "Error", err?.message || "Failed to create category");
    },
  });
  const updateMutation = useUpdateAdminGuideCategory({
    onSuccess: () => {
      showFeedback("success", "Category Updated", "The category has been updated successfully.");
      refetch();
      setIsDialogOpen(false);
    },
    onError: (err: any) => {
      showFeedback("error", "Error", err?.message || "Failed to update category");
    },
  });
  const deleteMutation = useDeleteAdminGuideCategory({
    onSuccess: () => {
      showFeedback("success", "Category Deleted", "The category has been deleted successfully.");
      refetch();
    },
    onError: (err: any) => {
      showFeedback("error", "Error", err?.message || err?.response?.data?.message || "Failed to delete category");
    },
  });

  function showFeedback(status: any, title: string, description: string) {
    setFeedbackModal({
      open: true,
      status,
      title,
      description,
      primaryAction: { label: "Close", onClick: () => setFeedbackModal(null) },
    });
  }

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      slug: "",
      title: "",
      description: "",
      iconName: "FileText",
      colorKey: "text-blue-500",
      bgColorKey: "bg-blue-500/10",
      sortOrder: 0,
      isActive: true,
    },
  });

  const onOpenCreate = () => {
    setEditingCategory(null);
    form.reset({
      slug: "",
      title: "",
      description: "",
      iconName: "FileText",
      colorKey: "text-blue-500",
      bgColorKey: "bg-blue-500/10",
      sortOrder: categories.length + 1,
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  const onEdit = (cat: any) => {
    setEditingCategory(cat);
    form.reset({
      slug: cat.slug ?? "",
      title: cat.title ?? "",
      description: cat.description ?? "",
      iconName: cat.iconName ?? "FileText",
      colorKey: cat.colorKey ?? "text-blue-500",
      bgColorKey: cat.bgColorKey ?? "bg-blue-500/10",
      sortOrder: cat.sortOrder ?? 0,
      isActive: cat.isActive ?? true,
    });
    setIsDialogOpen(true);
  };

  const onDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this category? Guides in this category must be moved first.")) {
      deleteMutation.mutate(id);
    }
  };

  const onSubmit = (values: CategoryFormValues) => {
    if (editingCategory) {
      updateMutation.mutate({ ...values, id: editingCategory.id });
    } else {
      createMutation.mutate(values);
    }
  };

  const filteredCategories = categories.filter((c: any) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {feedbackModal && (
        <FeedbackModal
          open={feedbackModal.open}
          onOpenChange={(open) => setFeedbackModal((prev) => (prev ? { ...prev, open } : null))}
          status={feedbackModal.status}
          title={feedbackModal.title}
          description={feedbackModal.description}
          primaryAction={feedbackModal.primaryAction}
          secondaryAction={feedbackModal.secondaryAction}
        />
      )}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-transparent leading-[unset]">
            Categories
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage guide categories with icons and theme colors.
          </p>
        </div>
        <Button onClick={onOpenCreate} className="gap-2">
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </div>

      <div className="relative w-full md:w-[300px]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search categories..."
          className="pl-8 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Icon</TableHead>
              <TableHead>Sort Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No categories found.
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories.map((cat: any) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-medium">{cat.title}</TableCell>
                  <TableCell className="text-muted-foreground font-mono text-sm">{cat.slug}</TableCell>
                  <TableCell><code className="text-xs bg-muted px-1.5 py-0.5 rounded">{cat.iconName}</code></TableCell>
                  <TableCell>{cat.sortOrder}</TableCell>
                  <TableCell>
                    <Badge
                      variant={cat.isActive ? "default" : "secondary"}
                      className={cn(
                        cat.isActive
                          ? "bg-green-500/20 text-green-700 hover:bg-green-500/30 border-green-500/30"
                          : "",
                      )}
                    >
                      {cat.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="outline" size="sm" onClick={() => onEdit(cat)}>
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => onDelete(cat.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] p-3 sm:p-6">
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Add Category"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Play Guidelines" {...field} />
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
                      <Input placeholder="google-play-guidelines" {...field} className="font-mono" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Category description..." rows={2} {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="iconName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Shield" {...field} className="font-mono" />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">Lucide icon name (e.g. Shield, Globe, Star)</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sortOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sort Order</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="colorKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Text Color</FormLabel>
                      <FormControl>
                        <Input placeholder="text-blue-500" {...field} className="font-mono" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bgColorKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>BG Color</FormLabel>
                      <FormControl>
                        <Input placeholder="bg-blue-500/10" {...field} className="font-mono" />
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
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingCategory ? "Update Category" : "Add Category"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AdminGuideManagementContent() {
  return (
    <div className="flex-1 space-y-6 container mx-auto px-4 md:px-6 py-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-transparent leading-[unset]">
          Guide Management
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage guides and categories for the public guides section.
        </p>
      </div>

      <Tabs defaultValue="guides">
        <TabsList>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        <TabsContent value="guides">
          <GuidesTab />
        </TabsContent>
        <TabsContent value="categories">
          <CategoriesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AdminGuideManagementPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <AdminGuideManagementContent />
    </Suspense>
  );
}
