"use client";

import { useState, Suspense } from "react";
import { Plus, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useAllFaqs,
  useCreateFaq,
  useUpdateFaq,
  useDeleteFaq,
} from "@/hooks/useAdmin";
import { FeedbackModal } from "@/components/feedback-modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

const faqCategories = [
  { value: "general", label: "General" },
  { value: "community", label: "Community / Free Testing" },
  { value: "professional", label: "Professional / Pro Testing" },
  { value: "homepage", label: "Homepage" },
  { value: "pricing", label: "Pricing" },
  { value: "google_play_guide", label: "Google Play Guide" },
  { value: "billing", label: "Billing" },
] as const;

const faqSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Question is required").max(500),
  description: z.string().min(1, "Answer is required"),
  category: z.string().min(1, "Category is required"),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().min(0).default(0),
});

type FaqFormValues = z.infer<typeof faqSchema>;

function AdminFaqsContent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqFormValues | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [feedbackModal, setFeedbackModal] = useState<{
    open: boolean;
    status: "success" | "error" | "warning" | "info";
    title: string;
    description: string;
    primaryAction?: { label: string; onClick: () => void };
    secondaryAction?: { label: string; onClick: () => void };
  } | null>(null);

  const { data: faqs = [], isLoading, refetch } = useAllFaqs();
  const createMutation = useCreateFaq({
    onSuccess: () => {
      setFeedbackModal({
        open: true,
        status: "success",
        title: "FAQ Created",
        description: "The FAQ has been created successfully.",
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
        description: err?.message || "Failed to create FAQ",
        primaryAction: {
          label: "Try Again",
          onClick: () => setFeedbackModal(null),
        },
      });
    },
  });

  const updateMutation = useUpdateFaq({
    onSuccess: () => {
      setFeedbackModal({
        open: true,
        status: "success",
        title: "FAQ Updated",
        description: "The FAQ has been updated successfully.",
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
        description: err?.message || "Failed to update FAQ",
        primaryAction: {
          label: "Try Again",
          onClick: () => setFeedbackModal(null),
        },
      });
    },
  });

  const deleteMutation = useDeleteFaq({
    onSuccess: () => {
      setFeedbackModal({
        open: true,
        status: "success",
        title: "FAQ Deleted",
        description: "The FAQ has been deleted successfully.",
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
        description: err?.message || "Failed to delete FAQ",
        primaryAction: {
          label: "Close",
          onClick: () => setFeedbackModal(null),
        },
      });
    },
  });

  const form = useForm<FaqFormValues>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "general",
      isActive: true,
      sortOrder: 0,
    },
  });

  const onOpenCreate = () => {
    setEditingFaq(null);
    form.reset({
      title: "",
      description: "",
      category: "general",
      isActive: true,
      sortOrder: 0,
    });
    setIsDialogOpen(true);
  };

  const onEdit = (faq: any) => {
    setEditingFaq(faq);
    form.reset({
      id: faq.id,
      title: faq.title ?? "",
      description: faq.description ?? "",
      category: faq.category ?? "general",
      isActive: faq.isActive,
      sortOrder: faq.sortOrder ?? 0,
    });
    setIsDialogOpen(true);
  };

  const onDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this FAQ?")) {
      deleteMutation.mutate(id);
    }
  };

  const onSubmit = (values: FaqFormValues) => {
    if (editingFaq) {
      updateMutation.mutate({ ...values, id: editingFaq.id! });
    } else {
      createMutation.mutate(values);
    }
  };

  const filteredFaqs = faqs.filter((f: any) =>
    f.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const categoryLabel = (value: string) =>
    faqCategories.find((c) => c.value === value)?.label ?? value;

  return (
    <div className="flex-1 space-y-6 container mx-auto px-4 md:px-6 py-6">
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-transparent leading-[unset]">
            FAQs
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage frequently asked questions across all pages.
          </p>
        </div>
        <Button onClick={onOpenCreate} className="gap-2">
          <Plus className="h-4 w-4" /> Create FAQ
        </Button>
      </div>

      <div className="relative w-full md:w-[300px]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search questions..."
          className="pl-8 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">#</TableHead>
                <TableHead className="w-[80px]">Order</TableHead>
                <TableHead>Question</TableHead>
                <TableHead className="w-[150px]">Category</TableHead>
                <TableHead className="w-[80px]">Active</TableHead>
                <TableHead className="w-[150px]">Updated</TableHead>
                <TableHead className="w-[120px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFaqs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No FAQs found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredFaqs.map((faq: any, idx: number) => (
                  <TableRow key={faq.id}>
                    <TableCell className="text-muted-foreground text-xs">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="text-center">{faq.sortOrder}</TableCell>
                    <TableCell className="font-medium max-w-[400px] truncate">
                      {faq.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {categoryLabel(faq.category)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={faq.isActive ? "default" : "secondary"}
                        className={
                          faq.isActive
                            ? "bg-green-500/20 text-green-700 border-green-500/30"
                            : ""
                        }
                      >
                        {faq.isActive ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(faq.updatedAt), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(faq)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onDelete(faq.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] p-3 sm:p-6 max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingFaq ? "Edit FAQ" : "Create FAQ"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the FAQ question"
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Answer</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter the FAQ answer"
                        className="min-h-[120px]"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {faqCategories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          value={field.value ?? 0}
                        />
                      </FormControl>
                      <FormDescription>
                        Lower numbers appear first.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Active</FormLabel>
                      <FormDescription>
                        Inactive FAQs are hidden from public pages.
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
                <Button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingFaq ? "Update FAQ" : "Create FAQ"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AdminFaqsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <AdminFaqsContent />
    </Suspense>
  );
}
