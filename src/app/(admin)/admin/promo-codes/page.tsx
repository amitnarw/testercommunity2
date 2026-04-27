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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useAllPromoCodes,
  useCreatePromoCode,
  useUpdatePromoCode,
  useDeletePromoCode,
} from "@/hooks/useAdmin";
import { PromoCodesTable } from "@/components/admin/promo-codes-table";
import { FeedbackModal } from "@/components/feedback-modal";
import { getPromoCodeApps } from "@/lib/apiCallsAdmin";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const promoSchema = z.z.object({
  id: z.number().optional(),
  code: z.string().min(1, "Code is required").max(50),
  discountType: z.string().default("FIXED"),
  discountValue: z.coerce.number().min(0),
  isActive: z.boolean().default(true),
  maxUses: z.coerce.number().nullable().optional(),
  maxPerUser: z.coerce.number().nullable().optional(),
});

type PromoFormValues = z.infer<typeof promoSchema>;

function AdminPromoCodesContent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoFormValues | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<any>(null);
  const [promoApps, setPromoApps] = useState<any[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState<{
    open: boolean;
    status: "success" | "error" | "warning" | "info";
    title: string;
    description: string;
    primaryAction?: { label: string; onClick: () => void };
    secondaryAction?: { label: string; onClick: () => void };
  } | null>(null);

  const { data: promoCodes = [], isLoading, refetch } = useAllPromoCodes();
  const createMutation = useCreatePromoCode({
    onSuccess: () => {
      setFeedbackModal({
        open: true,
        status: "success",
        title: "Promo Code Created",
        description: "The promo code has been created successfully.",
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
        description: err?.message || "Failed to create promo code",
        primaryAction: {
          label: "Try Again",
          onClick: () => setFeedbackModal(null),
        },
      });
    },
  });

  const updateMutation = useUpdatePromoCode({
    onSuccess: () => {
      setFeedbackModal({
        open: true,
        status: "success",
        title: "Promo Code Updated",
        description: "The promo code has been updated successfully.",
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
        description: err?.message || "Failed to update promo code",
        primaryAction: {
          label: "Try Again",
          onClick: () => setFeedbackModal(null),
        },
      });
    },
  });

  const deleteMutation = useDeletePromoCode({
    onSuccess: () => {
      setFeedbackModal({
        open: true,
        status: "success",
        title: "Promo Code Deleted",
        description: "The promo code has been deleted successfully.",
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
        description: err?.message || "Failed to delete promo code",
        primaryAction: {
          label: "Close",
          onClick: () => setFeedbackModal(null),
        },
      });
    },
  });

  const form = useForm<PromoFormValues>({
    resolver: zodResolver(promoSchema),
    defaultValues: {
      code: "",
      discountType: "FIXED",
      discountValue: 200,
      isActive: true,
      maxUses: null,
      maxPerUser: 1,
    },
  });

  const onOpenCreate = () => {
    setEditingPromo(null);
    form.reset({
      code: "",
      discountType: "FIXED",
      discountValue: 200,
      isActive: true,
      maxUses: null,
      maxPerUser: 1,
    });
    setIsDialogOpen(true);
  };

  const onEdit = (promo: any) => {
    setEditingPromo(promo);
    form.reset({
      id: promo.id,
      code: promo.code,
      discountType: promo.discountType || "FIXED",
      discountValue: promo.discountValue || promo.fixedPoints,
      isActive: promo.isActive,
      maxUses: promo.maxUses,
      maxPerUser: promo.maxPerUser,
    });
    setIsDialogOpen(true);
  };

  const onViewDetails = async (promo: any) => {
    setSelectedPromo(promo);
    setDetailsDialogOpen(true);
    setLoadingApps(true);
    try {
      const apps = await getPromoCodeApps(promo.id);
      setPromoApps(apps || []);
    } catch (err) {
      setPromoApps([]);
    } finally {
      setLoadingApps(false);
    }
  };

  const onDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this promo code?")) {
      deleteMutation.mutate(id);
    }
  };

  const onSubmit = (values: PromoFormValues) => {
    if (editingPromo) {
      updateMutation.mutate({ ...values, id: editingPromo.id! });
    } else {
      createMutation.mutate(values);
    }
  };

  const filteredPromoCodes = promoCodes.filter((p: any) =>
    p.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex-1 space-y-6 container mx-auto px-4 md:px-6 py-6">
      {feedbackModal && (
        <FeedbackModal
          open={feedbackModal.open}
          onOpenChange={(open) => {
            setFeedbackModal((prev) => prev ? { ...prev, open } : null);
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
            Promo Codes
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage discount codes and user usage limits for the Community Hub.
          </p>
        </div>
        <Button onClick={onOpenCreate} className="gap-2">
          <Plus className="h-4 w-4" /> Create Promo Code
        </Button>
      </div>

      <div className="bg-border p-4 sm:p-6 rounded-xl border-l-4 border-primary">
        <div className="flex flex-row items-center gap-3 mb-4">
          <span className="bg-gradient-to-b from-primary to-primary/50 text-white font-bold rounded-lg px-4 py-0.5 text-lg">
            Important
          </span>
        </div>
        <p className="text-sm sm:text-base font-medium mb-4">
          Promo codes apply <span className="font-bold">ONLY</span> to Community Hub (Free) submissions, not valid for Developer Dashboard (Paid) submissions.
        </p>

        <div className="border-t border-primary/20 pt-4">
          <h3 className="text-sm font-bold mb-2">How Promo Codes Work</h3>
          <ul className="space-y-2 text-sm ml-0">
            <li>Users enter a code (e.g. <span className="font-mono font-bold">WELCOME200</span>) during Community Hub submission</li>
            <li>The code sets a fixed point cost, overriding the original configuration price</li>
            <li>Each code has optional usage limits: total uses and max uses per user</li>
          </ul>
        </div>
      </div>

      <div className="relative w-full md:w-[300px]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search codes..."
          className="pl-8 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <PromoCodesTable
        promoCodes={filteredPromoCodes}
        isLoading={isLoading}
        onEdit={onEdit}
        onDelete={onDelete}
        onViewDetails={onViewDetails}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] p-3 sm:p-6">
          <DialogHeader>
            <DialogTitle>
              {editingPromo ? "Edit Promo Code" : "Create Promo Code"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Promo Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="WELCOME200"
                        {...field}
                        className="uppercase"
                      />
                    </FormControl>
                    <FormDescription>
                      The code users enter during Community Hub submission.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="discountType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="FIXED">Fixed Points</SelectItem>
                          <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="discountValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {form.watch("discountType") === "PERCENTAGE"
                          ? "Discount (%)"
                          : "Discount (Points)"}
                      </FormLabel>
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
                  name="maxUses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Uses (Total)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Unlimited"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxPerUser"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Per User</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Unlimited"
                          {...field}
                          value={field.value || ""}
                        />
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
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Active Status</FormLabel>
                      <FormDescription>
                        Enable or disable this code.
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
                  {editingPromo ? "Update Code" : "Create Code"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] p-3 sm:p-6 max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Promo Code Details
              {selectedPromo && (
                <Badge variant="outline" className="font-mono">
                  {selectedPromo.code}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedPromo && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground">Discount Type</p>
                  <p className="font-medium">
                    {selectedPromo.discountType === "PERCENTAGE" ? "Percentage" : "Fixed Points"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Discount Value</p>
                  <p className="font-medium">
                    {selectedPromo.discountType === "PERCENTAGE"
                      ? `${selectedPromo.discountValue}%`
                      : `${selectedPromo.discountValue} pts`}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Status</p>
                  <Badge
                    variant={selectedPromo.isActive ? "default" : "secondary"}
                    className={selectedPromo.isActive ? "bg-green-500/20 text-green-700 border-green-500/30" : ""}
                  >
                    {selectedPromo.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Usage Limit</p>
                  <p className="font-medium">
                    {selectedPromo.usedCount} / {selectedPromo.maxUses || "∞"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Per User Limit</p>
                  <p className="font-medium">{selectedPromo.maxPerUser || "∞"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Created</p>
                  <p className="font-medium">
                    {format(new Date(selectedPromo.createdAt), "MMM dd, yyyy")}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">
                  Apps Using This Code ({promoApps.length})
                </h4>
                {loadingApps ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : promoApps.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-4">
                    No apps have used this promo code yet.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {promoApps.map((app: any) => (
                      <div
                        key={app.id}
                        className="flex items-center justify-between p-3 rounded-lg border bg-card"
                      >
                        <div className="flex items-center gap-3">
                          {app.androidApp?.appLogoUrl && (
                            <img
                              src={app.androidApp.appLogoUrl}
                              alt=""
                              className="w-8 h-8 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium text-sm">
                              {app.androidApp?.appName || `App #${app.appId}`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {app.appOwner?.name || app.appOwnerId} •{" "}
                              {format(new Date(app.createdAt), "MMM dd, yyyy")}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {app.status?.replace(/_/g, " ")}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AdminPromoCodesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <AdminPromoCodesContent />
    </Suspense>
  );
}
